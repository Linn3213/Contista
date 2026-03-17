using Contista.Shared.Core.DTO.Calendar;
using System.Collections.Generic;

namespace Contista.Shared.Core.Interfaces.Calendar;

public interface ICalendarInvitesService
{
    Task<List<CalendarInviteDto>> GetInvitesAsync(CancellationToken ct = default);
    Task AcceptAsync(string calendarId, CancellationToken ct = default);
    Task DeclineAsync(string calendarId, CancellationToken ct = default);
    Task InviteMemberAsync(string calendarId, InviteCalendarMemberRequest req, CancellationToken ct = default);
}
