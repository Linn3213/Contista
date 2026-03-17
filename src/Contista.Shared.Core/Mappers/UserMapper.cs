using Contista.Shared.Core.Models;
using System.Text;
using Contista.Shared.Core.DTO;

namespace Contista.Shared.Core.Mappers
{
    public static class UserMapper
    {
        public static User ToUser(FirestoreDocument doc, string id)
        {
            var field = doc.Fields!;
            return new User
            {
                UserId = id,
                FirstName = field.GetString("FirstName"),
                LastName = field.GetString("LastName"),
                Email = field.GetString("Email"),

                DisplayName = field.GetString("DisplayName"),
                Bio = string.IsNullOrWhiteSpace(field.GetString("Bio")) ? null : field.GetString("Bio"),
                Language = string.IsNullOrWhiteSpace(field.GetString("Language")) ? "sv" : field.GetString("Language"),

                Created = field.GetDate("Created"),

                RoleId = field.GetString("RoleId"),
                MembershipId = field.GetString("MembershipId"),
                UpdatedAt = field.GetDate("UpdatedAt")
            };
        }

        public static FirestoreDocument FromUser(User doc)
        {
            var fields = new Dictionary<string, FirestoreValue>
            {
                ["FirstName"] = doc.FirstName.ToFirestoreValue(),
                ["LastName"] = doc.LastName.ToFirestoreValue(),
                ["Email"] = doc.Email.ToFirestoreValue(),

                ["DisplayName"] = doc.DisplayName.ToFirestoreValue(),
                ["Bio"] = (doc.Bio ?? "").ToFirestoreValue(),
                ["Language"] = doc.Language.ToFirestoreValue(),

                ["Created"] = doc.Created.ToFirestoreTimestamp(),

                ["RoleId"] = doc.RoleId.ToFirestoreValue(),
                ["MembershipId"] = doc.MembershipId.ToFirestoreValue(),
                ["UpdatedAt"] = doc.UpdatedAt.ToFirestoreTimestamp()
            };

            return new FirestoreDocument { Fields = fields };
        }
    }
}
