namespace Contista.Shared.Core.Interfaces.Auth;

public interface IAuthReactor
{
    Task ForceLogoutAsync(string reason, CancellationToken ct = default);
}
