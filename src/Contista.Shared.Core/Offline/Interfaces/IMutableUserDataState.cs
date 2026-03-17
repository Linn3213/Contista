using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces;

public interface IMutableUserDataState<T> : IUserDataState<T> where T : class
{
    /// <summary>
    /// Uppdaterar Current lokalt (optimistic UI) och triggar Changed.
    /// Skyddar mot fel user.
    /// </summary>
    Task<bool> TryApplyLocalPatchAsync(string userId, Func<T, T> patch, CancellationToken ct = default);
}
