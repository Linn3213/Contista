using Contista.Shared.Core.DTO.Calendar;

namespace Contista.Shared.Core.Offline.Models.Calendar;

public sealed class CalendarStateData
{
    public CalendarSettingsDto? Settings { get; set; }
    public CalendarMyResponse? My { get; set; }

    /// <summary>Vilka calendarIds som just nu är aktiva (valda) i UI.</summary>
    public List<string> ActiveCalendarIds { get; set; } = new();

    /// <summary>Senast laddade events för aktuell vy/range.</summary>
    public List<CalendarEventDto> Events { get; set; } = new();

    public CalendarViewMode View { get; set; }
    public DateTime AnchorLocal { get; set; }

    public DateTime RangeStartUtc { get; set; }
    public DateTime RangeEndUtc { get; set; }
}
