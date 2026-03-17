using System;

namespace Contista.Shared.Core.Offline.Models.Calendar;

public sealed class DeleteCalendarWithMoveOperationDto
{
    public string SourceCalendarId { get; set; } = "";

    // "move" | "delete"
    public string Mode { get; set; } = "move";

    // required if Mode == "move"
    public string? TargetCalendarId { get; set; }

    // default true 
    public bool SetHasConflictOnMovedEvents { get; set; } = true;
}
