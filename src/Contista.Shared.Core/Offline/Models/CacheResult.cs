using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Models
{
    public sealed record CacheResult<T>(
    bool Found,
    string? Version,
    DateTime? UpdatedAtUtc,
    T? Data)
    {
        public static CacheResult<T> NotFound() => new(false, null, null, default);
        public static CacheResult<T> From(CacheEnvelope<T> env) => new(true, env.Version, env.UpdatedAtUtc, env.Data);
    }
}
