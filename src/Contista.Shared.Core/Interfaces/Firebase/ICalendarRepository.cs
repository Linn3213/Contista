using Contista.Shared.Core.DTO.Calendar;

namespace Contista.Shared.Core.Interfaces.Firebase;

public interface ICalendarRepository
{
    // ---- Calendars ----
    Task<string?> CreateCalendarAsync(CalendarDto calendar, CancellationToken ct = default);
    Task<string?> CreateCalendarWithTokenAsync(CalendarDto calendar, string idToken, CancellationToken ct = default);

    Task<bool> UpdateCalendarAsync(CalendarDto calendar, CancellationToken ct = default);
    Task<bool> UpdateCalendarWithTokenAsync(CalendarDto calendar, string idToken, CancellationToken ct = default);

    Task<bool> DeleteCalendarAsync(string calendarId, CancellationToken ct = default);
    Task<bool> DeleteCalendarWithTokenAsync(string calendarId, string idToken, CancellationToken ct = default);

    Task<CalendarDto?> GetCalendarByIdAsync(string calendarId, CancellationToken ct = default);
    Task<CalendarDto?> GetCalendarByIdWithTokenAsync(string calendarId, string idToken, CancellationToken ct = default);
    Task<List<CalendarDto>> GetCalendarsByOwnerAsync(string ownerUserId, CancellationToken ct = default);


    // ---- Events ----
    Task<string?> CreateEventAsync(CalendarEventDto ev, CancellationToken ct = default);
    Task<string?> CreateEventWithTokenAsync(CalendarEventDto ev, string idToken, CancellationToken ct = default);

    Task<bool> UpdateEventAsync(CalendarEventDto ev, CancellationToken ct = default);
    Task<bool> UpdateEventWithTokenAsync(CalendarEventDto ev, string idToken, CancellationToken ct = default);

    Task<bool> DeleteEventAsync(string calendarId, string eventId, CancellationToken ct = default);
    Task<bool> DeleteEventWithTokenAsync(string calendarId, string eventId, string idToken, CancellationToken ct = default);

    Task<List<CalendarEventDto>> GetEventsInRangeAsync(string calendarId, DateTime startUtc, DateTime endUtc, CancellationToken ct = default);
    Task<List<CalendarEventDto>> GetEventsInRangeWithTokenAsync(string calendarId, DateTime startUtc, DateTime endUtc, string idToken, CancellationToken ct = default);
    Task<List<CalendarEventDto>> GetAllEventsAsync(string calendarId, CancellationToken ct = default);
    Task<bool> UpsertEventWithIdAsync(string calendarId, string eventId, CalendarEventDto ev, CancellationToken ct = default);

    
}
