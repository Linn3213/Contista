using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Mappers;

public static class CalendarSettingsMapper
{
    public static FirestoreDocument FromCalendarSettings(CalendarSettingsDto s)
    {
        var now = DateTime.UtcNow;
        s.UpdatedAtUtc = now;

        var fields = new Dictionary<string, FirestoreValue>
        {
            ["UserId"] = (s.UserId ?? "").ToFirestoreValue(),
            ["PrimaryCalendarId"] = (s.PrimaryCalendarId ?? "").ToFirestoreValue(),
            ["DefaultView"] = ((int)s.DefaultView).ToFirestoreValue(),
            ["SelectedCalendarIds"] = (s.SelectedCalendarIds ?? new List<string>()).ToFirestoreArrayValue(),
            ["UpdatedAtUtc"] = now.ToFirestoreTimestamp(),
            ["LastMutationId"] = (s.LastMutationId ?? "").ToFirestoreValue(),
        };

        // DndPeriods: om du vill lagra det direkt här senare kan vi lägga Map/Array,
        // men du har det redan i DTO. För nu kör vi bara det du redan hanterar.
        return new FirestoreDocument { Fields = fields };
    }

    public static CalendarSettingsDto ToCalendarSettings(FirestoreDocument doc, string userId)
    {
        var f = doc.Fields ?? new Dictionary<string, FirestoreValue>();

        return new CalendarSettingsDto
        {
            UserId = string.IsNullOrWhiteSpace(f.GetString("UserId")) ? userId : f.GetString("UserId"),
            PrimaryCalendarId = f.GetString("PrimaryCalendarId"),
            DefaultView = (CalendarViewMode)f.GetInt("DefaultView"),
            SelectedCalendarIds = f.GetStringList("SelectedCalendarIds"),
            UpdatedAtUtc = f.GetDate("UpdatedAtUtc"),
            LastMutationId = f.GetOptionalString("LastMutationId"),
        };
    }
}