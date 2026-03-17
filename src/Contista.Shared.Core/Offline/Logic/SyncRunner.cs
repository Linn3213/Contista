using Contista.Shared.Core.Http;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Interfaces.Sync;
using Contista.Shared.Core.Models.Sync;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Logic;

public sealed class SyncRunner : ISyncRunner
{
    private readonly ISyncQueue _queue;
    private readonly IOfflineDataSync _sync;
    private readonly INetworkStatus _network;
    private readonly IFirebaseAuthService _auth;
    private readonly ISyncUxNotifier _ux;

    private readonly SemaphoreSlim _gate = new(1, 1);

    private readonly object _triggerLock = new();
    private CancellationTokenSource? _triggerCts;
    private bool _triggerScheduled;

    private static readonly TimeSpan TriggerDebounce = TimeSpan.FromSeconds(2);
    private const int MaxAttempts = 8;

    public SyncRunner(
        ISyncQueue queue,
        IOfflineDataSync sync,
        INetworkStatus network,
        IFirebaseAuthService auth,
        ISyncUxNotifier ux)
    {
        _queue = queue;
        _sync = sync;
        _network = network;
        _auth = auth;
        _ux = ux;
    }

    public Task TriggerAsync(CancellationToken ct = default)
    {
        if (!_network.IsOnline || !_auth.IsLoggedIn)
            return Task.CompletedTask;

        lock (_triggerLock)
        {
            _triggerCts?.Cancel();
            _triggerCts?.Dispose();

            _triggerCts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            var localCts = _triggerCts;

            if (_triggerScheduled)
                return Task.CompletedTask;

            _triggerScheduled = true;
            _ = DebouncedRunAsync(localCts.Token);
            return Task.CompletedTask;
        }
    }

    private async Task DebouncedRunAsync(CancellationToken ct)
    {
        try
        {
            await Task.Delay(TriggerDebounce, ct);

            var pending = await _queue.CountAsync(SyncQueueStatus.Pending, ct);
            var failed = await _queue.CountAsync(SyncQueueStatus.Failed, ct);
            if (pending + failed <= 0)
                return;

            await RunOnceAsync(ct);
        }
        catch (OperationCanceledException) { }
        catch { }
        finally
        {
            lock (_triggerLock) { _triggerScheduled = false; }
        }
    }

    public async Task RunOnceAsync(CancellationToken ct = default)
    {
        if (!_network.IsOnline || !_auth.IsLoggedIn)
            return;

        await _gate.WaitAsync(ct);
        try
        {
            while (_network.IsOnline && _auth.IsLoggedIn && !ct.IsCancellationRequested)
            {
                var next = await GetNextCandidateAsync(ct);
                if (next is null)
                    break;

                // Backoff: om failed och inte redo ännu -> sluta (för att inte spinna)
                if (next.Status == SyncQueueStatus.Failed && next.LastAttemptUtc is not null)
                {
                    var readyAt = next.LastAttemptUtc.Value + RetryPolicy.GetBackoff(next.Attempts, max: TimeSpan.FromSeconds(60));
                    if (DateTime.UtcNow < readyAt)
                        break;
                }

                // Max attempts: ge upp
                if (next.Attempts >= MaxAttempts)
                {
                    _ux.Set(new SyncUxState(
                        FailedCount: 1,
                        SessionExpired: false,
                        Message: "Vissa ändringar kunde inte synkas (för många försök)."));

                    // lämna den som Failed så användaren kan se att något är fel
                    next.Status = SyncQueueStatus.Failed;
                    next.LastError = "Max attempts reached.";
                    next.LastAttemptUtc = DateTime.UtcNow;
                    await _queue.UpsertAsync(next, ct);
                    break;
                }

                // Markera processing
                next.Status = SyncQueueStatus.Processing;
                next.LastAttemptUtc = DateTime.UtcNow;
                next.Attempts++;
                next.LastError = null;
                await _queue.UpsertAsync(next, ct);

                try
                {
                    // Token: behövs i MAUI (Bearer). Web (cookie) kan vara tomt.
                    var token = "";
                    try { token = await _auth.GetValidIdTokenAsync(); } catch { token = ""; }

                    await _sync.ApplyOperationAsync(next.Operation.UserId, token, next.Operation, ct);

                    next.Status = SyncQueueStatus.Done;
                    next.LastError = null;
                    next.LastAttemptUtc = DateTime.UtcNow;
                    await _queue.UpsertAsync(next, ct);

                    // Om du vill: rensa UX när vi lyckas med en operation
                    _ux.Clear();
                }
                catch (Exception ex)
                {
                    var failure = ExtractFailure(ex);

                    // 401 => session expired: visa UX + stoppa sync-loop
                    if (failure.Kind == ApiFailureKind.Unauthorized)
                    {
                        _ux.Set(new SyncUxState(
                            FailedCount: 0,
                            SessionExpired: true,
                            Message: "Sessionen gick ut. Logga in igen."));

                        next.Status = SyncQueueStatus.Failed;
                        next.LastError = "Unauthorized (session expired).";
                        next.LastAttemptUtc = DateTime.UtcNow;
                        await _queue.UpsertAsync(next, ct);

                        break; // låt AppGate/Auth hantera logout/redirect
                    }

                    // Retrybart: låt ligga kvar som Failed och backoff styr nästa körning
                    next.Status = SyncQueueStatus.Failed;
                    next.LastError = $"{failure.Kind}: {failure.Message ?? ex.Message}";
                    next.LastAttemptUtc = DateTime.UtcNow;
                    await _queue.UpsertAsync(next, ct);

                    if (failure.IsTransient)
                    {
                        _ux.Set(new SyncUxState(
                            FailedCount: 1,
                            SessionExpired: false,
                            Message: "Vissa ändringar kunde inte synkas ännu. Vi försöker igen automatiskt."));

                        break; // bryt så vi inte spammar backend
                    }

                    // Ej retrybart (t.ex. BadRequest/NotFound): visa och ge upp för nu
                    _ux.Set(new SyncUxState(
                        FailedCount: 1,
                        SessionExpired: false,
                        Message: "En ändring kunde inte synkas. Kontrollera och försök igen."));

                    break;
                }
            }
        }
        finally
        {
            _gate.Release();
        }
    }

    private ApiFailure ExtractFailure(Exception ex)
    {
        if (ex is ApiFailureException afx)
            return afx.Failure;

        // Om vi vet att vi är offline -> klassificera korrekt
        if (!_network.IsOnline)
            return new ApiFailure(ApiFailureKind.Offline, null, "Offline", ex);

        return ApiFailureClassifier.FromException(ex);
    }

    private async Task<SyncQueueItem?> GetNextCandidateAsync(CancellationToken ct)
    {
        var pending = await _queue.GetNextPendingAsync(ct);
        if (pending is not null)
            return pending;

        var all = await _queue.GetAllAsync(ct);
        return all
            .Where(i => i.Status == SyncQueueStatus.Failed)
            .OrderBy(i => i.LastAttemptUtc ?? i.CreatedAtUtc)
            .FirstOrDefault();
    }
}
