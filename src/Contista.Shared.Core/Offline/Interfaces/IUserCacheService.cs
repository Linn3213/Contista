using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Interfaces;

public interface IUserCacheService<T> where T : class
{
    Task<UserCacheEnvelope<T>?> TryLoadAsync(string userId, CancellationToken ct = default);
    Task SaveAsync(string userId, UserCacheEnvelope<T> envelope, CancellationToken ct = default);
    Task ClearAsync(string userId, CancellationToken ct = default);
}
