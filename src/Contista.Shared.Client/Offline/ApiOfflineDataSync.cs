using Contista.Shared.Client.Http;
using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Http;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models.Auth;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Offline.Models.Sync;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Text;

namespace Contista.Shared.Client.Offline;

public sealed class ApiOfflineDataSync : IOfflineDataSync
{
    private readonly HttpClient _http;
    private readonly IFirebaseAuthService _auth;
    private readonly INetworkStatus _network;

    public ApiOfflineDataSync(HttpClient http, IFirebaseAuthService auth, INetworkStatus network)
    {
        _http = http;
        _auth = auth;
        _network = network;
    }

    public async Task<(bool ok, string? version, object? data)> FetchCommonAsync(string? knownVersion, CancellationToken ct = default)
    {
        if (!_network.IsOnline)
            throw new ApiFailureException(new ApiFailure(ApiFailureKind.Offline, null, "Offline"));

        try
        {
            var req = new HttpRequestMessage(HttpMethod.Get, "api/common");
            if (!string.IsNullOrWhiteSpace(knownVersion))
                req.Headers.TryAddWithoutValidation("If-None-Match", $"\"{knownVersion}\"");

            var resp = await _http.SendAsync(req, ct);

            // ✅ 401/403 ska INTE bli ok=false tyst, utan klassificeras
            if (resp.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
            {
                var body = await SafeReadAsync(resp, ct);
                var failure = ApiFailureClassifier.FromHttp(resp.StatusCode, body);
                throw new ApiFailureException(failure);
            }

            if (resp.StatusCode == HttpStatusCode.NoContent)
                return (true, knownVersion, null);

            if (!resp.IsSuccessStatusCode)
            {
                var body = await SafeReadAsync(resp, ct);
                var failure = ApiFailureClassifier.FromHttp(resp.StatusCode, body);
                throw new ApiFailureException(failure);
            }

            var payload = await resp.Content.ReadFromJsonAsync<Envelope<CommonDataDto>>(cancellationToken: ct);
            return (true, payload?.Version, payload?.Data);
        }
        catch (ApiFailureException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new ApiFailureException(ApiFailureClassifier.FromException(ex));
        }
    }

    private static async Task<string?> SafeReadAsync(HttpResponseMessage resp, CancellationToken ct)
    {
        try { return await resp.Content.ReadAsStringAsync(ct); }
        catch { return null; }
    }


    public async Task<(bool ok, string? version, object? data)> FetchUserAsync(
    string userId,
    string? knownVersion,
    CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        // ✅ Guard: ingen HTTP när offline
        if (!_network.IsOnline)
            throw new ApiFailureException(new ApiFailure(ApiFailureKind.Offline, null, "Offline"));

        // ✅ Inte inloggad => inget att hämta (INTE "auth invalid")
        if (!_auth.IsLoggedIn || string.IsNullOrWhiteSpace(_auth.Uid))
            return (false, knownVersion, null);

        try
        {
            // 1) Profile
            using var profileReq = new HttpRequestMessage(HttpMethod.Get, "/api/auth/profile");
            using var profileResp = await _http.SendAsync(profileReq, ct);

            if (profileResp.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
            {
                var body = await SafeReadAsync(profileResp, ct);
                throw new ApiFailureException(ApiFailureClassifier.FromHttp(profileResp.StatusCode, body));
            }

            if (!profileResp.IsSuccessStatusCode)
            {
                var body = await SafeReadAsync(profileResp, ct);
                throw new ApiFailureException(ApiFailureClassifier.FromHttp(profileResp.StatusCode, body));
            }

            var profile = await profileResp.Content.ReadFromJsonAsync<UserProfile>(cancellationToken: ct);
            if (profile is null)
                throw new ApiFailureException(new ApiFailure(ApiFailureKind.ServerError, 500, "Profile payload was null"));

            // 2) Posts
            using var postsReq = new HttpRequestMessage(HttpMethod.Get, "/api/user/posts");
            using var postsResp = await _http.SendAsync(postsReq, ct);

            if (postsResp.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
            {
                var body = await SafeReadAsync(postsResp, ct);
                throw new ApiFailureException(ApiFailureClassifier.FromHttp(postsResp.StatusCode, body));
            }

            if (!postsResp.IsSuccessStatusCode)
            {
                var body = await SafeReadAsync(postsResp, ct);
                throw new ApiFailureException(ApiFailureClassifier.FromHttp(postsResp.StatusCode, body));
            }

            var posts = await postsResp.Content.ReadFromJsonAsync<List<ContentPost>>(cancellationToken: ct)
                        ?? new List<ContentPost>();

            var dto = new UserDataDto(
                profile.UserId,
                profile.Firstname,
                profile.Lastname,
                profile.DisplayName,
                profile.Bio,
                profile.Language,
                profile.Email,
                profile.CreatedAt,
                profile.UpdatedAt,
                profile.RoleId,
                profile.MembershipId,
                posts
            );

            // Du har inte ETag/version på user i API ännu
            var version = knownVersion ?? "v1";
            return (true, version, dto);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (ApiFailureException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new ApiFailureException(ApiFailureClassifier.FromException(ex));
        }
    }


    public async Task ApplyOperationAsync(string userId, string idToken, object operationDto, CancellationToken ct = default)
    {
        // ✅ Guard: ingen HTTP när offline
        if (!_network.IsOnline)
            throw new ApiFailureException(new ApiFailure(ApiFailureKind.Offline, null, "Offline"));

        if (!_auth.IsLoggedIn)
            throw new ApiFailureException(new ApiFailure(ApiFailureKind.Unauthorized, 401, "Not logged in"));

        if (operationDto is not SyncOperation op)
            throw new InvalidOperationException("ApplyOperationAsync förväntar SyncOperation som operationDto.");

        if (string.IsNullOrWhiteSpace(op.UserId))
            op.UserId = userId;

        try
        {
            var resp = await _http.PostAsJsonAsync("/api/sync/apply", op, ct);

            if (resp.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
            {
                var body = await resp.Content.ReadAsStringAsync(ct);
                throw new ApiFailureException(ApiFailureClassifier.FromHttp(resp.StatusCode, body));
            }

            if (!resp.IsSuccessStatusCode)
            {
                var body = await resp.Content.ReadAsStringAsync(ct);
                throw new ApiFailureException(ApiFailureClassifier.FromHttp(resp.StatusCode, body));
            }
        }
        catch (ApiFailureException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new ApiFailureException(ApiFailureClassifier.FromException(ex));
        }
    }

    private sealed class Envelope<T>
    {
        public string? Version { get; set; }
        public T? Data { get; set; }
    }
}
