using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces;

public interface IUserDirectoryState
{
    string? TryGetName(string? uid);
    Task EnsureLoadedAsync(IEnumerable<string?> uids, CancellationToken ct = default);

}
