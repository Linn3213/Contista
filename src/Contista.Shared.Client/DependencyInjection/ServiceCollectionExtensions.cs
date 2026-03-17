using Contista.Shared.Client.Services;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.UserDirectory;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Logic;
using Contista.Shared.Core.Services.Calendar;
using Microsoft.Extensions.DependencyInjection;

namespace Contista.Shared.Client.DependencyInjection;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registrerar API-klienter som pratar med Web via HttpClient.
    ///
    /// OBS:
    /// - Registrerar INTE IOfflineDataSync (väljs av hosten: Web.Client vs MAUI).
    /// - Registrerar INTE IFirebaseAuthService (cookie vs firebase väljs av hosten).
    /// - Registrerar INTE IRegisterApi (web vs maui väljs av hosten).
    /// </summary>
    public static IServiceCollection AddContistaClientApi(this IServiceCollection services)
    {
        services.AddScoped<IUserClaimsService, ApiUserClaimsService>();

        services.AddScoped<ICalendarDataProvider, ApiCalendarDataProvider>();
        services.AddScoped<ICalendarState, CalendarState>();
        services.AddScoped<IUserDirectoryState, UserDirectoryState>();
        services.AddScoped<ICalendarPermissionService, CalendarPermissionService>();
        services.AddScoped<ICalendarQuotaService, ApiCalendarQuotaService>();
        services.AddScoped<ICalendarInvitesService, ApiCalendarInvitesService>();
        services.AddScoped<IUserDirectoryDataProvider, ApiUserDirectoryDataProvider>();
        services.AddScoped<IReminderHub, ReminderHub>();
        services.AddScoped<IReminderScheduler, ReminderScheduler>();
        services.AddScoped<IReminderStartupService, ReminderStartupService>();

        return services;
    }
}
