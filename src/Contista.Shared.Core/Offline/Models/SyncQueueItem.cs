using Contista.Shared.Core.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Models
{
    public sealed class SyncQueueItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        public int Attempts { get; set; }

        public SyncQueueStatus Status { get; set; } = SyncQueueStatus.Pending;

        public string? LastError { get; set; }

        public DateTime? LastAttemptUtc { get; set; }
        public DateTime? NextAttemptUtc { get; set; }
        public ApiFailureKind? LastFailureKind { get; set; }

        public SyncOperation Operation { get; set; } = new();
    }
}
