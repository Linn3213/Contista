using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models.Auth;
using System.Security.Claims;

namespace Contista.Infrastructure.Firestore.Services
{
    public sealed class UserClaimsService : IUserClaimsService
    {
        private readonly IUserRepository _users;
        private readonly IRoleRepository _roles;
        private readonly IMembershipRepository _memberships;
        private readonly IRequestAuth _auth;

        public UserClaimsService(
            IUserRepository users,
            IRoleRepository roles,
            IMembershipRepository memberships,
            IRequestAuth auth)
        {
            _users = users;
            _roles = roles;
            _memberships = memberships;
            _auth = auth;
        }

        public async Task<UserProfile> EnsureProfileAsync(string uid, string? email)
        {
            var user = await _users.GetByIdAsync(uid);
            if (user is null)
            {
                user = new User
                {
                    UserId = uid,
                    Email = email ?? "",
                    RoleId = "",
                    MembershipId = "",
                    Created = DateTime.UtcNow
                };

                // ✅ Viktigt: skapa kräver token
                var idToken = await _auth.GetValidIdTokenAsync();
                await _users.CreateWithIdAsync(uid, user, idToken);
            }

            return (await GetProfileAsync(uid))!;
        }

        public async Task<UserProfile?> GetProfileAsync(string userId)
        {
            var user = await _users.GetByIdAsync(userId);
            if (user is null) return null;

            var role = !string.IsNullOrWhiteSpace(user.RoleId)
                ? await _roles.GetByIdAsync(user.RoleId)
                : null;

            var membership = !string.IsNullOrWhiteSpace(user.MembershipId)
                ? await _memberships.GetByIdAsync(user.MembershipId)
                : null;

            return new UserProfile(
                UserId: user.UserId,
                Email: user.Email,
                Firstname: user.FirstName,
                Lastname: user.LastName,
                DisplayName: user.DisplayName,
                Bio: user.Bio,
                Language: user.Language,
                CreatedAt: user.Created,
                UpdatedAt: user.UpdatedAt,
                RoleId: user.RoleId ?? "",
                RoleName: role?.RoleName ?? "User",
                MembershipId: user.MembershipId ?? "",
                MembershipName: membership?.MembershipName ?? "Free membership",
                MembershipType: membership?.MembershipType ?? "Free"
            );
        }

        public async Task<ClaimsPrincipal> BuildPrincipalAsync(string userId, string? email = null)
        {
            var profile = await EnsureProfileAsync(userId, email);

            // 1) Admin?
            var isAdmin = IsAdmin(profile);

            // 2) Permanent entitlement separat (inte admin)
            var isPermanent = !isAdmin && PlanLevels.IsPermanent(profile.MembershipType);

            // 3) Normalisera membershipType (Admin => Full, okända => Free)
            var normalizedType = PlanLevels.NormalizeMembershipType(profile.MembershipType, isAdmin);

            // 4) Map till numerisk nivå (Permanent ingår inte i trappan längre)
            var planLevel = PlanLevels.MapPlanLevel(normalizedType, isAdmin);

            // 5) Rollclaim: se till att Admin blir Admin för IsInRole("Admin")
            var roleName = isAdmin ? "Admin" : (string.IsNullOrWhiteSpace(profile.RoleName) ? "User" : profile.RoleName);

            var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, profile.UserId),

        // identitet
        new(ClaimTypes.Email, string.IsNullOrWhiteSpace(profile.Email) ? (email ?? "") : profile.Email),
        new(ClaimTypes.Name, string.IsNullOrWhiteSpace(profile.Email) ? profile.UserId : profile.Email),

        // roll
        new(ClaimTypes.Role, roleName),

        // membership meta
        new("membershipId", profile.MembershipId ?? ""),
        new("membershipName", profile.MembershipName ?? "Free membership"),

        // bakåtkomp
        new("membershipType", normalizedType),

        // nya
        new("la.membershipType", normalizedType),
        new("la.planLevel", planLevel.ToString()),
    };

            // ✅ Permanent entitlement separat
            if (isPermanent)
                claims.Add(new Claim("la.permanent", "true"));

            if (!string.IsNullOrWhiteSpace(profile.Firstname))
                claims.Add(new Claim(ClaimTypes.GivenName, profile.Firstname));

            if (!string.IsNullOrWhiteSpace(profile.Lastname))
                claims.Add(new Claim(ClaimTypes.Surname, profile.Lastname));

            if (!string.IsNullOrWhiteSpace(profile.DisplayName))
                claims.Add(new Claim("displayName", profile.DisplayName));

            if (!string.IsNullOrWhiteSpace(profile.Language))
                claims.Add(new Claim("language", profile.Language));

            var identity = new ClaimsIdentity(claims, authenticationType: "la-auth");
            return new ClaimsPrincipal(identity);
        }


        private static bool IsAdmin(UserProfile p)
            => string.Equals(p.RoleName, "Admin", StringComparison.OrdinalIgnoreCase);
    }
}
