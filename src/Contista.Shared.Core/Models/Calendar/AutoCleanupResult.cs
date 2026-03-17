using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Models.Calendar;

public sealed class AutoCleanupResult
{
    public bool IsOk { get; private set; }
    public bool IsOverLimit { get; private set; }
    public int TotalEvents { get; private set; }
    public int MaxAllowed { get; private set; }

    public static AutoCleanupResult None() => new() { IsOk = true };

    public static AutoCleanupResult Ok(int total, int max) => new()
    {
        IsOk = true,
        TotalEvents = total,
        MaxAllowed = max
    };

    public static AutoCleanupResult OverLimit(int total, int max) => new()
    {
        IsOk = false,
        IsOverLimit = true,
        TotalEvents = total,
        MaxAllowed = max
    };
}

