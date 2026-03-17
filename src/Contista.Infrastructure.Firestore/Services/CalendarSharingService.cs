using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Exceptions.Calendar;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models.Calendar;

namespace Contista.Infrastructure.Firestore.Services;



public sealed class CalendarSharingService : ICalendarSharingService
{
    private readonly ICalendarRepository _cal;
    private readonly ICalendarMembershipRepository _members;
    private readonly ICalendarRefRepository _refs;
    private readonly IUserRepository _users;
    private readonly IUserDirectoryRepository _dir;

    public CalendarSharingService(
        ICalendarRepository cal,
        ICalendarMembershipRepository members,
        ICalendarRefRepository refs,
        IUserRepository users,
        IUserDirectoryRepository dir)
    {
        _cal = cal;
        _members = members;
        _refs = refs;
        _users = users;
        _dir = dir;
    }

    public async Task InviteUserAsync(
    string calendarId,
    string inviterUid,
    string idToken,
    InviteCalendarMemberRequest req,
    CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(inviterUid))
            throw new InvalidOperationException("inviterUid saknas.");
        if (string.IsNullOrWhiteSpace(idToken))
            throw new InvalidOperationException("idToken saknas.");
        if (req is null)
            throw new ArgumentNullException(nameof(req));
        if (string.IsNullOrWhiteSpace(req.Email))
            throw new InvalidOperationException("Invite: Email saknas.");

        var email = req.Email.Trim();

        // 0) Lookup uid via directory
        var entry = await _dir.GetByEmailAsync(email, idToken, ct);
        if (entry is null || string.IsNullOrWhiteSpace(entry.UserId))
            throw new CalendarInviteException(CalendarInviteErrorCodes.UserNotFound, "Mottagaren måste redan ha ett konto (ingen användare hittades på e-post).");

        var targetUid = entry.UserId.Trim();

        if (string.Equals(targetUid, inviterUid, StringComparison.Ordinal))
            throw new CalendarInviteException(CalendarInviteErrorCodes.SelfInvite, "Du kan inte bjuda in dig själv.");

        // 1) Server-check: finns kalendern + kan inviter share?
        var cal = await _cal.GetCalendarByIdWithTokenAsync(calendarId, idToken, ct);
        if (cal is null || string.IsNullOrWhiteSpace(cal.CalendarId))
            throw new InvalidOperationException("Kalendern finns inte.");

        var isOwner = string.Equals(cal.OwnerUserId, inviterUid, StringComparison.Ordinal);
        var inviterMember = await _members.GetMemberAsync(calendarId, inviterUid, ct);
        var canShare = isOwner || (inviterMember is not null && inviterMember.CanShare);

        if (!canShare)
            throw new UnauthorizedAccessException("Du har inte rätt att bjuda in (CanShare=false).");

        // 2) membership
        var now = DateTime.UtcNow;

        var membership = new CalendarMembershipDto
        {
            Role = req.Role,
            CanEdit = req.CanEdit,
            CanShare = req.CanShare,
            CanSeeDetails = req.CanSeeDetails,
            UpdatedAtUtc = now,
            LastMutationId = "",
            InviteStatus = CalendarInviteStatus.Pending
        };

        var memberOk = await _members.UpsertMemberWithTokenAsync(calendarId, targetUid, membership, idToken, ct);
        if (!memberOk)
            throw new InvalidOperationException("Invite: Kunde inte skriva membership.");

        // 3) calendarRef (pending)
        var r = new CalendarRefDto
        {
            CalendarId = calendarId,
            Role = req.Role,
            CanEdit = req.CanEdit,
            CanShare = req.CanShare,
            CanSeeDetails = req.CanSeeDetails,
            IsSelectedByDefault = req.IsSelectedByDefault,
            UpdatedAtUtc = now,
            LastMutationId = "",
            InviteStatus = CalendarInviteStatus.Pending
        };

