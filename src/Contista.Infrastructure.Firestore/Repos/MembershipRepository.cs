// Ignore Spelling: Firestore

using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Models;
using Microsoft.Extensions.Options;
using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Options;
using Contista.Shared.Core.Interfaces.Auth;

namespace Contista.Infrastructure.Firestore.Repos
{
    public class MembershipRepository : BaseRepository<Membership>, IMembershipRepository
    {
        public MembershipRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
            : base(http, opts.Value.ProjectId, "memberships", auth)
        {
        }

        public Task<string?> CreateAsync(Membership obj) => base.CreateAsync(MembershipMapper.FromMembership(obj));

        public async Task<List<Membership>> GetAllAsync() => await base.GetAllAsync(MembershipMapper.ToMembership);

        public async Task<Membership?> GetByIdAsync(string id) => await base.GetByIdAsync(id, MembershipMapper.ToMembership);

        public Task<BulkSaveResult> SaveAllAsync(IEnumerable<Membership> obj) => base.SaveAllAsync(obj, m => m.MembershipId, MembershipMapper.FromMembership);

        public Task<bool> UpdateAsync(Membership obj) => base.UpdateAsync(obj.MembershipId, (MembershipMapper.FromMembership(obj)));

        Task<bool> IMembershipRepository.DeleteAsync(string id) => base.DeleteAsync(id);
    }
}
