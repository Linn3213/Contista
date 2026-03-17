using Contista.Shared.Core.Http;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Logic;

public sealed class UserDataProvider<T> : IUserDataProvider<T> where T : class
{
    private readonly IUserCacheService<T> _cache;
    private readonly IOfflineDataSync _sync;
    private readonly INetworkStatus _network;

    public UserDataProvider(
        IUserCacheService<T> cache,
        IOfflineDataSync sync,
        INetworkStatus network)
    {
        _cache = cache;
        _sync = sync;
        _network = network;
    }

    public async Task<UserCacheEnvelope<T>?> GetUserAsync(
        string userId,
        bool forceRefresh = false,
        CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        var cached = await _cache.TryLoadAsync(userId, ct);
        var knownVersion = cached?.Version;

        // ✅ Offline-first: ingen HTTP när offline
        if (!_network.IsOnline)
            return cached;

        try
        {
            var (ok, version, dataObj) =
                await _sync.FetchUserAsync(userId, forceRefresh ? null : knownVersion, ct);

            if (!ok)
                return cached;

            // ok men inget nytt
            if (dataObj is null)
                return cached;

            if (dataObj is not T dto)
                throw new InvalidOperationException(
                    $"FetchUserAsync returned '{dataObj.GetType().Name}' but provider expects '{typeof(T).Name}'.");

            var envelope = new UserCacheEnvelope<T>
            {
                UserId = userId,
                Version = version ?? knownVersion ?? "v1",
                Data = dto,
                CachedAtUtc = DateTime.UtcNow
            };

            await _cache.SaveAsync(userId, envelope, ct);
            return envelope;
        }
        catch (OperationCanceledException)
        {
            // ✅ maska inte cancellation
            throw;
        }
        catch (ApiFailureException afx)
        {
            // ✅ Auth måste bubbla så state kan hantera logout/reauth
            if (afx.Failure.IsAuth)
                throw;

            // ✅ Offline/timeout/server => fallback cache
            return cached;
        }
        catch
        {
            // ✅ okända fel => fallback cache
            return cached;
        }
    }
}
