using Contista.Shared.Core.Interfaces.Firebase;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Text.Json;

namespace Contista.Web.Services
{
    public sealed class HttpContextFirebaseAuthService : IFirebaseAuthService
    {
        private readonly IHttpContextAccessor _http;

        public HttpContextFirebaseAuthService(IHttpContextAccessor http) => _http = http;

        public bool IsLoggedIn => !string.IsNullOrWhiteSpace(IdToken);

        public string? IdToken => ReadBearerToken();

        // Interface kräver set; men vi kan ignorera på servern
        public string? RefreshTokenPublic { get; set; }

        public string? Uid => TryGetUidFromJwt(IdToken);

        // Interface kräver dessa, men på servern har vi dem inte alltid
        public string? ExpiresIn => null;
        public string? Email => TryGetEmailFromJwt(IdToken);

        public Task<bool> SignInWithEmailPassword(string email, string password)
            => throw new NotSupportedException("Use client-side Firebase login. Server auth is via Bearer token.");

        public void AttachAuthHeader(HttpClient client)
        {
            var token = IdToken;
            if (!string.IsNullOrWhiteSpace(token))
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        }

        public Task<bool> ExchangeCustomToken(string customToken)
            => throw new NotSupportedException("Not supported on server.");

        public Task<bool> RefreshToken()
            => Task.FromResult(false); // server kan inte refresh:a klientens token

        public Task<string> GetValidIdTokenAsync()
        {
            var token = IdToken;
            if (string.IsNullOrWhiteSpace(token))
                throw new InvalidOperationException("Missing Bearer token.");
            return Task.FromResult(token);
        }

        public Task<string?> RegisterUserAsync(string email, string password)
            => throw new NotSupportedException("Register should be performed client-side.");

        public Task LogoutAsync()
            => Task.CompletedTask;

        public Task<bool> ChangePasswordAsync(string currentPassword, string newPassword)
            => throw new NotSupportedException("ChangePassword should be performed client-side.");

        public Task<bool> SendPasswordResetEmailAsync(string email)
            => throw new NotSupportedException("Reset email should be performed client-side.");

        public Task RestoreSessionAsync(string uid, string idToken, string refreshToken, string? email, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task<bool> TryResumeSessionAsync(CancellationToken ct = default)
            => Task.FromResult(false);


        private string? ReadBearerToken()
        {
            var ctx = _http.HttpContext;
            if (ctx is null) return null;

            if (!ctx.Request.Headers.TryGetValue("Authorization", out var auth))
                return null;

            var value = auth.ToString();
            const string prefix = "Bearer ";
            if (!value.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
                return null;

            return value.Substring(prefix.Length).Trim();
        }

        private static string? TryGetUidFromJwt(string? jwt)
        {
            if (string.IsNullOrWhiteSpace(jwt)) return null;
            var parts = jwt.Split('.');
            if (parts.Length < 2) return null;

            try
            {
                var payload = PadBase64(parts[1]);
                var json = Encoding.UTF8.GetString(Convert.FromBase64String(payload));
                using var doc = JsonDocument.Parse(json);

                if (doc.RootElement.TryGetProperty("user_id", out var uid))
                    return uid.GetString();
                if (doc.RootElement.TryGetProperty("sub", out var sub))
                    return sub.GetString();

                return null;
            }
            catch { return null; }
        }

        private static string? TryGetEmailFromJwt(string? jwt)
        {
            if (string.IsNullOrWhiteSpace(jwt)) return null;
            var parts = jwt.Split('.');
            if (parts.Length < 2) return null;

            try
            {
                var payload = PadBase64(parts[1]);
                var json = Encoding.UTF8.GetString(Convert.FromBase64String(payload));
                using var doc = JsonDocument.Parse(json);

                if (doc.RootElement.TryGetProperty("email", out var email))
                    return email.GetString();

                return null;
            }
            catch { return null; }
        }

        private static string PadBase64(string payload)
        {
            payload = payload.Replace('-', '+').Replace('_', '/');
            switch (payload.Length % 4)
            {
                case 2: payload += "=="; break;
                case 3: payload += "="; break;
            }
            return payload;
        }
    }
}
