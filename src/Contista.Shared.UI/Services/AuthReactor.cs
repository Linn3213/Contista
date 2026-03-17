using Contista.Shared.Core.Interfaces.Auth;
using Microsoft.AspNetCore.Components;

namespace Contista.Shared.UI.Services;

public sealed class AuthReactor : IAuthReactor
{
    private readonly NavigationManager _nav;
    private readonly AppAuthStateProvider _auth;

    public AuthReactor(NavigationManager nav, AppAuthStateProvider auth)
    {
        _nav = nav;
        _auth = auth;
    }

    public async Task ForceLogoutAsync(string reason, CancellationToken ct = default)
    {
        await _auth.RefreshAsync(isLogout: true);
        _nav.NavigateTo("/", replace: true);
    }
    
}
