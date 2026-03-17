using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Models;

public enum SyncQueueStatus
{
    Pending = 1,
    Processing = 2,
    Failed = 3,
    Done = 4
}
