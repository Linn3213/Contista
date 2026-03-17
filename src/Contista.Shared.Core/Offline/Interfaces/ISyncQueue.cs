using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Interfaces
{
    public interface ISyncQueue
    {
        Task<SyncQueueItem?> GetByIdAsync(string id, CancellationToken ct = default);
        Task<IReadOnlyList<SyncQueueItem>> GetAllAsync(CancellationToken ct = default);

        Task EnqueueAsync(SyncOperation operation, CancellationToken ct = default);

        Task MarkDoneAsync(string operationId, CancellationToken ct = default);

        Task MarkFailedAsync(string operationId, string error, CancellationToken ct = default);

        Task ClearAsync(CancellationToken ct = default);

        Task UpsertAsync(SyncQueueItem item, CancellationToken ct = default);
        
        Task<SyncQueueItem?> GetNextPendingAsync(CancellationToken ct = default);
        
        Task<int> CountAsync(SyncQueueStatus status, CancellationToken ct = default);
        
        Task DeleteAsync(string id, CancellationToken ct = default);
    }
}
