using Contista.Shared.Client.DependencyInjection;
using Contista.Shared.Client.Services;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Web.Client.DependencyInjection;
using Contista.Web.Client.Offline.Runtime;
using Contista.Web.Client.Services;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

// ? SAME-ORIGIN HttpClient
// Cookies skickas automatiskt av browsern
builder.Services.AddScoped(_ => new HttpClient
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
});

// 1) Gemensamma API-klienter (claims/profile)
builder.Services.AddContistaClientApi();

// 2) WEB/WASM auth = cookie-baserad
builder.Services.AddScoped<IFirebaseAuthService, ApiCookieAuthService>();

// 3) WEB register via servern (/api/auth/register)
builder.Services.AddScoped<IRegisterApi, ApiRegisterService>();

// 4) Offline runtime + orchestrator + states
builder.Services.AddWebClientOffline();

// 5) WEB sync-implementation
builder.Services.AddWebClientApiSync();

var host = builder.Build();

// initiera BrowserNetworkStatus (så events kopplas)
var net = host.Services.GetRequiredService<BrowserNetworkStatus>();
await net.InitializeAsync();

await host.RunAsync();
