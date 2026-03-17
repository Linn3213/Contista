using System.Net;
using System.Net.Http.Json;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Models.Auth;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;

namespace Contista.Infrastructure.Firestore.Repos;

public sealed class UserDirectoryRepository : BaseRepository<UserDirectoryEntry>, IUserDirectoryRepository
{
    private const string ColByEmail = "userDirectoryByEmail";
    private const string ColByUid = "userDirectoryByUid";

    public UserDirectoryRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
        : base(http, opts.Value.ProjectId, collection: "__not_used__", auth)
    {
    }

    private static string NormalizeEmail(string email)
        => (email ?? "").Trim().ToLowerInvariant();

    private static void ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new InvalidOperationException("email saknas.");

        // enkel sanity-check (du kan göra mer, men detta räcker)
        if (!email.Contains("@", StringComparison.Ordinal) || email.Length < 5)
            throw new InvalidOperationException("email verkar ogiltig.");
    }

    // ============================================================
    // READ: Email -> Entry
    // ============================================================
    public async Task<UserDirectoryEntry?> GetByEmailAsync(string email, string idToken, CancellationToken ct = default)
    {
        ValidateEmail(email);
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        var emailLower = NormalizeEmail(email);

        var url = BuildDocUrl(ColByEmail, emailLower);
        var req = await CreateRequestAsync(HttpMethod.Get, url, body: null, requireAuth: true, tokenOverride: idToken);
        var resp = await SendAsyncWithRetry(req, ct);

        if (resp.StatusCode == HttpStatusCode.NotFound)
            return null;

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            throw new InvalidOperationException($"UserDirectory GetByEmail failed: {resp.StatusCode} {err}");
        }

        var doc = await resp.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
        return doc is null ? null : UserDirectoryMapper.ToModel(doc, docIdFallback: emailLower);
    }

    public async Task<string?> ResolveUserIdByEmailAsync(string email, string idToken, CancellationToken ct = default)
    {
        var entry = await GetByEmailAsync(email, idToken, ct);
        return string.IsNullOrWhiteSpace(entry?.UserId) ? null : entry!.UserId;
    }

    // ============================================================
    // READ: UID -> Entry
    // ============================================================
    public async Task<UserDirectoryEntry?> GetByUidAsync(string uid, string idToken, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(uid)) throw new InvalidOperationException("uid saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        var url = BuildDocUrl(ColByUid, uid);
        var req = await CreateRequestAsync(HttpMethod.Get, url, body: null, requireAuth: true, tokenOverride: idToken);
        var resp = await SendAsyncWithRetry(req, ct);

        if (resp.StatusCode == HttpStatusCode.NotFound)
            return null;

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            throw new InvalidOperationException($"UserDirectory GetByUid failed: {resp.StatusCode} {err}");
        }

        var doc = await resp.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
        return doc is null ? null : UserDirectoryMapper.ToModel(doc, docIdFallback: uid);
    }

    // ============================================================
    // WRITE: Upsert by Email docId = emailLower
    // ============================================================
    public async Task<bool> UpsertByEmailAsync(UserDirectoryEntry entry, string idToken, CancellationToken ct = default)
    {
        if (entry is null) throw new ArgumentNullException(nameof(entry));
        if (string.IsNullOrWhiteSpace(entry.UserId)) throw new InvalidOperationException("entry.UserId saknas.");
        if (string.IsNullOrWhiteSpace(entry.EmailLower)) throw new InvalidOperationException("entry.EmailLower saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        entry.EmailLower = NormalizeEmail(entry.EmailLower);
        entry.UpdatedAtUtc = DateTime.UtcNow;

        var docId = entry.EmailLower;
        var fsDoc = UserDirectoryMapper.FromModel(entry);

        // PATCH (upsert merge) – samma pattern som i dina andra repos
        var updateMask = string.Join("&", (fsDoc.Fields ?? new()).Keys.Select(k => $"updateMask.fieldPaths={Uri.EscapeDataString(k)}"));
        var url = BuildDocUrl(ColByEmail, docId) + (string.IsNullOrWhiteSpace(updateMask) ? "" : $"?{updateMask}");

        var req = await CreateRequestAsync(HttpMethod.Patch, url, fsDoc, requireAuth: true, tokenOverride: idToken);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            throw new InvalidOperationException($"UserDirectory UpsertByEmail failed: {resp.StatusCode} {err}");
        }

        return true;
    }

    // ============================================================
    // WRITE: Upsert by UID docId = uid
    // ============================================================
    public async Task<bool> UpsertByUidAsync(UserDirectoryEntry entry, string idToken, CancellationToken ct = default)
    {
        if (entry is null) throw new ArgumentNullException(nameof(entry));
        if (string.IsNullOrWhiteSpace(entry.UserId)) throw new InvalidOperationException("entry.UserId saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        entry.EmailLower = NormalizeEmail(entry.EmailLower);
        entry.UpdatedAtUtc = DateTime.UtcNow;

        var docId = entry.UserId;
        var fsDoc = UserDirectoryMapper.FromModel(entry);

        var updateMask = string.Join("&", (fsDoc.Fields ?? new()).Keys.Select(k => $"updateMask.fieldPaths={Uri.EscapeDataString(k)}"));
        var url = BuildDocUrl(ColByUid, docId) + (string.IsNullOrWhiteSpace(updateMask) ? "" : $"?{updateMask}");

        var req = await CreateRequestAsync(HttpMethod.Patch, url, fsDoc, requireAuth: true, tokenOverride: idToken);
        var resp = await SendAsyncWithRetry(req, ct);

        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync(ct);
            throw new InvalidOperationException($"UserDirectory UpsertByUid failed: {resp.StatusCode} {err}");
        }

        return true;
    }

    // ============================================================
    // WRITE: Upsert both indexes
    // ============================================================
    public async Task<bool> UpsertBothAsync(
        string uid,
        string displayName,
        string email,
        string idToken,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(uid)) throw new InvalidOperationException("uid saknas.");
        ValidateEmail(email);
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        var emailLower = NormalizeEmail(email);

        var entry = new UserDirectoryEntry
        {
            UserId = uid,
            DisplayName = displayName ?? "",
            EmailLower = emailLower,
            UpdatedAtUtc = DateTime.UtcNow
        };

        // skriv båda. (Om du vill: parallellisera, men detta är tydligare och lättare att felsöka)
        await UpsertByUidAsync(entry, idToken, ct);
        await UpsertByEmailAsync(entry, idToken, ct);

        return true;
    }
}
