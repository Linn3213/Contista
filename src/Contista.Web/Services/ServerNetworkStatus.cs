using Contista.Shared.Core.Offline.Interfaces;

namespace Contista.Web.Services.Offline;

public sealed class ServerNetworkStatus : INetworkStatus
{
    // På servern är vi "online" ur appens perspektiv (kan nå Firestore / API).
    // Det här används bara för att inte krascha DI under prerender.
    public bool IsOnline => true;

    public event Action<bool>? OnlineChanged
    {
        add { }   // no-op
        remove { }
    }
}
