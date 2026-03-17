using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Models.Calendar;

namespace Contista.Shared.UI.Utils;

public static class CalendarConflictDetector
{
    public static bool Overlaps(DateTime aStart, DateTime aEnd, DateTime bStart, DateTime bEnd)
        => aStart < bEnd && aEnd > bStart;

    public static List<CalendarEventDto> FindBlockingConflicts(
        CalendarEventDto candidate,
        IEnumerable<CalendarEventDto> all,
        Func<CalendarEventDto, CalendarVisibility> effectiveVisibilityResolver)
    {
        if (candidate is null) return new();
        if (all is null) return new();

        var candStart = DateTimes.ToLocalFromUtc(candidate.StartUtc);
        var candEnd = DateTimes.ToLocalFromUtc(candidate.EndUtc);

        if (candidate.IsAllDay)
        {
            candStart = candStart.Date;
            candEnd = candStart.AddDays(1);
        }

        var result = new List<CalendarEventDto>();

        foreach (var ev in all)
        {
            if (ev is null) continue;
            if (ev.CalendarId != candidate.CalendarId) continue;

            if (!string.IsNullOrWhiteSpace(candidate.EventId)
                && candidate.EventId == ev.EventId)
                continue;

            var eff = effectiveVisibilityResolver(ev);

            var displayAvail =
                CalendarAvailabilityPolicy.GetDisplayAvailability(ev, eff);

            if (!CalendarAvailabilityPolicy.IsBlocking(displayAvail))
                continue;

            var evStart = DateTimes.ToLocalFromUtc(ev.StartUtc);
            var evEnd = DateTimes.ToLocalFromUtc(ev.EndUtc);

            if (ev.IsAllDay)
            {
                evStart = evStart.Date;
                evEnd = evStart.AddDays(1);
            }

            if (Overlaps(candStart, candEnd, evStart, evEnd))
                result.Add(ev);
        }

        return result
            .OrderBy(x => x.StartUtc)
            .ToList();
    }
}