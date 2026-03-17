namespace Contista.Shared.Core.Models.Calendar;

/// <summary>
/// Centralt register för alla kalenderfärger i Contista.
/// Används av:
/// - provisioning (default Primary)
/// - UI rendering
/// - framtida teman / branding
/// </summary>
public static class CalendarColors
{
    /// <summary>
    /// Namnet på obligatorisk primärfärg.
    /// </summary>
    public const string Primary = "Primary";

    /// <summary>
    /// Alla färger som systemet stödjer.
    /// Key = färgnamn i DB
    /// Value = hex-kod som UI använder.
    /// </summary>
    public static readonly IReadOnlyDictionary<string, string> Map =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            [Primary] = "#2B2622",
            ["Blue"] = "#3B82F6",
            ["Green"] = "#22C55E",
            ["Orange"] = "#F59E0B",
            ["Red"] = "#EF4444",
            ["Purple"] = "#A855F7",
            ["Pink"] = "#EC4899",
            ["Teal"] = "#14B8A6",
            ["Gray"] = "#6B7280"
        };

    /// <summary>
    /// Returnerar hex-kod för färgnamn.
    /// Faller tillbaka till Primary om okänd.
    /// </summary>
    public static string GetHex(string? colorName)
    {
        if (string.IsNullOrWhiteSpace(colorName))
            return Map[Primary];

        return Map.TryGetValue(colorName, out var hex)
            ? hex
            : Map[Primary];
    }

    /// <summary>
    /// Säkerställer att färgnamn är giltigt innan lagring i DB.
    /// </summary>
    public static string Normalize(string? colorName)
    {
        if (string.IsNullOrWhiteSpace(colorName))
            return Primary;

        return Map.ContainsKey(colorName)
            ? colorName
            : Primary;
    }
}
