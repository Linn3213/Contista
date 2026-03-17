using Contista.Infrastructure.Firestore.Services;
using Contista.Shared.Core.DTO;
using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Exceptions.Calendar;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models.Auth;
using Contista.Shared.Core.Models.Calendar;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;

namespace Contista.Web.Endpoints;

public static class CalendarEndpoints
{
    public sealed record EnforceQuotaRequest(int MaxEventQuota);

    public static void MapCalendarEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/calendar")
            .RequireAuthorization();

        // ---------------- Settings ----------------
        group.MapGet("/settings", [Authorize] async (
            HttpContext http,
            ICalendarSettingsRepository calSettings,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var settings = await calSettings.GetSettingsAsync(uid!, ct);

            // första gång: returnera default settings istället för null
            settings ??= new CalendarSettingsDto
            {
                UserId = uid!,
                PrimaryCalendarId = "",
                DefaultView = CalendarViewMode.Month,
                SelectedCalendarIds = new List<string>(),
                DndPeriods = new List<DndPeriodDto>(),
                UpdatedAtUtc = DateTime.UtcNow
            };

            return Results.Ok(settings);
        });

        // ---------------- My calendars ----------------
        group.MapGet("/my", [Authorize] async (
            HttpContext http,
            IFirebaseAuthService auth,
            ICalendarRepository calRepo,
            ICalendarRefRepository calRefRepo,
            ICalendarMembershipRepository calMemberRepo,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            // Säkerställ token (så vi inte får 403 från Firestore REST)
            var idToken = await auth.GetValidIdTokenAsync();
            if (string.IsNullOrWhiteSpace(idToken))
                return Results.Unauthorized();

            // 1) Mina refs = vilka calendarIds jag "har"
            var refsAll = await calRefRepo.GetRefsForUserWithTokenAsync(uid!, idToken, ct) ?? new List<CalendarRefDto>();
            var refs = refsAll.Where(r => r.InviteStatus == CalendarInviteStatus.Accepted).ToList();


            // 2) Hämta calendar-dokument för varje ref
            // (dedupe, behåll ordning: primary först om den flaggan finns i CalendarDto)
            var calById = new Dictionary<string, CalendarDto>(StringComparer.Ordinal);

            foreach (var r in refs)
            {
                if (string.IsNullOrWhiteSpace(r.CalendarId))
                    continue;

                if (calById.ContainsKey(r.CalendarId))
                    continue;

                try
                {
                    var cal = await calRepo.GetCalendarByIdWithTokenAsync(r.CalendarId, idToken!, ct);
                    if (cal is null || string.IsNullOrWhiteSpace(cal.CalendarId)) continue;

                    calById[cal.CalendarId!] = cal;
                }
                catch
                {
                    // Om en ref pekar på en kalender som inte går att läsa: skippa den.
                    continue;
                }
            }

            var calendars = calById.Values
                .OrderByDescending(c => c.IsPrimary)
                .ThenBy(c => c.Name)
                .ToList();

            // 3) Bygg MemberRows: endast min membership per kalender
            var memberRows = new List<CalendarMemberRowDto>();

            foreach (var cal in calendars)
            {
                CalendarMembershipDto? myMembership = null;

                try
                {
                    myMembership = await calMemberRepo.GetMemberAsync(cal.CalendarId!, uid!, ct);
                }
                catch
                {
                    myMembership = null;
                }

                // Om du vill vara extra tolerant (t.ex. refs finns men membership saknas),
                // kan du fallbacka till owner om du äger kalendern.
                if (myMembership is null)
                {
                    if (string.Equals(cal.OwnerUserId, uid, StringComparison.Ordinal))
                    {
                        myMembership = new CalendarMembershipDto
                        {
                            Role = CalendarMemberRole.Owner,
                            CanEdit = true,
                            CanShare = true,
                            CanSeeDetails = true,
                            UpdatedAtUtc = DateTime.UtcNow,
                            LastMutationId = ""
                        };
                    }
                    else
                    {
                        // shared ref utan membership -> skippa (eller logga)
                        continue;
                    }
                }

                memberRows.Add(new CalendarMemberRowDto
                {
                    CalendarId = cal.CalendarId!,
                    UserId = uid!,
                    Membership = myMembership
                });
            }

            return Results.Ok(new CalendarMyResponse
            {
                Calendars = calendars,
                CalendarRefs = refs,
                MemberRows = memberRows
            });
        });


