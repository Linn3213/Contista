using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Models;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace Contista.Infrastructure.Firestore.Repos;

/// <summary>
/// Basrepo för dokument i subcollections / dynamiska collection-paths
/// Ex: users/{uid}/public, calendars/{id}/members, etc.
/// </summary>
public abstract class BaseSubcollectionRepository<T> : BaseRepository<T>
{
    protected BaseSubcollectionRepository(HttpClient http, string projectId, IRequestAuth auth)
        : base(http, projectId, collection: "noop", auth) { }

    // ----------------------------
    // GET BY ID
    // ----------------------------
    protected Task<T?> GetByIdAtPathAsync(
        string collectionPath,
        string docId,
        Func<FirestoreDocument, string, T> mapper,
        CancellationToken ct = default)
        => GetByIdCoreAsync(collectionPath, docId, mapper, tokenOverride: null, ct);

    protected Task<T?> GetByIdWithTokenAsync(
        string collectionPath,
        string docId,
        Func<FirestoreDocument, string, T> mapper,
        string idToken,
        CancellationToken ct = default)
        => GetByIdCoreAsync(collectionPath, docId, mapper, tokenOverride: idToken, ct);

    private async Task<T?> GetByIdCoreAsync(
        string collectionPath,
        string docId,
        Func<FirestoreDocument, string, T> mapper,
        string? tokenOverride,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");
        if (string.IsNullOrWhiteSpace(docId)) throw new InvalidOperationException("docId saknas.");

        var url = BuildDocUrl(collectionPath, docId);
        var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true, tokenOverride: tokenOverride);
        var response = await SendAsyncWithRetry(request, ct);

        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return default;

        if (!response.IsSuccessStatusCode)
            return default;

