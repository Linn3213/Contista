using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Models.Calendar;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Contista.Shared.Core.Mappers;

public static class CalendarEventMapper
{
    public static CalendarEventDto ToEvent(FirestoreDocument doc, string id, string calendarId)
    {
        var f = doc.Fields ?? new Dictionary<string, FirestoreValue>();

        static string? NormalizeStringOrNull(string? s)
            => string.IsNullOrWhiteSpace(s) ? null : s;

        DateTime? ReadNullableDate(string field)
        {
            if (!f.HasNonNull(field)) return null;
            var dt = f.GetDate(field);
            return dt == default ? null : dt;
        }

        // -------- Recurrence (map) --------
        RecurrenceDto? recurrence = null;
        var recMap = f.GetMap("Recurrence");
        if (recMap is not null && recMap.Count > 0)
        {
            var byWeekDays = (recMap.GetArray("ByWeekDays") ?? new List<FirestoreValue>())
                .Where(v => v is not null && v.NullValue is null)
                .Select(v =>
                {
                    var asInt = 0;

                    if (!string.IsNullOrWhiteSpace(v.IntegerValue) && int.TryParse(v.IntegerValue, out var i))
                        asInt = i;
                    else if (!string.IsNullOrWhiteSpace(v.StringValue) && int.TryParse(v.StringValue, out i))
                        asInt = i;

                    if (asInt < 0) asInt = 0;
                    if (asInt > 6) asInt = 6;

                    return (DayOfWeek)asInt;
                })
                .Distinct()
                .ToList();

            recurrence = new RecurrenceDto
            {
                Frequency = recMap.GetEnum("Frequency", RecurrenceFrequency.Weekly),
                Interval = Math.Max(1, recMap.GetInt("Interval")),
                UntilUtc = recMap.HasNonNull("UntilUtc") ? (DateTime?)recMap.GetDate("UntilUtc") : null,
                Count = recMap.HasNonNull("Count") ? (int?)recMap.GetInt("Count") : null,
                SeriesId = recMap.GetOptionalString("SeriesId"),
                ByWeekDays = byWeekDays
            };

            // extra safety
            if (recurrence.Count is <= 0) recurrence.Count = null;
            if (recurrence.UntilUtc == default) recurrence.UntilUtc = null;
        }

        // -------- Reminders (array of map) --------
        var reminders = new List<ReminderDto>();
        var remArr = f.GetArray("Reminders");
        if (remArr is not null)
        {
            foreach (var item in remArr)
            {
                if (item is null || item.NullValue is not null) continue;

                var m = item.MapValue?.Fields;
                if (m is null) continue;

                reminders.Add(new ReminderDto
                {
                    Channel = m.GetEnum("Channel", ReminderChannel.InApp),
                    MinutesBeforeStart = Math.Max(0, m.GetInt("MinutesBeforeStart"))
                });
            }
        }

        // -------- Checklist (array of map) --------
        var checklist = new List<ChecklistItemDto>();
        var chkArr = f.GetArray("Checklist");
        if (chkArr is not null)
        {
            foreach (var item in chkArr)
            {
                if (item is null || item.NullValue is not null) continue;

                var m = item.MapValue?.Fields;
                if (m is null) continue;

                checklist.Add(new ChecklistItemDto
                {
                    Id = m.GetOptionalString("Id"),
                    Text = m.GetString("Text") ?? "",
                    Done = m.GetBool("Done"),
                    Order = m.GetInt("Order"),
                });
            }
        }

        return new CalendarEventDto
        {
            EventId = id,
            CalendarId = calendarId,

            CreatedById = NormalizeStringOrNull(f.GetString("CreatedById")),
            Type = (CalendarEventType)f.GetInt("Type"),
            Title = f.GetString("Title") ?? "",
            Description = NormalizeStringOrNull(f.GetString("Description")),
            Location = NormalizeStringOrNull(f.GetString("Location")),

            StartUtc = f.GetDate("StartUtc"),
            EndUtc = f.GetDate("EndUtc"),
            IsAllDay = f.GetBool("IsAllDay"),

            Availability = (CalendarAvailability)f.GetInt("Availability"),
            Visibility = (CalendarVisibility)f.GetInt("Visibility"),

            Reminders = reminders,
            Recurrence = recurrence,

            // Exception fields (override/cancel)
            OccurrenceOverrideSeriesId = NormalizeStringOrNull(f.GetString("OccurrenceOverrideSeriesId")),
            OriginalStartUtc = ReadNullableDate("OriginalStartUtc"),
            IsOccurrenceOverride = f.GetBool("IsOccurrenceOverride"),
            IsOccurrenceCancelled = f.GetBool("IsOccurrenceCancelled"),

            IsDone = f.GetBool("IsDone"),
            Checklist = checklist,

            ContentPostId = NormalizeStringOrNull(f.GetString("ContentPostId")),

            HasConflict = f.GetBool("HasConflict"),
            ConflictWithEventIds = f.GetStringList("ConflictWithEventIds"),
            ConflictAcknowledgedByUserIds = f.GetStringList("ConflictAcknowledgedByUserIds"),

            CreatedAtUtc = f.GetDate("CreatedAtUtc"),
            UpdatedAtUtc = f.GetDate("UpdatedAtUtc"),
            LastMutationId = NormalizeStringOrNull(f.GetString("LastMutationId")),
        };
    }

