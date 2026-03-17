using Contista.Shared.Core.DTO.Calendar;

namespace Contista.Shared.Core.Offline.Interfaces;

/// <summary>
/// Hämtar kalenderdata via server-API.
/// Implementation finns i Shared.Client.
/// </summary>
public interface ICalendarDataProvider
{
    Task<CalendarSettingsDto?> GetSettingsAsync(CancellationToken ct = default);
    Task<CalendarMyResponse?> GetMyAsync(CancellationToken ct = default);

    Task<List<CalendarEventDto>> GetEventsRangeAsync(
        CalendarEventsRangeRequest req,
        CancellationToken ct = default);

    Task<List<CalendarMemberRowDto>> GetMembersAsync(
        string calendarId,
        CancellationToken ct = default);

    Task RemoveMemberAsync(
        string calendarId,
        string memberUid,
        CancellationToken ct = default);

    Task UpdateMemberAsync(
        string calendarId,
        string memberUid,
        UpdateCalendarMemberRequest req,
        CancellationToken ct = default);
}
