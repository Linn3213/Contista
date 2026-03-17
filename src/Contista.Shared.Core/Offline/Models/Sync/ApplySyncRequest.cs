using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Models.Sync;

public sealed class ApplySyncRequest
{
    public SyncOperationEnvelope Operation { get; set; } = new();
}
