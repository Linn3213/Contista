
namespace Contista.Shared.Core.Offline.Interfaces
{
    public interface ISecretStore
    {
        Task<string?> GetAsync(string key, CancellationToken ct = default);
        Task SetAsync(string key, string value, CancellationToken ct = default);
        Task RemoveAsync(string key, CancellationToken ct = default);
    }
}
