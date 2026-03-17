using Microsoft.AspNetCore.Components.WebAssembly.Http;

namespace Contista.Web.Client.Services;

/// <summary>
/// Ser till att cookies följer med på alla /api/*-anrop (även om du råkar bli cross-origin).
/// </summary>
public sealed class ApiCookieCredentialsHandler : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        // Sätt credentials för API-anrop (cookie-auth)
        if (request.RequestUri is not null &&
            request.RequestUri.AbsolutePath.StartsWith("/api/", StringComparison.OrdinalIgnoreCase))
        {
            request.SetBrowserRequestCredentials(BrowserRequestCredentials.Include);
        }

        return base.SendAsync(request, cancellationToken);
    }
}
