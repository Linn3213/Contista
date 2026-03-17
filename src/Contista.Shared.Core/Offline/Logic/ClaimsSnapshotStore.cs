using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Offline.Models.Auth;

namespace Contista.Shared.Core.Offline.Logic;

public sealed class ClaimsSnapshotStore : IClaimsSnapshotStore
{
    private readonly ICacheStore _cache;

    private const string KeyPrefix = "auth.claimsSnapshot";
    private const string Version = "v1";

    public ClaimsSnapshotStore(ICacheStore cache) => _cache = cache;

    private static string Key(string userId) => $"{KeyPrefix}.{userId}.{Version}";

    public async Task<ClaimSnapshot?> TryGetAsync(string userId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return null;

        var res = await _cache.TryGetAsync<ClaimSnapshot>(Key(userId), ct);
        return res.Found ? res.Data : null;
    }

    public Task SetAsync(ClaimSnapshot snapshot, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(snapshot.UserId))
            return Task.CompletedTask;

        return _cache.SetAsync(
            key: Key(snapshot.UserId),
            data: snapshot,
            version: Version,
            updatedAtUtc: snapshot.UpdatedAtUtc,
            ct: ct);
    }

    public Task RemoveAsync(string userId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return Task.CompletedTask;

        return _cache.RemoveAsync(Key(userId), ct);
    }
}
