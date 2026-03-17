using System.Collections.Concurrent;
using System.Text.Json;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Web.Services;

public sealed class InMemoryCacheStore : ICacheStore
{
    private sealed record Entry(string Json, string? Version, DateTime? UpdatedAtUtc);

    private readonly ConcurrentDictionary<string, Entry> _store = new();
    private readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

    public Task<CacheResult<T>> TryGetAsync<T>(string key, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        if (!_store.TryGetValue(key, out var entry))
            return Task.FromResult(CacheResult<T>.NotFound());

        try
        {
            var data = JsonSerializer.Deserialize<T>(entry.Json, _json);
            if (data is null)
                return Task.FromResult(CacheResult<T>.NotFound());

            return Task.FromResult(new CacheResult<T>(
                Found: true,
                Version: entry.Version,
                UpdatedAtUtc: entry.UpdatedAtUtc,
                Data: data));
        }
        catch
        {
            // trasig json => behandla som saknas
            return Task.FromResult(CacheResult<T>.NotFound());
        }
    }

    public Task SetAsync<T>(
        string key,
        T data,
        string? version = null,
        DateTime? updatedAtUtc = null,
        CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        var json = JsonSerializer.Serialize(data, _json);
        _store[key] = new Entry(json, version, updatedAtUtc);

        return Task.CompletedTask;
    }

    public Task RemoveAsync(string key, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();
        _store.TryRemove(key, out _);
        return Task.CompletedTask;
    }
}
