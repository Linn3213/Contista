using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Http;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Logic;

public sealed class CommonDataProvider : ICommonDataProvider
{
    private readonly ICommonCacheService _cache;
    private readonly IOfflineDataSync _sync;
    private readonly INetworkStatus _network;

    public CommonDataProvider(
        ICommonCacheService cache,
        IOfflineDataSync sync,
        INetworkStatus network)
    {
        _cache = cache;
        _sync = sync;
        _network = network;
    }

    public async Task<CommonCacheEnvelope?> GetCommonAsync(
        bool forceRefresh = false,
        CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        var cached = await _cache.TryLoadAsync(ct);
        var knownVersion = cached?.Version;

        // ✅ Guard: offline => returnera cache direkt, ingen HTTP
        if (!_network.IsOnline)
            return cached;

        try
        {
            var (ok, version, dataObj) =
                await _sync.FetchCommonAsync(forceRefresh ? null : knownVersion, ct);

            // ok=false = typ 401/unauthorized i din ApiOfflineDataSync
            if (!ok)
                return cached;

            // dataObj == null => "not modified" / inget nytt
            if (dataObj is null)
                return cached;

            if (dataObj is not CommonDataDto dto)
                return cached; // defensivt

            var envelope = new CommonCacheEnvelope
            {
                Version = version ?? "",
                Data = dto,
                CachedAtUtc = DateTime.UtcNow
            };

            await _cache.SaveAsync(envelope, ct);
            return envelope;
        }
        catch (OperationCanceledException)
        {
            // ✅ Viktigt: maska inte cancellation
            throw;
        }
        catch (ApiFailureException afx)
        {
            // ✅ Auth-fel ska bubbla upp (så auth kan hantera logout)
            if (afx.Failure.IsAuth)
                throw;

            // ✅ Offline/timeout/server => fallback cache
            return cached;
        }
        catch
        {
            return cached;
        }
    }
}
