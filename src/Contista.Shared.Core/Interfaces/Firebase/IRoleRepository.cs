using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Firebase
{
    public interface IRoleRepository
    {
        Task<List<Role>> GetAllAsync();
        Task<Role?> GetByIdAsync(string id);
        Task<string?> CreateAsync(Role obj);
        Task<bool> UpdateAsync(Role obj);
        Task<bool> DeleteAsync(string id);
        Task<BulkSaveResult> SaveAllAsync(IEnumerable<Role> obj);
    }
}
