using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.SyncDebug;
using Contista.Shared.Core.Services.Calendar;
using Contista.Shared.UI.Services;
using Contista.Shared.UI.Services.SyncDebug;
using Contista.Shared.UI.State;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;

namespace Contista.Shared.UI.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSharedUi(this IServiceCollection services)
    {
        services.AddAuthorizationCore(options =>
        {
            static bool IsAuthenticated(AuthorizationHandlerContext ctx)
                => ctx.User?.Identity?.IsAuthenticated == true;

            static bool IsAdmin(AuthorizationHandlerContext ctx)
            {
                if (!IsAuthenticated(ctx)) return false;

                return ctx.User.IsInRole("Admin") ||
                       ctx.User.HasClaim("role", "Admin") ||
                       ctx.User.HasClaim("roles", "Admin") ||
                       ctx.User.HasClaim(ClaimTypes.Role, "Admin");
            }

            static int PlanLevel(AuthorizationHandlerContext ctx)
            {
                // Primär: la.planLevel = "0/1/2/4..."
                var v = ctx.User.FindFirst("la.planLevel")?.Value;
                if (int.TryParse(v, out var n))
                    return n;

                // Fallback om du ibland har string:
                // la.membershipType = Free/Standard/Premium/Full/Permanent
                var mt = ctx.User.FindFirst("la.membershipType")?.Value;
                return mt?.Trim().ToLowerInvariant() switch
                {
                    "standard" => 1,
                    "premium" => 2,
                    "full" => 4,
                    // permanent är separat policy (se nedan)
                    _ => 0,
                };
            }

            static bool HasPlanAtLeast(AuthorizationHandlerContext ctx, int level)
                => (IsAdmin(ctx) || (IsAuthenticated(ctx) && PlanLevel(ctx) >= level));

            static bool HasPermanentEntitlement(AuthorizationHandlerContext ctx)
            {
                if (IsAdmin(ctx)) return true;
                if (!IsAuthenticated(ctx)) return false;

                // Rekommenderad: la.permanent="true"
                var v = ctx.User.FindFirst("la.permanent")?.Value;
                if (string.Equals(v, "true", StringComparison.OrdinalIgnoreCase)) return true;

                // bakåtkomp
                if (ctx.User.HasClaim("permanent", "true")) return true;

                var mt = ctx.User.FindFirst("la.membershipType")?.Value;
                if (string.Equals(mt, "Permanent", StringComparison.OrdinalIgnoreCase)) return true;

                return false;
            }

            // ✅ BAS: bara inloggad (admin ok)
            // Den här får ALDRIG kräva plan-claims.
            options.AddPolicy("Free", p => p.RequireAssertion(ctx => IsAuthenticated(ctx) || IsAdmin(ctx)));

            // Plan-trappa
            options.AddPolicy("Standard", p => p.RequireAssertion(ctx => HasPlanAtLeast(ctx, 1)));
            options.AddPolicy("Premium", p => p.RequireAssertion(ctx => HasPlanAtLeast(ctx, 2)));
            options.AddPolicy("Full", p => p.RequireAssertion(ctx => HasPlanAtLeast(ctx, 4)));

            // Permanent separat
            options.AddPolicy("Permanent", p => p.RequireAssertion(ctx => HasPermanentEntitlement(ctx)));

            // Strikt admin-only
            options.AddPolicy("AdminOnly", p => p.RequireAssertion(ctx => IsAdmin(ctx)));
        });

        services.AddScoped<AuthenticationStateProvider, AppAuthStateProvider>();
        services.AddScoped<IAuthReactor, AuthReactor>();
        services.AddScoped<IFeatureAccessService, FeatureAccessService>();

        services.AddScoped(sp =>
            (AppAuthStateProvider)sp.GetRequiredService<AuthenticationStateProvider>());
        services.AddSingleton<AppReadyState>();
        services.AddSingleton<ILocalizationService, LocalizationService>();
        services.AddScoped<AppBusyService>();
        

        return services;
    }

    public static IServiceCollection AddSyncDebugUi(this IServiceCollection services)
    {
        services.AddScoped<IAutoSyncDispatcher, AutoSyncDispatcher>();
        services.AddScoped<ISyncDebugController, SyncDebugController>();
        services.AddScoped<IUserDataOptimisticPatcher, UserDataOptimisticPatcher>();
        return services;
    }

}
