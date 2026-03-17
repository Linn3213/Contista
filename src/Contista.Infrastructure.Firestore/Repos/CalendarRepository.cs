using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Logic.Calendar;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Models.Calendar;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;

namespace Contista.Infrastructure.Firestore.Repos;

public sealed class CalendarRepository : BaseRepository<CalendarDto>, ICalendarRepository
{
    public CalendarRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
        : base(http, opts.Value.ProjectId, "calendars", auth)
    { }

    // ---------------- Calendars ----------------

    public Task<string?> CreateCalendarAsync(CalendarDto calendar, CancellationToken ct = default)
        => CreateCalendarCoreAsync(calendar, tokenOverride: null, ct);

    public Task<string?> CreateCalendarWithTokenAsync(CalendarDto calendar, string idToken, CancellationToken ct = default)
        => CreateCalendarCoreAsync(calendar, tokenOverride: idToken, ct);

    private async Task<string?> CreateCalendarCoreAsync(CalendarDto calendar, string? tokenOverride, CancellationToken ct)
    {
        if (calendar is null) throw new ArgumentNullException(nameof(calendar));

        calendar.UpdatedAtUtc = DateTime.UtcNow;
        if (calendar.CreatedAtUtc == default) calendar.CreatedAtUtc = DateTime.UtcNow;

        // OBS: BaseRepository.CreateAsync() bygger request utan tokenOverride.
        // Därför gör vi explicit här för att kunna skicka tokenOverride vid behov.
        var url = BuildCollectionUrl("calendars");

        calendar.Color = CalendarColors.Normalize(calendar.Color);

        var req = await CreateRequestAsync(HttpMethod.Post, url, CalendarMapper.FromCalendar(calendar), requireAuth: true, tokenOverride: tokenOverride);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"CreateCalendar failed: {resp.StatusCode} {err}");
            return null;
        }

        var created = await resp.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
        return created?.Name?.Split('/').Last();
    }

    public Task<bool> UpdateCalendarAsync(CalendarDto calendar, CancellationToken ct = default)
        => UpdateCalendarCoreAsync(calendar, tokenOverride: null, ct);

    public Task<bool> UpdateCalendarWithTokenAsync(CalendarDto calendar, string idToken, CancellationToken ct = default)
        => UpdateCalendarCoreAsync(calendar, tokenOverride: idToken, ct);

    private async Task<bool> UpdateCalendarCoreAsync(CalendarDto calendar, string? tokenOverride, CancellationToken ct)
    {
        if (calendar is null) throw new ArgumentNullException(nameof(calendar));
        if (string.IsNullOrWhiteSpace(calendar.CalendarId))
            throw new InvalidOperationException("CalendarId saknas.");

        calendar.UpdatedAtUtc = DateTime.UtcNow;

        var url = BuildDocUrl("calendars", calendar.CalendarId!);

        calendar.Color = CalendarColors.Normalize(calendar.Color);


        var req = await CreateRequestAsync(HttpMethod.Patch, url, CalendarMapper.FromCalendar(calendar), requireAuth: true, tokenOverride: tokenOverride);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"UpdateCalendar failed: {resp.StatusCode} {err}");
        }

        return resp.IsSuccessStatusCode;
    }

    public Task<bool> DeleteCalendarAsync(string calendarId, CancellationToken ct = default)
        => DeleteCalendarCoreAsync(calendarId, tokenOverride: null, ct);

    public Task<bool> DeleteCalendarWithTokenAsync(string calendarId, string idToken, CancellationToken ct = default)
        => DeleteCalendarCoreAsync(calendarId, tokenOverride: idToken, ct);

    private async Task<bool> DeleteCalendarCoreAsync(string calendarId, string? tokenOverride, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");

        var url = BuildDocUrl("calendars", calendarId);
        var req = await CreateRequestAsync(HttpMethod.Delete, url, body: null, requireAuth: true, tokenOverride: tokenOverride);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"DeleteCalendar failed: {resp.StatusCode} {err}");
        }

        return resp.IsSuccessStatusCode;
    }

    public Task<CalendarDto?> GetCalendarByIdAsync(string calendarId, CancellationToken ct = default)
        => GetCalendarByIdCoreAsync(calendarId, tokenOverride: null, ct);

    public Task<CalendarDto?> GetCalendarByIdWithTokenAsync(string calendarId, string idToken, CancellationToken ct = default)
        => GetCalendarByIdCoreAsync(calendarId, tokenOverride: idToken, ct);

    public async Task<List<CalendarDto>> GetCalendarsByOwnerAsync(string ownerUserId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(ownerUserId))
            return new List<CalendarDto>();

        var structuredQuery = new
        {
            from = new[] { new { collectionId = "calendars" } },
            where = new
            {
                fieldFilter = new
                {
                    field = new { fieldPath = "OwnerUserId" },
                    op = "EQUAL",
                    value = new { stringValue = ownerUserId }
                }
            }
        };

        // BaseRepository.GetObjectsWithQueryAsync ger dig id från name-split
        // och mappar med CalendarMapper.
        var list = await GetObjectsWithQueryAsync(structuredQuery, (doc, id) =>
            CalendarMapper.ToCalendar(doc, id));

        return list
            .Where(x => !string.IsNullOrWhiteSpace(x.CalendarId))
            .OrderByDescending(x => x.IsPrimary)
            .ThenBy(x => x.Name)
            .ToList();
    }


    private async Task<CalendarDto?> GetCalendarByIdCoreAsync(string calendarId, string? tokenOverride, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");

        var url = BuildDocUrl("calendars", calendarId);
        var req = await CreateRequestAsync(HttpMethod.Get, url, body: null, requireAuth: true, tokenOverride: tokenOverride);
        var resp = await SendAsyncWithRetry(req, ct);

        if (resp.StatusCode == System.Net.HttpStatusCode.NotFound)
            return null;

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            throw new InvalidOperationException($"GetCalendarById failed: {resp.StatusCode} {err}");
        }

        var doc = await resp.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
        if (doc is null) return null;

        return CalendarMapper.ToCalendar(doc, calendarId);
    }

    // ---------------- Events (subcollection) ----------------

    private static string EventsCollectionPath(string calendarId) => $"calendars/{calendarId}/events";

    public Task<string?> CreateEventAsync(CalendarEventDto ev, CancellationToken ct = default)
        => CreateEventCoreAsync(ev, tokenOverride: null, ct);

    public Task<string?> CreateEventWithTokenAsync(CalendarEventDto ev, string idToken, CancellationToken ct = default)
        => CreateEventCoreAsync(ev, tokenOverride: idToken, ct);

    private async Task<string?> CreateEventCoreAsync(CalendarEventDto ev, string? tokenOverride, CancellationToken ct)
    {
        if (ev is null) throw new ArgumentNullException(nameof(ev));
        if (string.IsNullOrWhiteSpace(ev.CalendarId))
            throw new InvalidOperationException("CalendarId saknas.");

        ev.UpdatedAtUtc = DateTime.UtcNow;
        if (ev.CreatedAtUtc == default) ev.CreatedAtUtc = DateTime.UtcNow;

        var url = BuildCollectionUrl(EventsCollectionPath(ev.CalendarId));
        var req = await CreateRequestAsync(HttpMethod.Post, url, CalendarEventMapper.FromEvent(ev), requireAuth: true, tokenOverride: tokenOverride);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"CreateEvent failed: {resp.StatusCode} {err}");
            return null;
        }

        var created = await resp.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
        return created?.Name?.Split('/').Last();
    }

    public Task<bool> UpdateEventAsync(CalendarEventDto ev, CancellationToken ct = default)
        => UpdateEventCoreAsync(ev, tokenOverride: null, ct);

    public Task<bool> UpdateEventWithTokenAsync(CalendarEventDto ev, string idToken, CancellationToken ct = default)
        => UpdateEventCoreAsync(ev, tokenOverride: idToken, ct);

    private async Task<bool> UpdateEventCoreAsync(CalendarEventDto ev, string? tokenOverride, CancellationToken ct)
    {
        if (ev is null) throw new ArgumentNullException(nameof(ev));
        if (string.IsNullOrWhiteSpace(ev.CalendarId) || string.IsNullOrWhiteSpace(ev.EventId))
            throw new InvalidOperationException("CalendarId/EventId saknas.");

        ev.UpdatedAtUtc = DateTime.UtcNow;

        var url = BuildDocUrl(EventsCollectionPath(ev.CalendarId), ev.EventId!);
        var req = await CreateRequestAsync(HttpMethod.Patch, url, CalendarEventMapper.FromEvent(ev), requireAuth: true, tokenOverride: tokenOverride);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"UpdateEvent failed: {resp.StatusCode} {err}");
        }

        return resp.IsSuccessStatusCode;
    }

    public Task<bool> DeleteEventAsync(string calendarId, string eventId, CancellationToken ct = default)
        => DeleteEventCoreAsync(calendarId, eventId, tokenOverride: null, ct);

    public Task<bool> DeleteEventWithTokenAsync(string calendarId, string eventId, string idToken, CancellationToken ct = default)
        => DeleteEventCoreAsync(calendarId, eventId, tokenOverride: idToken, ct);

    private async Task<bool> DeleteEventCoreAsync(string calendarId, string eventId, string? tokenOverride, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(eventId))
            throw new InvalidOperationException("eventId saknas.");

        var url = BuildDocUrl(EventsCollectionPath(calendarId), eventId);
        var req = await CreateRequestAsync(HttpMethod.Delete, url, body: null, requireAuth: true, tokenOverride: tokenOverride);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"DeleteEvent failed: {resp.StatusCode} {err}");
        }

        return resp.IsSuccessStatusCode;
    }

    public Task<List<CalendarEventDto>> GetEventsInRangeAsync(string calendarId, DateTime startUtc, DateTime endUtc, CancellationToken ct = default)
        => GetEventsInRangeCoreAsync(calendarId, startUtc, endUtc, tokenOverride: null, ct);

    public Task<List<CalendarEventDto>> GetEventsInRangeWithTokenAsync(string calendarId, DateTime startUtc, DateTime endUtc, string idToken, CancellationToken ct = default)
        => GetEventsInRangeCoreAsync(calendarId, startUtc, endUtc, tokenOverride: idToken, ct);

    private async Task<List<CalendarEventDto>> GetEventsInRangeCoreAsync(
    string calendarId,
    DateTime startUtc,
    DateTime endUtc,
    string? tokenOverride,
    CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");
        if (endUtc <= startUtc)
            return new List<CalendarEventDto>();

        startUtc = AsUtc(startUtc);
        endUtc = AsUtc(endUtc);

        var url = BuildCollectionUrl(EventsCollectionPath(calendarId));
        var req = await CreateRequestAsync(HttpMethod.Get, url, body: null, requireAuth: true, tokenOverride: tokenOverride);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"GetEventsInRange failed: {resp.StatusCode} {err}");
            return new List<CalendarEventDto>();
        }

        var firestoreList = await resp.Content.ReadFromJsonAsync<FirestoreListResponse>(cancellationToken: ct);
        var raw = new List<CalendarEventDto>();

        if (firestoreList?.Documents == null)
            return raw;

        foreach (var doc in firestoreList.Documents)
        {
            if (doc?.Name is null) continue;
            var id = doc.Name.Split('/').Last();
            var ev = CalendarEventMapper.ToEvent(doc, id, calendarId);
            raw.Add(ev);
        }

        // Låt expander+exceptions avgöra vad som ska synas i rangen
        return RecurrenceExpander.ExpandInRange(raw, startUtc, endUtc);
    }

    public Task<List<CalendarEventDto>> GetAllEventsAsync(string calendarId, CancellationToken ct = default)
    => GetAllEventsCoreAsync(calendarId, tokenOverride: null, ct);

    private async Task<List<CalendarEventDto>> GetAllEventsCoreAsync(string calendarId, string? tokenOverride, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");

        var url = BuildCollectionUrl(EventsCollectionPath(calendarId));
        var req = await CreateRequestAsync(HttpMethod.Get, url, body: null, requireAuth: true, tokenOverride: tokenOverride);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"GetAllEvents failed: {resp.StatusCode} {err}");
            return new List<CalendarEventDto>();
        }

        var firestoreList = await resp.Content.ReadFromJsonAsync<FirestoreListResponse>(cancellationToken: ct);
        var result = new List<CalendarEventDto>();
        if (firestoreList?.Documents == null) return result;

        foreach (var doc in firestoreList.Documents)
        {
            if (doc?.Name is null) continue;
            var id = doc.Name.Split('/').Last();
            var ev = CalendarEventMapper.ToEvent(doc, id, calendarId);
            result.Add(ev);
        }

        return result
            .OrderBy(x => x.StartUtc)
            .ThenBy(x => x.Title)
            .ToList();
    }

    public Task<bool> UpsertEventWithIdAsync(string calendarId, string eventId, CalendarEventDto ev, CancellationToken ct = default)
    => UpsertEventWithIdCoreAsync(calendarId, eventId, ev, tokenOverride: null, ct);

    private async Task<bool> UpsertEventWithIdCoreAsync(string calendarId, string eventId, CalendarEventDto ev, string? tokenOverride, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(calendarId)) throw new InvalidOperationException("calendarId saknas.");
        if (string.IsNullOrWhiteSpace(eventId)) throw new InvalidOperationException("eventId saknas.");
        if (ev is null) throw new ArgumentNullException(nameof(ev));

        ev.CalendarId = calendarId;
        ev.EventId = eventId;

        ev.UpdatedAtUtc = DateTime.UtcNow;
        if (ev.CreatedAtUtc == default) ev.CreatedAtUtc = DateTime.UtcNow;

        var url = BuildDocUrl(EventsCollectionPath(calendarId), eventId);
        var req = await CreateRequestAsync(HttpMethod.Patch, url, CalendarEventMapper.FromEvent(ev), requireAuth: true, tokenOverride: tokenOverride);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"UpsertEventWithId failed: {resp.StatusCode} {err}");
        }

        return resp.IsSuccessStatusCode;
    }

    static DateTime AsUtc(DateTime dt)
    {
        if (dt.Kind == DateTimeKind.Utc) return dt;
        if (dt.Kind == DateTimeKind.Unspecified) return DateTime.SpecifyKind(dt, DateTimeKind.Utc);
        return dt.ToUniversalTime();
    }
}
