using Contista.Shared.Core.Offline.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces
{
    public interface ICommonCacheService
    {
        Task<CommonCacheEnvelope?> TryLoadAsync(CancellationToken ct = default);
        Task SaveAsync(CommonCacheEnvelope envelope, CancellationToken ct = default);
        Task ClearAsync(CancellationToken ct = default);
    }
}
