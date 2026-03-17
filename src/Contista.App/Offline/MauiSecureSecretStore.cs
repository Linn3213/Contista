using Contista.Shared.Core.Offline.Interfaces;
using Microsoft.Maui.Storage;

namespace Contista.Offline
{
    public sealed class MauiSecureSecretStore : ISecretStore
    {
        public Task<string?> GetAsync(string key, CancellationToken ct = default)
            => SecureStorage.Default.GetAsync(key);

        public Task SetAsync(string key, string value, CancellationToken ct = default)
            => SecureStorage.Default.SetAsync(key, value);

        public Task RemoveAsync(string key, CancellationToken ct = default)
        {
            SecureStorage.Default.Remove(key);
            return Task.CompletedTask;
        }
    }
}
