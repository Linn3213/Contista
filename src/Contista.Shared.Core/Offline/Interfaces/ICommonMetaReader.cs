using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces
{
    public interface ICommonMetaReader
    {
        Task<CommonMeta?> GetCommonMetaAsync(CancellationToken ct = default);
    }

    public sealed record CommonMeta(
        string MembershipsVersion,
        string RolesVersion);
}
