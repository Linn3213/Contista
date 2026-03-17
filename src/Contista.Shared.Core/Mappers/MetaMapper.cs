using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Mappers
{
    public static class MetaMapper
    {
        public static Meta ToMeta(FirestoreDocument doc, string id)
        {
            var field = doc.Fields!;
            return new Meta
            {
                MetaId = id,
                MembershipVersion = field.GetDate("MembershipVersion"),
                RoleVersion = field.GetDate("RoleVersion")
            };
        }

        public static FirestoreDocument FromMeta(Meta doc)
        {
            var fields = new Dictionary<string, FirestoreValue>
            {
                ["MembershipVersion"] = doc.MembershipVersion.ToFirestoreTimestamp(),
                ["RoleVersion"] = doc.RoleVersion.ToFirestoreTimestamp()
            };

            return new FirestoreDocument { Fields = fields };
        }
    }
}
