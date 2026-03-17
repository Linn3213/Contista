using Contista.Shared.Core.Http;

namespace Contista.Shared.Core.Offline.Logic;

public static class RetryPolicy
{
    public static TimeSpan GetBackoff(int attempts, TimeSpan? max = null)
    {
        // attempts=1 => 2s, 2 => 4s, 3 => 8s...
        var seconds = 2 * Math.Pow(2, Math.Max(0, attempts - 1));
        var cap = (max ?? TimeSpan.FromMinutes(5)).TotalSeconds;
        return TimeSpan.FromSeconds(Math.Min(cap, seconds));
    }

    public static bool ShouldRetry(ApiFailure failure, int attempts, int maxAttempts)
        => failure.IsTransient && attempts < maxAttempts;
}
