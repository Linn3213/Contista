using Contista.Shared.Core.DTO.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Calendar;

public interface ICalendarPermissionService
{
    bool IsOwner(string? userId, CalendarDto? cal);

    bool CanDeleteCalendar(string? userId, CalendarDto? cal);
    bool CanMoveEventsOutOfCalendar(string? userId, CalendarDto? cal);

    bool CanRead(CalendarMembershipDto? membership);
    bool CanEditEvents(CalendarMembershipDto? membership);

    // Hjälpmetoder som ofta behövs i UI:
    CalendarRefDto? GetMyRef(CalendarMyResponse? my, string? calendarId);
}