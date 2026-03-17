using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models.Auth;
using Contista.Web.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Contista.Web.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/register", Register);
        app.MapPost("/api/auth/login", Login);
        app.MapPost("/api/auth/logout", Logout);

        // API endpoints: kräver auth, men ska inte redirecta
        app.MapGet("/api/auth/me", Me).RequireAuthorization();
        app.MapGet("/api/auth/profile", Profile).RequireAuthorization();
        app.MapPost("/api/auth/provision", Provision).RequireAuthorization();

        return app;
    }

    private static async Task<IResult> Register(
        [FromBody] RegisterRequest req,
        FirebaseIdentityApi firebase,
        AuthCookieService cookies,
        HttpContext http,
        IUserProvisioningService provisioning,
        CancellationToken ct)
    {
        var signup = await firebase.SignUpWithEmailPassword(req.Email, req.Password, ct);

        // Sätt cookie (IdToken hamnar i la.tokens-claim)
        await cookies.SignInAsync(http, signup, ct);

        // Skapa user-doc i Firestore
        await provisioning.EnsureUserDocAsync(req, signup.Uid, signup.Email, signup.IdToken, ct);
        await provisioning.EnsureCalendarProvisionedAsync(signup.Uid, signup.IdToken, ct);
        return Results.Ok(new { ok = true });
    }

    private static async Task<IResult> Login(
        [FromBody] LoginRequest body,
        FirebaseIdentityApi firebase,
        AuthCookieService cookies,
        HttpContext http,
        IUserProvisioningService provisioning,
        CancellationToken ct)
    {
        var result = await firebase.SignInWithEmailPassword(body.Email, body.Password, ct);
        await cookies.SignInAsync(http, result, ct);

        //var dirOk = await provisioning.EnsureUserDirectoryAsync(result.Uid, body.Email, result.IdToken, ct);

        await provisioning.EnsureCalendarProvisionedAsync(result.Uid, result.IdToken, ct);

        return Results.Ok(new { ok = true, uid = result.Uid, email = result.Email });
    }

    private static async Task<IResult> Logout(
        HttpContext http,
        AuthCookieService cookies,
        CancellationToken ct)
    {
        await cookies.SignOutAsync(http, ct);
        return Results.Ok(new { ok = true });
    }

    private static IResult Me(HttpContext http)
    {
        // Viktigt: välj claim-nycklar som faktiskt finns i din cookie-principal
        var uid =
            http.User.FindFirstValue("user_id") ??
            http.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            http.User.FindFirstValue("sub");

        var email =
            http.User.FindFirstValue(ClaimTypes.Email) ??
            http.User.FindFirstValue("email");

        if (string.IsNullOrWhiteSpace(uid))
            return Results.Unauthorized();

        // Returnera stabil DTO-form (exakt match till klienten)
        return Results.Ok(new AuthMe { Uid = uid, Email = email });
    }

    private static async Task<IResult> Profile(
        HttpContext http,
        IUserClaimsService claims,
        CancellationToken ct)
    {
        var uid =
            http.User.FindFirstValue("user_id") ??
            http.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            http.User.FindFirstValue("sub");

        var email =
            http.User.FindFirstValue(ClaimTypes.Email) ??
            http.User.FindFirstValue("email");

        if (string.IsNullOrWhiteSpace(uid))
            return Results.Unauthorized();

        var profile = await claims.GetProfileAsync(uid);
        if (profile is null)
            return Results.Problem("Could not load profile.");

        return Results.Ok(profile);
    }

    private static async Task<IResult> Provision(
        [FromBody] ProvisionRequest req,
        HttpContext http,
        IUserProvisioningService provisioning,
        IFirebaseAuthService auth,
        CancellationToken ct)
    {
        var uid =
            http.User.FindFirstValue("user_id") ??
            http.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            http.User.FindFirstValue("sub");

        var email =
            http.User.FindFirstValue(ClaimTypes.Email) ??
            http.User.FindFirstValue("email");

        if (string.IsNullOrWhiteSpace(uid))
            return Results.Unauthorized();

        // Token kommer från Bearer (MAUI) eller cookie (web)
        var idToken = await RequireIdToken(auth);

        var registerReq = new RegisterRequest(
            Email: req.Email ?? email ?? "",
            Password: "ignored",
            FirstName: req.FirstName,
            LastName: req.LastName
        );

        await provisioning.EnsureUserDocAsync(registerReq, uid, email, idToken, ct);
        await provisioning.EnsureCalendarProvisionedAsync(uid, idToken, ct);

        return Results.Ok(new { ok = true });
    }

    // DTO matchar klienten exakt
    private sealed class AuthMe
    {
        public string? Uid { get; set; }
        public string? Email { get; set; }
    }

    private static async Task<string> RequireIdToken(IFirebaseAuthService auth)
    => await auth.GetValidIdTokenAsync() ?? throw new InvalidOperationException("Missing idToken");
}
