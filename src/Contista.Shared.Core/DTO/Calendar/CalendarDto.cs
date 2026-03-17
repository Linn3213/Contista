using Contista.Shared.Core.Models.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO.Calendar;

public class CalendarDto
{
    public string? CalendarId { get; set; }

    public string Name { get; set; } = "Contista";
    public string? Color { get; set; } = CalendarColors.Primary;
    public bool IsPrimary { get; set; }

    public string OwnerUserId { get; set; } = "";
    public bool IsShared { get; set; }

    public CalendarConflictPolicy ConflictPolicy { get; set; } = CalendarConflictPolicy.Warn;
    public CalendarVisibility DefaultVisibility { get; set; } = CalendarVisibility.Details;

    public CalendarProvider Provider { get; set; } = CalendarProvider.Contista;
    public string? ExternalCalendarId { get; set; }
    public bool ExternalReadOnly { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public string? LastMutationId { get; set; }
}





