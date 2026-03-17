using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Interfaces;

public interface IAppSessionOrchestrator
{
    //Task<CacheResult<TCommon>> GetCommonAsync<TCommon>(CancellationToken ct = default);
    Task<bool> TryResumeSessionAsync(CancellationToken ct = default);
    //Task RefreshCommonAsync<TCommon>(string? knownVersion, CancellationToken ct = default);
    //Task<CacheResult<TUser>> GetUserAsync<TUser>(string userId, CancellationToken ct = default);
    //Task RefreshUserAsync<TUser>(string userId, string? knownVersion, CancellationToken ct = default);
    //Task EnqueueOperationAsync(SyncOperation op, CancellationToken ct = default);
    //Task TryFlushQueueAsync(string userId, CancellationToken ct = default);
    //Task<bool> HasSavedSessionAsync(CancellationToken ct = default);
    //Task ClearSessionAsync(CancellationToken ct = default);
}
