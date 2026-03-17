using System.Net;

namespace Contista.Shared.Core.Http;

public enum ApiFailureKind
{
    Offline,
    Unauthorized,
    Forbidden,
    ServerError,
    NotFound,
    BadRequest,
    Timeout,
    RateLimited,
    Unknown
}

public sealed record ApiFailure(
    ApiFailureKind Kind,
    int? StatusCode = null,
    string? Message = null,
    Exception? Exception = null,
    string? Code = null)
{
    public bool IsAuth => Kind is ApiFailureKind.Unauthorized;
    public bool IsForbidden => Kind is ApiFailureKind.Forbidden;
    public bool IsOffline => Kind is ApiFailureKind.Offline or ApiFailureKind.Timeout;
    public bool IsTransient => Kind is ApiFailureKind.Offline or ApiFailureKind.Timeout or ApiFailureKind.ServerError or ApiFailureKind.RateLimited;
}

public static class ApiFailureExtensions
{
    public static ApiFailure WithException(this ApiFailure f, Exception ex)
        => f with { Exception = ex, Message = f.Message ?? ex.Message };
}
