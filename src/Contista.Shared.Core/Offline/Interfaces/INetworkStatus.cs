using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces
{
    public interface INetworkStatus
    {
        bool IsOnline { get; }
        event Action<bool>? OnlineChanged; // true = online
    }
}
