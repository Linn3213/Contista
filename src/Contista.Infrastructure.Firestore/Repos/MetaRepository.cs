using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Infrastructure.Firestore.Repos
{
    public class MetaRepository : BaseRepository<Meta>, IMetaRepository
    {
        public MetaRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
            : base(http, opts.Value.ProjectId, "meta", auth)
        {
        }

        public Task<string?> CreateAsync(Meta obj) => base.CreateAsync(MetaMapper.FromMeta(obj));

        public async Task<List<Meta>> GetAllAsync() => await base.GetAllAsync(MetaMapper.ToMeta);

        public async Task<Meta?> GetByIdAsync(string id) => await base.GetByIdAsync(id, MetaMapper.ToMeta);

        public Task<BulkSaveResult> SaveAllAsync(IEnumerable<Meta> obj) => base.SaveAllAsync(obj, m => m.MetaId, MetaMapper.FromMeta);

        public Task<bool> UpdateAsync(Meta obj) => base.UpdateAsync(obj.MetaId, (MetaMapper.FromMeta(obj)));

        public async Task<bool> UpdateOneFieldAsync(string metaId, string fieldToUpdate, DateTime newDate)
        {
            var fields = new Dictionary<string, FirestoreValue>
            {
                { fieldToUpdate, new FirestoreValue { TimestampValue = newDate.ToUniversalTime().ToString("O") } }
            };

            return await UpdateFieldAsync(metaId, fields);
        }

        Task<bool> IMetaRepository.DeleteAsync(string id) => base.DeleteAsync(id);
    }
}