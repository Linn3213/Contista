using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models.Auth;
using System.Net.Http.Json;

namespace Contista.Shared.Client.Services;

public sealed class MauiRegisterApi : IRegisterApi
{
    private readonly IFirebaseAuthService _auth;
    private readonly HttpClient _serverApi; // har FirebaseBearerHandler på sig

    public MauiRegisterApi(IFirebaseAuthService auth, HttpClient serverApi)
    {
        _auth = auth;
        _serverApi = serverApi;
    }

    public async Task<bool> RegisterAsync(RegisterRequest req, CancellationToken ct = default)
    {
        // 1) Skapa konto i Firebase (idToken hamnar i _auth)
        var uid = await _auth.RegisterUserAsync(req.Email, req.Password);
        if (string.IsNullOrWhiteSpace(uid))
            throw new InvalidOperationException("Kunde inte skapa konto i Firebase.");

        // 2) Provisiona user-doc via servern (Bearer skickas av handlern)
        var res = await _serverApi.PostAsJsonAsync("/api/auth/provision", new ProvisionRequest(
            FirstName: req.FirstName,
            LastName: req.LastName,
            Email: req.Email
        ), ct);

        if (!res.IsSuccessStatusCode)
            throw new InvalidOperationException(await res.Content.ReadAsStringAsync(ct));

        var txt = await res.Content.ReadAsStringAsync(ct);

        System.Diagnostics.Debug.WriteLine($"PROVISION status={res.StatusCode} body={txt}");
        res.EnsureSuccessStatusCode();

        return true;
    }
}
