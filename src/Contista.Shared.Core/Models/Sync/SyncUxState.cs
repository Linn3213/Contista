using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Models.Sync;

public sealed record SyncUxState(
    int FailedCount = 0,
    bool SessionExpired = false,
    string? Message = null
);