        // ==========================
        // INVITES (mine)
        // GET /api/calendar/invites
        // ==========================
        group.MapGet("/invites", [Authorize] async (
            HttpContext http,
            IFirebaseAuthService auth,
            ICalendarRefRepository refs,
            ICalendarRepository calRepo,
            IUserDirectoryRepository dir,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var idToken = await auth.GetValidIdTokenAsync();
            if (string.IsNullOrWhiteSpace(idToken))
                return Results.Unauthorized();

            var list = await refs.GetRefsForUserWithTokenAsync(uid!, idToken!, ct) ?? new List<CalendarRefDto>();

            var pending = list
                .Where(x => x.InviteStatus == CalendarInviteStatus.Pending && !string.IsNullOrWhiteSpace(x.CalendarId))
                .OrderByDescending(x => x.UpdatedAtUtc)
                .ToList();

            if (pending.Count == 0)
                return Results.Ok(new List<CalendarInviteDto>());

            // ✅ Cache: calendar + owner profile
            var calCache = new Dictionary<string, CalendarDto?>(StringComparer.Ordinal);
            var ownerCache = new Dictionary<string, UserDirectoryEntry?>(StringComparer.Ordinal);

            var result = new List<CalendarInviteDto>();

            foreach (var r in pending)
            {
                var calId = r.CalendarId!.Trim();

                if (!calCache.TryGetValue(calId, out var cal))
                {
                    try { cal = await calRepo.GetCalendarByIdWithTokenAsync(calId, idToken!, ct); }
                    catch { cal = null; }
                    calCache[calId] = cal;
                }

                if (cal is null || string.IsNullOrWhiteSpace(cal.CalendarId))
                    continue;

                var ownerId = (cal.OwnerUserId ?? "").Trim();

                UserDirectoryEntry? ownerProfile = null;
                if (!string.IsNullOrWhiteSpace(ownerId))
                {
                    if (!ownerCache.TryGetValue(ownerId, out ownerProfile))
                    {
                        try 
                        { 
                            ownerProfile = await dir.GetByUidAsync(ownerId, idToken!, ct); 
                        }
                        catch 
                        { ownerProfile = null; }
                        
                        ownerCache[ownerId] = ownerProfile;
                    }
                }

                // ✅ From alltid: DisplayName -> ownerId -> Unknown
                var ownerDisplayName =
                    !string.IsNullOrWhiteSpace(ownerProfile?.DisplayName) ? ownerProfile!.DisplayName :
                    !string.IsNullOrWhiteSpace(ownerId) ? ownerId :
                    "Unknown";

                // ✅ Email visas alltid i UI, men vi hittar inte på om vi inte vet
                var ownerEmail = ownerProfile?.EmailLower ?? "";

                result.Add(new CalendarInviteDto
                {
                    CalendarId = calId,
                    CalendarName = string.IsNullOrWhiteSpace(cal.Name) ? calId : cal.Name!,
                    Color = cal.Color ?? "",

                    OwnerUserId = ownerId,
                    OwnerDisplayName = ownerDisplayName,
                    OwnerEmail = ownerEmail,

                    Role = r.Role,
                    CanEdit = r.CanEdit,
                    CanShare = r.CanShare,
                    CanSeeDetails = r.CanSeeDetails,
                    InviteStatus = r.InviteStatus,
                    UpdatedAtUtc = r.UpdatedAtUtc
                });
            }

            return Results.Ok(result);
        });


