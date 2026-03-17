using System.Text.Json;
using Contista.Shared.Core.Http;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Offline.Models.Sync;

namespace Contista.Shared.Core.Offline.Logic;

public sealed class OfflineOrchestrator : IAppSessionOrchestrator
{
    private readonly ICacheStore _cache;
    private readonly ISyncQueue _queue;
    private readonly INetworkStatus _net;
    private readonly ISecretStore _secrets;
    private readonly IOfflineDataSync _sync;
    private readonly IOfflineClock _clock;
    private readonly IFirebaseAuthService _auth;
    private readonly IAuthReactor _authReactor;

    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public OfflineOrchestrator(
        ICacheStore cache,
        ISyncQueue queue,
        INetworkStatus net,
        ISecretStore secrets,
        IOfflineDataSync sync,
        IOfflineClock clock,
        IFirebaseAuthService auth,
        IAuthReactor authReactor)
    {
        _cache = cache;
        _queue = queue;
        _net = net;
        _secrets = secrets;
        _sync = sync;
        _clock = clock;
        _auth = auth;
        _authReactor = authReactor;
    }

    // 1) Landing: cache först, refresh i bakgrunden om online
    public async Task<CacheResult<TCommon>> GetCommonAsync<TCommon>(CancellationToken ct = default)
    {
        var cached = await _cache.TryGetAsync<TCommon>(OfflineKeys.CommonCacheKey, ct);

        if (_net.IsOnline)
        {
            _ = Task.Run(async () =>
            {
                try { await RefreshCommonAsync<TCommon>(cached.Version, CancellationToken.None); }
                catch { /* best effort */ }
            });
        }

        return cached;
    }

    public async Task<bool> TryResumeSessionAsync(CancellationToken ct = default)
    {
        if (_auth.IsLoggedIn && !string.IsNullOrWhiteSpace(_auth.Uid))
            return true;

        var uid = await _secrets.GetAsync(OfflineKeys.Secret_UserId, ct);
        var idToken = await _secrets.GetAsync(OfflineKeys.Secret_IdToken, ct);
        var refreshToken = await _secrets.GetAsync(OfflineKeys.Secret_RefreshToken, ct);
        var email = await _secrets.GetAsync(OfflineKeys.Secret_Email, ct);

        if (string.IsNullOrWhiteSpace(uid) ||
            string.IsNullOrWhiteSpace(idToken) ||
            string.IsNullOrWhiteSpace(refreshToken))
        {
            return false;
        }

        await _auth.RestoreSessionAsync(uid!, idToken!, refreshToken!, email, ct);
        return _auth.IsLoggedIn;
    }

    public async Task RefreshCommonAsync<TCommon>(string? knownVersion, CancellationToken ct = default)
    {
        // Offline => gör inget (cache gäller)
        if (!_net.IsOnline)
            return;

        try
        {
            var (ok, newVersion, dataObj) = await _sync.FetchCommonAsync(knownVersion, ct);
            if (!ok || dataObj is null) return;

            // Snabb väg om typen redan matchar
            if (dataObj is TCommon typedDirect)
            {
                await _cache.SetAsync(OfflineKeys.CommonCacheKey, typedDirect, newVersion, _clock.UtcNow, ct);
                return;
            }

            // Fallback (safe) via JSON
            var json = JsonSerializer.Serialize(dataObj, JsonOpts);
            var typed = JsonSerializer.Deserialize<TCommon>(json, JsonOpts);
            if (typed is null) return;

            await _cache.SetAsync(OfflineKeys.CommonCacheKey, typed, newVersion, _clock.UtcNow, ct);
        }
        catch (ApiFailureException afx) when (afx.Failure.IsAuth)
        {
            // ✅ Token/cookie ogiltig -> hård logout
            await _authReactor.ForceLogoutAsync($"OfflineOrchestrator Refresh auth-failed: {afx.Failure.Kind}", ct);
        }
        catch (OperationCanceledException) { throw; }
        catch
        {
            // best effort
        }
    }

