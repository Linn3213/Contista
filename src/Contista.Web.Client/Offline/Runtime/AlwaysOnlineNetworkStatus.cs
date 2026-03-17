using Contista.Shared.Core.Offline.Interfaces;

namespace Contista.Web.Client.Offline.Runtime;

public sealed class AlwaysOnlineNetworkStatus : INetworkStatus
{
    public bool IsOnline => true;
    public event Action<bool>? OnlineChanged
    {
        add { }
        remove { }
    }
}
