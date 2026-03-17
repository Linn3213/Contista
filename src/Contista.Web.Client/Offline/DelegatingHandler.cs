using Contista.Web.Client.Offline.Interfaces;
using System.Net.Http.Headers;

namespace Contista.Web.Client.Offline
{
    public sealed class FirebaseBearerHandler : DelegatingHandler
    {
        private readonly IClientTokenProvider _tokens;

        public FirebaseBearerHandler(IClientTokenProvider tokens)
            => _tokens = tokens;

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken ct)
        {
            var token = await _tokens.GetIdTokenAsync();
            if (!string.IsNullOrWhiteSpace(token))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            return await base.SendAsync(request, ct);
        }
    }
}
