using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO.Calendar;

public sealed class CalendarDeleteRequest
{
    public string SourceCalendarId { get; set; } = "";
    public string Mode { get; set; } = "move"; // move|delete
    public string? TargetCalendarId { get; set; }
}
