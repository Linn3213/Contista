using Contista.Shared.Core.Models.Calendar;

namespace Contista.Shared.Core.DTO.Calendar;

public sealed class InviteCalendarMemberRequest
{
    public string Email { get; set; } = ""; 
    public CalendarMemberRole Role { get; set; } = CalendarMemberRole.Reader;

    public bool CanEdit { get; set; } = false;
    public bool CanShare { get; set; } = false;
    public bool CanSeeDetails { get; set; } = true;

    // UI-defaults (om du har kvar dessa i CalendarRefDto)
    public bool IsSelectedByDefault { get; set; } = true;
}
