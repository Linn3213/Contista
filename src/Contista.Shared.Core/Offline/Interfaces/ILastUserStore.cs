namespace Contista.Shared.Core.Offline.Interfaces;

public interface ILastUserStore
{
    Task<LastUser?> TryGetAsync(CancellationToken ct = default);
    Task SetAsync(LastUser user, CancellationToken ct = default);
    Task ClearAsync(CancellationToken ct = default);
}

public sealed record LastUser(string UserId, string? Email);
