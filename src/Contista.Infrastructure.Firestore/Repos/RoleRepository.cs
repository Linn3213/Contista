using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;

namespace Contista.Infrastructure.Firestore.Repos
{
    public class RoleRepository : BaseRepository<Role>, IRoleRepository
    {
        public RoleRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
            : base(http, opts.Value.ProjectId, "roles", auth)
        {
        }

        public Task<string?> CreateAsync(Role obj) => base.CreateAsync(RoleMapper.FromRole(obj));

        public async Task<List<Role>> GetAllAsync() => await base.GetAllAsync(RoleMapper.ToRole);
        
        public async Task<Role?> GetByIdAsync(string id) => await base.GetByIdAsync(id, RoleMapper.ToRole);

        public Task<BulkSaveResult> SaveAllAsync(IEnumerable<Role> obj) => base.SaveAllAsync(obj, m => m.RoleId, RoleMapper.FromRole);

        public Task<bool> UpdateAsync(Role obj) => base.UpdateAsync(obj.RoleId, (RoleMapper.FromRole(obj)));

        Task<bool> IRoleRepository.DeleteAsync(string id) => base.DeleteAsync(id);
    }
}
