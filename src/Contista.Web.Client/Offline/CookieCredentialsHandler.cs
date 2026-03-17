using Microsoft.AspNetCore.Components.WebAssembly.Http;

namespace Contista.Web.Client.Offline
{
    public class CookieCredentialsHandler : DelegatingHandler
    {
        /// <summary>
        /// Tvingar fetch att skicka cookies (la.auth) till samma origin.
        /// </summary>
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            // Viktigt för cookie-auth i WASM
            request.SetBrowserRequestCredentials(BrowserRequestCredentials.Include);
            request.SetBrowserRequestMode(BrowserRequestMode.SameOrigin);

            return base.SendAsync(request, cancellationToken);
        }
    }
}
