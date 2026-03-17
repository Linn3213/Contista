using System.Text.Json;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;
using Microsoft.Maui.Storage;

namespace Contista.Offline
{
    public sealed class JsonFileSyncQueue : ISyncQueue
    {
        private readonly string _path;
        private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);
        private readonly SemaphoreSlim _gate = new(1, 1);

        public JsonFileSyncQueue()
        {
            var dir = Path.Combine(FileSystem.AppDataDirectory, "sync");
            Directory.CreateDirectory(dir);
            _path = Path.Combine(dir, "queue.v1.json");
        }

        public async Task<SyncQueueItem?> GetByIdAsync(string id, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(id)) return null;

            await _gate.WaitAsync(ct);
            try
            {
                var list = await LoadUnsafeAsync(ct);
                return list.FirstOrDefault(x => x.Id == id);
            }
            finally
            {
                _gate.Release();
            }
        }

        public async Task<IReadOnlyList<SyncQueueItem>> GetAllAsync(CancellationToken ct = default)
        {
            await _gate.WaitAsync(ct);
            try
            {
                var list = await LoadUnsafeAsync(ct);
                return list.OrderBy(i => i.CreatedAtUtc).ToList();
            }
            finally
            {
                _gate.Release();
            }
        }

        public async Task EnqueueAsync(SyncOperation operation, CancellationToken ct = default)
        {
            ct.ThrowIfCancellationRequested();
            if (string.IsNullOrWhiteSpace(operation.ClientOperationId))
                operation.ClientOperationId = Guid.NewGuid().ToString("N");

            var id = operation.ClientOperationId!;

            await _gate.WaitAsync(ct);
            try
            {
                var list = await LoadUnsafeAsync(ct);

                // Dedupe: om samma ClientOperationId redan finns -> ersätt
                var idx = list.FindIndex(x => x.Id == id);
                var existing = idx >= 0 ? list[idx] : null;

                var createdAt = existing?.CreatedAtUtc ?? DateTime.UtcNow;
                var attempts = existing?.Attempts ?? 0;

                var item = new SyncQueueItem
                {
                    Id = id,
                    CreatedAtUtc = createdAt,
                    Attempts = attempts,
                    Status = SyncQueueStatus.Pending,
                    LastError = null,
                    LastAttemptUtc = null,
                    Operation = operation
                };

                if (idx >= 0) list[idx] = item;
                else list.Add(item);

                await SaveUnsafeAsync(list, ct);
            }
            finally
            {
                _gate.Release();
            }
        }

        public async Task MarkDoneAsync(string operationId, CancellationToken ct = default)
        {
            await _gate.WaitAsync(ct);
            try
            {
                var list = await LoadUnsafeAsync(ct);
                var idx = list.FindIndex(x => x.Id == operationId);
                if (idx < 0) return;

                if (idx >= 0)
                {
                    var cur = list[idx];
                    cur.Status = SyncQueueStatus.Done;
                    cur.LastError = null;
                    cur.LastAttemptUtc = DateTime.UtcNow;

                    list[idx] = cur;
                    await SaveUnsafeAsync(list, ct);
                }
            }
            finally
            {
                _gate.Release();
            }
        }

        public async Task MarkFailedAsync(string operationId, string error, CancellationToken ct = default)
        {
            await _gate.WaitAsync(ct);
            try
            {
                var list = await LoadUnsafeAsync(ct);
                var idx = list.FindIndex(x => x.Id == operationId);
                if (idx < 0) return;

                if (idx >= 0)
                {
                    var cur = list[idx];
                    cur.Attempts++;
                    cur.LastError = error;
                    cur.Status = SyncQueueStatus.Failed;
                    cur.LastAttemptUtc = DateTime.UtcNow;

                    list[idx] = cur;
                    await SaveUnsafeAsync(list, ct);
                }
            }
            finally
            {
                _gate.Release();
            }
        }

        public async Task ClearAsync(CancellationToken ct = default)
        {
            await _gate.WaitAsync(ct);
            try
            {
                if (File.Exists(_path))
                    File.Delete(_path);
            }
            finally
            {
                _gate.Release();
            }
        }

        public async Task UpsertAsync(SyncQueueItem item, CancellationToken ct = default)
        {
            ct.ThrowIfCancellationRequested();

            await _gate.WaitAsync(ct);
            try
            {
                var list = await LoadUnsafeAsync(ct);

                // Säkerställ id
                if (string.IsNullOrWhiteSpace(item.Id))
                {
                    var opId = item.Operation?.ClientOperationId;
                    item.Id = !string.IsNullOrWhiteSpace(opId) ? opId! : Guid.NewGuid().ToString("N");
                }

                // Säkerställ att operation också har CorrelationId
                if (item.Operation != null && string.IsNullOrWhiteSpace(item.Operation.ClientOperationId))
                    item.Operation.ClientOperationId = item.Id;

                var idx = list.FindIndex(x => x.Id == item.Id);
                if (idx >= 0) list[idx] = item;
                else list.Add(item);

                await SaveUnsafeAsync(list, ct);
            }
            finally
            {
                _gate.Release();
            }
        }

        public async Task<SyncQueueItem?> GetNextPendingAsync(CancellationToken ct = default)
        {
            await _gate.WaitAsync(ct);
            try
            {
                var list = await LoadUnsafeAsync(ct);
                return list
                    .Where(x => x.Status == SyncQueueStatus.Pending)
                    .OrderBy(x => x.CreatedAtUtc)
                    .FirstOrDefault();
            }
            finally
            {
                _gate.Release();
            }
        }

        public async Task<int> CountAsync(SyncQueueStatus status, CancellationToken ct = default)
        {
            await _gate.WaitAsync(ct);
            try
            {
                var list = await LoadUnsafeAsync(ct);
                return list.Count(x => x.Status == status);
            }
            finally
            {
                _gate.Release();
            }
        }


        public async Task DeleteAsync(string operationId, CancellationToken ct = default)
        {
            await _gate.WaitAsync(ct);
            try
            {
                var list = await LoadUnsafeAsync(ct);
                list.RemoveAll(x => x.Id == operationId);
                await SaveUnsafeAsync(list, ct);
            }
            finally
            {
                _gate.Release();
            }
        }

        // --------- Internals (NO LOCK) ---------

        private async Task<List<SyncQueueItem>> LoadUnsafeAsync(CancellationToken ct)
        {
            if (!File.Exists(_path)) return new List<SyncQueueItem>();
            try
            {
                var json = await File.ReadAllTextAsync(_path, ct);
                return JsonSerializer.Deserialize<List<SyncQueueItem>>(json, JsonOpts) ?? new();
            }
            catch
            {
                // Om filen är trasig: börja om (hellre än att crasha)
                return new();
            }
        }

        private async Task SaveUnsafeAsync(List<SyncQueueItem> list, CancellationToken ct)
        {
            var json = JsonSerializer.Serialize(list, JsonOpts);
            await File.WriteAllTextAsync(_path, json, ct);
        }
    }
}
