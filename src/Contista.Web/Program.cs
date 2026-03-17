using Contista.Infrastructure.Firestore;
using Contista.Infrastructure.Firestore.Offline;
using Contista.Infrastructure.Firestore.Repos;
using Contista.Infrastructure.Firestore.Services;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Interfaces.Sync;
using Contista.Shared.Core.Models.Sync;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Logic;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Services.Calendar;
using Contista.Shared.UI.DependencyInjection;
using Contista.Shared.UI.Services;
using Contista.Web.Components;
using Contista.Web.Endpoints;
using Contista.Web.Services;
using Contista.Web.Services.Offline;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

#region Culture
var culture = new CultureInfo("sv");
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;
#endregion

#region Razor / Blazor
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents()
    .AddInteractiveWebAssemblyComponents();

builder.Services.AddServerSideBlazor()
    .AddCircuitOptions(o => o.DetailedErrors = true);
#endregion

#region Firestore infra (server)
builder.Services.AddFirestoreInfrastructure(builder.Configuration);

// Servern behöver denna för /api/common
builder.Services.TryAddScoped<IOfflineDataSync, FirestoreOfflineDataSync>();
#endregion

#region AUTH – Cookie (Web) + Firebase JWT (MAUI)
builder.Services.AddHttpContextAccessor();

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, "dp_keys")))
    .SetApplicationName("Contista");

