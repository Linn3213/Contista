using Contista.Shared.Client.Offline;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.Sync;
using Contista.Shared.Core.Interfaces.SyncDebug;
using Contista.Shared.Core.Models.Sync;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Logic;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Services.Calendar;
using Contista.Shared.UI.DependencyInjection;
using Contista.Shared.UI.Services;
using Contista.Shared.UI.Services.SyncDebug;
using Contista.Web.Client.Offline;
using Contista.Web.Client.Offline.Runtime;
using Microsoft.Extensions.DependencyInjection;
using SystemOfflineClock = Contista.Web.Client.Offline.Runtime.SystemOfflineClock;

namespace Contista.Web.Client.DependencyInjection;

public static class WebClientServiceCollectionExtensions
{
    /// <summary>
    /// Offline core i WASM (localStorage/cache/state + UI).
    /// </summary>
    public static IServiceCollection AddWebClientOffline(this IServiceCollection services)
    {
        // Shared UI (AuthStateProvider m.m.)
        services.AddSharedUi();

        services.AddSyncDebugUi();

        // Localization
        services.AddSingleton<ILocalizationService, LocalizationService>();

        // ---- Offline runtime-implementationer i browser ----
        services.AddSingleton<IOfflineFileStore, WebOfflineFileStore>();      // localStorage “files”
        //services.AddSingleton<ICacheStore, InMemoryCacheStore>();   Det gamla in-memory (för testning)          
        //services.AddSingleton<ISyncQueue, InMemorySyncQueue>();     Det gamla in-memory (för testning)           
        services.AddSingleton<ICacheStore, IndexedDbCacheStore>();            // IndexedDB cache store
        services.AddSingleton<ISyncQueue, IndexedDbSyncQueue>();              // IndexedDB sync queue
        services.AddSingleton<ISecretStore, NoopSecretStore>();               // i web: kör cookie-auth => inget securestore behövs
        services.AddSingleton<IOfflineClock, SystemOfflineClock>();
        services.AddSingleton<BrowserNetworkStatus>(); // riktig status i browsern

        services.AddSingleton<DebugNetworkStatus>(sp =>
            new DebugNetworkStatus(sp.GetRequiredService<BrowserNetworkStatus>()));

        services.AddSingleton<INetworkStatus>(sp => sp.GetRequiredService<DebugNetworkStatus>());
        services.AddSingleton<INetworkDebugControl>(sp => sp.GetRequiredService<DebugNetworkStatus>());
        services.AddScoped<IClaimsSnapshotStore, ClaimsSnapshotStore>();
        services.AddScoped<ILastUserStore, LastUserStore>();


        services.AddScoped<IOfflineWriteService, OfflineWriteService>();
        services.AddScoped<ISyncRunner, SyncRunner>();
        services.AddScoped<ISyncUxNotifier, SyncUxNotifier>();
        services.AddScoped<SyncUxState>();

        // ---- Orchestrator (det AppGate kräver) ----
        services.AddScoped<OfflineOrchestrator>();
        services.AddScoped<IAppSessionOrchestrator>(sp => sp.GetRequiredService<OfflineOrchestrator>());

        // ---- COMMON ----
        services.AddScoped<ICommonCacheService, CommonCacheService>();
        services.AddScoped<ICommonDataProvider, CommonDataProvider>();
        services.AddScoped<ICommonDataState<CommonDataDto>, CommonDataState<CommonDataDto>>();

        // ---- USER ----
        services.AddScoped<IUserCacheService<UserDataDto>, UserCacheService<UserDataDto>>();
        services.AddScoped<IUserDataProvider<UserDataDto>, UserDataProvider<UserDataDto>>();
        services.AddScoped<IUserDataState<UserDataDto>, UserDataState<UserDataDto>>();
        services.AddScoped<IMutableUserDataState<UserDataDto>>(sp => (IMutableUserDataState<UserDataDto>)sp.GetRequiredService<IUserDataState<UserDataDto>>());

        return services;
    }

    /// <summary>
    /// Sync mot Web API istället för Firestore direkt.
    /// </summary>
    public static IServiceCollection AddWebClientApiSync(this IServiceCollection services)
    {
        services.AddScoped<IOfflineDataSync, ApiOfflineDataSync>();
        return services;
    }
}
