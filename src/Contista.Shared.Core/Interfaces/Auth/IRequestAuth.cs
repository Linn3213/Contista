namespace Contista.Shared.Core.Interfaces.Auth
{
    public interface IRequestAuth
    {
        bool IsLoggedIn { get; }
        string? IdToken { get; }
        string? Uid { get; }
        string? Email { get; }

        Task<string> GetValidIdTokenAsync();
        Task<bool> RefreshToken();
    }
}
