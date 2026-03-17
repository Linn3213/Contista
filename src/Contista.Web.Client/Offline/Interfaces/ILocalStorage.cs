namespace Contista.Web.Client.Offline.Interfaces
{
    public interface ILocalStorage
    {
        Task<string?> GetStringAsync(string key);
        Task SetStringAsync(string key, string value);
        Task RemoveAsync(string key);
    }
}
