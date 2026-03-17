using System.Net.Http.Json;
using System.Text.Json;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;

namespace Contista.Web.Services;

public sealed class FirebaseIdentityApi
{
    private readonly HttpClient _http;
    private readonly FirebaseOptions _opt;

    public FirebaseIdentityApi(HttpClient http, IOptions<FirebaseOptions> opt)
    {
        _http = http;
        _opt = opt.Value;

        if (string.IsNullOrWhiteSpace(_opt.ApiKey))
            throw new InvalidOperationException("Firebase ApiKey saknas i Web/appsettings.json -> Firebase:ApiKey");
    }

    public async Task<FirebaseLoginResult> SignInWithEmailPassword(string email, string password, CancellationToken ct)
    {
        var payload = new { email, password, returnSecureToken = true };

        using var res = await _http.PostAsJsonAsync(
        $"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={_opt.ApiKey}",
        payload,
        ct);

        var jsonText = await res.Content.ReadAsStringAsync(ct);

        if (!res.IsSuccessStatusCode)
            throw new InvalidOperationException($"Firebase login misslyckades: {jsonText}");

        var json = JsonDocument.Parse(jsonText).RootElement;

        return new FirebaseLoginResult(
            Uid: json.GetProperty("localId").GetString() ?? "",
            Email: json.TryGetProperty("email", out var e) ? e.GetString() : email,
            IdToken: json.GetProperty("idToken").GetString() ?? "",
            RefreshToken: json.GetProperty("refreshToken").GetString() ?? "",
            ExpiresInSeconds: int.TryParse(json.GetProperty("expiresIn").GetString(), out var s) ? s : 3600
        );
    }


    public async Task<FirebaseLoginResult> SignUpWithEmailPassword(string email, string password, CancellationToken ct)
    {
        var payload = new { email, password, returnSecureToken = true };

        // ✅ RÄTT endpoint för SIGNUP/REGISTER
        using var res = await _http.PostAsJsonAsync(
            $"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={_opt.ApiKey}",
            payload,
            ct);

        var jsonText = await res.Content.ReadAsStringAsync(ct);

        if (!res.IsSuccessStatusCode)
            throw new InvalidOperationException($"Firebase signup misslyckades: {jsonText}");

        var json = JsonDocument.Parse(jsonText).RootElement;

        return new FirebaseLoginResult(
            Uid: json.GetProperty("localId").GetString() ?? "",
            Email: json.TryGetProperty("email", out var e) ? e.GetString() : email,
            IdToken: json.GetProperty("idToken").GetString() ?? "",
            RefreshToken: json.GetProperty("refreshToken").GetString() ?? "",
            ExpiresInSeconds: int.TryParse(json.GetProperty("expiresIn").GetString(), out var s) ? s : 3600
        );
    }
}

public sealed record FirebaseLoginResult(
    string Uid,
    string? Email,
    string IdToken,
    string RefreshToken,
    int ExpiresInSeconds
);
