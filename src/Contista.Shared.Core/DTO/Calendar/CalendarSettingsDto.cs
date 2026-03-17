using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO.Calendar;

public class CalendarSettingsDto
{
    public string UserId { get; set; } = "";
    public string PrimaryCalendarId { get; set; } = "";
    public CalendarViewMode DefaultView { get; set; } = CalendarViewMode.Month;

    public List<string> SelectedCalendarIds { get; set; } = new();

    public List<DndPeriodDto> DndPeriods { get; set; } = new();

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? LastMutationId { get; set; }
}

public class DndPeriodDto
{
    public string? DndId { get; set; }
    public string Title { get; set; } = "Stör ej";
    public DateTime StartUtc { get; set; }
    public DateTime EndUtc { get; set; }
    public bool IsAllDay { get; set; }

    public bool BlockNotifications { get; set; } = true;
    public bool BlockScheduling { get; set; } = false;
}

public enum CalendarViewMode { Month = 0, Week = 1, Agenda = 2 }