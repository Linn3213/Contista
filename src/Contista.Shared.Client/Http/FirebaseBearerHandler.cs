using System.Net.Http.Headers;
using Contista.Shared.Core.Interfaces.Firebase;

namespace Contista.Shared.Client.Http;

public sealed class FirebaseBearerHandler : DelegatingHandler
{
    private readonly IFirebaseAuthService _auth;

    public FirebaseBearerHandler(IFirebaseAuthService auth)
    {
        _auth = auth;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken ct)
    {
        if (_auth.IsLoggedIn)
        {
            var token = await _auth.GetValidIdTokenAsync();
            if (!string.IsNullOrWhiteSpace(token))
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        }

        return await base.SendAsync(request, ct);
    }
}
