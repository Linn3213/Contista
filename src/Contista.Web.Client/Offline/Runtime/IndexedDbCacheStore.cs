using System.Text.Json;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;
using Microsoft.JSInterop;

namespace Contista.Web.Client.Offline.Runtime;

public sealed class IndexedDbCacheStore : ICacheStore
{
    private readonly IJSRuntime _js;
    private static readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

    private bool _initAttempted;

    public IndexedDbCacheStore(IJSRuntime js) => _js = js;

    private async Task EnsureInitAsync(CancellationToken ct)
    {
        if (_initAttempted) return;
        _initAttempted = true;

        try
        {
            // best effort – om detta failar ska cache bara “tyst” inte fungera
            await _js.InvokeVoidAsync("laIndexedDb.openDb", ct);
        }
        catch (JSException) { }
        catch (TaskCanceledException) { }
    }

    public async Task<CacheResult<T>> TryGetAsync<T>(string key, CancellationToken ct = default)
    {
        await EnsureInitAsync(ct);

        try
        {
            // Returnera bara json-string från JS
            var json = await _js.InvokeAsync<string?>("laIndexedDb.cacheGetJson", ct, key);

            if (string.IsNullOrWhiteSpace(json))
                return CacheResult<T>.NotFound();

            var data = JsonSerializer.Deserialize<T>(json, _json);
            if (data is null)
                return CacheResult<T>.NotFound();

            // Om du vill behålla version/tid: gör cacheGetMeta separat senare.
            return new CacheResult<T>(true, Version: null, UpdatedAtUtc: null, data);
        }
        catch (JSException)
        {
            return CacheResult<T>.NotFound();
        }
        catch (TaskCanceledException)
        {
            return CacheResult<T>.NotFound();
        }
        catch
        {
            return CacheResult<T>.NotFound();
        }
    }

    public async Task SetAsync<T>(string key, T data, string? version = null, DateTime? updatedAtUtc = null, CancellationToken ct = default)
    {
        await EnsureInitAsync(ct);

        try
        {
            var json = JsonSerializer.Serialize(data, _json);

            // Skicka entry i JS-shape (camelCase)
            var entry = new
            {
                key,
                json,
                version,
                updatedAtUtc = updatedAtUtc ?? DateTime.UtcNow
            };

            await _js.InvokeVoidAsync("laIndexedDb.cacheSet", ct, entry);
        }
        catch (JSException) { }
        catch (TaskCanceledException) { }
        catch { }
    }

    public async Task RemoveAsync(string key, CancellationToken ct = default)
    {
        await EnsureInitAsync(ct);

        try
        {
            await _js.InvokeVoidAsync("laIndexedDb.cacheRemove", ct, key);
        }
        catch (JSException) { }
        catch (TaskCanceledException) { }
        catch { }
    }
}
