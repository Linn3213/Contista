using System.Collections.Concurrent;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Web.Client.Offline.Runtime;

public sealed class InMemoryCacheStore : ICacheStore
{
    private sealed class Entry
    {
        public object? Data { get; init; }
        public string? Version { get; init; }
        public DateTime? UpdatedAtUtc { get; init; }
    }

    private readonly ConcurrentDictionary<string, Entry> _map = new();

    public Task<CacheResult<T>> TryGetAsync<T>(string key, CancellationToken ct = default)
    {
        if (_map.TryGetValue(key, out var e) && e.Data is T t)
            return Task.FromResult(new CacheResult<T>(true, e.Version, e.UpdatedAtUtc, t));

        return Task.FromResult(CacheResult<T>.NotFound());
    }

    public Task SetAsync<T>(string key, T data, string? version = null, DateTime? updatedAtUtc = null, CancellationToken ct = default)
    {
        _map[key] = new Entry
        {
            Data = data,
            Version = version,
            UpdatedAtUtc = updatedAtUtc ?? DateTime.UtcNow
        };
        return Task.CompletedTask;
    }

    public Task RemoveAsync(string key, CancellationToken ct = default)
    {
        _map.TryRemove(key, out _);
        return Task.CompletedTask;
    }
}
