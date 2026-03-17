using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces
{
    public interface IOfflineFileStore
    {
        Task<bool> ExistsAsync(string fileName, CancellationToken ct = default);
        Task<string?> ReadTextAsync(string fileName, CancellationToken ct = default);
        Task WriteTextAsync(string fileName, string content, CancellationToken ct = default);
        Task DeleteAsync(string fileName, CancellationToken ct = default);
    }
}
