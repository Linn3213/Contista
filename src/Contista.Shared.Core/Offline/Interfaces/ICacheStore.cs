using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Interfaces
{
    public interface ICacheStore
    {
        Task<CacheResult<T>> TryGetAsync<T>(string key, CancellationToken ct = default);

        Task SetAsync<T>(
            string key,
            T data,
            string? version = null,
            DateTime? updatedAtUtc = null,
            CancellationToken ct = default);

        Task RemoveAsync(string key, CancellationToken ct = default);
    }
}
