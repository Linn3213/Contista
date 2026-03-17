using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Offline.Models.Calendar;

namespace Contista.Shared.Core.Offline.Interfaces;

public interface ICalendarState
{
    CalendarStateData? Current { get; }
    bool IsLoading { get; }
    string? LastError { get; }

    event Action? Changed;

    Task RefreshAsync(
        string userId,
        CalendarViewMode view,
        DateTime anchorLocal,
        bool force,
        List<string>? activeCalendarIdsOverride = null,
        CancellationToken ct = default);

    Task OptimisticAddEventAsync(CalendarEventDto ev, CancellationToken ct = default);
    Task OptimisticUpdateEventAsync(CalendarEventDto ev, CancellationToken ct = default);
    Task OptimisticDeleteEventAsync(string eventId, CancellationToken ct = default);
    CalendarEventDto CloneForEdit(CalendarEventDto ev);
    CalendarEventDto? FindMasterBySeriesId(string seriesId);
    void HideCalendar(string calendarId);
}
