using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Interfaces;

public interface IUserDataProvider<T> where T : class
{
    Task<UserCacheEnvelope<T>?> GetUserAsync(string userId, bool forceRefresh = false, CancellationToken ct = default);
}