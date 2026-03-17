namespace Contista.Web.Client.Offline.Interfaces
{
    public interface IClientTokenProvider
    {
        Task<string?> GetIdTokenAsync();
    }
}
