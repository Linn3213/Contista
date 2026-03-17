using Contista.Shared.Core.Models;
using Contista.Shared.Core.Models.Auth;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Mappers;

public static class UserDirectoryMapper
{
    public static FirestoreDocument FromModel(UserDirectoryEntry e)
    {
        var fields = new Dictionary<string, FirestoreValue>
        {
            ["EmailLower"] = e.EmailLower.ToFirestoreValue(),
            ["UserId"] = e.UserId.ToFirestoreValue(),
            ["DisplayName"] = e.DisplayName.ToFirestoreValue(),
            ["UpdatedAtUtc"] = e.UpdatedAtUtc.ToFirestoreTimestamp()
        };

        return new FirestoreDocument { Fields = fields };
    }

    public static UserDirectoryEntry ToModel(FirestoreDocument doc, string docIdFallback = "")
    {
        var f = doc.Fields ?? new Dictionary<string, FirestoreValue>();

        return new UserDirectoryEntry
        {
            UserId = f.GetOptionalString("UserId") ?? "",
            DisplayName = f.GetOptionalString("DisplayName") ?? "",
            EmailLower = f.GetOptionalString("EmailLower") ?? docIdFallback,
            UpdatedAtUtc = f.GetDate("UpdatedAtUtc"),
        };
    }
}
