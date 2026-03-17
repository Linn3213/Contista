using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Contista.Shared.Core.Offline.Models
{
    /// <summary>
    /// Minimal operation som kan serialiseras och spelas upp senare.
    /// PayloadJson kan vara en DTO (t.ex. ContentPostDto) som du skickar till backend.
    /// </summary>
    public sealed class SyncOperation
    {
        public string UserId { get; set; } = string.Empty;

        // Idempotens/dedupe (måste vara stabilt per operation)
        public string ClientOperationId { get; set; } = string.Empty;

        public DateTime ClientTimestampUtc { get; set; } = DateTime.UtcNow;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public SyncOperationType OperationType { get; set; }

        // Payload skickas som JSON-string (t.ex. JSON.stringify(dto))
        public string PayloadJson { get; set; } = "{}";
    }
}
