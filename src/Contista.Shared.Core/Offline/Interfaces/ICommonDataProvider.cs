using Contista.Shared.Core.Offline.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces
{
    public interface ICommonDataProvider
    {
        Task<CommonCacheEnvelope?> GetCommonAsync(bool forceRefresh = false, CancellationToken ct = default);
    }
}
