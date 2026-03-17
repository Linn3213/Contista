using Contista.Shared.UI.Services;
using System;

namespace Contista.Shared.UI.Utils;

public static class CalendarLocationHelper
{
    public static bool HasValue(string? location)
        => !string.IsNullOrWhiteSpace(location);

    public static string Clean(string? location)
        => string.IsNullOrWhiteSpace(location)
            ? string.Empty
            : location.Trim();

    public static bool IsAbsoluteUrl(string? location)
    {
        var value = Clean(location);
        if (string.IsNullOrWhiteSpace(value))
            return false;

        return Uri.TryCreate(value, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }

    public static bool LooksLikeDomainWithoutScheme(string? location)
    {
        var value = Clean(location);
        if (string.IsNullOrWhiteSpace(value))
            return false;

        if (value.Contains(' '))
            return false;

        if (value.StartsWith("www.", StringComparison.OrdinalIgnoreCase))
            return true;

        return value.Contains('.')
               && !value.StartsWith("/")
               && !value.Contains("\\");
    }

    public static bool IsMeetingLikeLink(string? location)
    {
        var value = Clean(location);

        if (string.IsNullOrWhiteSpace(value))
            return false;

        var normalized = value.ToLowerInvariant();

        return normalized.Contains("teams.microsoft.com")
               || normalized.Contains("meet.google.com")
               || normalized.Contains("zoom.us")
               || normalized.Contains("whereby.com")
               || normalized.Contains("webex.com");
    }

    public static bool IsLinkLike(string? location)
        => IsAbsoluteUrl(location) || LooksLikeDomainWithoutScheme(location);

    public static string BuildOpenHref(string? location)
    {
        var value = Clean(location);

        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        if (IsAbsoluteUrl(value))
            return value;

        if (LooksLikeDomainWithoutScheme(value))
            return $"https://{value}";

        return $"https://www.google.com/maps/search/?api=1&query={Uri.EscapeDataString(value)}";
    }

    public static string GetOpenLabel(ILocalizationService loc, string? location)
    {
        if (IsMeetingLikeLink(location) || IsLinkLike(location))
            return loc.GetOr("Common_Action_OpenLink", "Open link");

        return loc.GetOr("Common_Action_OpenMap", "Open map");
    }

    public static string GetDisplayText(string? location)
        => Clean(location);
}