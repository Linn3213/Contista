using Contista.Shared.Core.Interfaces.Firebase;
using System.Security.Claims;

namespace Contista.Web.Services
{
    public sealed class HeaderFirebaseAuthService : IFirebaseAuthService
    {
        private readonly IHttpContextAccessor _http;

        public HeaderFirebaseAuthService(IHttpContextAccessor http)
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

        public bool IsLoggedIn => !string.IsNullOrWhiteSpace(IdToken) && !string.IsNullOrWhiteSpace(Uid);

        public string? IdToken => BearerToken;

        public string? Uid =>
            _http.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? _http.HttpContext?.User?.FindFirstValue("user_id");

        public string? Email =>
            _http.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);

        // -------- Enda metoden Provision behöver --------
        public Task<string> GetValidIdTokenAsync()
        {
            if (string.IsNullOrWhiteSpace(IdToken))
                throw new InvalidOperationException("Missing bearer IdToken.");

            return Task.FromResult(IdToken);
        }

        // -------- Client-only metoder (ska ALDRIG användas på servern) --------
        public Task<bool> SignInWithEmailPassword(string email, string password)
            => throw new NotSupportedException();

        public Task<string?> RegisterUserAsync(string email, string password)
            => throw new NotSupportedException();

        public Task<bool> ExchangeCustomToken(string customToken)
            => throw new NotSupportedException();

        public Task<bool> RefreshToken()
            => Task.FromResult(false);

        public void AttachAuthHeader(HttpClient client)
            => throw new NotSupportedException();

        public Task LogoutAsync()
            => Task.CompletedTask;

        public Task<bool> ChangePasswordAsync(string currentPassword, string newPassword)
            => throw new NotSupportedException();

        public Task<bool> SendPasswordResetEmailAsync(string email)
            => throw new NotSupportedException();

        public Task RestoreSessionAsync(string uid, string idToken, string refreshToken, string? email, CancellationToken ct = default)
            => throw new NotSupportedException();

        public Task<bool> TryResumeSessionAsync(CancellationToken ct = default)
            => Task.FromResult(IsLoggedIn);


        public string? RefreshTokenPublic { get => null; set { } }
        public string? ExpiresIn => null;
    }
}
