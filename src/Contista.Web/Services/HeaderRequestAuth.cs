using Contista.Shared.Core.Interfaces.Auth;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Contista.Web.Services
{
    public sealed class HeaderRequestAuth : IRequestAuth
    {
        private readonly IHttpContextAccessor _http;

        public HeaderRequestAuth(IHttpContextAccessor http)
        {
            _http = http;
        }

        private string? BearerToken
        {
            get
            {
                var ctx = _http.HttpContext;
                if (ctx is null) return null;

                var auth = ctx.Request.Headers.Authorization.ToString();
                if (string.IsNullOrWhiteSpace(auth)) return null;

                const string prefix = "Bearer ";
                return auth.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)
                    ? auth[prefix.Length..].Trim()
                    : null;
            }
        }

        public bool IsLoggedIn => !string.IsNullOrWhiteSpace(Uid) && !string.IsNullOrWhiteSpace(IdToken);

        public string? Uid =>
            _http.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? _http.HttpContext?.User?.FindFirstValue("user_id");

        public string? Email =>
            _http.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);

        public string? IdToken => BearerToken;

        public Task<string> GetValidIdTokenAsync()
        {
            if (string.IsNullOrWhiteSpace(IdToken))
                throw new InvalidOperationException("Bearer IdToken saknas.");

            return Task.FromResult(IdToken);
        }

        public Task<bool> RefreshToken() => Task.FromResult(false);
    }
}
