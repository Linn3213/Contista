using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Contista.Web.Services;

public sealed class ServerFirebaseAuthService : IRequestAuth
{
    private readonly IHttpContextAccessor _http;

    public ServerFirebaseAuthService(IHttpContextAccessor http) => _http = http;

    private HttpContext Ctx => _http.HttpContext ?? throw new InvalidOperationException("No HttpContext.");
    private string? _refreshToken;
    private string? BearerToken
    {
        get
        {
            var auth = Ctx.Request.Headers.Authorization.ToString();
            if (string.IsNullOrWhiteSpace(auth)) return null;

            const string prefix = "Bearer ";
            return auth.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)
                ? auth[prefix.Length..].Trim()
                : null;
        }
    }

    // Din cookie-claim (justera om du har annat namn)
    private string? CookieToken => Ctx.User?.FindFirst("la.tokens")?.Value;

    public string? IdToken => BearerToken ?? CookieToken;
    public string? RefreshTokenPublic
    {
        get => _refreshToken;
        set => _refreshToken = value;
    }
    public string? Uid =>
        Ctx.User?.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? Ctx.User?.FindFirstValue("user_id");

    public string? Email => Ctx.User?.FindFirstValue(ClaimTypes.Email);

    public bool IsLoggedIn => !string.IsNullOrWhiteSpace(Uid) && !string.IsNullOrWhiteSpace(IdToken);

    public Task<bool> RefreshToken() => Task.FromResult(false);

    public Task<string> GetValidIdTokenAsync()
    {
        if (string.IsNullOrWhiteSpace(IdToken))
            throw new InvalidOperationException("Missing auth cookie/token.");

        return Task.FromResult(IdToken!);
    }
}
