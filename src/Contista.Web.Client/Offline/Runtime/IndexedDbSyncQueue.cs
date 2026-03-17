using System.Text.Json;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;
using Microsoft.JSInterop;

namespace Contista.Web.Client.Offline.Runtime;

public sealed class IndexedDbSyncQueue : ISyncQueue
{
    private readonly IJSRuntime _js;
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    public IndexedDbSyncQueue(IJSRuntime js) => _js = js;

    public async Task<SyncQueueItem?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();
        if (string.IsNullOrWhiteSpace(id)) return null;

        return await _js.InvokeAsync<SyncQueueItem?>("laIndexedDb.queueGetById", ct, id);
    }



    public async Task<IReadOnlyList<SyncQueueItem>> GetAllAsync(CancellationToken ct = default)
    {
        var items = await _js.InvokeAsync<SyncQueueItem[]>("laIndexedDb.queueGetAll", ct);
        return items ?? Array.Empty<SyncQueueItem>();
    }

    public async Task EnqueueAsync(SyncOperation operation, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(operation.ClientOperationId))
            operation.ClientOperationId = Guid.NewGuid().ToString("N");

        var item = new SyncQueueItem
        {
            Id = operation.ClientOperationId!,
            CreatedAtUtc = DateTime.UtcNow,
            Attempts = 0,
            Status = SyncQueueStatus.Pending,
            LastError = null,
            LastAttemptUtc = null,
            Operation = operation
        };

        await UpsertAsync(item, ct);
    }

    public async Task MarkDoneAsync(string operationId, CancellationToken ct = default)
    {
        var all = await GetAllAsync(ct);
        var item = all.FirstOrDefault(x => x.Id == operationId);
        if (item is null) return;

        item.Status = SyncQueueStatus.Done;
        item.LastError = null;
        item.LastAttemptUtc = DateTime.UtcNow;
        await UpsertAsync(item, ct);
    }

    public async Task MarkFailedAsync(string operationId, string error, CancellationToken ct = default)
    {
        var all = await GetAllAsync(ct);
        var item = all.FirstOrDefault(x => x.Id == operationId);
        if (item is null) return;

        item.Attempts += 1;
        item.LastError = error;
        item.Status = SyncQueueStatus.Failed;
        item.LastAttemptUtc = DateTime.UtcNow;
        await UpsertAsync(item, ct);
    }

    public Task ClearAsync(CancellationToken ct = default)
        => _js.InvokeVoidAsync("laIndexedDb.queueClear", ct).AsTask();

    public async Task UpsertAsync(SyncQueueItem item, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(item.Id))
        {
            var opId = item.Operation?.ClientOperationId;
            item.Id = !string.IsNullOrWhiteSpace(opId) ? opId! : Guid.NewGuid().ToString("N");
        }

        if (item.Operation != null && string.IsNullOrWhiteSpace(item.Operation.ClientOperationId))
            item.Operation.ClientOperationId = item.Id;

        // JS behöver “enkla” property names (camelCase) – JsonSerializerDefaults.Web ger det.
        // Men JS interop skickar objekt som JSON ändå; SyncQueueItem bör vara serialiserbar.
        await _js.InvokeVoidAsync("laIndexedDb.queueUpsert", ct, item);
    }

    public async Task<SyncQueueItem?> GetNextPendingAsync(CancellationToken ct = default)
    {
        // För enkelhet: hämta via JS-funktion
        //return await _js.InvokeAsync<SyncQueueItem?>("laIndexedDb.queueGetNextPending", ct);
        ct.ThrowIfCancellationRequested();

        var all = await GetAllAsync(ct);
        return all
            .Where(i => i.Status == SyncQueueStatus.Pending)
            .OrderBy(i => i.CreatedAtUtc)
            .FirstOrDefault();
    }

    public async Task<int> CountAsync(SyncQueueStatus status, CancellationToken ct = default)
    {
        // status kan bli int i JS, så vi skickar både sträng och int-stöd i JS (se queueGetNextPending)
        // Här räcker int
        //return await _js.InvokeAsync<int>("laIndexedDb.queueCountByStatus", ct, (int)status);
        ct.ThrowIfCancellationRequested();

        var all = await GetAllAsync(ct);
        return all.Count(i => i.Status == status);
    }

    public Task DeleteAsync(string id, CancellationToken ct = default)
        => _js.InvokeVoidAsync("laIndexedDb.queueDelete", ct, id).AsTask();
}
