// Ignore Spelling: Firestore

using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace Contista.Infrastructure.Firestore.Repos
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
            : base(http, opts.Value.ProjectId, "users", auth)
        {
        }

        // Creates 
        public Task<string?> CreateAsync(User obj) => base.CreateAsync(UserMapper.FromUser(obj));

        public Task<string?> CreateWithIdAsync(string id, User user, string idToken, CancellationToken ct = default) 
            => base.CreateWithIdAsync(id, UserMapper.FromUser(user), idToken, ct);

        public Task<string?> UpsertWithIdAsync(string id, User user, string idToken, CancellationToken ct = default)
            => base.UpsertMergeWithIdAsync(id, UserMapper.FromUser(user), idToken, ct);

        // Reads
        public async Task<List<User>> GetAllAsync() => await base.GetAllAsync(UserMapper.ToUser);

        public async Task<User?> GetByEmailAsync(string email)
        {
            var structuredQuery = new
            {
                from = new[] { new { collectionId = "users" } },
                where = new
                {
                    fieldFilter = new
                    {
                        field = new { fieldPath = "Email" },
                        op = "EQUAL",
                        value = new { stringValue = email }
                    }
                },
                limit = 1
            };

            return await GetObjectWithQueryAsync(structuredQuery, UserMapper.ToUser);
        }

        public async Task<User?> GetByEmailWithTokenAsync(string email, string idToken, CancellationToken ct = default)
        {
            var structuredQuery = new
            {
                from = new[] { new { collectionId = "users" } },
                where = new
                {
                    fieldFilter = new
                    {
                        field = new { fieldPath = "Email" },
                        op = "EQUAL",
                        value = new { stringValue = email }
                    }
                },
                limit = 1
            };

            return await GetObjectWithQueryAsync(structuredQuery, UserMapper.ToUser, idToken, ct);
        }


        public async Task<User?> GetByIdAsync(string id) => await base.GetByIdAsync(id, UserMapper.ToUser);

        public Task<User?> GetByIdAsync(string id, CancellationToken ct = default)
            => base.GetByIdAsync(id, UserMapper.ToUser, ct);

        // Updates
        public Task<BulkSaveResult> SaveAllAsync(IEnumerable<User> obj) => base.SaveAllAsync(obj, m => m.UserId, UserMapper.FromUser);

        public Task<bool> UpdateAsync(User obj) => base.UpdateAsync(obj.UserId, UserMapper.FromUser(obj));

        public async Task<bool> TouchUpdatedAtAsync(string id, DateTime utcNow, CancellationToken ct = default)
        {
            var fields = new Dictionary<string, FirestoreValue>
            {
                { "UpdatedAt", new FirestoreValue { TimestampValue = utcNow.ToUniversalTime().ToString("O") } }
            };

            return await UpdateFieldAsync(id, fields, ct);
        }

        // Deletes
        Task<bool> IUserRepository.DeleteAsync(string id) => base.DeleteAsync(id);
    }
}
