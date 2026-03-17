using Contista.Shared.Core.Offline.Interfaces;
using Microsoft.JSInterop;
using System.Text;

namespace Contista.Web.Client.Offline
{
    public sealed class WebOfflineFileStore : IOfflineFileStore
    {
        private readonly IJSRuntime _js;

        public WebOfflineFileStore(IJSRuntime js) => _js = js;

        public async Task<bool> ExistsAsync(string fileName, CancellationToken ct = default)
            => !string.IsNullOrWhiteSpace(await ReadTextAsync(fileName, ct));

        public async Task<string?> ReadTextAsync(string fileName, CancellationToken ct = default)
            => await _js.InvokeAsync<string?>("localStorage.getItem", ct, fileName);

        public async Task WriteTextAsync(string fileName, string content, CancellationToken ct = default)
            => await _js.InvokeVoidAsync("localStorage.setItem", ct, fileName, content ?? "");

        public async Task DeleteAsync(string fileName, CancellationToken ct = default)
            => await _js.InvokeVoidAsync("localStorage.removeItem", ct, fileName);
    }
}
