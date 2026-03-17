using System.Collections.Concurrent;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Web.Client.Offline.Runtime;

public sealed class InMemorySyncQueue : ISyncQueue
{
    private readonly ConcurrentDictionary<string, SyncQueueItem> _items = new();

    public Task<SyncQueueItem?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();
        if (string.IsNullOrWhiteSpace(id)) return Task.FromResult<SyncQueueItem?>(null);

        _items.TryGetValue(id, out var item);
        return Task.FromResult(item);
    }

    public Task<IReadOnlyList<SyncQueueItem>> GetAllAsync(CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        var list = _items.Values
            .OrderBy(x => x.CreatedAtUtc)
            .ToList();

        return Task.FromResult((IReadOnlyList<SyncQueueItem>)list);
    }

    public Task EnqueueAsync(SyncOperation operation, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        if (string.IsNullOrWhiteSpace(operation.ClientOperationId))
            operation.ClientOperationId = Guid.NewGuid().ToString("N");

        var id = operation.ClientOperationId!;

        if (_items.TryGetValue(id, out var existing))
        {
            _items[id] = new SyncQueueItem
            {
                Id = id,
                CreatedAtUtc = existing.CreatedAtUtc,
                Attempts = existing.Attempts,
                Status = SyncQueueStatus.Pending,
                LastError = null,
                LastAttemptUtc = null,
                Operation = operation
            };
        }
        else
        {
            _items[id] = new SyncQueueItem
            {
                Id = id,
                CreatedAtUtc = DateTime.UtcNow,
                Attempts = 0,
                Status = SyncQueueStatus.Pending,
                LastError = null,
                LastAttemptUtc = null,
                Operation = operation
            };
        }

        return Task.CompletedTask;
    }

    public Task MarkDoneAsync(string operationId, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        if (_items.TryGetValue(operationId, out var item))
        {
            item.Status = SyncQueueStatus.Done;
            item.LastError = null;
            item.LastAttemptUtc = DateTime.UtcNow;
            _items[operationId] = item;
        }

        return Task.CompletedTask;
    }

    public Task MarkFailedAsync(string operationId, string error, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        if (_items.TryGetValue(operationId, out var item))
        {
            item.Attempts += 1;
            item.LastError = error;
            item.Status = SyncQueueStatus.Failed;
            item.LastAttemptUtc = DateTime.UtcNow;
            _items[operationId] = item;
        }

        return Task.CompletedTask;
    }

    public Task ClearAsync(CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();
        _items.Clear();
        return Task.CompletedTask;
    }

    public Task UpsertAsync(SyncQueueItem item, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        if (string.IsNullOrWhiteSpace(item.Id))
        {
            var opId = item.Operation?.ClientOperationId;
            item.Id = !string.IsNullOrWhiteSpace(opId) ? opId! : Guid.NewGuid().ToString("N");
        }

        if (item.Operation != null && string.IsNullOrWhiteSpace(item.Operation.ClientOperationId))
            item.Operation.ClientOperationId = item.Id;

        _items[item.Id] = item;
        return Task.CompletedTask;
    }

    public Task<SyncQueueItem?> GetNextPendingAsync(CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        var next = _items.Values
            .Where(i => i.Status == SyncQueueStatus.Pending)
            .OrderBy(i => i.CreatedAtUtc)
            .FirstOrDefault();

        return Task.FromResult(next);
    }

    public Task<int> CountAsync(SyncQueueStatus status, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();
        var count = _items.Values.Count(i => i.Status == status);
        return Task.FromResult(count);
    }

    public Task DeleteAsync(string id, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();
        _items.TryRemove(id, out _);
        return Task.CompletedTask;
    }
}
