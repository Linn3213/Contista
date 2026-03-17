namespace Contista.Shared.Core.Http;

public static class HttpProblemDetails
{
    public static string? TryReadCode(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            return null;

        try
        {
            using var doc = System.Text.Json.JsonDocument.Parse(raw);
            if (!doc.RootElement.TryGetProperty("code", out var directCode)
                || directCode.ValueKind != System.Text.Json.JsonValueKind.String)
            {
                if (!doc.RootElement.TryGetProperty("extensions", out var ext)
                    || ext.ValueKind != System.Text.Json.JsonValueKind.Object
                    || !ext.TryGetProperty("code", out directCode)
                    || directCode.ValueKind != System.Text.Json.JsonValueKind.String)
                    return null;
            }

            return directCode.GetString();
        }
        catch
        {
            return null;
        }
    }
}
