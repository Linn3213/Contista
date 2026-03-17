using Contista.Shared.Core.Interfaces.UserDirectory;
using System.Net.Http.Json;

namespace Contista.Shared.Client.Services;



public sealed class ApiUserDirectoryDataProvider : IUserDirectoryDataProvider
{
    private readonly HttpClient _http;

    public ApiUserDirectoryDataProvider(HttpClient http)
    {
        _http = http;
    }

    private sealed record ResolveUidsRequest(List<string> Uids);

    public async Task<Dictionary<string, string>> ResolveUidsAsync(List<string> uids, CancellationToken ct = default)
    {
        uids ??= new();

        var clean = uids
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => x.Trim())
            .Distinct(StringComparer.Ordinal)
            .ToList();

        if (clean.Count == 0)
            return new Dictionary<string, string>(StringComparer.Ordinal);

        var resp = await _http.PostAsJsonAsync("/api/user-directory/resolve-uids", new ResolveUidsRequest(clean), ct);
        resp.EnsureSuccessStatusCode();

        return await resp.Content.ReadFromJsonAsync<Dictionary<string, string>>(cancellationToken: ct)
               ?? new Dictionary<string, string>(StringComparer.Ordinal);
    }
}