using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Http;
using System.Collections.Generic;
using System.Net.Http.Json;

namespace Contista.Shared.Client.Services;

public sealed class ApiCalendarInvitesService : ICalendarInvitesService
{
    private readonly HttpClient _http;
    public ApiCalendarInvitesService(HttpClient http) => _http = http;

    public async Task<List<CalendarInviteDto>> GetInvitesAsync(CancellationToken ct = default)
        => await _http.GetFromJsonAsync<List<CalendarInviteDto>>("/api/calendar/invites", ct)
       ?? new List<CalendarInviteDto>();

    public async Task AcceptAsync(string calendarId, CancellationToken ct = default)
    {
        var encoded = Uri.EscapeDataString(calendarId);
        var r = await _http.PostAsync($"/api/calendar/{encoded}/accept", content: null, ct);
        r.EnsureSuccessStatusCode();
    }

    public async Task DeclineAsync(string calendarId, CancellationToken ct = default)
    {
        var encoded = Uri.EscapeDataString(calendarId);
        var r = await _http.PostAsync($"/api/calendar/{encoded}/decline", content: null, ct);
        r.EnsureSuccessStatusCode();
    }

    public async Task InviteMemberAsync(string calendarId, InviteCalendarMemberRequest req, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("calendarId saknas.");

        if (req is null)
            throw new ArgumentNullException(nameof(req));

        var encoded = Uri.EscapeDataString(calendarId);
        var resp = await _http.PostAsJsonAsync($"/api/calendar/{encoded}/invite", req, ct);
        if (resp.IsSuccessStatusCode)
            return;

        var raw = await resp.Content.ReadAsStringAsync(ct);
        var code = HttpProblemDetails.TryReadCode(raw);
        var failure = ApiFailureClassifier.FromHttp(resp.StatusCode, raw);
        var enriched = string.IsNullOrWhiteSpace(code)
            ? failure
            : failure with { Code = code };

        throw new ApiFailureException(enriched, raw);
    }
}
