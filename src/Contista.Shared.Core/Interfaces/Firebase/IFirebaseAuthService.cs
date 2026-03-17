using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Firebase
{
    public interface IFirebaseAuthService
    {
        
        bool IsLoggedIn { get; }
        string? IdToken { get; }
        string? RefreshTokenPublic { get; set; }
        string? Uid { get; }
        string? ExpiresIn { get; }
        string? Email { get; }

        Task<bool> SignInWithEmailPassword(string email, string password);
        void AttachAuthHeader(HttpClient client);
        Task<bool> ExchangeCustomToken(string customToken);
        Task<bool> RefreshToken();
        Task<string> GetValidIdTokenAsync();
        Task<string?> RegisterUserAsync(string email, string password);
        Task LogoutAsync();
        Task<bool> ChangePasswordAsync(string currentPassword, string newPassword);
        Task<bool> SendPasswordResetEmailAsync(string email);
        Task RestoreSessionAsync(string uid, string idToken, string refreshToken, string? email, CancellationToken ct = default);
        Task<bool> TryResumeSessionAsync(CancellationToken ct = default);
    }
}
