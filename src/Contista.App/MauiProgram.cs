using Contista.Offline;
using Contista.Services;
using Contista.Shared.Client.DependencyInjection;
using Contista.Shared.Client.Http;
using Contista.Shared.Client.Offline;
using Contista.Shared.Client.Options;
using Contista.Shared.Client.Services;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Interfaces.Sync;
using Contista.Shared.Core.Models.Sync;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Logic;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Options;
using Contista.Shared.UI.DependencyInjection;
using Contista.Shared.UI.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Reflection;

namespace Contista;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();

        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            });

        builder.Services.AddMauiBlazorWebView();

#if DEBUG
        builder.Services.AddBlazorWebViewDeveloperTools();
        builder.Logging.AddDebug();
        builder.Logging.SetMinimumLevel(LogLevel.Trace);
#endif

        // -----------------------------
        // Load embedded appsettings.json
        // -----------------------------
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = "Contista.appsettings.json";

        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream is null)
        {
            var all = string.Join("\n", assembly.GetManifestResourceNames());
            System.Diagnostics.Debug.WriteLine("RESOURCES:\n" + all);
            throw new InvalidOperationException(
                $"Hittar inte embedded resource '{resourceName}'. Tillgängliga resurser:\n{all}");
        }

        var embeddedConfig = new ConfigurationBuilder()
            .AddJsonStream(stream)
            .Build();

        builder.Configuration.AddConfiguration(embeddedConfig);

        // -----------------------------
        // Bind Options (Firebase + ServerApi)
        // -----------------------------
        builder.Services.AddOptions<FirebaseOptions>()
            .Bind(builder.Configuration.GetSection("Firebase"));

        builder.Services.AddOptions<ServerApiOptions>()
            .Bind(builder.Configuration.GetSection("ServerApi"));

        // -----------------------------
        // Localization + UI
        // -----------------------------
        builder.Services.AddSingleton<ILocalizationService, LocalizationService>();
        builder.Services.AddSharedUi();
        builder.Services.AddSyncDebugUi();


        // -----------------------------
        // MAUI platform/offline primitives
        // -----------------------------
        builder.Services.AddSingleton<MauiNetworkStatus>();
        builder.Services.AddSingleton<INetworkStatus>(sp => sp.GetRequiredService<MauiNetworkStatus>());
        builder.Services.AddSingleton<INetworkDebugControl>(sp => sp.GetRequiredService<MauiNetworkStatus>());
        builder.Services.AddSingleton<IKeyValueStore, MauiFileKeyValueStore>();
        builder.Services.AddSingleton<ICacheStore, JsonFileCacheStore>();
        builder.Services.AddSingleton<ISyncQueue, JsonFileSyncQueue>();
        builder.Services.AddSingleton<IOfflineClock, SystemOfflineClock>();
        builder.Services.AddSingleton<IOfflineFileStore, MauiOfflineFileStore>();
        builder.Services.AddSingleton<ISecretStore, MauiSecureSecretStore>();
        builder.Services.AddScoped<IOfflineWriteService, OfflineWriteService>();
        builder.Services.AddScoped<IClaimsSnapshotStore, ClaimsSnapshotStore>();
        builder.Services.AddScoped<ILastUserStore, LastUserStore>();



        // -----------------------------
        // Offline common pipeline (Shared.Core)
        // -----------------------------
        builder.Services.AddScoped<ICommonCacheService, CommonCacheService>();
        builder.Services.AddScoped<ICommonDataProvider, CommonDataProvider>();

        builder.Services.AddScoped<IUserCacheService<UserDataDto>, UserCacheService<UserDataDto>>();
        builder.Services.AddScoped<IUserDataProvider<UserDataDto>, UserDataProvider<UserDataDto>>();

        // -----------------------------
        // BaseUrl (MÅSTE sättas före ServerApi HttpClient-reg)
        // -----------------------------
        var baseUrl = builder.Configuration["ServerApi:BaseUrl"]?.Trim();

