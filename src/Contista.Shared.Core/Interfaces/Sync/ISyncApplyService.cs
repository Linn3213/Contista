using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Offline.Models.Sync;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Sync;

public interface ISyncApplyService
{
    Task<ApplySyncResponse> ApplyAsync(SyncOperation op, CancellationToken ct = default);

    public sealed class ApplySyncResult
    {
        public bool Applied { get; set; }
        public bool DuplicateIgnored { get; set; }
        public string? Message { get; set; }
    }
}