    // 2) Home: cache först, refresh + flush i bakgrunden om online
    public async Task<CacheResult<TUser>> GetUserAsync<TUser>(string userId, CancellationToken ct = default)
    {
        var key = OfflineKeys.UserCacheKey(userId);
        var cached = await _cache.TryGetAsync<TUser>(key, ct);

        if (_net.IsOnline)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    await RefreshUserAsync<TUser>(userId, cached.Version, CancellationToken.None);
                    await TryFlushQueueAsync(userId, CancellationToken.None);
                }
                catch { /* best effort */ }
            });
        }

        return cached;
    }

    public async Task RefreshUserAsync<TUser>(string userId, string? knownVersion, CancellationToken ct = default)
    {
        if (!_net.IsOnline)
            return;

        try
        {
            var (ok, newVersion, dataObj) = await _sync.FetchUserAsync(userId, knownVersion, ct);
            if (!ok || dataObj is null) return;

            if (dataObj is TUser typedDirect)
            {
                await _cache.SetAsync(OfflineKeys.UserCacheKey(userId), typedDirect, newVersion, _clock.UtcNow, ct);
                return;
            }

            var json = JsonSerializer.Serialize(dataObj, JsonOpts);
            var typed = JsonSerializer.Deserialize<TUser>(json, JsonOpts);
            if (typed is null) return;

            await _cache.SetAsync(OfflineKeys.UserCacheKey(userId), typed, newVersion, _clock.UtcNow, ct);
        }
        catch (ApiFailureException afx) when (afx.Failure.IsAuth)
        {
            await _authReactor.ForceLogoutAsync($"OfflineOrchestrator Refresh auth-failed: {afx.Failure.Kind}", ct);
        }
        catch (OperationCanceledException) { throw; }
        catch
        {
            // best effort
        }
    }

    // 3) Offline-write: enqueue
    public Task EnqueueOperationAsync(SyncOperation op, CancellationToken ct = default)
        => _queue.EnqueueAsync(op, ct);

    // 4) Online: flush queue till backend
    public async Task TryFlushQueueAsync(string userId, CancellationToken ct = default)
    {
        if (!_net.IsOnline)
            return;

        // Om vi inte är inloggade: flush gör ingen nytta
        if (!_auth.IsLoggedIn || string.IsNullOrWhiteSpace(_auth.Uid))
            return;

        // MAUI: du använder secrets för token; Web: cookie – men du har signaturen kvar.
        var idToken = await _secrets.GetAsync(OfflineKeys.Secret_IdToken, ct);
        if (string.IsNullOrWhiteSpace(idToken))
            return;

        var items = await _queue.GetAllAsync(ct);
        if (items.Count == 0)
            return;

        foreach (var item in items.Where(i => i.Status == SyncQueueStatus.Pending)
                                  .OrderBy(i => i.CreatedAtUtc))
        {
            ct.ThrowIfCancellationRequested();

            try
            {
                item.Status = SyncQueueStatus.Processing;
                item.LastAttemptUtc = _clock.UtcNow;
                item.Attempts++;
                await _queue.UpsertAsync(item, ct);

                await _sync.ApplyOperationAsync(userId, idToken!, item.Operation, ct);

                await _queue.DeleteAsync(item.Id, ct);
            }
            catch (ApiFailureException afx) when (afx.Failure.IsAuth)
            {
                // ✅ token/cookie är död -> logga ut och sluta flush:a
                item.Status = SyncQueueStatus.Pending;
                item.LastError = afx.Message;
                await _queue.UpsertAsync(item, ct);

                await _authReactor.ForceLogoutAsync($"OfflineOrchestrator Flush auth-failed: {afx.Failure.Kind}", ct);
                break;
            }
            catch (ApiFailureException afx)
            {
                // Offline/timeout/5xx: lämna pending och sluta (inte spamma servern)
                item.Status = SyncQueueStatus.Pending;
                item.LastError = afx.Message;
                await _queue.UpsertAsync(item, ct);
                break;
            }
            catch (Exception ex)
            {
                item.Status = SyncQueueStatus.Pending;
                item.LastError = ex.Message;
                await _queue.UpsertAsync(item, ct);
                break;
            }
        }
    }

    // 5) “Auto-login”-signal
    public async Task<bool> HasSavedSessionAsync(CancellationToken ct = default)
    {
        var uid = await _secrets.GetAsync(OfflineKeys.Secret_UserId, ct);
        var rt = await _secrets.GetAsync(OfflineKeys.Secret_RefreshToken, ct);
        return !string.IsNullOrWhiteSpace(uid) && !string.IsNullOrWhiteSpace(rt);
    }

    // 6) Logout
    public async Task ClearSessionAsync(CancellationToken ct = default)
    {
        await _secrets.RemoveAsync(OfflineKeys.Secret_UserId, ct);
        await _secrets.RemoveAsync(OfflineKeys.Secret_IdToken, ct);
        await _secrets.RemoveAsync(OfflineKeys.Secret_RefreshToken, ct);
        await _secrets.RemoveAsync(OfflineKeys.Secret_Email, ct);

        await _auth.LogoutAsync();
    }
}
