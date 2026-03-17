

using Contista.Shared.Core.DTO;

namespace Contista.Shared.Core.Offline.Models
{
    public sealed class CommonCacheEnvelope
    {
        public string Version { get; set; } = "";

        public CommonDataDto Data { get; set; } = new(
            Memberships: Array.Empty<Membership>(),
            Roles: Array.Empty<Role>());

        public DateTime CachedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
