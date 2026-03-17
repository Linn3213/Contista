using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Models.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Mappers;

public static class CalendarRefMapper
{
    public static FirestoreDocument FromCalendarRef(CalendarRefDto r)
    {
        var now = DateTime.UtcNow;
        r.UpdatedAtUtc = now;

        var fields = new Dictionary<string, FirestoreValue>
        {
            ["Role"] = ((int)r.Role).ToFirestoreValue(),
            ["CanEdit"] = r.CanEdit.ToFirestoreValue(),
            ["CanShare"] = r.CanShare.ToFirestoreValue(),
            ["CanSeeDetails"] = r.CanSeeDetails.ToFirestoreValue(),

            ["IsSelectedByDefault"] = r.IsSelectedByDefault.ToFirestoreValue(),
            ["DefaultView"] = ((int)r.DefaultView).ToFirestoreValue(),

            ["UpdatedAtUtc"] = r.UpdatedAtUtc.ToFirestoreTimestamp(),
            ["LastMutationId"] = (r.LastMutationId ?? "").ToFirestoreValue(),
            ["InviteStatus"] = ((int)r.InviteStatus).ToFirestoreValue()
        };

        return new FirestoreDocument { Fields = fields };
    }

    public static CalendarRefDto ToCalendarRef(FirestoreDocument doc, string calendarId)
    {
        var f = doc.Fields ?? new Dictionary<string, FirestoreValue>();

        return new CalendarRefDto
        {
            CalendarId = calendarId,

            Role = (CalendarMemberRole)f.GetInt("Role"),
            CanEdit = f.GetBool("CanEdit"),
            CanShare = f.GetBool("CanShare"),
            CanSeeDetails = f.GetBool("CanSeeDetails"),

            IsSelectedByDefault = f.GetBool("IsSelectedByDefault"),
            DefaultView = (CalendarViewMode)f.GetInt("DefaultView"),

            UpdatedAtUtc = f.GetDate("UpdatedAtUtc"),
            LastMutationId = f.GetOptionalString("LastMutationId"),
            InviteStatus = (CalendarInviteStatus)f.GetInt("InviteStatus")
        };
    }
}