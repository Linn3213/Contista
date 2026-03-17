using Contista.Shared.Core.Offline.Interfaces;

namespace Contista.Shared.Core.Offline.Logic;

public sealed class LastUserStore : ILastUserStore
{
    private readonly ICacheStore _cache;
    private const string Key = "auth.lastUser.v1";

    public LastUserStore(ICacheStore cache) => _cache = cache;

    public async Task<LastUser?> TryGetAsync(CancellationToken ct = default)
    {
        var res = await _cache.TryGetAsync<LastUser>(Key, ct);
        return res.Found ? res.Data : null;
    }

    public Task SetAsync(LastUser user, CancellationToken ct = default)
        => _cache.SetAsync(Key, user, version: "v1", updatedAtUtc: DateTime.UtcNow, ct: ct);

    public Task ClearAsync(CancellationToken ct = default)
        => _cache.RemoveAsync(Key, ct);
}
