using System.Net.Http.Json;
using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Offline.Interfaces;

namespace Contista.Shared.Client.Services;

/// <summary>
/// Shared.Client implementation som pratar med Contista.Web endpoints.
/// </summary>
public sealed class ApiCalendarDataProvider : ICalendarDataProvider
{
    private readonly HttpClient _http;

    public ApiCalendarDataProvider(HttpClient http)
    {
        _http = http;
    }

    public Task<CalendarSettingsDto?> GetSettingsAsync(CancellationToken ct = default)
        => _http.GetFromJsonAsync<CalendarSettingsDto>("/api/calendar/settings", ct);

    public Task<CalendarMyResponse?> GetMyAsync(CancellationToken ct = default)
        => _http.GetFromJsonAsync<CalendarMyResponse>("/api/calendar/my", ct);

    public async Task<List<CalendarEventDto>> GetEventsRangeAsync(CalendarEventsRangeRequest req, CancellationToken ct = default)
    {
        var resp = await _http.PostAsJsonAsync("/api/calendar/events/range", req, ct);
        resp.EnsureSuccessStatusCode();

        return await resp.Content.ReadFromJsonAsync<List<CalendarEventDto>>(cancellationToken: ct)
               ?? new List<CalendarEventDto>();
    }
    public async Task<List<CalendarMemberRowDto>> GetMembersAsync(string calendarId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            return new List<CalendarMemberRowDto>();

        var encoded = Uri.EscapeDataString(calendarId);

        return await _http.GetFromJsonAsync<List<CalendarMemberRowDto>>($"/api/calendar/{encoded}/members", ct)
               ?? new List<CalendarMemberRowDto>();
    }

    public async Task RemoveMemberAsync(string calendarId, string memberUid, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");

        if (string.IsNullOrWhiteSpace(memberUid))
            throw new InvalidOperationException("memberUid saknas.");

        var cal = Uri.EscapeDataString(calendarId);
        var uid = Uri.EscapeDataString(memberUid);

        var resp = await _http.DeleteAsync($"/api/calendar/{cal}/members/{uid}", ct);
        resp.EnsureSuccessStatusCode();
    }

    public async Task UpdateMemberAsync(string calendarId, string memberUid, UpdateCalendarMemberRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");

        if (string.IsNullOrWhiteSpace(memberUid))
            throw new InvalidOperationException("memberUid saknas.");

        if (req is null)
            throw new ArgumentNullException(nameof(req));

        var cal = Uri.EscapeDataString(calendarId);
        var uid = Uri.EscapeDataString(memberUid);

        var resp = await _http.PostAsJsonAsync($"/api/calendar/{cal}/members/{uid}", req, ct);
        resp.EnsureSuccessStatusCode();
    }

}
