using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Firebase
{
    public interface IMetaRepository
    {
        Task<List<Meta>> GetAllAsync();
        Task<Meta?> GetByIdAsync(string id);
        Task<string?> CreateAsync(Meta obj);
        Task<bool> UpdateAsync(Meta obj);
        Task<bool> UpdateOneFieldAsync(string metaId, string fieldToUpdate, DateTime newDate);
        Task<bool> DeleteAsync(string id);
        Task<BulkSaveResult> SaveAllAsync(IEnumerable<Meta> obj);
    }
}