#if ANDROID
        if (string.IsNullOrWhiteSpace(baseUrl) || baseUrl.Contains("localhost"))
            baseUrl = "https://10.0.2.2:7277/";
#else
        if (string.IsNullOrWhiteSpace(baseUrl))
            baseUrl = "https://localhost:7277/";
#endif

        // skriv tillbaka så både Options och HttpClient-reg ser rätt värde
        builder.Configuration["ServerApi:BaseUrl"] = baseUrl;

        // -----------------------------
        // HttpClient för FirebaseAuthService (direkt mot Google/Firebase)
        // VIKTIGT: INTE default HttpClient och INTE ServerApi client (annars blir det cirkel/lazy-felet)
        // -----------------------------
        builder.Services.AddHttpClient("FirebaseAuth")
            .ConfigurePrimaryHttpMessageHandler(() =>
            {
                var handler = new HttpClientHandler
                {
                    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
                };

#if DEBUG
                // DEV: acceptera self-signed cert i debug (påverkar ej Google, men skadar inte)
                handler.ServerCertificateCustomValidationCallback =
                    HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
#endif
                return handler;
            });

        // -----------------------------
        // IFirebaseAuthService (MAUI) = FirebaseAuthService
        // -----------------------------
        builder.Services.AddSingleton<IFirebaseAuthService>(sp =>
        {
            var http = sp.GetRequiredService<IHttpClientFactory>().CreateClient("FirebaseAuth");
            var opts = sp.GetRequiredService<IOptions<FirebaseOptions>>();
            var secrets = sp.GetRequiredService<ISecretStore>();

            // OBS: FirebaseAuthService måste nu ligga i Shared.Client (t.ex. Contista.Shared.Client.Services)
            return new FirebaseAuthService(http, opts, secrets);
        });

        // -----------------------------
        // ServerApi HttpClient ("ServerApi") med Bearer för /api/*
        // -----------------------------
        builder.Services.AddScoped<FirebaseBearerHandler>();

        builder.Services.AddServerApiHttpClient(
            builder.Configuration,
            configureBuilder: b => b.AddHttpMessageHandler<FirebaseBearerHandler>(),
            configureHandler: _ =>
            {
                var handler = new HttpClientHandler
                {
                    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
                };

#if DEBUG
                // DEV: acceptera self-signed cert mot din lokala https-server
                handler.ServerCertificateCustomValidationCallback =
                    HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
#endif
                return handler;
            },
            sectionName: "ServerApi"
        );

        // -----------------------------
        // Shared.Client API-tjänster (MAUI-variant)
        // -----------------------------
        builder.Services.AddContistaClientApi();
        builder.Services.AddScoped<IOfflineDataSync, ApiOfflineDataSync>();

        // -----------------------------
        // Orchestrator + state (Shared.Core)
        // -----------------------------
        builder.Services.AddScoped<OfflineOrchestrator>();
        builder.Services.AddScoped<IAppSessionOrchestrator>(sp => sp.GetRequiredService<OfflineOrchestrator>());

        builder.Services.AddScoped<IAppResetService, AppResetService>();

        builder.Services.AddScoped<ICommonDataState<CommonDataDto>, CommonDataState<CommonDataDto>>();
        builder.Services.AddScoped<IUserDataState<UserDataDto>, UserDataState<UserDataDto>>();
        builder.Services.AddScoped<IMutableUserDataState<UserDataDto>>(sp => (IMutableUserDataState<UserDataDto>)sp.GetRequiredService<IUserDataState<UserDataDto>>());

        builder.Services.AddScoped<ISyncRunner, SyncRunner>();
        builder.Services.AddScoped<ISyncUxNotifier, SyncUxNotifier>();
        builder.Services.AddScoped<SyncUxState>();

        // -----------------------------
        // Register (MAUI) = MauiRegisterApi (Firebase signUp lokalt + /api/auth/provision via bearer)
        // -----------------------------
        builder.Services.AddScoped<IRegisterApi, MauiRegisterApi>();
        
        

        return builder.Build();
    }
}
