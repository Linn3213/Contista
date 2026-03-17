using System;
using System.Collections.Generic;

namespace Contista.Shared.Core.DTO.Calendar;

/// <summary>
/// Request för /api/calendar/events/range
/// </summary>
public sealed class CalendarEventsRangeRequest
{
    public List<string> CalendarIds { get; set; } = new();
    public DateTime StartUtc { get; set; }
    public DateTime EndUtc { get; set; }
}
