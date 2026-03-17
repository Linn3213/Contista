using Contista.Shared.Core.Offline.Interfaces;

namespace Contista.Web.Services;

public sealed class NoOpSessionOrchestrator : IAppSessionOrchestrator
{
    public Task<bool> TryResumeSessionAsync(CancellationToken ct = default)
        => Task.FromResult(false);
}