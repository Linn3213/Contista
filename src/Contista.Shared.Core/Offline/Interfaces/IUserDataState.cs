namespace Contista.Shared.Core.Offline.Interfaces;

public interface IUserDataState<T> where T : class
{
    T? Current { get; }
    string? Version { get; }
    DateTime? CachedAtUtc { get; }
    bool HasData { get; }
    bool IsRefreshing { get; }

    event Action? Changed;

    Task EnsureLoadedAsync(string userId, CancellationToken ct = default);
    Task RefreshAsync(string userId, bool force = false, CancellationToken ct = default);
    void Clear();
}
