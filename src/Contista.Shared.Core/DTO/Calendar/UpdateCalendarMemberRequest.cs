using Contista.Shared.Core.Models.Calendar;

namespace Contista.Shared.Core.DTO.Calendar;

public sealed class UpdateCalendarMemberRequest
{
    public CalendarMemberRole Role { get; set; } = CalendarMemberRole.Reader;
    public bool CanEdit { get; set; }
    public bool CanShare { get; set; }
    public bool CanSeeDetails { get; set; } = true;
}
