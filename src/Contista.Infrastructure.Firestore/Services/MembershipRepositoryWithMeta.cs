using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models;

namespace Contista.Infrastructure.Firestore.Services
{
    public sealed class MembershipRepositoryWithMeta : IMembershipRepository
    {
        private readonly IMembershipRepository _inner;
        private readonly ICommonMetaVersionBumper _meta;

        public MembershipRepositoryWithMeta(IMembershipRepository inner, ICommonMetaVersionBumper meta)
        {
            _inner = inner;
            _meta = meta;
        }

        public Task<List<Membership>> GetAllAsync() => _inner.GetAllAsync();
        public Task<Membership?> GetByIdAsync(string id) => _inner.GetByIdAsync(id);

        public async Task<string?> CreateAsync(Membership obj)
        {
            var id = await _inner.CreateAsync(obj);
            if (!string.IsNullOrWhiteSpace(id))
                await _meta.TouchMembershipsAsync();
            return id;
        }

        public async Task<bool> UpdateAsync(Membership obj)
        {
            var ok = await _inner.UpdateAsync(obj);
            if (ok)
                await _meta.TouchMembershipsAsync();
            return ok;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var ok = await _inner.DeleteAsync(id);
            if (ok)
                await _meta.TouchMembershipsAsync();
            return ok;
        }

        public async Task<BulkSaveResult> SaveAllAsync(IEnumerable<Membership> obj)
        {
            var result = await _inner.SaveAllAsync(obj);
            await _meta.TouchMembershipsAsync();
            return result;
        }
    }
}
