using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;

namespace Contista.Infrastructure.Firestore.Repos;

public sealed class CalendarRefRepository
    : BaseSubcollectionRepository<CalendarRefDto>, ICalendarRefRepository
{
    public CalendarRefRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
        : base(http, opts.Value.ProjectId, auth) { }

    private static string RefsPath(string userId) => $"users/{userId}/calendarRefs";

    public async Task<List<CalendarRefDto>> GetRefsForUserAsync(string userId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");

        var list = await GetAllAtPathAsync(
            RefsPath(userId),
            (doc, calendarId) => CalendarRefMapper.ToCalendarRef(doc, calendarId),
            ct);

        return list
            .OrderByDescending(x => x.IsSelectedByDefault)
            .ThenBy(x => x.CalendarId)
            .ToList();
    }

    public async Task<List<CalendarRefDto>> GetRefsForUserWithTokenAsync(string userId, string idToken, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        var list = await GetAllWithTokenAsync(
            RefsPath(userId),
            (doc, calendarId) => CalendarRefMapper.ToCalendarRef(doc, calendarId),
            idToken,
            ct);

        return list
            .OrderByDescending(x => x.IsSelectedByDefault)
            .ThenBy(x => x.CalendarId)
            .ToList();
    }

    public Task<CalendarRefDto?> GetRefAsync(string userId, string calendarId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");

        return GetByIdAtPathAsync(
            RefsPath(userId),
            calendarId,
            (doc, id) => CalendarRefMapper.ToCalendarRef(doc, id),
            ct);
    }

    public Task<CalendarRefDto?> GetRefWithTokenAsync(string userId, string calendarId, string idToken, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        return GetByIdWithTokenAsync(
            RefsPath(userId),
            calendarId,
            (doc, id) => CalendarRefMapper.ToCalendarRef(doc, id),
            idToken,
            ct);
    }

    public Task<bool> UpsertRefAsync(string userId, CalendarRefDto r, CancellationToken ct = default)
        => UpsertRefCoreAsync(userId, r, tokenOverride: null, ct);

    public Task<bool> UpsertRefWithTokenAsync(string userId, CalendarRefDto r, string idToken, CancellationToken ct = default)
        => UpsertRefCoreAsync(userId, r, tokenOverride: idToken, ct);

    private async Task<bool> UpsertRefCoreAsync(string userId, CalendarRefDto r, string? tokenOverride, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");
        if (r is null) throw new ArgumentNullException(nameof(r));
        if (string.IsNullOrWhiteSpace(r.CalendarId)) throw new InvalidOperationException("CalendarId saknas.");

        var fsDoc = CalendarRefMapper.FromCalendarRef(r);

        var upsertedId = tokenOverride is null
            ? await UpsertMergeWithIdAtPathAsync(RefsPath(userId), r.CalendarId, fsDoc, ct)
            : await UpsertMergeWithIdAtPathWithTokenAsync(RefsPath(userId), r.CalendarId, fsDoc, tokenOverride, ct);

        return !string.IsNullOrWhiteSpace(upsertedId);
    }

    public Task<bool> RemoveRefAsync(string userId, string calendarId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");

        return DeleteAtPathAsync(RefsPath(userId), calendarId, ct);
    }

    public Task<bool> RemoveRefWithTokenAsync(string userId, string calendarId, string idToken, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        return DeleteAtPathWithTokenAsync(RefsPath(userId), calendarId, idToken, ct);
    }
}