    public static FirestoreDocument FromEvent(CalendarEventDto ev)
    {
        if (ev is null) throw new ArgumentNullException(nameof(ev));

        var fields = new Dictionary<string, FirestoreValue>
        {
            ["Type"] = ((int)ev.Type).ToFirestoreValue(),
            ["Title"] = (ev.Title ?? "").ToFirestoreValue(),

            ["StartUtc"] = ev.StartUtc.ToFirestoreTimestamp(),
            ["EndUtc"] = ev.EndUtc.ToFirestoreTimestamp(),
            ["IsAllDay"] = ev.IsAllDay.ToFirestoreValue(),

            ["Availability"] = ((int)ev.Availability).ToFirestoreValue(),
            ["Visibility"] = ((int)ev.Visibility).ToFirestoreValue(),

            ["IsDone"] = ev.IsDone.ToFirestoreValue(),

            ["HasConflict"] = ev.HasConflict.ToFirestoreValue(),
            ["ConflictWithEventIds"] = (ev.ConflictWithEventIds ?? new List<string>()).ToFirestoreArrayValue(),
            ["ConflictAcknowledgedByUserIds"] = (ev.ConflictAcknowledgedByUserIds ?? new List<string>()).ToFirestoreArrayValue(),

            ["CreatedAtUtc"] = ev.CreatedAtUtc.ToFirestoreTimestamp(),
            ["UpdatedAtUtc"] = ev.UpdatedAtUtc.ToFirestoreTimestamp(),

            // exception metadata
            ["OriginalStartUtc"] = ev.OriginalStartUtc.HasValue ? ev.OriginalStartUtc.Value.ToFirestoreTimestamp() : FirestoreValue.Null,
            ["IsOccurrenceOverride"] = ev.IsOccurrenceOverride.ToFirestoreValue(),
            ["IsOccurrenceCancelled"] = ev.IsOccurrenceCancelled.ToFirestoreValue(),
        };

        // ---- Optional strings -> NullValue when blank ----
        fields["Description"] = !string.IsNullOrWhiteSpace(ev.Description) ? ev.Description.ToFirestoreValue() : FirestoreValue.Null;
        fields["Location"] = !string.IsNullOrWhiteSpace(ev.Location) ? ev.Location.ToFirestoreValue() : FirestoreValue.Null;
        fields["ContentPostId"] = !string.IsNullOrWhiteSpace(ev.ContentPostId) ? ev.ContentPostId.ToFirestoreValue() : FirestoreValue.Null;
        fields["LastMutationId"] = !string.IsNullOrWhiteSpace(ev.LastMutationId) ? ev.LastMutationId.ToFirestoreValue() : FirestoreValue.Null;
        fields["CreatedById"] = !string.IsNullOrWhiteSpace(ev.CreatedById) ? ev.CreatedById.ToFirestoreValue() : FirestoreValue.Null;

        // 🔒 Regel: master använder Recurrence.SeriesId, exceptions använder RecurrenceSeriesId
        if (ev.Recurrence is not null)
        {
            // master
            fields["OccurrenceOverrideSeriesId"] = FirestoreValue.Null;
        }
        else if (ev.IsOccurrenceOverride || ev.IsOccurrenceCancelled)
        {
            // exception måste peka på serien
            if (string.IsNullOrWhiteSpace(ev.OccurrenceOverrideSeriesId))
                throw new InvalidOperationException("OccurrenceOverrideSeriesId krävs för override/cancel.");

            fields["OccurrenceOverrideSeriesId"] = ev.OccurrenceOverrideSeriesId.ToFirestoreValue();
        }
        else
        {
            // vanliga events
            fields["OccurrenceOverrideSeriesId"] = FirestoreValue.Null;
        }

        // ---- Recurrence ----
        if (ev.Recurrence is null)
        {
            fields["Recurrence"] = FirestoreValue.Null;
        }
        else
        {
            // Normalisering (så du aldrig sparar trasiga värden)
            var interval = Math.Max(1, ev.Recurrence.Interval);
            var byDays = (ev.Recurrence.ByWeekDays ?? new())
                .Distinct()
                .Select(d => (int)d)
                .Where(i => i >= 0 && i <= 6)
                .ToList();

            var recFields = new Dictionary<string, FirestoreValue>
            {
                ["Frequency"] = ((int)ev.Recurrence.Frequency).ToFirestoreValue(),
                ["Interval"] = interval.ToFirestoreValue(),

                // SeriesId lever i Recurrence-map för masters
                ["SeriesId"] = !string.IsNullOrWhiteSpace(ev.Recurrence.SeriesId)
                    ? ev.Recurrence.SeriesId!.ToFirestoreValue()
                    : FirestoreValue.Null,

                ["UntilUtc"] = ev.Recurrence.UntilUtc.HasValue
                    ? ev.Recurrence.UntilUtc.Value.ToFirestoreTimestamp()
                    : FirestoreValue.Null,

                ["Count"] = (ev.Recurrence.Count.HasValue && ev.Recurrence.Count.Value > 0)
                    ? ev.Recurrence.Count.Value.ToFirestoreValue()
                    : FirestoreValue.Null,

                // ByWeekDays = array of ints
                ["ByWeekDays"] = byDays.Select(i => i.ToFirestoreValue()).ToFirestoreArrayValue(),
            };

            fields["Recurrence"] = recFields.ToFirestoreMapValueFields();
        }

        // ---- Reminders ----
        if (ev.Reminders is null || ev.Reminders.Count == 0)
        {
            fields["Reminders"] = FirestoreValue.Null;
        }
        else
        {
            var remValues = ev.Reminders.Select(r =>
                new Dictionary<string, FirestoreValue>
                {
                    ["Channel"] = ((int)r.Channel).ToFirestoreValue(),
                    ["MinutesBeforeStart"] = Math.Max(0, r.MinutesBeforeStart).ToFirestoreValue(),
                }.ToFirestoreMapValueFields()
            );

            fields["Reminders"] = remValues.ToFirestoreArrayValue();
        }

        // ---- Checklist ----
        if (ev.Checklist is null || ev.Checklist.Count == 0)
        {
            fields["Checklist"] = FirestoreValue.Null;
        }
        else
        {
            var chkValues = ev.Checklist.Select((c, idx) =>
                new Dictionary<string, FirestoreValue>
                {
                    ["Id"] = !string.IsNullOrWhiteSpace(c.Id) ? c.Id!.ToFirestoreValue() : FirestoreValue.Null,
                    ["Text"] = (c.Text ?? "").ToFirestoreValue(),
                    ["Done"] = c.Done.ToFirestoreValue(),
                    ["Order"] = (c.Order >= 0 ? c.Order : idx).ToFirestoreValue(),
                }.ToFirestoreMapValueFields()
            );

            fields["Checklist"] = chkValues.ToFirestoreArrayValue();
        }

        return new FirestoreDocument { Fields = fields };
    }
}