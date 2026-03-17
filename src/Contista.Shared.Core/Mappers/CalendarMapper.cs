using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Models.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Mappers;

public static class CalendarMapper
{
    public static CalendarDto ToCalendar(FirestoreDocument doc, string id)
    {
        var f = doc.Fields ?? new Dictionary<string, FirestoreValue>();

        return new CalendarDto
        {
            CalendarId = id,
            Name = f.GetString("Name"),
            Color = f.GetString("Color"),
            IsPrimary = f.GetBool("IsPrimary"),
            OwnerUserId = f.GetString("OwnerUserId"),
            IsShared = f.GetBool("IsShared"),
            ConflictPolicy = (CalendarConflictPolicy)f.GetInt("ConflictPolicy"),
            DefaultVisibility = (CalendarVisibility)f.GetInt("DefaultVisibility"),
            Provider = (CalendarProvider)f.GetInt("Provider"),
            ExternalCalendarId = f.GetString("ExternalCalendarId"),
            ExternalReadOnly = f.GetBool("ExternalReadOnly"),
            CreatedAtUtc = f.GetDate("CreatedAtUtc"),
            UpdatedAtUtc = f.GetDate("UpdatedAtUtc"),
            LastMutationId = f.GetString("LastMutationId")
        };
    }

    public static FirestoreDocument FromCalendar(CalendarDto cal)
    {
        var fields = new Dictionary<string, FirestoreValue>
        {
            ["Name"] = (cal.Name ?? "").ToFirestoreValue(),
            ["Color"] = (cal.Color ?? "").ToFirestoreValue(),
            ["IsPrimary"] = cal.IsPrimary.ToFirestoreValue(),
            ["OwnerUserId"] = (cal.OwnerUserId ?? "").ToFirestoreValue(),
            ["IsShared"] = cal.IsShared.ToFirestoreValue(),
            ["ConflictPolicy"] = ((int)cal.ConflictPolicy).ToFirestoreValue(),
            ["DefaultVisibility"] = ((int)cal.DefaultVisibility).ToFirestoreValue(),
            ["Provider"] = ((int)cal.Provider).ToFirestoreValue(),
            ["ExternalCalendarId"] = (cal.ExternalCalendarId ?? "").ToFirestoreValue(),
            ["ExternalReadOnly"] = cal.ExternalReadOnly.ToFirestoreValue(),
            ["CreatedAtUtc"] = cal.CreatedAtUtc.ToFirestoreTimestamp(),
            ["UpdatedAtUtc"] = cal.UpdatedAtUtc.ToFirestoreTimestamp(),
            ["LastMutationId"] = (cal.LastMutationId ?? "").ToFirestoreValue(),
        };

        return new FirestoreDocument { Fields = fields };
    }
}

