using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Offline.Models;
using Microsoft.AspNetCore.Mvc;

namespace Contista.Web.Endpoints;

public static class CommonEndpoints
{
    public static IEndpointRouteBuilder MapCommonEndpoints(this IEndpointRouteBuilder app)
    {
        // Common-data som UI behöver (t.ex. roles/memberships/pillars etc)
        app.MapGet("/api/common", GetCommon);

        return app;
    }

    private static async Task<IResult> GetCommon(
        IFirebaseAuthService auth,
        IMembershipRepository membershipsRepo,
        IRoleRepository rolesRepo,
        CancellationToken ct)
    {
        if (!auth.IsLoggedIn)
            return Results.Unauthorized();

        // ✅ trigga refresh av cookie-token om den är utgången
        try
        {
            _ = await auth.GetValidIdTokenAsync();
        }
        catch
        {
            return Results.Unauthorized();
        }

        var memberships = await membershipsRepo.GetAllAsync();
        var roles = await rolesRepo.GetAllAsync();

        var env = new CommonCacheEnvelope
        {
            Version = $"v1-{memberships.Count}-{roles.Count}",
            CachedAtUtc = DateTime.UtcNow,
            Data = new CommonDataDto(memberships, roles)
        };

        return Results.Ok(env);
    }
}
