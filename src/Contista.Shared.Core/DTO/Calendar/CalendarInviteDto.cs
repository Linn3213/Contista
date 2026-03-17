using Contista.Shared.Core.Models.Calendar;

namespace Contista.Shared.Core.DTO.Calendar;

public sealed class CalendarInviteDto
{
    public string CalendarId { get; set; } = "";
    public string CalendarName { get; set; } = "";
    public string Color { get; set; } = "";          // samma format som CalendarDto.Color (t.ex. "Primary"/"Blue"/etc)
    public string OwnerUserId { get; set; } = "";
    public string OwnerDisplayName { get; set; } = "";
    public string OwnerEmail { get; set; } = "";

    // från ref/membership (snabb ACL)
    public CalendarMemberRole Role { get; set; } = CalendarMemberRole.Reader;
    public bool CanEdit { get; set; }
    public bool CanShare { get; set; }
    public bool CanSeeDetails { get; set; } = true;

    public CalendarInviteStatus InviteStatus { get; set; } = CalendarInviteStatus.Pending;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
