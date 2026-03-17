// Ignore Spelling: Firestore Json

using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Models;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Contista.Infrastructure.Firestore.Repos
{
    public abstract class BaseRepository<T>
    {
        protected readonly HttpClient _http;
        protected readonly string _projectId;
        private readonly string _collection;
        private readonly IRequestAuth _auth;

        protected BaseRepository(HttpClient http, string projectId, string collection, IRequestAuth auth)
        {
            _http = http;
            _projectId = projectId;
            _collection = collection;
            _auth = auth;
        }

        // ✅ Helpers för subcollection paths
        protected string BuildCollectionUrl(string collectionPath)
            => $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{collectionPath}";

        protected string BuildDocUrl(string collectionPath, string docId)
            => $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{collectionPath}/{docId}";

        protected string BuildRunQueryUrl()
            => $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents:runQuery";

        protected async Task<HttpRequestMessage> CreateRequestAsync(
        HttpMethod method,
        string url,
        object? body = null,
        bool requireAuth = false,
        string? tokenOverride = null)
        {
            string? token = tokenOverride;

            if (string.IsNullOrWhiteSpace(token))
            {
                if (requireAuth)
                {
                    token = await _auth.GetValidIdTokenAsync(); 
                }
                else
                {
                    try
                    {
                        if (_auth.IsLoggedIn)
                            token = await _auth.GetValidIdTokenAsync();
                    }
                    catch
                    {
                        token = null;
                    }
                }
            }

            var request = new HttpRequestMessage(method, url);

            if (!string.IsNullOrWhiteSpace(token))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            if (body != null)
                request.Content = JsonContent.Create(body, options: FirestoreJson);

            return request;
        }

        private static readonly JsonSerializerOptions FirestoreJson = new()
        {
            PropertyNamingPolicy = null,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        protected Task<HttpResponseMessage> SendAsyncWithRetry(HttpRequestMessage request)
            => SendAsyncWithRetry(request, CancellationToken.None);


        protected async Task<HttpResponseMessage> SendAsyncWithRetry(
            HttpRequestMessage request,
            CancellationToken ct)
        {
            ct.ThrowIfCancellationRequested();

            HttpResponseMessage response;

            response = await _http.SendAsync(request, ct);

            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized ||
                response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            {
                try
                {
                    ct.ThrowIfCancellationRequested();

                    var newToken = await _auth.GetValidIdTokenAsync();
                    if (!string.IsNullOrWhiteSpace(newToken))
                    {
                        using var retryRequest = await CloneRequestAsync(request, ct);
                        retryRequest.Headers.Authorization =
                            new AuthenticationHeaderValue("Bearer", newToken);

                        response = await _http.SendAsync(retryRequest, ct);
                    }
                }
                catch (OperationCanceledException)
                {
                    throw; // viktigt: bubbla cancellation
                }
                catch
                {
                    // ignore – fallback till original response
                }
            }

            return response;
        }

       

        private static async Task<HttpRequestMessage> CloneRequestAsync(
            HttpRequestMessage request,
            CancellationToken ct = default)
        {
            var clone = new HttpRequestMessage(request.Method, request.RequestUri);

            foreach (var header in request.Headers)
                clone.Headers.TryAddWithoutValidation(header.Key, header.Value);

            if (request.Content is not null)
            {
                var ms = new MemoryStream();
                await request.Content.CopyToAsync(ms, ct);
                ms.Position = 0;

                clone.Content = new StreamContent(ms);

                foreach (var header in request.Content.Headers)
                    clone.Content.Headers.TryAddWithoutValidation(header.Key, header.Value);
            }

            return clone;
        }


        // GET ALL
        protected async Task<List<T>> GetAllAsync(Func<FirestoreDocument, string, T> mapper)
        {
            var url = BuildCollectionUrl(_collection);
            var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true);
            var response = await SendAsyncWithRetry(request);

            response.EnsureSuccessStatusCode();
            var firestoreList = await response.Content.ReadFromJsonAsync<FirestoreListResponse>();

            var result = new List<T>();
            if (firestoreList?.Documents != null)
            {
                foreach (var doc in firestoreList.Documents)
                {
                    result.Add(mapper(doc, doc.Name.Split('/').Last()));
                }
            }
            return result;
        }

        // GET BY ID
        protected async Task<T?> GetByIdAsync(string id, Func<FirestoreDocument, string, T> mapper)
        {
            var url = BuildDocUrl(_collection, id);
            var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true);
            var response = await SendAsyncWithRetry(request);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Firestore error: {response.StatusCode} - {error}");
                return default;
            }

            var doc = await response.Content.ReadFromJsonAsync<FirestoreDocument>();
            return doc != null ? mapper(doc, id) : default;
        }

        protected async Task<T?> GetByIdAsync(string id, Func<FirestoreDocument, string, T> mapper, CancellationToken ct = default)
        {
            var url = BuildDocUrl(_collection, id);
            var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true);
            var response = await SendAsyncWithRetry(request, ct);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Firestore error: {response.StatusCode} - {error}");
                return default;
            }

            var doc = await response.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
            return doc != null ? mapper(doc, id) : default;
        }

        protected async Task<T?> GetByIdAsync(string id, Func<FirestoreDocument, string, T> mapper, string idToken, CancellationToken ct = default)
        {
            var url = BuildDocUrl(_collection, id);
            var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true, tokenOverride: idToken);
            var response = await SendAsyncWithRetry(request, ct);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Firestore error: {response.StatusCode} - {error}");
                return default;
            }

            var doc = await response.Content.ReadFromJsonAsync<FirestoreDocument>(cancellationToken: ct);
            return doc != null ? mapper(doc, id) : default;
        }

        //GET OBJECT BY QUERY
        protected async Task<TModel?> GetObjectWithQueryAsync<TModel>(object structuredQuery, Func<FirestoreDocument, string, TModel> mapper)
        {
            var url = BuildRunQueryUrl();
            var request = await CreateRequestAsync(HttpMethod.Post, url, new { structuredQuery }, requireAuth: true);
            var response = await SendAsyncWithRetry(request);

            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<List<JsonElement>>();
            if (result == null || result.Count == 0)
                return default;

            var docElem = result
                .Where(r => r.ValueKind == JsonValueKind.Object && r.TryGetProperty("document", out _))
                .Select(r => r.GetProperty("document"))
                .FirstOrDefault();

            if (docElem.ValueKind == JsonValueKind.Undefined)
                return default;

            var name = docElem.GetProperty("name").GetString() ?? "";
            var id = name.Split('/').Last();

            var fields = docElem.GetProperty("fields").Deserialize<Dictionary<string, FirestoreValue>>();

            var firestoreDoc = new FirestoreDocument
            {
                Name = name,
                Fields = fields
            };

            return mapper(firestoreDoc, id);
        }

        protected async Task<TModel?> GetObjectWithQueryAsync<TModel>(
            object structuredQuery, 
            Func<FirestoreDocument, 
            string, TModel> mapper,
            string idToken,
            CancellationToken ct = default)
        {
            var url = BuildRunQueryUrl();
            var request = await CreateRequestAsync(HttpMethod.Post, url, new { structuredQuery }, requireAuth: true, tokenOverride: idToken);
            var response = await SendAsyncWithRetry(request);

            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<List<JsonElement>>();
            if (result == null || result.Count == 0)
                return default;

            var docElem = result
                .Where(r => r.ValueKind == JsonValueKind.Object && r.TryGetProperty("document", out _))
                .Select(r => r.GetProperty("document"))
                .FirstOrDefault();

            if (docElem.ValueKind == JsonValueKind.Undefined)
                return default;

            var name = docElem.GetProperty("name").GetString() ?? "";
            var id = name.Split('/').Last();

            var fields = docElem.GetProperty("fields").Deserialize<Dictionary<string, FirestoreValue>>();

            var firestoreDoc = new FirestoreDocument
            {
                Name = name,
                Fields = fields
            };

            return mapper(firestoreDoc, id);
        }

        protected async Task<List<TModel>> GetObjectsWithQueryAsync<TModel>(object structuredQuery, Func<FirestoreDocument, string, TModel> mapper)
        {
            var url = BuildRunQueryUrl();
            var request = await CreateRequestAsync(HttpMethod.Post, url, new { structuredQuery }, requireAuth: true);

            var response = await SendAsyncWithRetry(request);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<List<JsonElement>>();
            var list = new List<TModel>();

            if (result == null) return list;

            foreach (var r in result)
            {
                if (!r.TryGetProperty("document", out var doc)) continue;
                var name = doc.GetProperty("name").GetString() ?? "";
                var id = name.Split('/').Last();
                var fields = doc.GetProperty("fields").Deserialize<Dictionary<string, FirestoreValue>>();
                var firestoreDoc = new FirestoreDocument { Name = name, Fields = fields };
                list.Add(mapper(firestoreDoc, id));
            }

            return list;
        }

        //GET ALL WITH QUERY
        protected async Task<List<FirestoreDocument>> GetAllWithQueryAsync(object structuredQuery)
        {
            var url = BuildRunQueryUrl();
            var request = await CreateRequestAsync(HttpMethod.Post, url, new { structuredQuery }, requireAuth: true);

            var response = await SendAsyncWithRetry(request);
            response.EnsureSuccessStatusCode();

            var results = await response.Content.ReadFromJsonAsync<List<JsonElement>>();

            var documents = new List<FirestoreDocument>();
            foreach (var item in results!)
            {
                if (item.TryGetProperty("document", out var doc))
                {
                    var fsDoc = doc.Deserialize<FirestoreDocument>();
                    if (fsDoc != null)
                    {
                        documents.Add(fsDoc);
                    }
                }
            }
            return documents;
        }

        // CREATE
        protected async Task<string?> CreateAsync(FirestoreDocument doc)
        {
            var url = BuildCollectionUrl(_collection);
            var request = await CreateRequestAsync(HttpMethod.Post, url, doc, requireAuth: true);

            var response = await SendAsyncWithRetry(request);
            if (response.IsSuccessStatusCode)
            {
                var created = await response.Content.ReadFromJsonAsync<FirestoreDocument>();
                return created?.Name?.Split('/').Last();
            }

            var err = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Create failed: {err}");
            return null;
        }

        //protected async Task<string?> CreateWithIdAsync(string id, FirestoreDocument doc)
        //{
        //    var token = await _auth.GetValidIdTokenAsync();


        //    var url = $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{_collection}?documentId={id}";

        //    var options = new JsonSerializerOptions { WriteIndented = true };
        //    var json = JsonSerializer.Serialize(doc, options);

        //    Console.WriteLine(">>> FIRESTORE REQUEST JSON >>>");
        //    Console.WriteLine(json);

        //    var request = await CreateRequestAsync(HttpMethod.Post, url, requireAuth: true);
        //    request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        //    var response = await SendAsyncWithRetry(request);

        //    if (response.IsSuccessStatusCode)
        //    {
        //        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        //        var name = result.GetProperty("name").GetString();
        //        var documentId = name?.Split('/').Last();
        //        return await CreateWithIdAsync(id, doc, token);
        //    }
        //    else
        //    {
        //        var errorJson = await response.Content.ReadAsStringAsync();
        //        var firebaseError = JsonSerializer.Deserialize<FirebaseErrorResponse>(errorJson);

        //        var message = firebaseError?.error?.message ?? "Okänt fel";

        //        if (message == "EMAIL_EXISTS")
        //            throw new InvalidOperationException("E-postadressen är redan registrerad. Logga in istället.");

        //        throw new InvalidOperationException($"Registreringen misslyckades: {message}");
        //    }
        //}

        protected async Task<string?> CreateWithIdAsync(
            string id,
            FirestoreDocument doc,
            string idToken,
            CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(idToken))
                throw new InvalidOperationException("IdToken saknas. Kan inte skapa dokument i Firestore.");

            var url =
                $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{_collection}?documentId={id}";

            var options = new JsonSerializerOptions { WriteIndented = true };
            var json = JsonSerializer.Serialize(doc, FirestoreJson);

            var request = await CreateRequestAsync(
                HttpMethod.Post,
                url,
                requireAuth: true,
                tokenOverride: idToken);

            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await SendAsyncWithRetry(request);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
                var name = result.GetProperty("name").GetString();
                return name?.Split('/').Last();
            }

            var errorJson = await response.Content.ReadAsStringAsync(ct);
            if (response.StatusCode == System.Net.HttpStatusCode.Conflict ||
                errorJson.Contains("ALREADY_EXISTS", StringComparison.OrdinalIgnoreCase))
            {
                return id;
            }

            throw new InvalidOperationException($"CreateWithIdAsync failed: {errorJson}");
        }

        protected async Task<string?> UpsertMergeWithIdAsync(
            string id,
            FirestoreDocument doc,
            string idToken,
            CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(idToken))
                throw new InvalidOperationException("IdToken saknas.");

            // 1) CREATE (POST ?documentId=)
            var createUrl =
                $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{_collection}?documentId={id}";

            var json = JsonSerializer.Serialize(doc, new JsonSerializerOptions { WriteIndented = true });

            var createReq = await CreateRequestAsync(HttpMethod.Post, createUrl, requireAuth: true, tokenOverride: idToken);
            createReq.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var createResp = await SendAsyncWithRetry(createReq, ct);

            if (createResp.IsSuccessStatusCode)
                return id;

            var err = await createResp.Content.ReadAsStringAsync(ct);

            // 2) EXISTS -> PATCH MERGE (updateMask)
            if (createResp.StatusCode == System.Net.HttpStatusCode.Conflict ||
                err.Contains("ALREADY_EXISTS", StringComparison.OrdinalIgnoreCase))
            {
                if (doc.Fields == null || doc.Fields.Count == 0)
                    return id; // inget att uppdatera

                var mask = string.Join("&", doc.Fields.Keys.Select(k =>
                    $"updateMask.fieldPaths={Uri.EscapeDataString(k)}"));

                var patchUrl =
                    $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{_collection}/{id}?{mask}";

                var patchReq = await CreateRequestAsync(HttpMethod.Patch, patchUrl, requireAuth: true, tokenOverride: idToken);
                patchReq.Content = new StringContent(json, Encoding.UTF8, "application/json");

                var patchResp = await SendAsyncWithRetry(patchReq, ct);

                if (!patchResp.IsSuccessStatusCode)
                {
                    var patchErr = await patchResp.Content.ReadAsStringAsync(ct);
                    throw new InvalidOperationException($"UpsertMergeWithIdAsync PATCH failed: {patchErr}");
                }

                return id;
            }

            throw new InvalidOperationException($"UpsertMergeWithIdAsync POST failed: {err}");
        }

        // UPDATE
        protected async Task<bool> UpdateAsync(string id, FirestoreDocument doc)
        {
            var url = BuildDocUrl(_collection, id);
            var request = await CreateRequestAsync(HttpMethod.Patch, url, doc, requireAuth: true);

            var response = await SendAsyncWithRetry(request);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"UpdateAsync failed: {error}");
            }

            response.EnsureSuccessStatusCode();
            return response.IsSuccessStatusCode;
        }

        protected Task<bool> UpdateFieldAsync(string id, Dictionary<string, FirestoreValue> fields)
            => UpdateFieldAsync(id, fields, CancellationToken.None);

        protected async Task<bool> UpdateFieldAsync(string id, Dictionary<string, FirestoreValue> fields, CancellationToken ct)
        {
            var doc = new FirestoreDocument { Fields = fields };
            var updateMask = string.Join("&", fields.Keys.Select(k => $"updateMask.fieldPaths={k}"));
            var url = $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{_collection}/{id}?{updateMask}";

            var request = await CreateRequestAsync(HttpMethod.Patch, url, doc, requireAuth: true);
            var response = await SendAsyncWithRetry(request); // (kan också få ct om du vill gå längre)

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync(ct);
                Console.WriteLine($"UpdateFieldAsync failed: {err}");
            }

            response.EnsureSuccessStatusCode();
            return response.IsSuccessStatusCode;
        }

        protected async Task<bool> UpdateArrayUnionAsync(string id, string field, IEnumerable<string> values)
        {
            try
            {
                var getUrl = BuildDocUrl(_collection, id);
                var getRequest = await CreateRequestAsync(HttpMethod.Get, getUrl, requireAuth: true);
                var getResponse = await SendAsyncWithRetry(getRequest);

                if (!getResponse.IsSuccessStatusCode)
                {
                    Console.WriteLine($"⚠️ Failed to fetch document before update: {getResponse.StatusCode}");
                    return false;
                }

                var json = await getResponse.Content.ReadAsStringAsync();
                var existingDoc = JsonSerializer.Deserialize<FirestoreDocument>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                var existingArray = existingDoc?.Fields != null
                    && existingDoc.Fields.TryGetValue(field, out var fv)
                    && fv.ArrayValue?.Values != null
                        ? fv.ArrayValue.Values.Select(v => v.StringValue ?? "").Where(x => x != "").ToList()
                        : new List<string>();

                foreach (var val in values)
                {
                    if (!existingArray.Contains(val))
                        existingArray.Add(val);
                }

                var updateDoc = new FirestoreDocument
                {
                    Fields = new Dictionary<string, FirestoreValue>
                    {
                        {
                            field, new FirestoreValue
                            {
                                ArrayValue = new FirestoreArray
                                {
                                    Values = existingArray.Select(v => new FirestoreValue { StringValue = v }).ToList()
                                }
                            }
                        }
                    }
                };

                var patchUrl = $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{_collection}/{id}?updateMask.fieldPaths={field}";
                var patchRequest = await CreateRequestAsync(HttpMethod.Patch, patchUrl, updateDoc, requireAuth: true);
                var patchResponse = await SendAsyncWithRetry(patchRequest);

                if (!patchResponse.IsSuccessStatusCode)
                {
                    var err = await patchResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"❌ UpdateArrayUnionAsync failed: {err}");
                }

                return patchResponse.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🔥 Exception in UpdateArrayUnionAsync: {ex.Message}");
                return false;
            }
        }

        protected async Task<bool> AddToArrayUnionAsync(string id, string field, IEnumerable<string> values, CancellationToken ct = default)
        {
            var docPath = $"projects/{_projectId}/databases/(default)/documents/{_collection}/{id}";
            var url = $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents:commit";

            var requestBody = new
            {
                writes = new object[]
                {
            new
            {
                transform = new
                {
                    document = docPath,
                    fieldTransforms = new object[]
                    {
                        new
                        {
                            fieldPath = field,
                            appendMissingElements = new
                            {
                                values = values.Select(v => new { stringValue = v }).ToArray()
                            }
                        }
                    }
                }
            }
                }
            };

            var request = await CreateRequestAsync(HttpMethod.Post, url, requestBody, requireAuth: true);
            var response = await SendAsyncWithRetry(request, ct);

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync(ct);
                Console.WriteLine($"AddToArrayUnionAsync failed: {response.StatusCode} {err}");
            }

            return response.IsSuccessStatusCode;
        }


        protected async Task<bool> UpdateMapFieldAsync(string id, string mapField, string key, string value)
        {
            var getUrl = BuildDocUrl(_collection, id);
            var getRequest = await CreateRequestAsync(HttpMethod.Get, getUrl, requireAuth: true);

            var getResponse = await SendAsyncWithRetry(getRequest);
            if (!getResponse.IsSuccessStatusCode) return false;

            var docJson = await getResponse.Content.ReadFromJsonAsync<FirestoreDocument>();
            var existingMap = new Dictionary<string, FirestoreValue>();
            if (docJson?.Fields != null && docJson.Fields.TryGetValue(mapField, out var mapValue) && mapValue.MapValue?.Fields != null)
            {
                existingMap = mapValue.MapValue.Fields;
            }

            existingMap[key] = new FirestoreValue { StringValue = value };

            var patchDoc = new FirestoreDocument
            {
                Fields = new Dictionary<string, FirestoreValue>
                {
                    { mapField, new FirestoreValue { MapValue = new FirestoreMap { Fields = existingMap } } }
                }
            };

            var patchUrl = $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{_collection}/{id}?updateMask.fieldPaths={mapField}";
            var patchRequest = await CreateRequestAsync(HttpMethod.Patch, patchUrl, patchDoc, requireAuth: true);

            var patchResponse = await SendAsyncWithRetry(patchRequest);
            return patchResponse.IsSuccessStatusCode;
        }

        protected async Task<bool> UpdateArrayRemoveAsync(string id, string field, IEnumerable<string> values)
        {
            var url = $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{_collection}/{id}?updateMask.fieldPaths={field}";
            var body = new
            {
                fields = new Dictionary<string, object>
                {
                    {
                        field, new
                        {
                            arrayValue = new
                            {
                                values = values.Select(v => new { stringValue = v }).ToList()
                            }
                        }
                    }
                }
            };

            var request = await CreateRequestAsync(HttpMethod.Patch, url, body, requireAuth: true);
            var response = await SendAsyncWithRetry(request);
            return response.IsSuccessStatusCode;
        }

        protected async Task<bool> RemoveMapFieldAsync(string id, string parentField, string key)
        {
            var safeKey = System.Text.RegularExpressions.Regex.IsMatch(key, "^[a-zA-Z_][a-zA-Z_0-9]*$")
                ? key
                : $"`{key}`";

            var fieldPath = $"{parentField}.{safeKey}";
            var url = $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents/{_collection}/{id}?updateMask.fieldPaths={fieldPath}";

            var payload = new
            {
                fields = new { }
            };

            var request = await CreateRequestAsync(HttpMethod.Patch, url, payload, requireAuth: true);
            var response = await SendAsyncWithRetry(request);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"❌ RemoveMapFieldAsync failed: {response.StatusCode} - {error}");
            }

            return response.IsSuccessStatusCode;
        }

        protected async Task<bool> RemoveFromArrayAsync(string id, string field, IEnumerable<string> values)
        {
            if (string.IsNullOrWhiteSpace(_auth.IdToken))
                throw new InvalidOperationException("Auth missing. Logga in först.");

            var docPath = $"projects/{_projectId}/databases/(default)/documents/{_collection}/{id}";
            var url = $"https://firestore.googleapis.com/v1/projects/{_projectId}/databases/(default)/documents:commit";

            var requestBody = new
            {
                writes = new object[]
                {
                    new
                    {
                        transform = new
                        {
                            document = docPath,
                            fieldTransforms = new object[]
                            {
                                new
                                {
                                    fieldPath = field,
                                    removeAllFromArray = new
                                    {
                                        values = values.Select(v => new { stringValue = v }).ToArray()
                                    }
                                }
                            }
                        }
                    }
                }
            };

            var request = await CreateRequestAsync(HttpMethod.Post, url, requestBody, requireAuth: true);
            var response = await SendAsyncWithRetry(request);
            var respText = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"RemoveFromArrayAsync failed: {response.StatusCode} {respText}");
            }
            else
            {
                Console.WriteLine($"RemoveFromArrayAsync OK: {respText}");
            }

            return response.IsSuccessStatusCode;
        }

        // DELETE
        protected async Task<bool> DeleteAsync(string id)
        {
            var url = BuildDocUrl(_collection, id);
            var request = await CreateRequestAsync(HttpMethod.Delete, url, requireAuth: true);

            var response = await SendAsyncWithRetry(request);
            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"DeleteAsync failed: {err}");
            }

            return response.IsSuccessStatusCode;
        }

        protected async Task<bool> DeleteAsync(string id, string idToken, CancellationToken ct = default)
        {
            var url = BuildDocUrl(_collection, id);
            var request = await CreateRequestAsync(HttpMethod.Delete, url, requireAuth: true, tokenOverride: idToken);

            var response = await SendAsyncWithRetry(request);
            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"DeleteAsync failed: {err}");
            }

            return response.IsSuccessStatusCode;
        }

        protected async Task<FirestoreDocument?> GetDocumentAsync(string id)
        {
            var url = BuildDocUrl(_collection, id);
            var request = await CreateRequestAsync(HttpMethod.Get, url, requireAuth: true);

            var response = await SendAsyncWithRetry(request);
            if (!response.IsSuccessStatusCode)
            {
                var errorText = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"GetDocumentAsync error: {response.StatusCode} {errorText}");
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            try
            {
                return JsonSerializer.Deserialize<FirestoreDocument>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Deserialization error: {ex.Message}");
                return null;
            }
        }

        public async Task<BulkSaveResult> SaveAllAsync<TModel>(
            IEnumerable<TModel> items,
            Func<TModel, string?> getId,
            Func<TModel, FirestoreDocument> mapFunc,
            bool createIfMissing = true)
        {
            var result = new BulkSaveResult();

            foreach (var item in items)
            {
                result.TotalTried++;
                try
                {
                    var id = getId(item);
                    var doc = mapFunc(item);

                    if (!string.IsNullOrWhiteSpace(id))
                    {
                        var ok = await UpdateAsync(id!, doc);
                        if (ok) result.Updated++;
                        else result.Errors.Add($"Update failed for id '{id}'.");
                    }
                    else
                    {
                        if (!createIfMissing)
                        {
                            result.Errors.Add("Missing id and createIfMissing=false.");
                            continue;
                        }

                        var newId = await CreateAsync(doc);
                        if (!string.IsNullOrEmpty(newId)) result.Created++;
                        else result.Errors.Add("Create returned null/empty id.");
                    }
                }
                catch (Exception ex)
                {
                    result.Errors.Add(ex.Message);
                }
            }

            return result;
        }

        public async Task<string> ExportToJsonAsync(Func<FirestoreDocument, string, T> mapFunc)
        {
            var allItems = await GetAllAsync(mapFunc);
            if (allItems == null || allItems.Count == 0)
                return "[]";

            var json = JsonSerializer.Serialize(allItems, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            return json;
        }
    }

    public class FirestoreDocumentResponse
    {
        public string? Name { get; set; }
    }
}
