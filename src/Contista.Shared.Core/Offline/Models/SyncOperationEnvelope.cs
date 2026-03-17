using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Contista.Shared.Core.Offline.Models;
// En omslagsmodell för att paketera synkroniseringsoperationer
public sealed class SyncOperationEnvelope
{
    public int SchemaVersion { get; set; } = 1;

    public string ClientOperationId { get; set; } = Guid.NewGuid().ToString("N");

    public string UserId { get; set; } = string.Empty;

    public string IdToken { get; set; } = string.Empty;

    public SyncOperationType OperationType { get; set; }

    public DateTime ClientTimestampUtc { get; set; } = DateTime.UtcNow;

    // För enkel konflikt-minimum: klientens uppfattade version
    public string? IfMatchVersion { get; set; }

    // Själva operationens data (Create/Update/Delete payload)
    public JsonElement Payload { get; set; }
}
