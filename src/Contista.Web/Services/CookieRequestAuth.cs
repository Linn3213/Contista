using Contista.Shared.Core.Interfaces.Auth;

namespace Contista.Web.Services;

public sealed class CookieRequestAuth : IRequestAuth
{
    private readonly CookieFirebaseAuthService _auth;

    public CookieRequestAuth(CookieFirebaseAuthService auth)
        => _auth = auth;

    public bool IsLoggedIn => _auth.IsLoggedIn;
    public string? IdToken => _auth.IdToken;
    public string? Uid => _auth.Uid;
    public string? Email => _auth.Email;

    public Task<string> GetValidIdTokenAsync() => _auth.GetValidIdTokenAsync();

    // spelar ingen roll i reposen om vi gör retry via GetValidIdTokenAsync
    public Task<bool> RefreshToken() => Task.FromResult(false);
}
