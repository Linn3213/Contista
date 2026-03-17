using Contista.Shared.Core.Offline.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO;

public class SyncOpLog
{
    public string UserId { get; set; } = "";
    public string OperationId { get; set; } = "";
    public SyncOperationType OperationType { get; set; }

    public string? EntityId { get; set; } // t.ex PostId, UserId

    public DateTime ClientTimestampUtc { get; set; } = DateTime.UtcNow;
    public DateTime AppliedAtUtc { get; set; } = DateTime.UtcNow;

    public string? DetailsJson { get; set; } // valfritt, för debug
}
