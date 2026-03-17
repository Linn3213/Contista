using Contista.Shared.Client.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Http;
using System;

namespace Contista.Shared.Client.Http;

public static class ServerApiHttpClientExtensions
{
    private const string DefaultClientName = "ServerApi";

    public static IServiceCollection AddServerApiHttpClient(
        this IServiceCollection services,
        IConfiguration config,
        Action<IHttpClientBuilder>? configureBuilder = null,
        Func<IServiceProvider, HttpMessageHandler>? configureHandler = null,
        string sectionName = "ServerApi")
    {
        // Läs BaseUrl direkt ur IConfiguration (ingen IOptions här!)
        var baseUrl = config.GetSection(sectionName).GetValue<string>("BaseUrl")?.Trim();

        if (string.IsNullOrWhiteSpace(baseUrl))
            throw new InvalidOperationException($"{sectionName}:BaseUrl saknas");

        if (!Uri.TryCreate(baseUrl, UriKind.Absolute, out var baseUri))
            throw new InvalidOperationException($"{sectionName}:BaseUrl är inte en giltig absolute URI: '{baseUrl}'");

        // (Valfritt men bra) Behåll options-binding så resten av appen kan injicera IOptions<ServerApiOptions>
        services.AddOptions<ServerApiOptions>()
            .Bind(config.GetSection(sectionName));

        var builder = services.AddHttpClient(DefaultClientName, client =>
        {
            client.BaseAddress = baseUri;
        });

        if (configureHandler is not null)
            builder.ConfigurePrimaryHttpMessageHandler(configureHandler);

        configureBuilder?.Invoke(builder);

        // Default HttpClient => named "ServerApi"
        services.AddScoped(sp =>
            sp.GetRequiredService<IHttpClientFactory>().CreateClient(DefaultClientName));

        return services;
    }
}
