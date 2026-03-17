using Contista.Shared.Core.Offline.Interfaces;

namespace Contista.Web.Client.Offline.Runtime;

public sealed class NoopSecretStore : ISecretStore
{
    public Task<string?> GetAsync(string key, CancellationToken ct = default) => Task.FromResult<string?>(null);
    public Task SetAsync(string key, string value, CancellationToken ct = default) => Task.CompletedTask;
    public Task RemoveAsync(string key, CancellationToken ct = default) => Task.CompletedTask;
}
