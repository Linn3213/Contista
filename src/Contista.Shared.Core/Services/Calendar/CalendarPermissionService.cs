using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Models.Calendar;
using Contista.Shared.Core.Offline.Interfaces;

namespace Contista.Shared.Core.Services.Calendar;

public sealed class CalendarPermissionService : ICalendarPermissionService
{
    public bool IsOwner(string? userId, CalendarDto? cal)
        => !string.IsNullOrWhiteSpace(userId)
           && cal is not null
           && string.Equals(cal.OwnerUserId, userId, StringComparison.Ordinal);

    public bool CanDeleteCalendar(string? userId, CalendarDto? cal)
        => IsOwner(userId, cal) && cal is not null && !cal.IsPrimary;

    public bool CanMoveEventsOutOfCalendar(string? userId, CalendarDto? cal)
        => IsOwner(userId, cal) && cal is not null && !cal.IsPrimary;

    public bool CanEditEvents(CalendarMembershipDto? membership)
        => membership?.Role == CalendarMemberRole.Owner
           || membership?.Role == CalendarMemberRole.Editor;

    public bool CanRead(CalendarMembershipDto? membership)
        => membership is not null;

    public CalendarRefDto? GetMyRef(CalendarMyResponse? my, string? calendarId)
    {
        if (my?.CalendarRefs is null || string.IsNullOrWhiteSpace(calendarId))
            return null;

        return my.CalendarRefs.FirstOrDefault(r =>
            string.Equals(r.CalendarId, calendarId, StringComparison.Ordinal));
    }
}
