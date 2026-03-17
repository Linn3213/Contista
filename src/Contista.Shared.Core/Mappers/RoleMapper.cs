using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Mappers
{
    public static class RoleMapper
    {
        public static Role ToRole(FirestoreDocument doc, string id)
        {
            var field = doc.Fields!;
            return new Role
            {
                RoleId = id,
                RoleName = field.GetString("RoleName")
            };
        }

        public static FirestoreDocument FromRole(Role doc)
        {
            var fields = new Dictionary<string, FirestoreValue>
            {
                ["RoleName"] = doc.RoleName.ToFirestoreValue()
            };

            return new FirestoreDocument { Fields = fields };
        }
    }
}
