using System.Collections.Generic;

namespace Contista.Shared.Core.DTO.Calendar;

public sealed class CalendarMemberRowDto
{
    public string CalendarId { get; set; } = "";
    public string UserId { get; set; } = "";

    // Enriched från userDirectory när tillgängligt (fallback i UI kan fortsatt vara UserId)
    public string DisplayName { get; set; } = "";
    public string Email { get; set; } = "";

    public CalendarMembershipDto Membership { get; set; } = new();
}

/// <summary>
/// Response för /api/calendar/my.
/// Innehåller kalendrar + mina rights (per kalender) + mina refs (UI-state).
/// </summary>
public sealed class CalendarMyResponse
{
    public List<CalendarDto> Calendars { get; set; } = new();
    public List<CalendarRefDto> CalendarRefs { get; set; } = new();

    // en rad per kalender för den inloggade användaren
    public List<CalendarMemberRowDto> MemberRows { get; set; } = new();
}
