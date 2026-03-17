using Contista.Shared.Core.Models.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO.Calendar;

public class CalendarEventDto
{
    public string? EventId { get; set; }
    public string CalendarId { get; set; } = "";
    public string? CreatedById { get; set; }

    public CalendarEventType Type { get; set; } = CalendarEventType.Event;
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string? Location { get; set; }

    public DateTime StartUtc { get; set; }
    public DateTime EndUtc { get; set; }
    public bool IsAllDay { get; set; }

    public CalendarAvailability Availability { get; set; } = CalendarAvailability.Busy;
    public CalendarVisibility Visibility { get; set; } = CalendarVisibility.Details;

    public List<ReminderDto> Reminders { get; set; } = new();
    public RecurrenceDto? Recurrence { get; set; }
    public string? OccurrenceOverrideSeriesId { get; set; }              // pekar på recurrence-serien (master.EventId)
    public DateTime? OriginalStartUtc { get; set; }    // vilken instans (starttid) override/cancel gäller
    public bool IsOccurrenceOverride { get; set; }     // true = “ersätter” master-instansen
    public bool IsOccurrenceCancelled { get; set; }    // true = “tar bort” master-instansen

    public bool IsDone { get; set; }
    public List<ChecklistItemDto> Checklist { get; set; } = new();

    public string? ContentPostId { get; set; }

    public bool HasConflict { get; set; }
    public List<string> ConflictWithEventIds { get; set; } = new();
    public List<string> ConflictAcknowledgedByUserIds { get; set; } = new();

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public string? LastMutationId { get; set; }

    
}



