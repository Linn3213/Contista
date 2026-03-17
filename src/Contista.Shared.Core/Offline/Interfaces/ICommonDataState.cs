using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces
{
    public interface ICommonDataState<T> where T : class
    {
        T? Current { get; }
        string? Version { get; }
        DateTime? CachedAtUtc { get; }
        bool HasData { get; }
        bool IsRefreshing { get; }

        event Action? Changed;
        void Clear();
        Task EnsureLoadedAsync(CancellationToken ct = default);
        Task RefreshAsync(bool force = false, CancellationToken ct = default);
    }
}
