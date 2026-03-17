using Contista.Shared.Core.DTO.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Calendar;

public interface ICalendarSharingService
{
    Task InviteUserAsync(
        string calendarId,
        string inviterUid,
        string idToken,
        InviteCalendarMemberRequest req,
        CancellationToken ct = default);

    Task UpdateMemberAsync(
        string calendarId,
        string inviterUid,
        string idToken,
        string targetUserId,
        UpdateCalendarMemberRequest req,
        CancellationToken ct = default);

    Task KickMemberAsync(
        string calendarId,
        string inviterUid,
        string idToken,
        string targetUserId,
        CancellationToken ct = default);

    Task AcceptInviteAsync(string calendarId, string inviteeUid, string idToken, CancellationToken ct = default);
    Task DeclineInviteAsync(string calendarId, string inviteeUid, string idToken, CancellationToken ct = default);
}
