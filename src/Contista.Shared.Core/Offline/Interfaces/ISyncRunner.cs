using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces;
// En enkel runner som kan trigga från UI (AppGate) eller vid network-change
public interface ISyncRunner
{
    Task RunOnceAsync(CancellationToken ct = default);
    Task TriggerAsync(CancellationToken ct = default);
}
