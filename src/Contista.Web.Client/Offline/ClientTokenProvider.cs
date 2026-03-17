using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Web.Client.Offline.Interfaces;

namespace Contista.Web.Client.Offline
{
    public sealed class ClientTokenProvider : IClientTokenProvider
    {
        private readonly IFirebaseAuthService _auth;

        public ClientTokenProvider(IFirebaseAuthService auth) => _auth = auth;

        public async Task<string?> GetIdTokenAsync()
        {
            if (!_auth.IsLoggedIn) return null;
            try { return await _auth.GetValidIdTokenAsync(); }
            catch { return null; }
        }
    }
}
