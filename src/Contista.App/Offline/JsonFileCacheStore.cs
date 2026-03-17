using System.Text.Json;
using System.Security.Cryptography;
using System.Text;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;
using Microsoft.Maui.Storage;


namespace Contista.Offline
{
    public sealed class JsonFileCacheStore : ICacheStore
    {
        private readonly string _dir;
        private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

        public JsonFileCacheStore()
        {
            _dir = Path.Combine(FileSystem.AppDataDirectory, "cache");
            Directory.CreateDirectory(_dir);
        }

        public async Task<CacheResult<T>> TryGetAsync<T>(string key, CancellationToken ct = default)
        {
            var path = PathFor(key);
            if (!File.Exists(path)) return CacheResult<T>.NotFound();

            try
            {
                var json = await File.ReadAllTextAsync(path, ct);
                var env = JsonSerializer.Deserialize<CacheEnvelope<T>>(json, JsonOpts);
                return env is null ? CacheResult<T>.NotFound() : CacheResult<T>.From(env);
            }
            catch
            {
                return CacheResult<T>.NotFound();
            }
        }

        public async Task SetAsync<T>(string key, T data, string? version = null, DateTime? updatedAtUtc = null, CancellationToken ct = default)
        {
            var env = new CacheEnvelope<T>(
                Key: key,
                Version: version,
                UpdatedAtUtc: updatedAtUtc ?? DateTime.UtcNow,
                Data: data);

            var json = JsonSerializer.Serialize(env, JsonOpts);
            await File.WriteAllTextAsync(PathFor(key), json, ct);
        }

        public Task RemoveAsync(string key, CancellationToken ct = default)
        {
            var path = PathFor(key);
            if (File.Exists(path)) File.Delete(path);
            return Task.CompletedTask;
        }

        private string PathFor(string key)
            => Path.Combine(_dir, Hash(key) + ".json");

        private static string Hash(string input)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes).ToLowerInvariant();
        }
    }
}
