using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.UserDirectory;

public interface IUserDirectoryDataProvider
{
    Task<Dictionary<string, string>> ResolveUidsAsync(List<string> uids, CancellationToken ct = default);
}
