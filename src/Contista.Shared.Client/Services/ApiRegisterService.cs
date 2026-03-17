using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Models.Auth;
using System.Net.Http.Json;

namespace Contista.Shared.Client.Services;

public sealed class ApiRegisterService : IRegisterApi
{
    private readonly HttpClient _http;
    public ApiRegisterService(HttpClient http) => _http = http;

    public async Task<bool> RegisterAsync(RegisterRequest req, CancellationToken ct = default)
    {
        var res = await _http.PostAsJsonAsync("/api/auth/register", req, ct);

        if (!res.IsSuccessStatusCode)
            throw new InvalidOperationException(await res.Content.ReadAsStringAsync(ct));

        return true;
    }
}