        var doc = await response.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
        return doc is null ? default : mapper(doc, docId);
    }

    // ----------------------------
    // GET ALL
    // ----------------------------
    protected Task<List<T>> GetAllAtPathAsync(
        string collectionPath,
        Func<FirestoreDocument, string, T> mapper,
        CancellationToken ct = default)
        => GetAllCoreAsync(collectionPath, mapper, tokenOverride: null, ct);

    protected Task<List<T>> GetAllWithTokenAsync(
        string collectionPath,
        Func<FirestoreDocument, string, T> mapper,
        string idToken,
        CancellationToken ct = default)
        => GetAllCoreAsync(collectionPath, mapper, tokenOverride: idToken, ct);

    private async Task<List<T>> GetAllCoreAsync(
        string collectionPath,
        Func<FirestoreDocument, string, T> mapper,
        string? tokenOverride,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");

        var url = BuildCollectionUrl(collectionPath);
        var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true, tokenOverride: tokenOverride);
        var response = await SendAsyncWithRetry(request, ct);

        if (!response.IsSuccessStatusCode)
            return new List<T>();

        var firestoreList = await response.Content.ReadFromJsonAsync<FirestoreListResponse>(cancellationToken: ct);

        var result = new List<T>();
        if (firestoreList?.Documents != null)
        {
            foreach (var d in firestoreList.Documents)
            {
                var id = d.Name.Split('/').Last();
                result.Add(mapper(d, id));
            }
        }

        return result;
    }

    // ----------------------------
    // CREATE (utan docId) – Firestore genererar id
    // ----------------------------
    protected Task<string?> CreateAtPathAsync(
        string collectionPath,
        FirestoreDocument doc,
        CancellationToken ct = default)
        => CreateAtPathCoreAsync(collectionPath, doc, tokenOverride: null, ct);

    protected Task<string?> CreateAtPathWithTokenAsync(
        string collectionPath,
        FirestoreDocument doc,
        string idToken,
        CancellationToken ct = default)
        => CreateAtPathCoreAsync(collectionPath, doc, tokenOverride: idToken, ct);

    private async Task<string?> CreateAtPathCoreAsync(
        string collectionPath,
        FirestoreDocument doc,
        string? tokenOverride,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");

        var url = BuildCollectionUrl(collectionPath);

        var json = JsonSerializer.Serialize(doc, new JsonSerializerOptions { WriteIndented = true });
        var request = await CreateRequestAsync(HttpMethod.Post, url, requireAuth: true, tokenOverride: tokenOverride);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await SendAsyncWithRetry(request, ct);

        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync(ct);
            throw new InvalidOperationException($"CreateAtPathAsync failed: {response.StatusCode} {err}");
        }

        var created = await response.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
        return created?.Name?.Split('/').Last();
    }

    // ----------------------------
    // CREATE WITH ID (POST ?documentId=)
    // ----------------------------
    protected Task<string?> CreateWithIdAtPathAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        CancellationToken ct = default)
        => CreateWithIdAtPathCoreAsync(collectionPath, docId, doc, tokenOverride: null, ct);

    protected Task<string?> CreateWithIdAtPathWithTokenAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        string idToken,
        CancellationToken ct = default)
        => CreateWithIdAtPathCoreAsync(collectionPath, docId, doc, tokenOverride: idToken, ct);

    private async Task<string?> CreateWithIdAtPathCoreAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        string? tokenOverride,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");
        if (string.IsNullOrWhiteSpace(docId)) throw new InvalidOperationException("docId saknas.");

        var url = $"{BuildCollectionUrl(collectionPath)}?documentId={Uri.EscapeDataString(docId)}";

        var json = JsonSerializer.Serialize(doc, new JsonSerializerOptions { WriteIndented = true });
        var request = await CreateRequestAsync(HttpMethod.Post, url, requireAuth: true, tokenOverride: tokenOverride);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await SendAsyncWithRetry(request, ct);

        if (response.IsSuccessStatusCode)
            return docId;

        var errorJson = await response.Content.ReadAsStringAsync(ct);

        if (response.StatusCode == System.Net.HttpStatusCode.Conflict ||
            errorJson.Contains("ALREADY_EXISTS", StringComparison.OrdinalIgnoreCase))
        {
            return docId;
        }

        throw new InvalidOperationException($"CreateWithIdAtPathAsync failed: {errorJson}");
    }

    // ----------------------------
    // UPSERT MERGE WITH ID (POST create -> PATCH updateMask)
    // ----------------------------
    protected Task<string?> UpsertMergeWithIdAtPathAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        CancellationToken ct = default)
        => UpsertMergeWithIdAtPathCoreAsync(collectionPath, docId, doc, tokenOverride: null, ct);

    protected Task<string?> UpsertMergeWithIdAtPathWithTokenAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        string idToken,
        CancellationToken ct = default)
        => UpsertMergeWithIdAtPathCoreAsync(collectionPath, docId, doc, tokenOverride: idToken, ct);

    private async Task<string?> UpsertMergeWithIdAtPathCoreAsync(
    string collectionPath,
    string docId,
    FirestoreDocument doc,
    string? tokenOverride,
    CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");
        if (string.IsNullOrWhiteSpace(docId)) throw new InvalidOperationException("docId saknas.");

        // Vi vill MERGE:a fälten i doc.Fields
        var fields = doc.Fields ?? new Dictionary<string, FirestoreValue>();
        if (fields.Count == 0)
            return docId;

        var json = JsonSerializer.Serialize(doc, new JsonSerializerOptions { WriteIndented = true });

        // 1) PATCH först (updateMask på alla fält vi skickar)
        var mask = string.Join("&", fields.Keys.Select(k =>
            $"updateMask.fieldPaths={Uri.EscapeDataString(k)}"));

        var patchUrl = $"{BuildDocUrl(collectionPath, docId)}?{mask}";
        var patchReq = await CreateRequestAsync(HttpMethod.Patch, patchUrl, requireAuth: true, tokenOverride: tokenOverride);
        patchReq.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var patchResp = await SendAsyncWithRetry(patchReq, ct);

        if (patchResp.IsSuccessStatusCode)
            return docId;

        // Om doc inte finns -> försök CREATE
        if (patchResp.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            var createUrl = $"{BuildCollectionUrl(collectionPath)}?documentId={Uri.EscapeDataString(docId)}";
            var createReq = await CreateRequestAsync(HttpMethod.Post, createUrl, requireAuth: true, tokenOverride: tokenOverride);
            createReq.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var createResp = await SendAsyncWithRetry(createReq, ct);

            if (createResp.IsSuccessStatusCode)
                return docId;

            var createErr = await createResp.Content.ReadAsStringAsync(ct);

            // Race: någon hann skapa mellan patch och create
            if (createResp.StatusCode == System.Net.HttpStatusCode.Conflict ||
                createErr.Contains("ALREADY_EXISTS", StringComparison.OrdinalIgnoreCase))
            {
                return docId;
            }

            throw new InvalidOperationException($"UpsertMergeWithIdAtPathAsync CREATE failed: {createResp.StatusCode} {createErr}");
        }

        // Annat fel (t.ex. 403) -> bubbla upp tydligt
        var patchErr = await patchResp.Content.ReadAsStringAsync(ct);
        throw new InvalidOperationException($"UpsertMergeWithIdAtPathAsync PATCH failed: {patchResp.StatusCode} {patchErr}");
    }

    // ----------------------------
    // PATCH (hela doc) – enklast
    // ----------------------------
    protected Task<bool> PatchAtPathAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        CancellationToken ct = default)
        => PatchAtPathCoreAsync(collectionPath, docId, doc, tokenOverride: null, ct);

    protected Task<bool> PatchAtPathWithTokenAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        string idToken,
        CancellationToken ct = default)
        => PatchAtPathCoreAsync(collectionPath, docId, doc, tokenOverride: idToken, ct);

    private async Task<bool> PatchAtPathCoreAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        string? tokenOverride,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");
        if (string.IsNullOrWhiteSpace(docId)) throw new InvalidOperationException("docId saknas.");

        var url = BuildDocUrl(collectionPath, docId);

        var request = await CreateRequestAsync(HttpMethod.Patch, url, doc, requireAuth: true, tokenOverride: tokenOverride);
        var response = await SendAsyncWithRetry(request, ct);

        return response.IsSuccessStatusCode;
    }

    // ----------------------------
    // PATCH med updateMask (som du gör i posts)
    // ----------------------------
    protected Task<bool> PatchWithUpdateMaskAtPathAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        IEnumerable<string> fieldPaths,
        CancellationToken ct = default)
        => PatchWithUpdateMaskCoreAsync(collectionPath, docId, doc, fieldPaths, tokenOverride: null, ct);

    protected Task<bool> PatchWithUpdateMaskAtPathWithTokenAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        IEnumerable<string> fieldPaths,
        string idToken,
        CancellationToken ct = default)
        => PatchWithUpdateMaskCoreAsync(collectionPath, docId, doc, fieldPaths, tokenOverride: idToken, ct);

    private async Task<bool> PatchWithUpdateMaskCoreAsync(
        string collectionPath,
        string docId,
        FirestoreDocument doc,
        IEnumerable<string> fieldPaths,
        string? tokenOverride,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");
        if (string.IsNullOrWhiteSpace(docId)) throw new InvalidOperationException("docId saknas.");

        var fields = fieldPaths?.Where(x => !string.IsNullOrWhiteSpace(x)).ToList() ?? new List<string>();
        var mask = string.Join("&", fields.Select(k => $"updateMask.fieldPaths={Uri.EscapeDataString(k)}"));

        var url = BuildDocUrl(collectionPath, docId);
        if (!string.IsNullOrWhiteSpace(mask))
            url += "?" + mask;

        var json = JsonSerializer.Serialize(doc, new JsonSerializerOptions { WriteIndented = true });

        var request = await CreateRequestAsync(HttpMethod.Patch, url, requireAuth: true, tokenOverride: tokenOverride);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await SendAsyncWithRetry(request, ct);
        return response.IsSuccessStatusCode;
    }

    // ----------------------------
    // DELETE
    // ----------------------------
    protected Task<bool> DeleteAtPathAsync(
        string collectionPath,
        string docId,
        CancellationToken ct = default)
        => DeleteAtPathCoreAsync(collectionPath, docId, tokenOverride: null, ct);

    protected Task<bool> DeleteAtPathWithTokenAsync(
        string collectionPath,
        string docId,
        string idToken,
        CancellationToken ct = default)
        => DeleteAtPathCoreAsync(collectionPath, docId, tokenOverride: idToken, ct);

    private async Task<bool> DeleteAtPathCoreAsync(
        string collectionPath,
        string docId,
        string? tokenOverride,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");
        if (string.IsNullOrWhiteSpace(docId)) throw new InvalidOperationException("docId saknas.");

        var url = BuildDocUrl(collectionPath, docId);
        var request = await CreateRequestAsync(HttpMethod.Delete, url, requireAuth: true, tokenOverride: tokenOverride);
        var response = await SendAsyncWithRetry(request, ct);

        return response.IsSuccessStatusCode;
    }

    // ----------------------------
    // GET BY ID (projection, utan token)
    // ----------------------------
    protected async Task<TOut?> GetByIdAtPathAsync<TOut>(
        string collectionPath,
        string docId,
        Func<FirestoreDocument, string, TOut> mapper,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");
        if (string.IsNullOrWhiteSpace(docId)) throw new InvalidOperationException("docId saknas.");

        var url = BuildDocUrl(collectionPath, docId);
        var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true, tokenOverride: null);
        var response = await SendAsyncWithRetry(request, ct);

        if (!response.IsSuccessStatusCode)
            return default;

        var doc = await response.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
        return doc is null ? default : mapper(doc, docId);
    }

    // ----------------------------
    // GET BY ID (projection, med token)
    // ----------------------------
    protected async Task<TOut?> GetByIdAtPathWithTokenAsync<TOut>(
        string collectionPath,
        string docId,
        Func<FirestoreDocument, string, TOut> mapper,
        string idToken,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");
        if (string.IsNullOrWhiteSpace(docId)) throw new InvalidOperationException("docId saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        var url = BuildDocUrl(collectionPath, docId);
        var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true, tokenOverride: idToken);
        var response = await SendAsyncWithRetry(request, ct);

        if (!response.IsSuccessStatusCode)
            return default;

        var doc = await response.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
        return doc is null ? default : mapper(doc, docId);
    }

    // ----------------------------
    // GET ALL (projection, utan token)
    // ----------------------------
    protected async Task<List<TOut>> GetAllAtPathAsync<TOut>(
        string collectionPath,
        Func<FirestoreDocument, string, TOut> mapper,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");

        var url = BuildCollectionUrl(collectionPath);
        var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true, tokenOverride: null);
        var response = await SendAsyncWithRetry(request, ct);

        if (!response.IsSuccessStatusCode)
            return new List<TOut>();

        var firestoreList = await response.Content.ReadFromJsonAsync<FirestoreListResponse>(cancellationToken: ct);

        var result = new List<TOut>();
        if (firestoreList?.Documents != null)
        {
            foreach (var d in firestoreList.Documents)
            {
                var id = d.Name.Split('/').Last();
                result.Add(mapper(d, id));
            }
        }

        return result;
    }

    // ----------------------------
    // GET ALL (projection, med token)
    // ----------------------------
    protected async Task<List<TOut>> GetAllAtPathWithTokenAsync<TOut>(
        string collectionPath,
        Func<FirestoreDocument, string, TOut> mapper,
        string idToken,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(collectionPath)) throw new InvalidOperationException("collectionPath saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        var url = BuildCollectionUrl(collectionPath);
        var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true, tokenOverride: idToken);
        var response = await SendAsyncWithRetry(request, ct);

        if (!response.IsSuccessStatusCode)
            return new List<TOut>();

        var firestoreList = await response.Content.ReadFromJsonAsync<FirestoreListResponse>(cancellationToken: ct);

        var result = new List<TOut>();
        if (firestoreList?.Documents != null)
        {
            foreach (var d in firestoreList.Documents)
            {
                var id = d.Name.Split('/').Last();
                result.Add(mapper(d, id));
            }
        }

        return result;
    }
}
