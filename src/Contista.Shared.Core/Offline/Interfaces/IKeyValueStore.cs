
namespace Contista.Shared.Core.Offline.Interfaces
{
    /// <summary>
    /// Icke-hemlig lagring (t.ex. fil). Bra för metadata, små strängar, flags.
    /// </summary>
    public interface IKeyValueStore
    {
        Task<string?> GetAsync(string key, CancellationToken ct = default);
        Task SetAsync(string key, string value, CancellationToken ct = default);
        Task RemoveAsync(string key, CancellationToken ct = default);
    }
}
