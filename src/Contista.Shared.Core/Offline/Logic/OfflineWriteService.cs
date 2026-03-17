using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Mappers;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Offline.Models.Operations;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Contista.Shared.Core.Offline.Logic;
// En tjänst för att köa upp skriv-operationer för offline-synkronisering
public sealed class OfflineWriteService : IOfflineWriteService
{
    private readonly ISyncQueue _queue;
    private readonly ISyncRunner _syncRunner;
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public OfflineWriteService(ISyncQueue queue, ISyncRunner syncRunner)
    {
        _queue = queue;
        _syncRunner = syncRunner;
    }

    public async Task<string> EnqueueAsync(SyncOperationEnvelope envelope, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(envelope.UserId))
            throw new ArgumentException("UserId måste vara satt på operationen.");

        if (string.IsNullOrWhiteSpace(envelope.ClientOperationId))
            envelope.ClientOperationId = Guid.NewGuid().ToString("N");

        // ✅ Komprimering (bara för calendar event temp_*)
        // Returnerar true om operationen "konsumerades" (dvs vi ska INTE lägga till ny queue-item)
        var consumed = await TryCompressCalendarTempEventOpsAsync(envelope, ct);
        if (consumed)
        {
            // Vi ändrade/ta bort något i kön => trigga synk ändå
            await _syncRunner.TriggerAsync(ct);
            return envelope.ClientOperationId;
        }

        // ✅ KONVERTERA envelope → operation
        var op = SyncOperationMapper.FromEnvelope(envelope);

        var item = new SyncQueueItem
        {
            Id = op.ClientOperationId,
            CreatedAtUtc = DateTime.UtcNow,
            Attempts = 0,
            Status = SyncQueueStatus.Pending,
            LastError = null,
            LastAttemptUtc = null,
            Operation = op
        };

        await _queue.UpsertAsync(item, ct);
        await _syncRunner.TriggerAsync(ct);
        return item.Id;
    }

    public Task<int> GetPendingCountAsync(CancellationToken ct = default)
        => _queue.CountAsync(SyncQueueStatus.Pending, ct);

    // --------------------------------------------------------------------
    // ✅ Queue compression for CalendarEvent temp_*
    // --------------------------------------------------------------------
    private async Task<bool> TryCompressCalendarTempEventOpsAsync(SyncOperationEnvelope envelope, CancellationToken ct)
    {
        // Vi komprimerar bara CalendarEvent Update/Delete när EventId = temp_<createOpId>
        if (envelope.OperationType != SyncOperationType.UpdateCalendarEvent &&
            envelope.OperationType != SyncOperationType.DeleteCalendarEvent)
        {
            return false;
        }

        // Payload ligger som JsonElement (envelope.Payload)
        // Update: UpdateCalendarEventOperationDto
        // Delete: DeleteCalendarEventOperationDto

        if (envelope.OperationType == SyncOperationType.DeleteCalendarEvent)
        {
            var dto = Deserialize<DeleteCalendarEventOperationDto>(envelope.Payload);
            if (dto is null) return false;

            if (!IsTempId(dto.EventId, out var createOpId))
                return false; // inte temp => komprimera ej

            // Om createOpId finns i kön -> ta bort den, enqueua inte delete
            var createItem = await _queue.GetByIdAsync(createOpId, ct);
            if (createItem is null)
                return false; // create finns inte i kö => då måste delete enqueuas normalt

            if (createItem.Operation.OperationType != SyncOperationType.CreateCalendarEvent)
                return false; // safety: fel typ

            await _queue.DeleteAsync(createOpId, ct);
            return true; // consumed (delete behövs inte)
        }

        if (envelope.OperationType == SyncOperationType.UpdateCalendarEvent)
        {
            var dto = Deserialize<UpdateCalendarEventOperationDto>(envelope.Payload);
            if (dto?.Event is null) return false;

            if (!IsTempId(dto.Event.EventId, out var createOpId))
                return false; // inte temp => komprimera ej

            // Hitta create-op i kön och "merga" update in i create payload
            var createItem = await _queue.GetByIdAsync(createOpId, ct);
            if (createItem is null)
                return false; // create finns inte i kö => då måste update enqueuas normalt

            if (createItem.Operation.OperationType != SyncOperationType.CreateCalendarEvent)
                return false;

            // Parse create payload
            var createDto = DeserializeFromJson<CreateCalendarEventOperationDto>(createItem.Operation.PayloadJson);
            if (createDto?.Event is null)
                return false;

            // ✅ Merge: ersätt eventet i create med senaste versionen
            // Behåll temp EventId (ska fortfarande vara temp_<createOpId>)
            // Behåll CalendarId osv som användaren uppdaterat
            var merged = dto.Event;
            merged.EventId = "temp_" + createOpId;

            createDto.Event = merged;

            // Uppdatera payload json på createItem
            createItem.Operation.PayloadJson = JsonSerializer.Serialize(createDto, JsonOpts);

            // (valfritt) bumpa "CreatedAt" eller "LastAttempt" – jag låter CreatedAt vara
            await _queue.UpsertAsync(createItem, ct);

            return true; // consumed (update-op behövs inte)
        }

        return false;
    }

    private static bool IsTempId(string? eventId, out string createOpId)
    {
        createOpId = "";
        if (string.IsNullOrWhiteSpace(eventId)) return false;

        const string prefix = "temp_";
        if (!eventId.StartsWith(prefix, StringComparison.Ordinal))
            return false;

        var suffix = eventId.Substring(prefix.Length);
        if (string.IsNullOrWhiteSpace(suffix))
            return false;

        createOpId = suffix;
        return true;
    }

    private static T? Deserialize<T>(JsonElement payload)
    {
        try
        {
            // payload är JsonElement, serialize->deserialize är ok här
            var raw = payload.GetRawText();
            return JsonSerializer.Deserialize<T>(raw, JsonOpts);
        }
        catch
        {
            return default;
        }
    }

    private static T? DeserializeFromJson<T>(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return default;
        try
        {
            return JsonSerializer.Deserialize<T>(json, JsonOpts);
        }
        catch
        {
            return default;
        }
    }
}

