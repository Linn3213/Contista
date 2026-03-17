using Contista.Shared.Core.Models.Auth;

namespace Contista.Shared.Core.Interfaces.Auth;

public interface IRegisterApi
{
    Task<bool> RegisterAsync(RegisterRequest req, CancellationToken ct = default);
}
