using Contista.Shared.Core.Models.Auth;

namespace Contista.Shared.Core.Interfaces.Auth;

public interface IFeatureAccessService
{
    Task<bool> CanAsync(FeatureKey feature, CancellationToken ct = default);
}
