using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Offline.Models.Auth;

namespace Contista.Shared.Core.Offline.Interfaces;

public interface IClaimsSnapshotStore
{
    Task<ClaimSnapshot?> TryGetAsync(string userId, CancellationToken ct = default);
    Task SetAsync(ClaimSnapshot snapshot, CancellationToken ct = default);
    Task RemoveAsync(string userId, CancellationToken ct = default);
}
