using System.Net.Http.Json;
using System.Text.Json;
using Contista.Shared.Core.Interfaces.Firebase;
using Microsoft.AspNetCore.Http;

namespace Contista.Web.Services;

public sealed class CookieFirebaseAuthService : IFirebaseAuthService
{
    private readonly IHttpContextAccessor _http;
    private readonly AuthCookieService _cookies;
    private readonly HttpClient _httpClient; // för securetoken refresh
    private readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

    // Behövs för refresh endpoint
    private readonly string _firebaseApiKey;

    public CookieFirebaseAuthService(
        IHttpContextAccessor http,
        AuthCookieService cookies,
        IHttpClientFactory httpFactory,
        IConfiguration cfg)
    {
        _http = http;
        _cookies = cookies;
        _httpClient = httpFactory.CreateClient();

        _firebaseApiKey =
            cfg["Firebase:ApiKey"]
            ?? throw new InvalidOperationException("Firebase:ApiKey saknas i config.");
    }

    private HttpContext Ctx => _http.HttpContext ?? throw new InvalidOperationException("No HttpContext.");

    public bool IsLoggedIn => !string.IsNullOrWhiteSpace(Uid) && !string.IsNullOrWhiteSpace(IdToken);

    // OBS: IdToken här ska vara *Firebase idToken*, inte blob
    public string? IdToken
    {
        get
        {
            var blob = _cookies.TryReadTokenBlob(Ctx.User);
            return blob?.IdToken;
        }
    }

    // På servern använder vi refresh från blob (inte från interface)
    public string? RefreshTokenPublic { get; set; } = null;

    public string? ExpiresIn => null;

    public string? Uid
        => _cookies.TryReadTokenBlob(Ctx.User)?.Uid;

    public string? Email
        => _cookies.TryReadTokenBlob(Ctx.User)?.Email;

    public async Task<string> GetValidIdTokenAsync()
    {
        var blob = _cookies.TryReadTokenBlob(Ctx.User);
        if (blob is null)
            throw new InvalidOperationException("Not authenticated (no token blob).");

        // Refresh om utgången eller nära utgång (t.ex. < 2 min kvar)
        if (blob.ExpiresUtc <= DateTime.UtcNow.AddMinutes(2))
        {
            var refreshed = await RefreshViaSecureTokenAsync(blob.RefreshToken, Ctx.RequestAborted);

            // Uppdatera cookie så nästa request har fräscht token
            var loginResult = new FirebaseLoginResult(
                Uid: refreshed.UserId,
                Email: blob.Email,
                IdToken: refreshed.IdToken,
                RefreshToken: refreshed.RefreshToken,
                ExpiresInSeconds: refreshed.ExpiresInSeconds);

            await _cookies.SignInAsync(Ctx, loginResult, Ctx.RequestAborted);

            return refreshed.IdToken;
        }

        return blob.IdToken;
    }

    // --------- ej använda på servern ---------
    public Task<bool> SignInWithEmailPassword(string email, string password) => throw new NotSupportedException();
    public Task<bool> ExchangeCustomToken(string customToken) => throw new NotSupportedException();
    public Task<string?> RegisterUserAsync(string email, string password) => throw new NotSupportedException();
    public Task<bool> ChangePasswordAsync(string currentPassword, string newPassword) => throw new NotSupportedException();
    public Task<bool> SendPasswordResetEmailAsync(string email) => throw new NotSupportedException();
    public void AttachAuthHeader(HttpClient client) => throw new NotSupportedException();
    public Task LogoutAsync() => Task.CompletedTask;
    public Task RestoreSessionAsync(string uid, string idToken, string refreshToken, string? email, CancellationToken ct = default) => Task.CompletedTask;
    public Task<bool> TryResumeSessionAsync(CancellationToken ct = default) => Task.FromResult(IsLoggedIn);
    public Task<bool> RefreshToken() => Task.FromResult(false);

    // ----- SecureToken refresh -----

    private async Task<SecureTokenRefreshResult> RefreshViaSecureTokenAsync(string refreshToken, CancellationToken ct)
    {
        // securetoken endpoint kräver x-www-form-urlencoded (inte JSON)
        var content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string,string>("grant_type", "refresh_token"),
            new KeyValuePair<string,string>("refresh_token", refreshToken),
        });

        var resp = await _httpClient.PostAsync(
            $"https://securetoken.googleapis.com/v1/token?key={_firebaseApiKey}",
            content,
            ct);

        resp.EnsureSuccessStatusCode();

        var json = await resp.Content.ReadFromJsonAsync<JsonElement>(_json, ct);

        // Refresh-responsen har andra property names:
        // id_token, refresh_token, user_id, expires_in
        var idToken = json.GetProperty("id_token").GetString() ?? throw new InvalidOperationException("No id_token");
        var newRefresh = json.GetProperty("refresh_token").GetString() ?? refreshToken;
        var userId = json.GetProperty("user_id").GetString() ?? throw new InvalidOperationException("No user_id");

        var expiresInStr = json.GetProperty("expires_in").GetString() ?? "3600";
        _ = int.TryParse(expiresInStr, out var expiresSec);
        if (expiresSec <= 0) expiresSec = 3600;

        return new SecureTokenRefreshResult(userId, idToken, newRefresh, expiresSec);
    }

    private sealed record SecureTokenRefreshResult(string UserId, string IdToken, string RefreshToken, int ExpiresInSeconds);
}
