using Contista.Shared.Core.Models.Auth;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Firebase;

public interface IUserDirectoryRepository
{
    // -------- Lookups --------
    Task<UserDirectoryEntry?> GetByEmailAsync(string email, string idToken, CancellationToken ct = default);
    Task<UserDirectoryEntry?> GetByUidAsync(string uid, string idToken, CancellationToken ct = default);

    // -------- Convenience --------
    Task<string?> ResolveUserIdByEmailAsync(string email, string idToken, CancellationToken ct = default);

    // -------- Writes --------
    Task<bool> UpsertByEmailAsync(UserDirectoryEntry entry, string idToken, CancellationToken ct = default);
    Task<bool> UpsertByUidAsync(UserDirectoryEntry entry, string idToken, CancellationToken ct = default);

    // Upsertar båda indexen (email + uid) i ett “repo-call”
    Task<bool> UpsertBothAsync(string uid, string displayName, string email, string idToken, CancellationToken ct = default);
}

