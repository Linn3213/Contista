using Contista.Shared.Core.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Firebase;

public interface ISyncOpLogRepository
{
    Task<bool> ExistsAsync(string userId, string operationId, CancellationToken ct = default);
    Task MarkAppliedAsync(SyncOpLog log, CancellationToken ct = default);
}
