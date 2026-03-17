using Contista.Shared.Core.DTO.Calendar;

namespace Contista.Shared.Core.Offline.Models.Calendar;

/// <summary>
/// UI-komponerad kalenderdata som hämtas via server-API (inte Firestore direkt från UI).
/// </summary>
public sealed class CalendarUiData
{
    public CalendarSettingsDto? Settings { get; set; }
    public CalendarMyResponse? My { get; set; }

    /// <summary>
    /// Events för aktuell range (månad/vecka/agenda) baserat på valda calendarIds.
    /// </summary>
    public List<CalendarEventDto> Events { get; set; } = new();

    /// <summary>
    /// De calendarIds som UI valt att visa (byggs utifrån Settings + Memberships).
    /// </summary>
    public List<string> ActiveCalendarIds { get; set; } = new();

    public DateTime LastLoadedUtc { get; set; } = DateTime.MinValue;
}