        var refOk = await _refs.UpsertRefWithTokenAsync(targetUid, r, idToken, ct);
        if (!refOk)
            throw new InvalidOperationException("Invite: Kunde inte skriva calendarRef.");
    }



    // ==========================
    // UPDATE MEMBER (synkar refs)
    // ==========================
    public async Task UpdateMemberAsync(
        string calendarId,
        string inviterUid,
        string idToken,
        string targetUserId,
        UpdateCalendarMemberRequest req,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(inviterUid)) throw new InvalidOperationException("inviterUid saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");
        if (string.IsNullOrWhiteSpace(targetUserId)) throw new InvalidOperationException("targetUserId saknas.");
        if (req is null) throw new ArgumentNullException(nameof(req));

        // server-check: canShare?
        var cal = await _cal.GetCalendarByIdWithTokenAsync(calendarId, idToken, ct);
        if (cal is null || string.IsNullOrWhiteSpace(cal.CalendarId))
            throw new InvalidOperationException("Kalendern finns inte.");

        var isOwner = string.Equals(cal.OwnerUserId, inviterUid, StringComparison.Ordinal);
        var inviterMember = await _members.GetMemberAsync(calendarId, inviterUid, ct);
        var canShare = isOwner || (inviterMember is not null && inviterMember.CanShare);
        if (!canShare) throw new UnauthorizedAccessException("Du har inte rätt att ändra medlemmar (CanShare=false).");

        var now = DateTime.UtcNow;

        var existingMember = await _members.GetMemberAsync(calendarId, targetUserId, ct);

        var membership = new CalendarMembershipDto
        {
            Role = req.Role,
            CanEdit = req.CanEdit,
            CanShare = req.CanShare,
            CanSeeDetails = req.CanSeeDetails,
            UpdatedAtUtc = now,
            LastMutationId = "",
            InviteStatus = existingMember?.InviteStatus ?? CalendarInviteStatus.Accepted
        };

        var memberOk = await _members.UpsertMemberWithTokenAsync(calendarId, targetUserId, membership, idToken, ct);
        if (!memberOk) throw new InvalidOperationException("UpdateMember: Kunde inte skriva membership.");

        CalendarRefDto? existingRef = null;
        try
        {
            existingRef = await _refs.GetRefWithTokenAsync(targetUserId, calendarId, idToken, ct);
        }
        catch { /* ignore */ }

        var r = new CalendarRefDto
        {
            CalendarId = calendarId,
            Role = req.Role,
            CanEdit = req.CanEdit,
            CanShare = req.CanShare,
            CanSeeDetails = req.CanSeeDetails,

            // bevara om finns, annars defaults
            IsSelectedByDefault = existingRef?.IsSelectedByDefault ?? true,
            DefaultView = existingRef?.DefaultView ?? CalendarViewMode.Month,

            UpdatedAtUtc = now,
            LastMutationId = "",
            InviteStatus = existingRef?.InviteStatus ?? CalendarInviteStatus.Accepted
        };

        var refOk = await _refs.UpsertRefWithTokenAsync(targetUserId, r, idToken, ct);
        if (!refOk) throw new InvalidOperationException("UpdateMember: Kunde inte uppdatera calendarRef.");
    }

    // ==========================
    // KICK MEMBER (tar även ref)
    // ==========================
    public async Task KickMemberAsync(
        string calendarId,
        string inviterUid,
        string idToken,
        string targetUserId,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(inviterUid)) throw new InvalidOperationException("inviterUid saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");
        if (string.IsNullOrWhiteSpace(targetUserId)) throw new InvalidOperationException("targetUserId saknas.");

        var cal = await _cal.GetCalendarByIdWithTokenAsync(calendarId, idToken, ct);
        if (cal is null || string.IsNullOrWhiteSpace(cal.CalendarId))
            throw new InvalidOperationException("Kalendern finns inte.");

        var isOwner = string.Equals(cal.OwnerUserId, inviterUid, StringComparison.Ordinal);
        var inviterMember = await _members.GetMemberAsync(calendarId, inviterUid, ct);
        var canShare = isOwner || (inviterMember is not null && inviterMember.CanShare);
        if (!canShare) throw new UnauthorizedAccessException("Du har inte rätt att kicka medlemmar (CanShare=false).");

        // ✅ ta bort calendarRef hos target (tolerera om den redan är borta)
        var refOk = await _refs.RemoveRefWithTokenAsync(targetUserId, calendarId, idToken, ct);
        if (!refOk)
        {
            // valfritt: logga, men kasta inte alltid
            // throw new InvalidOperationException("Kick: Kunde inte ta bort calendarRef.");
        }

        // ✅ ta bort membership
        var memberOk = await _members.RemoveMemberAsync(calendarId, targetUserId, ct);
        if (!memberOk)
            throw new InvalidOperationException("Kick: Kunde inte ta bort membership.");

    }

    public async Task AcceptInviteAsync(
    string calendarId,
    string inviteeUid,
    string idToken,
    CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(inviteeUid)) throw new InvalidOperationException("inviteeUid saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        // 1) Ref måste finnas
        var r = await _refs.GetRefWithTokenAsync(inviteeUid, calendarId, idToken, ct);
        if (r is null) return; // idempotent

        // 2) Membership måste finnas (annars har någon kickat / städat)
        var m = await _members.GetMemberAsync(calendarId, inviteeUid, ct);
        if (m is null)
        {
            // Ref finns men membership saknas -> städa bort ref
            await _refs.RemoveRefWithTokenAsync(inviteeUid, calendarId, idToken, ct);
            return;
        }

        // 3) Markera accepted + (valfritt) synka ACL från membership
        m.InviteStatus = CalendarInviteStatus.Accepted;
        m.UpdatedAtUtc = DateTime.UtcNow;
        await _members.PatchInviteAcceptedWithTokenAsync(calendarId, inviteeUid, idToken, ct);

        r.Role = m.Role;
        r.CanEdit = m.CanEdit;
        r.CanShare = m.CanShare;
        r.CanSeeDetails = m.CanSeeDetails;

        r.InviteStatus = CalendarInviteStatus.Accepted;
        r.UpdatedAtUtc = DateTime.UtcNow;

        var ok = await _refs.UpsertRefWithTokenAsync(inviteeUid, r, idToken, ct);
        if (!ok) throw new InvalidOperationException("AcceptInvite: Kunde inte uppdatera calendarRef.");
    }

    public async Task DeclineInviteAsync(
        string calendarId,
        string inviteeUid,
        string idToken,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(inviteeUid)) throw new InvalidOperationException("inviteeUid saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        // Först: ta bort ref (idempotent)
        await _refs.RemoveRefWithTokenAsync(inviteeUid, calendarId, idToken, ct);

        // Sen: ta bort membership (idempotent-ish)
        // (RemoveMemberAsync returnerar bool, men du kan tolerera false om notfound)
        await _members.RemoveMemberAsync(calendarId, inviteeUid, ct);
    }

}
