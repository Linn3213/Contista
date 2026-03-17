using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Models.Calendar;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;

namespace Contista.Infrastructure.Firestore.Repos;

public sealed class CalendarMembershipRepository
    : BaseSubcollectionRepository<CalendarMembershipDto>, ICalendarMembershipRepository
{
    public CalendarMembershipRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
        : base(http, opts.Value.ProjectId, auth) { }

    private static string MembersPath(string calendarId) => $"calendars/{calendarId}/members";

    public async Task<List<CalendarMembershipDto>> GetMembersAsync(string calendarId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");

        var list = await GetAllAtPathAsync(
            MembersPath(calendarId),
            (doc, _id) => CalendarMembershipMapper.ToCalendarMembership(doc),
            ct);

        return list
            .OrderByDescending(x => x.Role == CalendarMemberRole.Owner)
            .ThenByDescending(x => x.CanEdit)
            .ToList();
    }

    public async Task<CalendarMembershipDto?> GetMemberAsync(string calendarId, string userId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");

        return await GetByIdAtPathAsync(
            MembersPath(calendarId),
            userId,
            (doc, _id) => CalendarMembershipMapper.ToCalendarMembership(doc),
            ct);
    }

    public async Task<List<CalendarMemberRowDto>> GetMemberRowsAsync(string calendarId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");

        var rows = await GetAllAtPathAsync<CalendarMemberRowDto>(
            MembersPath(calendarId),
            (doc, userId) => new CalendarMemberRowDto
            {
                CalendarId = calendarId,
                UserId = userId,
                Membership = CalendarMembershipMapper.ToCalendarMembership(doc)
            },
            ct);



        return rows
            .OrderByDescending(r => r.Membership.Role == CalendarMemberRole.Owner)
            .ThenByDescending(r => r.Membership.CanEdit)
            .ThenBy(r => r.UserId)
            .ToList();
    }


    public async Task<bool> CreateMemberWithTokenAsync(
        string calendarId,
        string userId,
        CalendarMembershipDto membership,
        string idToken,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");
        if (membership is null) throw new ArgumentNullException(nameof(membership));

        var fsDoc = CalendarMembershipMapper.FromCalendarMembership(membership);

        var createdId = await CreateWithIdAtPathWithTokenAsync(
            MembersPath(calendarId),
            userId,
            fsDoc,
            idToken,
            ct);

        return !string.IsNullOrWhiteSpace(createdId);
    }

    public Task<bool> UpsertMemberAsync(string calendarId, string userId, CalendarMembershipDto membership, CancellationToken ct = default)
        => UpsertMemberCoreAsync(calendarId, userId, membership, tokenOverride: null, ct);

    public Task<bool> UpsertMemberWithTokenAsync(string calendarId, string userId, CalendarMembershipDto membership, string idToken, CancellationToken ct = default)
        => UpsertMemberCoreAsync(calendarId, userId, membership, tokenOverride: idToken, ct);

    private async Task<bool> UpsertMemberCoreAsync(string calendarId, string userId, CalendarMembershipDto membership, string? tokenOverride, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");
        if (membership is null) throw new ArgumentNullException(nameof(membership));

        var fsDoc = CalendarMembershipMapper.FromCalendarMembership(membership);

        // robust upsert: create om saknas, annars merge-patch
        var upsertedId = tokenOverride is null
            ? await UpsertMergeWithIdAtPathAsync(MembersPath(calendarId), userId, fsDoc, ct)
            : await UpsertMergeWithIdAtPathWithTokenAsync(MembersPath(calendarId), userId, fsDoc, tokenOverride, ct);

        return !string.IsNullOrWhiteSpace(upsertedId);
    }

    public Task<bool> RemoveMemberAsync(string calendarId, string userId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");

        return DeleteAtPathAsync(MembersPath(calendarId), userId, ct);
    }

    public async Task<bool> PatchInviteAcceptedWithTokenAsync(
    string calendarId,
    string userId,
    string idToken,
    CancellationToken ct = default)
    {
        var doc = new FirestoreDocument
        {
            Fields = new Dictionary<string, FirestoreValue>
            {
                ["InviteStatus"] = ((int)CalendarInviteStatus.Accepted).ToFirestoreValue(),
                ["UpdatedAtUtc"] = DateTime.UtcNow.ToFirestoreTimestamp(),
                ["LastMutationId"] = ("").ToFirestoreValue()
            }
        };

        return await PatchWithUpdateMaskAtPathWithTokenAsync(
            MembersPath(calendarId),
            userId,
            doc,
            new[] { "InviteStatus", "UpdatedAtUtc", "LastMutationId" },
            idToken,
            ct);
    }
}
