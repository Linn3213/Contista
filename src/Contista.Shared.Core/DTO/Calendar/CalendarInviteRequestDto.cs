using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO.Calendar;

public sealed class CalendarInviteRequestDto
{
    public string Email { get; set; } = "";
    public bool CanEdit { get; set; }
    public bool CanShare { get; set; }
    public bool CanSeeDetails { get; set; } = true;
}
