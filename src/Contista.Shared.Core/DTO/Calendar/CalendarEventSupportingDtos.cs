using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO.Calendar;

public class ChecklistItemDto
{
    public string? Id { get; set; }
    public string Text { get; set; } = "";
    public bool Done { get; set; }
    public int Order { get; set; }
}

public class ReminderDto
{
    public ReminderChannel Channel { get; set; } = ReminderChannel.InApp;
    public int MinutesBeforeStart { get; set; } = 30;
}

public class RecurrenceDto
{
    public RecurrenceFrequency Frequency { get; set; } = RecurrenceFrequency.Weekly;
    public int Interval { get; set; } = 1;

    public List<DayOfWeek> ByWeekDays { get; set; } = new();
    public DateTime? UntilUtc { get; set; }
    public int? Count { get; set; }

    public string? SeriesId { get; set; }
}

public enum ReminderChannel { InApp = 0, Email = 1, Push = 2 }

public enum RecurrenceFrequency { Daily = 0, Weekly = 1, Monthly = 2, Yearly = 3 }