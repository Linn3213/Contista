using System.Text.Json;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Mappers
{
    public static class SyncOperationMapper
    {
        public static SyncOperation FromEnvelope(SyncOperationEnvelope envelope)
        {
            return new SyncOperation
            {
                UserId = envelope.UserId,
                ClientOperationId = envelope.ClientOperationId,
                ClientTimestampUtc = envelope.ClientTimestampUtc,
                OperationType = envelope.OperationType,

                // 🔑 Viktigt: JsonElement → string
                PayloadJson = envelope.Payload.ValueKind == JsonValueKind.Undefined
                    ? "{}"
                    : envelope.Payload.GetRawText()
            };
        }
    }
}
