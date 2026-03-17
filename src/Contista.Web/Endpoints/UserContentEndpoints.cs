using System.Security.Claims;
using Contista.Infrastructure.Firestore.Repos;
using Microsoft.AspNetCore.Authorization;

namespace Contista.Web.Endpoints;

public static class UserContentEndpoints
{
    public static void MapUserContentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user")
            .RequireAuthorization();

        group.MapGet("/posts", [Authorize] async (
            HttpContext http,
            ContentPostRepository repo,
            CancellationToken ct) =>
        {
            var uid =
                http.User.FindFirstValue("user_id") ??
                http.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                http.User.FindFirstValue("sub");

            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var posts = await repo.GetAllAsync(uid, ct);
            return Results.Ok(posts);
        });
    }
}
