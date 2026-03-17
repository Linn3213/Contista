using Contista.Shared.Core.Interfaces.Firebase;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Contista.Shared.Client.Services;

/// <summary>
/// WASM: login/logout via servern (/api/auth/*). Cookie används för auth.
/// Klienten har inga Firebase-tokens.
/// </summary>
public sealed class ApiCookieAuthService : IFirebaseAuthService
{
    private readonly HttpClient _http;
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public ApiCookieAuthService(HttpClient http) => _http = http;

    // Cookie-auth => ingen token i klienten
    public string? IdToken => null;
    public string? RefreshTokenPublic { get; set; }
    public string? ExpiresIn => null;

    public bool IsLoggedIn { get; private set; }
    public string? Uid { get; private set; }
    public string? Email { get; private set; }

    public async Task<bool> SignInWithEmailPassword(string email, string password)
    {
        // Login via servern -> sätter cookie om ok
        HttpResponseMessage resp;
        try
        {
            resp = await _http.PostAsJsonAsync(
                "/api/auth/login",
                new LoginRequest(email, password),
                JsonOpts);
        }
        catch
        {
            // nätfel/offline: behåll local state
            return IsLoggedIn && !string.IsNullOrWhiteSpace(Uid);
        }

        if (!resp.IsSuccessStatusCode)
        {
            ClearLocal();
            return false;
        }

        // Efter login: läs vem jag är från servern (cookie ska nu finnas)
        return await RefreshLocalSessionAsync();
    }

    public async Task LogoutAsync()
    {
        try
        {
            _ = await _http.PostAsync("/api/auth/logout", content: null);
        }
        catch
        {
            // ignore
        }

        // Logout är "riktig" => rensa alltid
        ClearLocal();
    }

    public async Task RestoreSessionAsync(
        string uid,
        string idToken,
        string refreshToken,
        string? email,
        CancellationToken ct = default)
    {
        // Web: vi "restorar" inte tokens. Vi syncar bara local state från cookie-session.
        await RefreshLocalSessionAsync(ct);
    }

    public Task<bool> RefreshToken() => Task.FromResult(false);

    /// <summary>
    /// Web använder cookie-auth. Ingen ID-token på klienten.
    /// Returnera tom sträng så inget kraschar om någon råkar kalla denna.
    /// </summary>
    public Task<string> GetValidIdTokenAsync() => Task.FromResult(string.Empty);

    public Task<bool> ExchangeCustomToken(string customToken)
        => Task.FromException<bool>(new InvalidOperationException("Web använder /api/auth/login istället."));

    public Task<string?> RegisterUserAsync(string email, string password)
        => Task.FromException<string?>(new InvalidOperationException("Web: registrering bör göras via server-endpoint."));

    public Task<bool> ChangePasswordAsync(string currentPassword, string newPassword)
        => Task.FromException<bool>(new InvalidOperationException("Web: implementera via server-endpoint."));

    public Task<bool> SendPasswordResetEmailAsync(string email)
        => Task.FromException<bool>(new InvalidOperationException("Web: implementera via server-endpoint."));

    public void AttachAuthHeader(HttpClient client)
    {
        // Cookie skickas automatiskt av browsern, inget att göra
    }

    /// <summary>
    /// Kallas vid app-start i web för att läsa in cookie-sessionen.
    /// </summary>
    public Task<bool> TryResumeSessionAsync(CancellationToken ct = default)
        => RefreshLocalSessionAsync(ct);

    public async Task<bool> RefreshLocalSessionAsync(CancellationToken ct = default)
    {
        HttpResponseMessage resp;

        try
        {
            resp = await _http.GetAsync("/api/auth/me", ct);
        }
        catch
        {
            // offline / nätfel / server nere:
            // BEHÅLL local state så AppAuthStateProvider kan läsa snapshot vid F5 offline.
            return IsLoggedIn && !string.IsNullOrWhiteSpace(Uid);
        }

        // Om servern svarar 401/403 är sessionen faktiskt borta
        if (resp.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
        {
            ClearLocal();
            return false;
        }

        if (!resp.IsSuccessStatusCode)
        {
            // serverfel -> behåll local state (känns mer robust än att logga ut användaren)
            return IsLoggedIn && !string.IsNullOrWhiteSpace(Uid);
        }

        // Skydd mot HTML/redirect/errorpage
        var mediaType = resp.Content.Headers.ContentType?.MediaType ?? "";
        if (!mediaType.Contains("json", StringComparison.OrdinalIgnoreCase))
        {
            // okänt svar -> behåll local state
            return IsLoggedIn && !string.IsNullOrWhiteSpace(Uid);
        }

        try
        {
            var me = await resp.Content.ReadFromJsonAsync<AuthMe>(JsonOpts, ct);

            if (me is null || string.IsNullOrWhiteSpace(me.Uid))
            {
                ClearLocal();
                return false;
            }

            IsLoggedIn = true;
            Uid = me.Uid;
            Email = me.Email;
            return true;
        }
        catch (JsonException)
        {
            // kunde inte parse:a -> behåll local state (alternativ: ClearLocal)
            return IsLoggedIn && !string.IsNullOrWhiteSpace(Uid);
        }
    }

    private void ClearLocal()
    {
        IsLoggedIn = false;
        Uid = null;
        Email = null;
    }

    private sealed record LoginRequest(string Email, string Password);

    private sealed class AuthMe
    {
        public string? Uid { get; set; }
        public string? Email { get; set; }
    }
}
