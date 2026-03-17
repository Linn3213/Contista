using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;

namespace Contista.Web.Services;

public sealed class AuthCookieService
{
    private const string TokenBlobKey = "la.tokens";
    private readonly IDataProtector _protector;

    public AuthCookieService(IDataProtectionProvider dp)
    {
        _protector = dp.CreateProtector("Contista.AuthCookie.v1");
    }

    public async Task<ClaimsPrincipal> SignInAsync(HttpContext http, FirebaseLoginResult result, CancellationToken ct)
    {
        // 1) Firebase idToken-expire (kort)
        var tokenExpiresUtc = DateTime.UtcNow.AddSeconds(result.ExpiresInSeconds);

        // 2) Cookie-expire (lång)
        var cookieExpiresUtc = DateTime.UtcNow.AddDays(30);

        var tokenBlob = new TokenBlob(
            result.Uid,
            result.Email,
            result.IdToken,
            result.RefreshToken,
            tokenExpiresUtc);

        var protectedBlob = _protector.Protect(JsonSerializer.Serialize(tokenBlob));

        var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, result.Uid),
        new(ClaimTypes.Name, result.Email ?? result.Uid),
        new(TokenBlobKey, protectedBlob),
    };

        var identity = new ClaimsIdentity(claims, authenticationType: "la-cookie");
        var principal = new ClaimsPrincipal(identity);

        await http.SignInAsync("la-cookie", principal, new AuthenticationProperties
        {
            IsPersistent = true,
            AllowRefresh = true,
            ExpiresUtc = cookieExpiresUtc
        });

        return principal;
    }

    public Task SignOutAsync(HttpContext http, CancellationToken ct)
        => http.SignOutAsync("la-cookie");

    public TokenBlob? TryReadTokenBlob(ClaimsPrincipal user)
    {
        var protectedBlob = user.FindFirst(TokenBlobKey)?.Value;
        if (string.IsNullOrWhiteSpace(protectedBlob)) return null;

        try
        {
            var json = _protector.Unprotect(protectedBlob);
            return JsonSerializer.Deserialize<TokenBlob>(json);
        }
        catch
        {
            return null;
        }
    }
}

public sealed record TokenBlob(
    string Uid,
    string? Email,
    string IdToken,
    string RefreshToken,
    DateTime ExpiresUtc
);