var firebaseProjectId = builder.Configuration["Firebase:ProjectId"];
if (string.IsNullOrWhiteSpace(firebaseProjectId))
    throw new InvalidOperationException("Firebase:ProjectId saknas i config.");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = "la";
        options.DefaultAuthenticateScheme = "la";
        options.DefaultChallengeScheme = "la";
        options.DefaultSignInScheme = "la-cookie";
    })
    .AddPolicyScheme("la", "Cookie or Firebase JWT", options =>
    {
        options.ForwardDefaultSelector = context =>
        {
            var auth = context.Request.Headers.Authorization.ToString();
            if (!string.IsNullOrWhiteSpace(auth) &&
                auth.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                return "firebase";
            }

            return "la-cookie";
        };
    })
    .AddCookie("la-cookie", opt =>
    {
        opt.Cookie.Name = "la.auth";
        opt.Cookie.HttpOnly = true;
        opt.Cookie.SameSite = SameSiteMode.Lax;
        opt.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        opt.SlidingExpiration = true;
        opt.ExpireTimeSpan = TimeSpan.FromDays(30);
        opt.LoginPath = "/";

        // VIKTIGT: API ska få 401/403, inte HTML-redirect
        opt.Events = new Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationEvents
        {
            OnRedirectToLogin = ctx =>
            {
                if (ctx.Request.Path.StartsWithSegments("/api"))
                {
                    ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                }

                ctx.Response.Redirect(ctx.RedirectUri);
                return Task.CompletedTask;
            },
            OnRedirectToAccessDenied = ctx =>
            {
                if (ctx.Request.Path.StartsWithSegments("/api"))
                {
                    ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                }

                // ✅ Viktigt: inga ReturnUrl-parametrar (annars kan Landing loopa)
                ctx.Response.Redirect("/");
                return Task.CompletedTask;
            }
        };
    })
    .AddJwtBearer("firebase", options =>
    {
        options.Authority = $"https://securetoken.google.com/{firebaseProjectId}";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://securetoken.google.com/{firebaseProjectId}",
            ValidateAudience = true,
            ValidAudience = firebaseProjectId,
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();
#endregion

#region HttpClient factory + Firebase Identity Toolkit
// ? Så IHttpClientFactory finns för CookieFirebaseAuthService
builder.Services.AddHttpClient();

// Behåll din FirebaseIdentityApi (om du använder den i login/custom token flow)
builder.Services.AddHttpClient<FirebaseIdentityApi>();
#endregion

#region IFirebaseAuthService – COOKIE vs BEARER

// Cookie-flöde (Web)
builder.Services.AddScoped<AuthCookieService>();
builder.Services.AddScoped<CookieFirebaseAuthService>();

// Bearer-flöde (MAUI/WASM)
builder.Services.AddScoped<HeaderFirebaseAuthService>();

// Välj per request
builder.Services.AddScoped<IFirebaseAuthService>(sp =>
{
    var http = sp.GetRequiredService<IHttpContextAccessor>();
    var authHeader = http.HttpContext?.Request.Headers.Authorization.ToString();

    if (!string.IsNullOrWhiteSpace(authHeader) &&
        authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
    {
        return sp.GetRequiredService<HeaderFirebaseAuthService>();
    }

    return sp.GetRequiredService<CookieFirebaseAuthService>();
});
#endregion

#region IRequestAuth (används av Firestore repos)

// Bearer request auth (MAUI/WASM)
builder.Services.AddScoped<HeaderRequestAuth>();

// ? Cookie request auth (måste peka på CookieFirebaseAuthService, inte “valfri” IFirebaseAuthService)
builder.Services.AddScoped<CookieRequestAuth>();

builder.Services.AddScoped<IRequestAuth>(sp =>
{
    var http = sp.GetRequiredService<IHttpContextAccessor>();
    var auth = http.HttpContext?.Request.Headers.Authorization.ToString();

    if (!string.IsNullOrWhiteSpace(auth) &&
        auth.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
    {
        return sp.GetRequiredService<HeaderRequestAuth>();
    }

    return sp.GetRequiredService<CookieRequestAuth>();
});
#endregion

#region Offline / State (server-side, prerender)
builder.Services.AddSingleton<IOfflineFileStore, InMemoryOfflineFileStore>();
builder.Services.AddSingleton<ICacheStore, InMemoryCacheStore>();
builder.Services.AddSingleton<ISyncQueue, InMemorySyncQueue>();
builder.Services.AddScoped<ISyncRunner, SyncRunner>();
builder.Services.AddScoped<ISyncUxNotifier, SyncUxNotifier>();
builder.Services.AddScoped<SyncUxState>();
builder.Services.AddSingleton<IOfflineClock, SystemOfflineClock>();
builder.Services.AddSingleton<ISecretStore, NoopSecretStore>();
builder.Services.AddSingleton<ServerNetworkStatus>();

builder.Services.AddSingleton<DebugNetworkStatus>(sp =>
    new DebugNetworkStatus(sp.GetRequiredService<ServerNetworkStatus>()));

builder.Services.AddSingleton<INetworkStatus>(sp =>
    sp.GetRequiredService<DebugNetworkStatus>());

builder.Services.AddSingleton<INetworkDebugControl>(sp =>
    sp.GetRequiredService<DebugNetworkStatus>());

builder.Services.AddScoped<IClaimsSnapshotStore, ClaimsSnapshotStore>();
builder.Services.AddScoped<ILastUserStore, LastUserStore>();

builder.Services.AddScoped<ICommonCacheService, CommonCacheService>();
builder.Services.AddScoped<ICommonDataProvider, CommonDataProvider>();
builder.Services.AddScoped<ICommonDataState<CommonDataDto>, CommonDataState<CommonDataDto>>();

builder.Services.AddScoped<IUserCacheService<UserDataDto>, UserCacheService<UserDataDto>>();
builder.Services.AddScoped<IUserDataProvider<UserDataDto>, UserDataProvider<UserDataDto>>();
builder.Services.AddScoped<IUserDataState<UserDataDto>, UserDataState<UserDataDto>>();

builder.Services.AddScoped<IAppSessionOrchestrator, OfflineOrchestrator>();
builder.Services.AddScoped<OfflineOrchestrator>(sp =>
    (OfflineOrchestrator)sp.GetRequiredService<IAppSessionOrchestrator>());
#endregion

#region Domain services
builder.Services.AddScoped<IUserClaimsService, UserClaimsService>();
builder.Services.AddScoped<IUserProvisioningService, UserProvisioningService>();

builder.Services.AddScoped<ICommonMetaVersionBumper, CommonMetaVersionBumper>();
builder.Services.AddScoped<ISyncApplyService, SyncApplyService>();

builder.Services.AddScoped<ContentPostRepository>();
builder.Services.AddScoped<ISyncOpLogRepository, SyncOpLogRepository>();

builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<RoleRepository>();
builder.Services.AddScoped<MembershipRepository>();


builder.Services.AddScoped<ICalendarQuotaService, CalendarQuotaService>();

builder.Services.AddSingleton<ILocalizationService, LocalizationService>();
builder.Services.AddSharedUi();

#endregion

var app = builder.Build();

#region Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseWebAssemblyDebugging();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), sub =>
{
    sub.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), sub =>
{
    sub.UseAntiforgery();
});

app.UseAuthentication();
app.UseAuthorization();
#endregion

#region Endpoints
app.MapStaticAssets();

app.MapAuthEndpoints();
app.MapCommonEndpoints();
app.MapSyncEndpoints();
app.MapUserContentEndpoints();
app.MapCalendarEndpoints();
app.MapUserDirectoryEndpoints();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .AddInteractiveWebAssemblyRenderMode()
    .AddAdditionalAssemblies(
        typeof(Contista.Shared.UI._Imports).Assembly,
        typeof(Contista.Web.Client._Imports).Assembly);

app.MapGet("/api/auth/debug-claims", (HttpContext http) =>
{
    var claims = http.User.Claims.Select(c => new
    {
        c.Type,
        Value = c.Value.Length > 80 ? c.Value[..80] + "..." : c.Value
    });

    return Results.Ok(new
    {
        auth = http.User.Identity?.IsAuthenticated,
        claims
    });
});
#endregion

app.Run();
