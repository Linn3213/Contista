using System.Net;
using System.Net.Http;

namespace Contista.Http;

public sealed class MauiCookieHttpHandler
{
    private readonly CookieContainer _cookies = new();

    public HttpMessageHandler CreateHandler()
    {
        var handler = new HttpClientHandler
        {
            CookieContainer = _cookies,
            UseCookies = true,
            AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
        };

#if DEBUG
        // DEV: acceptera self-signed cert i debug (för emulator/localhost)
        handler.ServerCertificateCustomValidationCallback =
            HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
#endif

        return handler;
    }
}
