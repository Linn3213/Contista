using Contista.Shared.Core.Interfaces.Firebase;

namespace Contista.Infrastructure.Firestore.Services
{
    public interface ICommonMetaVersionBumper
    {
        Task TouchRolesAsync(CancellationToken ct = default);
        Task TouchMembershipsAsync(CancellationToken ct = default);

        // Ny: för content posts (om common-cache ska reagera)
        Task<string> BumpContentAsync(CancellationToken ct = default);
    }

    public sealed class CommonMetaVersionBumper : ICommonMetaVersionBumper
    {
        private const string CommonMetaId = "Common";
        private readonly IMetaRepository _meta;

        public CommonMetaVersionBumper(IMetaRepository meta)
        {
            _meta = meta;
        }

        public Task TouchRolesAsync(CancellationToken ct = default)
            => _meta.UpdateOneFieldAsync(CommonMetaId, "RoleVersion", DateTime.UtcNow);

        public Task TouchMembershipsAsync(CancellationToken ct = default)
            => _meta.UpdateOneFieldAsync(CommonMetaId, "MembershipVersion", DateTime.UtcNow);

        public async Task<string> BumpContentAsync(CancellationToken ct = default)
        {
            var now = DateTime.UtcNow;
            await _meta.UpdateOneFieldAsync(CommonMetaId, "ContentVersion", now);
            return now.ToUniversalTime().ToString("O"); // returnera som version-sträng
        }
    }
}
