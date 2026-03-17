using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces
{
    /// <summary>
    /// Abstraktion för att hämta data + version, och för att flush:a lokala ändringar.
    /// Implementeras i Infrastructure (Firestore) eller annan backend.
    /// </summary>
    public interface IOfflineDataSync
    {
        // "Common"/publik data (kategorier, roller, membership-planer etc.)
        Task<(bool ok, string? version, object? data)> FetchCommonAsync(
            string? knownVersion,
            CancellationToken ct = default);

        // User-specifik data
        Task<(bool ok, string? version, object? data)> FetchUserAsync(
            string userId,
            string? knownVersion,
            CancellationToken ct = default);

        // Applicera en queued operation till backend
        Task ApplyOperationAsync(string userId, string idToken, object operationDto, CancellationToken ct = default);
    }
}
