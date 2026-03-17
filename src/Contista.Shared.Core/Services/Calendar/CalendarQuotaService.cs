using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models.Calendar;

namespace Contista.Shared.Core.Services.Calendar;

public sealed class CalendarQuotaService : ICalendarQuotaService
{
    private readonly ICalendarRepository _cal;
    private readonly ICalendarRefRepository _calRef;

    public CalendarQuotaService(
        ICalendarRepository cal,
        ICalendarRefRepository calRef)
    {
        _cal = cal;
        _calRef = calRef;
    }

    public async Task<AutoCleanupResult> EnforceQuotaAsync(
        string userId,
        int maxEventQuota,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) return AutoCleanupResult.None();
        if (maxEventQuota <= 0 || maxEventQuota == int.MaxValue) return AutoCleanupResult.None();

        var refs = await _calRef.GetRefsForUserAsync(userId, ct);

        var ownedIds = refs
            .Where(r => r.Role == CalendarMemberRole.Owner)
            .Select(r => r.CalendarId)
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct()
            .ToList();

        if (ownedIds.Count == 0)
            return AutoCleanupResult.Ok(0, maxEventQuota);

        var totalEvents = 0;
        foreach (var calId in ownedIds)
        {
            var events = await _cal.GetAllEventsAsync(calId!, ct);
            totalEvents += events?.Count ?? 0;

            if (totalEvents > maxEventQuota)
                return AutoCleanupResult.OverLimit(totalEvents, maxEventQuota);
        }

        return totalEvents <= maxEventQuota
            ? AutoCleanupResult.Ok(totalEvents, maxEventQuota)
            : AutoCleanupResult.OverLimit(totalEvents, maxEventQuota);
    }
}
