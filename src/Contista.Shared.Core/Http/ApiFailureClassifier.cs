using System.Net;

namespace Contista.Shared.Core.Http;

public static class ApiFailureClassifier
{
    public static ApiFailure FromHttp(HttpStatusCode status, string? message = null)
    {
        var code = (int)status;

        return status switch
        {
            HttpStatusCode.Unauthorized => new(ApiFailureKind.Unauthorized, code, message),
            HttpStatusCode.Forbidden => new(ApiFailureKind.Forbidden, code, message),
            HttpStatusCode.NotFound => new(ApiFailureKind.NotFound, code, message),
            HttpStatusCode.BadRequest => new(ApiFailureKind.BadRequest, code, message),

            _ when code >= 500 => new(ApiFailureKind.ServerError, code, message),

            _ => new(ApiFailureKind.Unknown, code, message),
        };
    }

    public static ApiFailure FromException(Exception ex)
    {
        // Timeout/cancel
        if (ex is TaskCanceledException)
            return new(ApiFailureKind.Timeout, null, ex.Message, ex);

        // HttpClient i WASM:
        // - Offline / DNS / CORS / nät: HttpRequestException utan StatusCode
        // - EnsureSuccessStatusCode: HttpRequestException med StatusCode (i nyare .NET)
        if (ex is HttpRequestException hre)
        {
#if NET8_0_OR_GREATER
            if (hre.StatusCode is HttpStatusCode sc)
                return FromHttp(sc, hre.Message).WithException(hre);
#endif
            return new(ApiFailureKind.Offline, null, hre.Message, hre);
        }

        return new(ApiFailureKind.Unknown, null, ex.Message, ex);
    }
}
