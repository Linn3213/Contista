using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Logic;

namespace Contista.Web.Client.Offline.Runtime;

public sealed class SystemOfflineClock : IOfflineClock
{
    public DateTime UtcNow => DateTime.UtcNow;
}
