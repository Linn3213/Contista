using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;
using System.Net;

namespace Contista.Infrastructure.Firestore.Repos;

public sealed class SyncOpLogRepository
    : BaseSubcollectionRepository<SyncOpLog>, ISyncOpLogRepository
{
    public SyncOpLogRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
        : base(http, opts.Value.ProjectId, auth) { }

    private static string LogPath(string userId) => $"users/{userId}/syncOps";

    public async Task<bool> ExistsAsync(string userId, string operationId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");
        if (string.IsNullOrWhiteSpace(operationId)) throw new InvalidOperationException("operationId saknas.");

        // Vi behöver inte ens mappa hela loggen – men enklast är att mappa minimalt:
        var doc = await GetByIdAtPathAsync(
            LogPath(userId),
            operationId,
            (fs, id) => SyncOpLogMapper.ToLog(fs, userId, id), // om du har ToLog; annars byt mapper
            ct);

        return doc is not null;
    }

    public async Task MarkAppliedAsync(SyncOpLog log, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(log.UserId)) throw new InvalidOperationException("SyncOpLog.UserId saknas.");
        if (string.IsNullOrWhiteSpace(log.OperationId)) throw new InvalidOperationException("SyncOpLog.OperationId saknas.");

        log.AppliedAtUtc = DateTime.UtcNow;

        var doc = SyncOpLogMapper.FromLog(log);

        // idempotent: POST ?documentId={operationId}
        await CreateWithIdAtPathAsync(
            LogPath(log.UserId),
            log.OperationId,
            doc,
            ct);
    }
}
