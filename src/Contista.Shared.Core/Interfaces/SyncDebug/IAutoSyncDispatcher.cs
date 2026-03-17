using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.SyncDebug;

public interface IAutoSyncDispatcher
{
    Task TrySyncSoonAsync(Func<Task> syncFunc);
    bool IsSyncRunning { get; }
}