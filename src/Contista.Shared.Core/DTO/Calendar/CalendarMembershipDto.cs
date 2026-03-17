using System;
using System.Collections.Generic;
using System.Text;
using Contista.Shared.Core.Models.Calendar;

namespace Contista.Shared.Core.DTO.Calendar;

public class CalendarMembershipDto
{
    public CalendarMemberRole Role { get; set; } = CalendarMemberRole.Reader;

    public bool CanEdit { get; set; }
    public bool CanShare { get; set; }
    public bool CanSeeDetails { get; set; } = true;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public string? LastMutationId { get; set; }

    public CalendarInviteStatus InviteStatus { get; set; } = CalendarInviteStatus.Accepted;
}

