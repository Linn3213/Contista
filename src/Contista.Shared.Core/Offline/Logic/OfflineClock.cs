using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Logic
{
    public interface IOfflineClock
    {
        DateTime UtcNow { get; }
    }

    public sealed class SystemOfflineClock : IOfflineClock
    {
        public DateTime UtcNow => DateTime.UtcNow;
    }
}
