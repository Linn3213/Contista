using Contista.Shared.Core.Offline.Interfaces;
using Microsoft.JSInterop;

namespace Contista.Web.Client.Offline.Runtime;

public sealed class BrowserNetworkStatus : INetworkStatus, IAsyncDisposable
{
    private readonly IJSRuntime _js;
    private DotNetObjectReference<BrowserNetworkStatus>? _objRef;

    public bool IsOnline { get; private set; } = true;

    public event Action<bool>? OnlineChanged;

    public BrowserNetworkStatus(IJSRuntime js)
    {
        _js = js;
    }

    public async ValueTask InitializeAsync()
    {
        _objRef ??= DotNetObjectReference.Create(this);
        await _js.InvokeVoidAsync("laNetwork.start", _objRef);
    }

    [JSInvokable]
    public void SetOnline(bool online)
    {
        if (IsOnline == online) return;
        IsOnline = online;
        OnlineChanged?.Invoke(online);
    }

    public async ValueTask DisposeAsync()
    {
        try
        {
            await _js.InvokeVoidAsync("laNetwork.stop");
        }
        catch { }

        _objRef?.Dispose();
        _objRef = null;
    }
}
