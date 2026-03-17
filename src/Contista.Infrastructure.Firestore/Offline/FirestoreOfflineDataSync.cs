using Contista.Infrastructure.Firestore.Repos;
using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Infrastructure.Firestore.Offline
{
    public sealed class FirestoreOfflineDataSync : IOfflineDataSync
    {
        private readonly IMembershipRepository _memberships;
        private readonly IRoleRepository _roles;
        private readonly IMetaRepository _meta;
        private readonly IUserRepository _users;
        private readonly ContentPostRepository _posts;
        private readonly IFirebaseAuthService _auth;

        private const string CommonMetaId = "Common";

        public FirestoreOfflineDataSync(
        IMembershipRepository memberships,
        IRoleRepository roles,
        IMetaRepository meta,
        IUserRepository users,
        ContentPostRepository posts,
        IFirebaseAuthService auth)
        {
            _memberships = memberships;
            _roles = roles;
            _meta = meta;
            _users = users;
            _posts = posts;
            _auth = auth;
        }

        public async Task<(bool ok, string? version, object? data)> FetchCommonAsync(
        string? knownVersion,
        CancellationToken ct = default)
        {
            // ✅ Om inte inloggad: gör INGEN nät-fetch här.
            // CommonDataProvider kommer då returnera cache (om den finns).
            if (!_auth.IsLoggedIn)
                return (false, knownVersion, null);

            var meta = await _meta.GetByIdAsync(CommonMetaId);
            if (meta is null)
                return (false, null, null);

            var combined = $"{meta.MembershipVersion:O}|{meta.RoleVersion:O}";

            if (!string.IsNullOrWhiteSpace(knownVersion) &&
                string.Equals(knownVersion, combined, StringComparison.Ordinal))
            {
                return (true, combined, null);
            }

            var memberships = await _memberships.GetAllAsync();
            var roles = await _roles.GetAllAsync();

            var dto = new CommonDataDto(
                Memberships: memberships,
                Roles: roles);

            return (true, combined, dto);
        }

        public async Task<(bool ok, string? version, object? data)> FetchUserAsync(string userId, string? knownVersion, CancellationToken ct = default)
        {
            if (!_auth.IsLoggedIn)
                return (false, knownVersion, null);

            var user = await _users.GetByIdAsync(userId); 
            if (user is null)
                return (false, null, null);

            var updatedUtc = user.UpdatedAt.Kind == DateTimeKind.Utc
                ? user.UpdatedAt
                : user.UpdatedAt.ToUniversalTime();

            var version = updatedUtc.ToString("O");

            if (!string.IsNullOrWhiteSpace(knownVersion) &&
                string.Equals(knownVersion, version, StringComparison.Ordinal))
                return (true, version, null);

            var posts = await _posts.GetAllAsync(userId, ct);

            var dto = new UserDataDto(
                UserId: userId,
                FirstName: user.FirstName,
                LastName: user.LastName,
                DisplayName: user.DisplayName,
                Bio: user.Bio,
                Language: user.Language,
                Email: user.Email,
                CreatedAt: user.Created,
                UpdatedAt: user.UpdatedAt,
                RoleId: user.RoleId,
                MembershipId: user.MembershipId,
                ContentPostList: posts);

            return (true, version, dto);
        }





        public Task ApplyOperationAsync(
            string userId,
            string idToken,
            object operationDto,
            CancellationToken ct = default)
        {
            throw new NotSupportedException("ApplyOperationAsync not implemented yet.");
        }
    }
}
