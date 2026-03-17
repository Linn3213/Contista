using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Models.Sync;

public sealed record CacheEntry(string Key, string Json, string? Version, DateTime? UpdatedAtUtc);
