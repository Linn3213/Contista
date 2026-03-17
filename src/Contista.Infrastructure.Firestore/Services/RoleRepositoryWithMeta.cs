using Contista.Infrastructure.Firestore.Services;
using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models;

namespace Contista.Infrastructure.Firestore.Services
{
    public sealed class RoleRepositoryWithMeta : IRoleRepository
    {
        private readonly IRoleRepository _inner;
        private readonly ICommonMetaVersionBumper _meta;

        public RoleRepositoryWithMeta(IRoleRepository inner, ICommonMetaVersionBumper meta)
        {
            _inner = inner;
            _meta = meta;
        }

        public Task<List<Role>> GetAllAsync() => _inner.GetAllAsync();
        public Task<Role?> GetByIdAsync(string id) => _inner.GetByIdAsync(id);

        public async Task<string?> CreateAsync(Role obj)
        {
            var id = await _inner.CreateAsync(obj);
            if (!string.IsNullOrWhiteSpace(id))
                await _meta.TouchRolesAsync();
            return id;
        }

        public async Task<bool> UpdateAsync(Role obj)
        {
            var ok = await _inner.UpdateAsync(obj);
            if (ok)
                await _meta.TouchRolesAsync();
            return ok;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var ok = await _inner.DeleteAsync(id);
            if (ok)
                await _meta.TouchRolesAsync();
            return ok;
        }

        public async Task<BulkSaveResult> SaveAllAsync(IEnumerable<Role> obj)
        {
            var result = await _inner.SaveAllAsync(obj);

            // Om BulkSaveResult har någon success-indikator, använd den.
            // Annars: "touch" alltid om den inte kastade exception.
            await _meta.TouchRolesAsync();
            return result;
        }
    }
}
