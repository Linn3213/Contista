using Contista.Infrastructure.Firestore.Repos;
using Contista.Infrastructure.Firestore.Services;
using Contista.Shared.Core.Interfaces;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Contista.Infrastructure.Firestore;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddFirestoreInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.Configure<FirebaseOptions>(config.GetSection("Firebase"));

        // HttpClient som repos + auth 
        services.AddSingleton(sp => new HttpClient());

        // Auth
        //services.AddSingleton<IFirebaseAuthService, FirebaseAuthService>();

        // ✅ MISSING: Meta version bumper
        services.AddScoped<ICommonMetaVersionBumper, CommonMetaVersionBumper>();

        // Repositories
        services.AddScoped<IContentPostRepository, ContentPostRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserDirectoryRepository, UserDirectoryRepository>();
        services.AddScoped<ICalendarRepository, CalendarRepository>();
        services.AddScoped<ICalendarMembershipRepository, CalendarMembershipRepository>();
        services.AddScoped<ICalendarSettingsRepository, CalendarSettingsRepository>();
        services.AddScoped<ICalendarRefRepository, CalendarRefRepository>();


        // Inner repos (registrera som concrete)
        services.AddScoped<ContentPostRepository>();
        services.AddScoped<UserRepository>();
        services.AddScoped<UserDirectoryRepository>();
        services.AddScoped<RoleRepository>();
        services.AddScoped<MembershipRepository>();
        services.AddScoped<CalendarRepository>();
        services.AddScoped<CalendarMembershipRepository>();
        services.AddScoped<CalendarRefRepository>();


        // Meta repo
        services.AddScoped<IMetaRepository, MetaRepository>();

        // Exposed repos = wrapper som bump:ar meta
        services.AddScoped<IRoleRepository>(sp =>
            new RoleRepositoryWithMeta(
                sp.GetRequiredService<RoleRepository>(),
                sp.GetRequiredService<ICommonMetaVersionBumper>()));

        services.AddScoped<IMembershipRepository>(sp =>
            new MembershipRepositoryWithMeta(
                sp.GetRequiredService<MembershipRepository>(),
                sp.GetRequiredService<ICommonMetaVersionBumper>()));

        // Claims från Firestore
        services.AddScoped<IUserClaimsService, UserClaimsService>();
        services.AddScoped<ICalendarSharingService, CalendarSharingService>();

        return services;
    }
}
