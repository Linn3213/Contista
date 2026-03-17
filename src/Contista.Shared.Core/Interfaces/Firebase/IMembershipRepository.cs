using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Firebase
{
    public interface IMembershipRepository
    {
        Task<List<Membership>> GetAllAsync();
        Task<Membership?> GetByIdAsync(string id);
        Task<string?> CreateAsync(Membership obj);
        Task<bool> UpdateAsync(Membership obj);
        Task<bool> DeleteAsync(string id);
        Task<BulkSaveResult> SaveAllAsync(IEnumerable<Membership> obj);
    }
}