        // ==========================
        // ACCEPT INVITE
        // POST /api/calendar/{calendarId}/accept
        // ==========================
        group.MapPost("/{calendarId}/accept", [Authorize] async (
            HttpContext http,
            [FromRoute] string calendarId,
            IFirebaseAuthService auth,
            ICalendarSharingService sharing,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var idToken = await auth.GetValidIdTokenAsync();
            if (string.IsNullOrWhiteSpace(idToken))
                return Results.Unauthorized();

            try
            {
                await sharing.AcceptInviteAsync(calendarId, uid!, idToken!, ct);
                return Results.Ok(new { ok = true });
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.ToString());
            }
        });

        // ==========================
        // DECLINE INVITE
        // POST /api/calendar/{calendarId}/decline
        // ==========================
        group.MapPost("/{calendarId}/decline", [Authorize] async (
            HttpContext http,
            [FromRoute] string calendarId,
            IFirebaseAuthService auth,
            ICalendarSharingService sharing,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var idToken = await auth.GetValidIdTokenAsync();
            if (string.IsNullOrWhiteSpace(idToken))
                return Results.Unauthorized();

            try
            {
                await sharing.DeclineInviteAsync(calendarId, uid!, idToken!, ct);
                return Results.Ok(new { ok = true });
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.ToString());
            }
        });



        // ---------------- Events range ----------------
        group.MapPost("/events/range", [Authorize] async (
            HttpContext http,
            [FromBody] CalendarEventsRangeRequest req,
            ICalendarRepository calRepo,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            if (req.CalendarIds == null || req.CalendarIds.Count == 0)
                return Results.Ok(new List<CalendarEventDto>());

            if (req.EndUtc <= req.StartUtc)
                return Results.BadRequest("EndUtc måste vara efter StartUtc.");

            if (req.EndUtc - req.StartUtc > TimeSpan.FromDays(62))
                return Results.BadRequest("Range för stor. Max 62 dagar per anrop.");

            var all = new List<CalendarEventDto>();

            foreach (var calId in req.CalendarIds.Distinct(StringComparer.Ordinal))
            {
                if (string.IsNullOrWhiteSpace(calId)) continue;

                var list = await calRepo.GetEventsInRangeAsync(calId, req.StartUtc, req.EndUtc, ct);
                if (list is not null) all.AddRange(list);
            }

            var result = all
                .OrderBy(e => e.StartUtc)
                .ThenBy(e => e.Title)
                .ToList();

            return Results.Ok(result);
        });

        // ---------------- Quota enforce ----------------
        group.MapPost("/quota/enforce", [Authorize] async (
            HttpContext http,
            [FromBody] EnforceQuotaRequest req,
            ICalendarQuotaService quota,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var max = req?.MaxEventQuota ?? 0;

            try
            {
                var result = await quota.EnforceQuotaAsync(uid!, max, ct);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.ToString());
            }
        });

        // ==========================
        // INVITE (share)
        // POST /api/calendar/{calendarId}/invite
        // ==========================
        group.MapPost("/{calendarId}/invite", [Authorize] async (
            HttpContext http,
            [FromRoute] string calendarId,
            [FromBody] InviteCalendarMemberRequest req,
            IFirebaseAuthService auth,
            ICalendarSharingService sharing,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var idToken = await auth.GetValidIdTokenAsync();
            if (string.IsNullOrWhiteSpace(idToken))
                return Results.Unauthorized();

            try
            {
                await sharing.InviteUserAsync(calendarId, uid!, idToken!, req, ct);
                return Results.Ok(new { ok = true });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Results.Problem(ex.Message, statusCode: 403);
            }
            catch (CalendarInviteException ex)
            {
                return Results.Problem(
                    detail: ex.Message,
                    statusCode: 400,
                    extensions: new Dictionary<string, object?>
                    {
                        ["code"] = ex.Code
                    });
            }
            catch (InvalidOperationException ex)
            {
                return Results.Problem(
                    detail: ex.Message,
                    statusCode: 400,
                    extensions: new Dictionary<string, object?>
                    {
                        ["code"] = CalendarInviteErrorCodes.Invalid
                    });
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.ToString());
            }
        });

        // ==========================
        // LEAVE
        // POST /api/calendar/{calendarId}/leave
        // ==========================
        group.MapPost("/{calendarId}/leave", [Authorize] async (
            HttpContext http,
            [FromRoute] string calendarId,
            IFirebaseAuthService auth,
            ICalendarMembershipRepository members,
            ICalendarRefRepository refs,
            ICalendarRepository calRepo,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var idToken = await auth.GetValidIdTokenAsync();
            if (string.IsNullOrWhiteSpace(idToken))
                return Results.Unauthorized();

            // får inte lämna om man är owner (då behöver delete/transfer)
            var cal = await calRepo.GetCalendarByIdWithTokenAsync(calendarId, idToken!, ct);
            if (cal is null) return Results.NotFound();

            if (string.Equals(cal.OwnerUserId, uid, StringComparison.Ordinal))
                return Results.BadRequest("Owner kan inte leave. Ta bort kalendern eller transfer ownership.");

            // 1) ta bort membership
            await members.RemoveMemberAsync(calendarId, uid!, ct);

            // 2) ta bort ref
            await refs.RemoveRefWithTokenAsync(uid, calendarId, idToken, ct);

            return Results.Ok(new { ok = true });
        });

        // ==========================
        // MEMBERS LIST (owner/share)
        // GET /api/calendar/{calendarId}/members
        // ==========================
        group.MapGet("/{calendarId}/members", [Authorize] async (
            HttpContext http,
            [FromRoute] string calendarId,
            IFirebaseAuthService auth,
            ICalendarRepository calRepo,
            ICalendarMembershipRepository members,
            IUserDirectoryRepository dir,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var idToken = await auth.GetValidIdTokenAsync();
            if (string.IsNullOrWhiteSpace(idToken))
                return Results.Unauthorized();

            // server-check: owner eller CanShare
            var cal = await calRepo.GetCalendarByIdWithTokenAsync(calendarId, idToken!, ct);
            if (cal is null) return Results.NotFound();

            var isOwner = string.Equals(cal.OwnerUserId, uid, StringComparison.Ordinal);
            var myMember = await members.GetMemberAsync(calendarId, uid!, ct);

            // ✅ Tillåt listning för owner eller medlemmar (ev kräva CanSeeDetails)
            var canList =
                isOwner ||
                (myMember is not null && (myMember.CanSeeDetails || myMember.CanEdit || myMember.CanShare));
            // alt enklast: isOwner || myMember is not null

            if (!canList)
                return Results.Problem("Du har inte rätt att lista medlemmar.", statusCode: 403);

            var rows = await members.GetMemberRowsAsync(calendarId, ct);

            // Enrich member rows med display/email från userDirectory (cache per uid)
            var userCache = new Dictionary<string, UserDirectoryEntry?>(StringComparer.Ordinal);

            foreach (var row in rows)
            {
                var memberUid = (row.UserId ?? "").Trim();
                if (string.IsNullOrWhiteSpace(memberUid))
                    continue;

                if (!userCache.TryGetValue(memberUid, out var entry))
                {
                    try
                    {
                        entry = await dir.GetByUidAsync(memberUid, idToken!, ct);
                    }
                    catch
                    {
                        entry = null;
                    }

                    userCache[memberUid] = entry;
                }

                row.DisplayName = !string.IsNullOrWhiteSpace(entry?.DisplayName)
                    ? entry!.DisplayName
                    : memberUid;

                row.Email = entry?.EmailLower ?? "";
            }

            return Results.Ok(rows);
        });


        // ==========================
        // UPDATE MEMBER (owner/share)
        // POST /api/calendar/{calendarId}/members/{memberUid}
        // ==========================
        group.MapPost("/{calendarId}/members/{memberUid}", [Authorize] async (
            HttpContext http,
            [FromRoute] string calendarId,
            [FromRoute] string memberUid,
            [FromBody] UpdateCalendarMemberRequest req,
            IFirebaseAuthService auth,
            ICalendarSharingService sharing,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var idToken = await auth.GetValidIdTokenAsync();
            if (string.IsNullOrWhiteSpace(idToken))
                return Results.Unauthorized();

            try
            {
                await sharing.UpdateMemberAsync(calendarId, uid!, idToken!, memberUid, req, ct);
                return Results.Ok(new { ok = true });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Results.Problem(ex.Message, statusCode: 403);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.ToString());
            }
        });


        // ==========================
        // REMOVE MEMBER (owner/share)
        // DELETE /api/calendar/{calendarId}/members/{memberUid}
        // ==========================
        group.MapDelete("/{calendarId}/members/{memberUid}", [Authorize] async (
            HttpContext http,
            [FromRoute] string calendarId,
            [FromRoute] string memberUid,
            IFirebaseAuthService auth,
            ICalendarSharingService sharing,
            CancellationToken ct) =>
        {
            var uid = GetUid(http);
            if (string.IsNullOrWhiteSpace(uid))
                return Results.Unauthorized();

            var idToken = await auth.GetValidIdTokenAsync();
            if (string.IsNullOrWhiteSpace(idToken))
                return Results.Unauthorized();

            try
            {
                await sharing.KickMemberAsync(calendarId, uid!, idToken!, memberUid, ct);
                return Results.Ok(new { ok = true });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Results.Problem(ex.Message, statusCode: 403);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.ToString());
            }
        });

    }

    private static string? GetUid(HttpContext http) =>
        http.User.FindFirstValue("user_id") ??
        http.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
        http.User.FindFirstValue("sub");
}
