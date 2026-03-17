using System.Text.Json;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Logic
{
    public sealed class CommonCacheService : ICommonCacheService
    {
        private readonly IOfflineFileStore _files;
        private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

        public CommonCacheService(IOfflineFileStore files)
        {
            _files = files;
        }

        public async Task<CommonCacheEnvelope?> TryLoadAsync(CancellationToken ct = default)
        {
            if (!await _files.ExistsAsync(OfflineCacheKeys.CommonCacheFileName, ct))
                return null;

            var json = await _files.ReadTextAsync(OfflineCacheKeys.CommonCacheFileName, ct);
            if (string.IsNullOrWhiteSpace(json))
                return null;

            try
            {
                return JsonSerializer.Deserialize<CommonCacheEnvelope>(json, JsonOpts);
            }
            catch
            {
                // Om filen är korrupt: rensa den och fortsätt som “ingen cache”
                await _files.DeleteAsync(OfflineCacheKeys.CommonCacheFileName, ct);
                return null;
            }
        }

        public Task SaveAsync(CommonCacheEnvelope envelope, CancellationToken ct = default)
        {
            var json = JsonSerializer.Serialize(envelope, JsonOpts);
            return _files.WriteTextAsync(OfflineCacheKeys.CommonCacheFileName, json, ct);
        }

        public Task ClearAsync(CancellationToken ct = default)
            => _files.DeleteAsync(OfflineCacheKeys.CommonCacheFileName, ct);
    }
}
