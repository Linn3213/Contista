using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Models;
// Typer av synkroniseringsoperationer
public enum SyncOperationType
{
    CreatePost = 1,
    UpdatePost = 2,
    DeletePost = 3,
    UpdateUserProfile = 4,

    CreateRole = 10,
    CreateMembership = 11,

        // Calendar
    CreateCalendar = 300,
    UpdateCalendar = 301,
    DeleteCalendar = 302,
    DeleteCalendarWithMove = 303,

    UpsertCalendarMembership = 310,
    RemoveCalendarMembership = 311,

    UpdateCalendarSettings = 320,

    CreateCalendarEvent = 330,
    UpdateCalendarEvent = 331,
    DeleteCalendarEvent = 332,

    AcknowledgeCalendarConflict = 340,
}
