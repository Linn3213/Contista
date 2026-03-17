using System.Collections.Generic;
using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Mappers
{
    public static class SyncOpLogMapper
    {
        public static SyncOpLog ToLog(FirestoreDocument doc, string operationId, string userId)
        {
            var f = doc.Fields ?? new Dictionary<string, FirestoreValue>();

            return new SyncOpLog
            {
                UserId = userId,
                OperationId = operationId,

                OperationType = f.GetEnum("OperationType", SyncOperationType.CreatePost),

                EntityId = f.GetOptionalString("EntityId"),
                ClientTimestampUtc = f.GetDate("ClientTimestampUtc"),
                AppliedAtUtc = f.GetDate("AppliedAtUtc"),
                DetailsJson = f.GetOptionalString("DetailsJson"),
            };
        }

        public static FirestoreDocument FromLog(SyncOpLog log)
        {
            var fields = new Dictionary<string, FirestoreValue>
            {
                ["OperationType"] = log.OperationType.ToString().ToFirestoreValue(),
                ["ClientTimestampUtc"] = log.ClientTimestampUtc.ToFirestoreTimestamp(),
                ["AppliedAtUtc"] = log.AppliedAtUtc.ToFirestoreTimestamp(),
            };

            if (!string.IsNullOrWhiteSpace(log.EntityId))
                fields["EntityId"] = log.EntityId!.ToFirestoreValue();

            if (!string.IsNullOrWhiteSpace(log.DetailsJson))
                fields["DetailsJson"] = log.DetailsJson!.ToFirestoreValue();

            return new FirestoreDocument { Fields = fields };
        }
    }
}
