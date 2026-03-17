using Contista.Shared.Core.Models.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO.Calendar;

public sealed class CalendarRefDto
{
    // docId i users/{uid}/calendarRefs/{calendarId}
    public string CalendarId { get; set; } = "";

    // “snabb ACL” (kopierat från members)
    public CalendarMemberRole Role { get; set; } = CalendarMemberRole.Reader;
    public bool CanEdit { get; set; }
    public bool CanShare { get; set; }
    public bool CanSeeDetails { get; set; } = true;

    // user-preferenser
    public bool IsSelectedByDefault { get; set; } = true;
    public CalendarViewMode DefaultView { get; set; } = CalendarViewMode.Month;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? LastMutationId { get; set; }
    public CalendarInviteStatus InviteStatus { get; set; } = CalendarInviteStatus.Accepted;
}




