using Contista.Shared.Core.Offline.Interfaces;
using Microsoft.Maui.Storage;
using System.Security.Cryptography;
using System.Text;


namespace Contista.Offline
{
    public sealed class MauiFileKeyValueStore : IKeyValueStore
    {
        private readonly string _dir;

        public MauiFileKeyValueStore()
        {
            _dir = Path.Combine(FileSystem.AppDataDirectory, "kv");
            Directory.CreateDirectory(_dir);
        }

        public async Task<string?> GetAsync(string key, CancellationToken ct = default)
        {
            var path = PathFor(key);
            if (!File.Exists(path)) return null;
            return await File.ReadAllTextAsync(path, ct);
        }

        public async Task SetAsync(string key, string value, CancellationToken ct = default)
        {
            var path = PathFor(key);
            await File.WriteAllTextAsync(path, value, ct);
        }

        public Task RemoveAsync(string key, CancellationToken ct = default)
        {
            var path = PathFor(key);
            if (File.Exists(path)) File.Delete(path);
            return Task.CompletedTask;
        }

        private string PathFor(string key)
            => Path.Combine(_dir, Hash(key) + ".txt");

        private static string Hash(string input)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes).ToLowerInvariant();
        }
    }
}
