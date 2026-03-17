using Contista.Shared.Core.Interfaces.Sync;
using Contista.Shared.Core.Offline.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Contista.Web.Endpoints
{
    public static class SyncEndpoints
    {
        public static void MapSyncEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/sync")
                .RequireAuthorization();

            group.MapPost("/apply", [Authorize] async (
                HttpContext http,
                [FromBody] SyncOperation op,
                ISyncApplyService svc,
                CancellationToken ct) =>
            {
                // Säkerhet: om vi kan hitta uid i claims, lås operation.UserId till den
                var uid =
                    http.User.FindFirstValue("user_id") ??
                    http.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                    http.User.FindFirstValue("sub");

                if (!string.IsNullOrWhiteSpace(uid))
                {
                    if (!string.IsNullOrWhiteSpace(op.UserId) && op.UserId != uid)
                        return Results.Forbid();

                    op.UserId = uid!;
                }

                var result = await svc.ApplyAsync(op, ct);
                return Results.Ok(result);
            });
        }
    }
}
