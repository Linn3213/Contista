using Contista.Shared.Core.DTO.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Models.Operations;

// Calendar CRUD
public class CreateCalendarOperationDto
{
    public CalendarDto Calendar { get; set; } = new();
}

public class UpdateCalendarOperationDto
{
    public CalendarDto Calendar { get; set; } = new();
    public DateTime? LastKnownUpdatedAtUtc { get; set; }
}

public class DeleteCalendarOperationDto
{
    public string CalendarId { get; set; } = "";
}

// Membership / sharing
public class UpsertCalendarMembershipOperationDto
{
    public string CalendarId { get; set; } = "";
    public string UserId { get; set; } = "";
    public CalendarMembershipDto Membership { get; set; } = new();
}

public class RemoveCalendarMembershipOperationDto
{
    public string CalendarId { get; set; } = "";
    public string UserId { get; set; } = "";
}

// Settings
public class UpdateCalendarSettingsOperationDto
{
    public CalendarSettingsDto Settings { get; set; } = new();
    public DateTime? LastKnownUpdatedAtUtc { get; set; }
}

// Event CRUD
public class CreateCalendarEventOperationDto
{
    public CalendarEventDto Event { get; set; } = new();
}

public class UpdateCalendarEventOperationDto
{
    public CalendarEventDto Event { get; set; } = new();
    public DateTime? LastKnownUpdatedAtUtc { get; set; }
}

public class DeleteCalendarEventOperationDto
{
    public string CalendarId { get; set; } = "";
    public string EventId { get; set; } = "";
}

// Acknowledge conflicts (when user clicks "save anyway")
public class AcknowledgeCalendarConflictOperationDto
{
    public string CalendarId { get; set; } = "";
    public string EventId { get; set; } = "";
    public List<string> ConflictWithEventIds { get; set; } = new();
    public string AcknowledgedByUserId { get; set; } = "";
}