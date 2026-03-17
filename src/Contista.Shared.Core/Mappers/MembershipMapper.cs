using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Mappers
{
    public static class MembershipMapper
    {
        public static Membership ToMembership(FirestoreDocument doc, string id)
        {
            var field = doc.Fields!;
            return new Membership
            {
                MembershipId = id,
                MembershipName = field.GetString("MembershipName"),
                MembershipType = field.GetString("MembershipType"),
                CreateDate = field.GetDate("CreateDate"),
                IsActive = field.GetBool("IsActive"),
                MembershipPrice = field.GetDouble("MembershipPrice"),
                MaxExtraCalendars = field.GetInt("MaxExtraCalendars"),
                MaxEventQuota = field.GetInt("MaxEventQuota")
            };
        }

        public static FirestoreDocument FromMembership(Membership doc)
        {
            var fields = new Dictionary<string, FirestoreValue>
            {
                ["MembershipName"] = doc.MembershipName.ToFirestoreValue(),
                ["MembershipType"] = doc.MembershipType.ToFirestoreValue(),
                ["CreateDate"] = doc.CreateDate.ToFirestoreTimestamp(),
                ["IsActive"] = doc.IsActive.ToFirestoreValue(),
                ["MembershipPrice"] = doc.MembershipPrice.ToFirestoreValue(),
                ["MaxExtraCalendars"] = doc.MaxExtraCalendars.ToFirestoreValue(),
                ["MaxEventQuota"] = doc.MaxEventQuota.ToFirestoreValue()
            };

            return new FirestoreDocument { Fields = fields };
        }
    }
}
