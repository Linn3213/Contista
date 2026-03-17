using Contista.Shared.Core.Models;
using Contista.Shared.Core.DTO;

namespace Contista.Shared.Core.Interfaces.Firebase
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(string id);
        Task<User?> GetByIdAsync(string id, CancellationToken ct = default);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByEmailWithTokenAsync(string email, string idToken, CancellationToken ct = default);
        Task<string?> CreateAsync(User obj);
        Task<string?> CreateWithIdAsync(string id, User obj, string idToken, CancellationToken ct = default);
        Task<string?> UpsertWithIdAsync(string id, User user, string idToken, CancellationToken ct = default);
        Task<bool> UpdateAsync(User obj);
        Task<bool> TouchUpdatedAtAsync(string id, DateTime utcNow, CancellationToken ct = default);
        Task<bool> DeleteAsync(string id);
        Task<BulkSaveResult> SaveAllAsync(IEnumerable<User> obj);
    }
}
