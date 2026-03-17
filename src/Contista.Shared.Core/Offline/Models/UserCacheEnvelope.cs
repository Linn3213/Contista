namespace Contista.Shared.Core.Offline.Models;

public sealed class UserCacheEnvelope<T> where T : class
{
    public string UserId { get; set; } = "";
    public string Version { get; set; } = "";
    public T? Data { get; set; }
    public DateTime CachedAtUtc { get; set; }
}
