using Microsoft.AspNetCore.Components.Authorization;
using System.Security.Claims;

namespace Contista.Shared.UI.Services
{
    public class SimpleAuthStateProvider : AuthenticationStateProvider
    {
        private static readonly ClaimsPrincipal Anonymous =
            new(new ClaimsIdentity());

        private ClaimsPrincipal _currentUser = Anonymous;

        public override Task<AuthenticationState> GetAuthenticationStateAsync()
            => Task.FromResult(new AuthenticationState(_currentUser));

        // Anropa när login lyckas
        public void SignIn(string userId, string? email = null, string? role = null)
        {
            var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
        };

            if (!string.IsNullOrWhiteSpace(email))
                claims.Add(new Claim(ClaimTypes.Email, email));

            if (!string.IsNullOrWhiteSpace(role))
                claims.Add(new Claim(ClaimTypes.Role, role));

            var identity = new ClaimsIdentity(claims, authenticationType: "app");
            _currentUser = new ClaimsPrincipal(identity);

            NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
        }

        public void SignOut()
        {
            _currentUser = Anonymous;
            NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
        }
    }
}
