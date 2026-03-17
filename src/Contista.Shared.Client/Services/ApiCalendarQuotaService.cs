using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Models.Calendar;
using System;
using System.Collections.Generic;
using System.Net.Http.Json;
using System.Text;

namespace Contista.Shared.Client.Services;

public sealed class ApiCalendarQuotaService : ICalendarQuotaService
{
    private readonly HttpClient _http;

    public ApiCalendarQuotaService(HttpClient http)
    {
        _http = http;
    }

    public async Task<AutoCleanupResult> EnforceQuotaAsync(
        string userId,
        int maxEventQuota,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return AutoCleanupResult.None();

        // Servern kan ignorera userId i body och ta från claims,
        // men det skadar inte att skicka med.
        var req = new EnforceQuotaRequest(maxEventQuota);

        var resp = await _http.PostAsJsonAsync("/api/calendar/quota/enforce", req, ct);
        if (!resp.IsSuccessStatusCode)
            return AutoCleanupResult.None();

        return await resp.Content.ReadFromJsonAsync<AutoCleanupResult>(cancellationToken: ct)
               ?? AutoCleanupResult.None();
    }

    private sealed record EnforceQuotaRequest(int MaxEventQuota);
}
