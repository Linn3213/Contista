using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Models
{
    public sealed record CacheEnvelope<T>(
    string Key,
    string? Version,
    DateTime UpdatedAtUtc,
    T Data);
}
