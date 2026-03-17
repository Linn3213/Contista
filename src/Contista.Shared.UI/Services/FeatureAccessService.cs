using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Models.Auth;
using Contista.Shared.Core.Offline.Interfaces;
using Microsoft.AspNetCore.Components.Authorization;
using System.Security.Claims;

namespace Contista.Shared.UI.Services;

public sealed class FeatureAccessService : IFeatureAccessService
{
    private readonly AuthenticationStateProvider _authStateProvider;
    private readonly INetworkStatus _network;

    public FeatureAccessService(
        AuthenticationStateProvider authStateProvider,
        INetworkStatus network)
    {
        _authStateProvider = authStateProvider;
        _network = network;
    }

    public async Task<bool> CanAsync(FeatureKey feature, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        if (!FeatureRequirements.Map.TryGetValue(feature, out var req))
            return false;

        // Online-krav (du sa: bara admin kräver online, så sätt OnlineRequired=true bara där)
        if(req.OnlineRequired && !_network.IsOnline)
{
#if DEBUG
            if (feature == FeatureKey.AdminTools)
                return true; // 🔓 tillåt offline i debug
#endif
            return false;
        }

        // "All" = synlig även utan login (används mest för public)
        if (req.Allowed.HasFlag(Entitlement.All))
            return true;

        var state = await _authStateProvider.GetAuthenticationStateAsync();
        var user = state.User;

        // Admin trumfar allt (om du vill)
        if (IsAdmin(user))
            return true;

        // Kräver login?
        if (RequiresLogin(req.Allowed) && !(user.Identity?.IsAuthenticated == true))
            return false;

        // Permanent: separat entitlement (claim)
        if (req.Allowed.HasFlag(Entitlement.Permanent) && HasPermanent(user))
            return true;

        // Standard/Premium via planLevel (0=Free,1=Standard,2=Premium,4=Full)
        var plan = GetPlanLevel(user);

        // Viktigt: OR-logik (om feature tillåts av flera)
        if (req.Allowed.HasFlag(Entitlement.Premium) && plan >= 2) return true;
        if (req.Allowed.HasFlag(Entitlement.Standard) && plan >= 1) return true;
        if (req.Allowed.HasFlag(Entitlement.Free) && plan >= 0) return true;

        return false;
    }

    private static bool RequiresLogin(Entitlement allowed)
        => allowed.HasFlag(Entitlement.Free)
           || allowed.HasFlag(Entitlement.Standard)
           || allowed.HasFlag(Entitlement.Premium)
           || allowed.HasFlag(Entitlement.Permanent)
           || allowed.HasFlag(Entitlement.Admin);

    private static int GetPlanLevel(ClaimsPrincipal user)
    {
        var v = user.FindFirst("la.planLevel")?.Value;
        return int.TryParse(v, out var n) ? n : -1;
    }

    private static bool HasPermanent(ClaimsPrincipal user)
        => string.Equals(user.FindFirst("la.permanent")?.Value, "true", StringComparison.OrdinalIgnoreCase)
           // bakåtkomp om du råkar ha detta:
           || user.HasClaim("membershipType", "Permanent")
           || user.HasClaim("la.membershipType", "Permanent");

    private static bool IsAdmin(ClaimsPrincipal user)
        => user.IsInRole("Admin")
           || user.HasClaim(ClaimTypes.Role, "Admin")
           || user.HasClaim("role", "Admin")
           || user.HasClaim("roles", "Admin");
}
