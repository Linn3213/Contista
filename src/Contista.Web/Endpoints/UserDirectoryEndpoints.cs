using System.Security.Claims;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models.Auth;
using Contista.Infrastructure.Firestore.Repos; // eller Interface
using Microsoft.AspNetCore.Authorization;

namespace Contista.Web.Endpoints;

public static class UserDirectoryEndpoints
{
    public sealed record ResolveUidsRequest(List<string> Uids);

    public static void MapUserDirectoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user-directory")
            .RequireAuthorization();

        // POST /api/user-directory/resolve-uids
        group.MapPost("/resolve-uids", [Authorize] async (
            HttpContext http,
            ResolveUidsRequest req,
            IFirebaseAuthService auth,
            IUserDirectoryRepository dir,
            CancellationToken ct) =>
        {
            var uid =
                http.User.FindFirstValue("user_id") ??
                http.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                http.User.FindFirstValue("sub");

            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var idToken = await auth.GetValidIdTokenAsync();
            if (string.IsNullOrWhiteSpace(idToken))
                return Results.Unauthorized();

            var uids = (req?.Uids ?? new List<string>())
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim())
                .Distinct(StringComparer.Ordinal)
                .Take(200) // skydd: rimlig gräns
                .ToList();

            if (uids.Count == 0)
                return Results.Ok(new Dictionary<string, string>(StringComparer.Ordinal));

            var map = new Dictionary<string, string>(StringComparer.Ordinal);

            foreach (var targetUid in uids)
            {
                try
                {
                    var entry = await dir.GetByUidAsync(targetUid, idToken!, ct);

                    map[targetUid] = !string.IsNullOrWhiteSpace(entry?.DisplayName)
                        ? entry!.DisplayName
                        : targetUid; // fallback
                }
                catch
                {
                    map[targetUid] = targetUid; // tolerant fallback
                }
            }

            return Results.Ok(map);
        });
    }
}