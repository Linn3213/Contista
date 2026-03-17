using Contista.Shared.Core.Offline.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces;
// En tjänst för att köa upp skriv-operationer för offline-synkronisering
public interface IOfflineWriteService
{
    Task<string> EnqueueAsync(SyncOperationEnvelope op, CancellationToken ct = default);
    Task<int> GetPendingCountAsync(CancellationToken ct = default);
}
