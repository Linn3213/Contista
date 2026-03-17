using Contista.Shared.Core.DTO.Calendar;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Globalization;
using System.Text;

namespace Contista.Shared.Core.Logic.Calendar;

public static class RecurrenceExpander
{
    private static readonly TimeZoneInfo AppTz = ResolveAppTimeZone();

    private static TimeZoneInfo ResolveAppTimeZone()
    {
        // WASM + vissa miljöer kan sakna IANA-zoner och bara ha Local.
        // Windows använder ofta "W. Europe Standard Time".
        try { return TimeZoneInfo.FindSystemTimeZoneById("Europe/Stockholm"); }
        catch { /* ignore */ }

        try { return TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time"); }
        catch { /* ignore */ }

        // Sista fallback: använd maskinens/local timezone (i din miljö är den sannolikt Sverige)
        return TimeZoneInfo.Local;
    }
    public static List<CalendarEventDto> ExpandInRange(
    IEnumerable<CalendarEventDto> allEvents,
    DateTime rangeStartUtc,
    DateTime rangeEndUtc)
    {
        if (allEvents is null) return new List<CalendarEventDto>();

        rangeStartUtc = DateTime.SpecifyKind(rangeStartUtc, DateTimeKind.Utc);
        rangeEndUtc = DateTime.SpecifyKind(rangeEndUtc, DateTimeKind.Utc);

        if (rangeEndUtc <= rangeStartUtc)
            return new List<CalendarEventDto>();

        // 1) Split: masters / exceptions / singles
        var masters = new List<CalendarEventDto>();
        var exceptions = new List<CalendarEventDto>();
        var singles = new List<CalendarEventDto>();

        foreach (var e in allEvents)
        {
            if (e is null) continue;

            if (!string.IsNullOrWhiteSpace(e.OccurrenceOverrideSeriesId))
                exceptions.Add(e);
            else if (e.Recurrence is not null)
                masters.Add(e);
            else
                singles.Add(e);
        }

        // 2) Index exceptions by (seriesId, originalStartUtcTicks)
        var exByKey = new Dictionary<string, CalendarEventDto>(StringComparer.Ordinal);

        // overrides that overlap range *by their new time* (even if original occurrence outside range)
        var overrideExtras = new List<CalendarEventDto>();

        foreach (var ex in exceptions)
        {
            if (string.IsNullOrWhiteSpace(ex.OccurrenceOverrideSeriesId)) continue;
            if (ex.OriginalStartUtc is null) continue;

            var key = MakeKey(ex.OccurrenceOverrideSeriesId!, ex.OriginalStartUtc.Value);
            exByKey[key] = ex;

            if (ex.IsOccurrenceOverride && Overlaps(ex.StartUtc, ex.EndUtc, rangeStartUtc, rangeEndUtc))
                overrideExtras.Add(ex);
        }

        // 3) Collect results without duplicates
        // - singles: by eventId
        // - occurrences: by (seriesId|originalStartTicks)
        var results = new Dictionary<string, CalendarEventDto>(StringComparer.Ordinal);

        // 3a) Singles overlapping range
        foreach (var s in singles)
        {
            if (!Overlaps(s.StartUtc, s.EndUtc, rangeStartUtc, rangeEndUtc))
                continue;

            var key = "single:" + (s.EventId ?? Guid.NewGuid().ToString("N"));
            results[key] = s;
        }

        // 3b) Masters -> expand with exceptions
        foreach (var master in masters)
        {
            var message = $"MASTER {master.Title} start={master.StartUtc:o} until={(master.Recurrence?.UntilUtc.HasValue == true ? master.Recurrence.UntilUtc.Value.ToString("o") : "null")} count={master.Recurrence?.Count?.ToString() ?? "null"}";
            Console.WriteLine(message);
            if (!CouldProduceOccurrenceInRange(master, rangeStartUtc, rangeEndUtc))
                continue;

            var r = master.Recurrence!;
            var seriesId =
                !string.IsNullOrWhiteSpace(r.SeriesId) ? r.SeriesId! :
                !string.IsNullOrWhiteSpace(master.EventId) ? master.EventId! :
                "series";

            foreach (var occ in ExpandMasterWithExceptions(master, rangeStartUtc, rangeEndUtc, exByKey))
            {
                // Nyckeln ska baseras på original-starten i serien.
                // - För override/cancel: OccurrenceOverrideSeriesId + OriginalStartUtc
                // - För synthetic: vi sätter samma fält i CloneForOccurrence (OccurrenceOverrideSeriesId + OriginalStartUtc)
                if (string.IsNullOrWhiteSpace(occ.OccurrenceOverrideSeriesId) || occ.OriginalStartUtc is null)
                {
                    // fallback: defensivt, men bör inte hända för occurrences
                    var fallbackKey = "single:" + (occ.EventId ?? Guid.NewGuid().ToString("N"));
                    results[fallbackKey] = occ;
                    continue;
                }

                var k = MakeKey(occ.OccurrenceOverrideSeriesId!, occ.OriginalStartUtc.Value);
                var resKey = "occ:" + k;

                if (Overlaps(occ.StartUtc, occ.EndUtc, rangeStartUtc, rangeEndUtc) && !occ.IsOccurrenceCancelled)
                    results[resKey] = occ;
            }
        }

        // 3c) Add overrides moved-into-range (original outside)
        foreach (var ex in overrideExtras)
        {
            if (string.IsNullOrWhiteSpace(ex.OccurrenceOverrideSeriesId)) continue;
            if (ex.OriginalStartUtc is null) continue;
            if (ex.IsOccurrenceCancelled) continue;

            var k = MakeKey(ex.OccurrenceOverrideSeriesId!, ex.OriginalStartUtc.Value);
            var resKey = "occ:" + k;

            if (Overlaps(ex.StartUtc, ex.EndUtc, rangeStartUtc, rangeEndUtc))
                results[resKey] = ex;
        }
        var eventCount = results.Count();

        return results.Values
            .OrderBy(x => x.StartUtc)
            .ThenBy(x => x.EndUtc)
            .ToList();

        // -------- local helpers --------
        static string MakeKey(string seriesId, DateTime originalStartUtc)
        {
            originalStartUtc = DateTime.SpecifyKind(originalStartUtc, DateTimeKind.Utc);
            return seriesId + "|" + originalStartUtc.Ticks.ToString(CultureInfo.InvariantCulture);
        }

        static bool Overlaps(DateTime aStart, DateTime aEnd, DateTime bStart, DateTime bEnd)
            => aStart < bEnd && aEnd > bStart;
    }

    // Represent one generated occurrence window
    private readonly record struct OccWindow(DateTime StartUtc, DateTime EndUtc);

    private static IEnumerable<OccWindow> EnumerateOccurrenceWindows(
    CalendarEventDto master,
    DateTime rangeStartUtc,
    DateTime rangeEndUtc)
    {
        if (master.Recurrence is null)
            yield break;

        var r = master.Recurrence;
        var interval = Math.Max(1, r.Interval);

        rangeStartUtc = DateTime.SpecifyKind(rangeStartUtc, DateTimeKind.Utc);
        rangeEndUtc = DateTime.SpecifyKind(rangeEndUtc, DateTimeKind.Utc);

        // Duration per occurrence
        var duration = master.EndUtc - master.StartUtc;
        if (duration <= TimeSpan.Zero)
            duration = TimeSpan.FromMinutes(30);

        // Weekly: default day om tomt
        var byWeekDays = (r.ByWeekDays ?? new List<DayOfWeek>())
            .Distinct()
            .ToList();

        if (r.Frequency == RecurrenceFrequency.Weekly && byWeekDays.Count == 0)
            byWeekDays.Add(master.StartUtc.DayOfWeek);

        var produced = 0;
        var maxSafety = 5000;

        foreach (var occStartUtc in EnumerateOccurrenceStarts(
            master.StartUtc,
            r.Frequency,
            interval,
            byWeekDays,
            rangeStartUtc,
            rangeEndUtc,
            r.UntilUtc))
        {
            if (--maxSafety <= 0)
                yield break;

            // Count stop
            if (r.Count.HasValue && produced >= r.Count.Value)
                yield break;

            produced++;

            var startUtc = DateTime.SpecifyKind(occStartUtc, DateTimeKind.Utc);
            var endUtc = startUtc + duration;

            if (!Overlaps(startUtc, endUtc, rangeStartUtc, rangeEndUtc))
                continue;

            yield return new OccWindow(startUtc, endUtc);
        }
    }

    private static IEnumerable<CalendarEventDto> ExpandMasterWithExceptions(
        CalendarEventDto master,
        DateTime rangeStartUtc,
        DateTime rangeEndUtc,
        Dictionary<string, CalendarEventDto> exceptionByKey)
    {
        var r = master.Recurrence!;
        var interval = Math.Max(1, r.Interval);

        var seriesId = !string.IsNullOrWhiteSpace(r.SeriesId)
            ? r.SeriesId
            : (!string.IsNullOrWhiteSpace(master.EventId) ? master.EventId : "series");

        DateTime? untilUtc = r.UntilUtc;
        int? count = r.Count;

        var duration = master.EndUtc - master.StartUtc;
        if (duration <= TimeSpan.Zero)
            duration = TimeSpan.FromMinutes(30);

        var byWeekDays = (r.ByWeekDays ?? new List<DayOfWeek>()).Distinct().ToList();
        if (r.Frequency == RecurrenceFrequency.Weekly && byWeekDays.Count == 0)
            byWeekDays.Add(master.StartUtc.DayOfWeek);

        var produced = 0;
        var maxSafety = 5000;

        string Key(DateTime originalStartUtc) => $"{seriesId}|{originalStartUtc.ToUniversalTime().Ticks}";

        foreach (var occStartUtc in EnumerateOccurrenceStarts(master.StartUtc, r.Frequency, interval, byWeekDays, rangeStartUtc, rangeEndUtc, untilUtc))
        {
            if (--maxSafety <= 0) yield break;
            if (count.HasValue && produced >= count.Value) yield break;

            var occEndUtc = occStartUtc + duration;

            // Finns exception för denna instans?
            if (exceptionByKey.TryGetValue(Key(occStartUtc), out var ex))
            {
                // Cancel: visa inte instansen alls
                if (ex.IsOccurrenceCancelled)
                {
                    produced++;
                    continue;
                }

                // Override: visa override-eventet (och filtrera på override tider)
                if (ex.IsOccurrenceOverride)
                {
                    if (Overlaps(ex.StartUtc, ex.EndUtc, rangeStartUtc, rangeEndUtc))
                        yield return ex;

                    produced++;
                    continue;
                }
            }

            // Vanlig instans
            if (!Overlaps(occStartUtc, occEndUtc, rangeStartUtc, rangeEndUtc))
                continue;

            produced++;

            yield return CloneForOccurrence(master, seriesId, occStartUtc, occEndUtc);
        }
    }

    private static DateTime? NormalizeUntil(DateTime? untilUtc)
    {
        if (!untilUtc.HasValue) return null;

        var u = untilUtc.Value;
        // Skydda mot Firestore-null som råkar bli default(DateTime)
        if (u == default || u.Year < 1900) return null;

        return DateTime.SpecifyKind(u, DateTimeKind.Utc);
    }

    public static bool CouldProduceOccurrenceInRange(CalendarEventDto master, DateTime rangeStartUtc, DateTime rangeEndUtc)
    {
        if (master.Recurrence is null)
            return Overlaps(master.StartUtc, master.EndUtc, rangeStartUtc, rangeEndUtc);

        var until = NormalizeUntil(master.Recurrence.UntilUtc);

        if (until.HasValue && until.Value < rangeStartUtc)
            return false;

        if (master.StartUtc >= rangeEndUtc)
            return false;

        return true;
    }

    private static IEnumerable<CalendarEventDto> ExpandMaster(CalendarEventDto master, DateTime rangeStartUtc, DateTime rangeEndUtc)
    {
        var r = master.Recurrence!;
        var interval = Math.Max(1, r.Interval);

        var seriesId = !string.IsNullOrWhiteSpace(r.SeriesId)
            ? r.SeriesId
            : (!string.IsNullOrWhiteSpace(master.EventId) ? master.EventId : "series");

        // End condition
        DateTime? untilUtc = r.UntilUtc; // null => "none"
        int? count = r.Count;            // null => "none"

        // Duration per instance (behåll all-day duration också)
        var duration = master.EndUtc - master.StartUtc;
        if (duration <= TimeSpan.Zero)
            duration = TimeSpan.FromMinutes(30);

        // Default weekly days om tomt
        var byWeekDays = (r.ByWeekDays ?? new List<DayOfWeek>()).Distinct().ToList();
        if (r.Frequency == RecurrenceFrequency.Weekly && byWeekDays.Count == 0)
            byWeekDays.Add(master.StartUtc.DayOfWeek);

        // Räknare för Count
        var produced = 0;

        // Vi itererar occurrences och stoppar när vi passerat rangeEnd eller hit conditions.
        // För säkerhets skull: skydda mot oändliga loopar om något blir fel.
        var maxSafety = 5000;

        foreach (var occStartUtc in EnumerateOccurrenceStarts(master.StartUtc, r.Frequency, interval, byWeekDays, rangeStartUtc, rangeEndUtc, untilUtc))
        {
            if (--maxSafety <= 0) yield break;

            if (count.HasValue && produced >= count.Value)
                yield break;

            var occEndUtc = occStartUtc + duration;

            // För all-day: om du vill att slut ska vara "exclusive date" i UI kan du justera, men här behåller vi duration.
            if (!Overlaps(occStartUtc, occEndUtc, rangeStartUtc, rangeEndUtc))
                continue;

            // Skapa ett "syntetiskt" event för UI
            var occ = CloneForOccurrence(master, seriesId, occStartUtc, occEndUtc);
            produced++;

            yield return occ;
        }
    }

    private static IEnumerable<DateTime> EnumerateOccurrenceStarts(
    DateTime masterStartUtc,
    RecurrenceFrequency freq,
    int interval,
    List<DayOfWeek> byWeekDays,
    DateTime rangeStartUtc,
    DateTime rangeEndUtc,
    DateTime? untilUtc)
    {
        // Normalisera Until så att 0001-01-01 blir null (som du redan gör)
        var until = NormalizeUntil(untilUtc);

        switch (freq)
        {
            case RecurrenceFrequency.Daily:
                {
                    var start = SeekDaily(masterStartUtc, interval, rangeStartUtc);
                    for (var d = start; d < rangeEndUtc; d = d.AddDays(interval))
                    {
                        if (until.HasValue && d > until.Value) yield break;
                        yield return d;
                    }
                    yield break;
                }

            case RecurrenceFrequency.Weekly:
                {
                    // ✅ DST-säker Weekly:
                    // Skapa occurrences i lokal "wall clock" (Europe/Stockholm),
                    // konvertera till UTC, och behåll dina valideringar.

                    var masterStartLocal = TimeZoneInfo.ConvertTimeFromUtc(masterStartUtc, AppTz);

                    var rangeStartLocal = TimeZoneInfo.ConvertTimeFromUtc(rangeStartUtc, AppTz);
                    var rangeEndLocal = TimeZoneInfo.ConvertTimeFromUtc(rangeEndUtc, AppTz);

                    var startWeekLocal = StartOfWeekLocal(masterStartLocal.Date, DayOfWeek.Monday);
                    var rangeWeekLocal = StartOfWeekLocal(rangeStartLocal.Date, DayOfWeek.Monday);

                    var weeksBetween = (int)Math.Floor((rangeWeekLocal - startWeekLocal).TotalDays / 7.0);
                    if (weeksBetween < 0) weeksBetween = 0;

                    var aligned = weeksBetween - (weeksBetween % interval);
                    var weekCursorLocal = startWeekLocal.AddDays(aligned * 7);

                    // samma overlap-säkerhet som innan
                    weekCursorLocal = weekCursorLocal.AddDays(-7 * interval);

                    for (; weekCursorLocal < rangeEndLocal; weekCursorLocal = weekCursorLocal.AddDays(7 * interval))
                    {
                        foreach (var dow in byWeekDays.OrderBy(d => d == DayOfWeek.Sunday ? 7 : (int)d))
                        {
                            var dayLocal = weekCursorLocal.AddDays(DowOffsetFromMonday(dow));

                            // behåll masterns lokala klockslag (12:00 ska vara 12:00 även över DST)
                            var occLocalUnspecified = new DateTime(
                                dayLocal.Year, dayLocal.Month, dayLocal.Day,
                                masterStartLocal.Hour, masterStartLocal.Minute, masterStartLocal.Second,
                                DateTimeKind.Unspecified);

                            // konvertera till UTC med AppTz
                            var occUtc = TimeZoneInfo.ConvertTimeToUtc(occLocalUnspecified, AppTz);
                            occUtc = DateTime.SpecifyKind(occUtc, DateTimeKind.Utc);

                            // ----- behåll dina valideringar (i UTC, precis som innan) -----

                            // occurrences får inte vara före master-start
                            if (occUtc < masterStartUtc) continue;

                            // stoppa på rangeEnd
                            if (occUtc >= rangeEndUtc) continue;

                            // stoppa på until (om satt)
                            if (until.HasValue && occUtc > until.Value) yield break;

                            yield return occUtc;
                        }
                    }

                    yield break;

                    static DateTime StartOfWeekLocal(DateTime dateLocal, DayOfWeek startDay)
                    {
                        var diff = (7 + (dateLocal.DayOfWeek - startDay)) % 7;
                        return dateLocal.AddDays(-diff).Date;
                    }
                }

            case RecurrenceFrequency.Monthly:
                {
                    var cursor = SeekMonthly(masterStartUtc, interval, rangeStartUtc);

                    for (var dt = cursor; dt < rangeEndUtc; dt = dt.AddMonths(interval))
                    {
                        if (until.HasValue && dt > until.Value) yield break;
                        yield return dt;
                    }
                    yield break;
                }

            case RecurrenceFrequency.Yearly:
                {
                    var cursor = SeekYearly(masterStartUtc, interval, rangeStartUtc);
                    for (var dt = cursor; dt < rangeEndUtc; dt = dt.AddYears(interval))
                    {
                        if (until.HasValue && dt > until.Value) yield break;
                        yield return dt;
                    }
                    yield break;
                }

            default:
                yield break;
        }
    }

    private static DateTime SeekDaily(DateTime masterStartUtc, int intervalDays, DateTime rangeStartUtc)
    {
        if (rangeStartUtc <= masterStartUtc) return masterStartUtc;

        var days = (rangeStartUtc - masterStartUtc).TotalDays;
        var k = (int)Math.Floor(days / intervalDays);
        var candidate = masterStartUtc.AddDays(k * intervalDays);

        // Backa en period för overlap-säkerhet
        candidate = candidate.AddDays(-intervalDays);
        if (candidate < masterStartUtc) candidate = masterStartUtc;

        return candidate;
    }

    private static DateTime SeekMonthly(DateTime masterStartUtc, int intervalMonths, DateTime rangeStartUtc)
    {
        if (rangeStartUtc <= masterStartUtc) return masterStartUtc;

        var monthsBetween = ((rangeStartUtc.Year - masterStartUtc.Year) * 12) + (rangeStartUtc.Month - masterStartUtc.Month);
        if (monthsBetween < 0) monthsBetween = 0;

        var aligned = monthsBetween - (monthsBetween % intervalMonths);
        var candidateMonth = masterStartUtc.AddMonths(aligned);

        // backa 1 intervall för overlap
        candidateMonth = candidateMonth.AddMonths(-intervalMonths);
        if (candidateMonth < masterStartUtc) candidateMonth = masterStartUtc;

        return ClampDayOfMonth(candidateMonth, masterStartUtc.Day, masterStartUtc);
    }

    private static DateTime SeekYearly(DateTime masterStartUtc, int intervalYears, DateTime rangeStartUtc)
    {
        if (rangeStartUtc <= masterStartUtc) return masterStartUtc;

        var yearsBetween = rangeStartUtc.Year - masterStartUtc.Year;
        if (yearsBetween < 0) yearsBetween = 0;

        var aligned = yearsBetween - (yearsBetween % intervalYears);
        var candidate = masterStartUtc.AddYears(aligned);

        candidate = candidate.AddYears(-intervalYears);
        if (candidate < masterStartUtc) candidate = masterStartUtc;

        return candidate;
    }

    private static DateTime ClampDayOfMonth(DateTime anyDateSameTimeUtc, int desiredDay, DateTime timeSourceUtc)
    {
        var daysInMonth = DateTime.DaysInMonth(anyDateSameTimeUtc.Year, anyDateSameTimeUtc.Month);
        var day = Math.Min(desiredDay, daysInMonth);

        return new DateTime(
            anyDateSameTimeUtc.Year, anyDateSameTimeUtc.Month, day,
            timeSourceUtc.Hour, timeSourceUtc.Minute, timeSourceUtc.Second,
            DateTimeKind.Utc);
    }

    private static DateTime StartOfWeekUtc(DateTime dtUtc, DayOfWeek weekStartsOn)
    {
        // dtUtc antas UTC
        var diff = (7 + (dtUtc.DayOfWeek - weekStartsOn)) % 7;
        var d = dtUtc.Date.AddDays(-diff);
        return new DateTime(d.Year, d.Month, d.Day, 0, 0, 0, DateTimeKind.Utc);
    }

    private static int DowOffsetFromMonday(DayOfWeek dow)
        => dow switch
        {
            DayOfWeek.Monday => 0,
            DayOfWeek.Tuesday => 1,
            DayOfWeek.Wednesday => 2,
            DayOfWeek.Thursday => 3,
            DayOfWeek.Friday => 4,
            DayOfWeek.Saturday => 5,
            DayOfWeek.Sunday => 6,
            _ => 0
        };

    private static bool Overlaps(DateTime aStart, DateTime aEnd, DateTime bStart, DateTime bEnd)
        => aStart < bEnd && aEnd > bStart;

    private static CalendarEventDto CloneForOccurrence(CalendarEventDto master, DateTime startUtc, DateTime endUtc)
    {
        var seriesId =
            master.Recurrence?.SeriesId
            ?? master.EventId
            ?? "series";

        return CloneForOccurrence(master, seriesId, startUtc, endUtc);
    }

    private static CalendarEventDto CloneForOccurrence(
    CalendarEventDto master,
    string seriesId,
    DateTime startUtc,
    DateTime endUtc)
    {
        startUtc = DateTime.SpecifyKind(startUtc, DateTimeKind.Utc);
        endUtc = DateTime.SpecifyKind(endUtc, DateTimeKind.Utc);

        // Stabilt UI-id (bara för render/dedup). Ska inte användas som Firestore-id.
        var occId = $"{seriesId}:{startUtc.ToString("yyyyMMddTHHmmssZ", CultureInfo.InvariantCulture)}";

        return new CalendarEventDto
        {
            // Identitet (UI)
            EventId = occId,
            CalendarId = master.CalendarId,
            CreatedById = master.CreatedById,

            // Occurrence metadata (nyckeln för exceptions)
            OccurrenceOverrideSeriesId = seriesId,
            OriginalStartUtc = startUtc,
            IsOccurrenceOverride = false,
            IsOccurrenceCancelled = false,

            // Basfält
            Type = master.Type,
            Title = master.Title,
            Description = master.Description,
            Location = master.Location,

            // Tid
            StartUtc = startUtc,
            EndUtc = endUtc,
            IsAllDay = master.IsAllDay,

            Availability = master.Availability,
            Visibility = master.Visibility,

            // 🔥 Viktigt: syntetiska occurrences ska INTE bära recurrence-regeln
            Recurrence = master.Recurrence is null ? null : new RecurrenceDto
            {
                Frequency = master.Recurrence.Frequency,
                Interval = master.Recurrence.Interval,
                ByWeekDays = master.Recurrence.ByWeekDays?.ToList() ?? new(),
                UntilUtc = master.Recurrence.UntilUtc,
                Count = master.Recurrence.Count,

                // viktigt: på occurrences vill vi ha seriesId som faktiskt används i expander
                SeriesId = seriesId
            },

            Reminders = master.Reminders?.Select(x => new ReminderDto
            {
                Channel = x.Channel,
                MinutesBeforeStart = x.MinutesBeforeStart
            }).ToList(),

            Checklist = master.Checklist?.Select(c => new ChecklistItemDto
            {
                Id = c.Id,
                Text = c.Text,
                Done = c.Done,
                Order = c.Order
            }).ToList(),

            ContentPostId = master.ContentPostId,
            IsDone = master.IsDone,

            HasConflict = master.HasConflict,
            ConflictWithEventIds = master.ConflictWithEventIds?.ToList() ?? new(),
            ConflictAcknowledgedByUserIds = master.ConflictAcknowledgedByUserIds?.ToList() ?? new(),

            CreatedAtUtc = master.CreatedAtUtc,
            UpdatedAtUtc = master.UpdatedAtUtc,
            LastMutationId = master.LastMutationId
        };
    }
}
