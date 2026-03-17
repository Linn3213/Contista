using Contista.Shared.Core.Http;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Models.Auth;
using Contista.Shared.Core.Offline.Interfaces;
using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;

namespace Contista.Shared.Client.Services;

public sealed class ApiUserClaimsService : IUserClaimsService
{
    private readonly HttpClient _http;
    private readonly INetworkStatus _network;

    public ApiUserClaimsService(HttpClient http, INetworkStatus network)
    {
        _http = http;
        _network = network;
    }

    public async Task<UserProfile?> GetProfileAsync(string userId)
    {
        // ✅ Offline: ingen http, låt snapshot ta över
        if (!_network.IsOnline)
            return null;

        try
        {
            var resp = await _http.GetAsync("/api/auth/profile");

            if (!resp.IsSuccessStatusCode)
            {
                var body = await SafeReadAsync(resp);
                var failure = ApiFailureClassifier.FromHttp(resp.StatusCode, body);

                // 401/403 ska bubbla -> AppAuthStateProvider ska kunna logga ut
                if (failure.IsAuth)
                    throw new ApiFailureException(failure);

                // 500/offline-liknande => null => snapshot
                return null;
            }

            return await resp.Content.ReadFromJsonAsync<UserProfile>();
        }
        catch (ApiFailureException)
        {
            throw;
        }
        catch (Exception ex)
        {
            var failure = ApiFailureClassifier.FromException(ex);

            if (failure.IsAuth)
                throw new ApiFailureException(failure);

            return null;
        }
    }

    public async Task<ClaimsPrincipal> BuildPrincipalAsync(string userId, string? email = null)
    {
        var profile = await GetProfileAsync(userId);

        if (profile is null)
            return new ClaimsPrincipal(new ClaimsIdentity());

        var isAdmin = string.Equals(profile.RoleName, "Admin", StringComparison.OrdinalIgnoreCase);

        var normalizedType = PlanLevels.NormalizeMembershipType(profile.MembershipType, isAdmin);
        var planLevel = PlanLevels.MapPlanLevel(normalizedType, isAdmin);

        var roleName = isAdmin ? "Admin" : (string.IsNullOrWhiteSpace(profile.RoleName) ? "User" : profile.RoleName);

        var isPermanent = !isAdmin && PlanLevels.IsPermanent(profile.MembershipType);

        var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, profile.UserId),
        new(ClaimTypes.Email, string.IsNullOrWhiteSpace(profile.Email) ? (email ?? "") : profile.Email),
        new(ClaimTypes.Name, string.IsNullOrWhiteSpace(profile.Email) ? profile.UserId : profile.Email),
        new(ClaimTypes.Role, roleName),

        new("membershipId", profile.MembershipId ?? ""),
        new("membershipName", profile.MembershipName ?? "Free membership"),

        // bakåtkomp + UI
        new("membershipType", normalizedType),
        new("la.membershipType", normalizedType),

        // prenumerationsnivå (Permanent ingår inte)
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


    private static async Task<string?> SafeReadAsync(HttpResponseMessage resp)
    {
        try { return await resp.Content.ReadAsStringAsync(); }
        catch { return null; }
    }
}
