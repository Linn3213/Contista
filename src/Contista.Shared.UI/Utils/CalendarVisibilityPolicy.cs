using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Models.Calendar;
using Contista.Shared.UI.Services;

namespace Contista.Shared.UI.Utils;

public static class CalendarVisibilityPolicy
{
    public static bool IsCreator(CalendarEventDto ev, string? currentUserId)
        => !string.IsNullOrWhiteSpace(currentUserId)
           && !string.IsNullOrWhiteSpace(ev?.CreatedById)
           && string.Equals(ev.CreatedById, currentUserId, StringComparison.Ordinal);

    // ✅ EN sann källa (samma regler som du kör i Card idag)
    public static CalendarVisibility EffectiveVisibility(CalendarEventDto ev, string? currentUserId)
    {
        if (ev is null) return CalendarVisibility.Private;

        // PRIVATE: bara skaparen ser (alla andra: dolt helt)
        if (ev.Visibility == CalendarVisibility.Private)
            return IsCreator(ev, currentUserId) ? CalendarVisibility.Details : CalendarVisibility.Private;

        // BUSY ONLY: skaparen ser titel, andra ser BusyOnly
        if (ev.Visibility == CalendarVisibility.BusyOnly)
            return IsCreator(ev, currentUserId) ? CalendarVisibility.Details : CalendarVisibility.BusyOnly;

        // DETAILS: alla med kalenderaccess ser detaljer (synlighet styr)
        return CalendarVisibility.Details;
    }

    public static bool IsHidden(CalendarEventDto ev, string? currentUserId)
        => EffectiveVisibility(ev, currentUserId) == CalendarVisibility.Private;

    public static string DisplayTitle(ILocalizationService loc, CalendarEventDto ev, CalendarVisibility effectiveVisibility)
        => effectiveVisibility == CalendarVisibility.BusyOnly
            ? loc.GetOr("Page_Calendar_Availability_Busy", "Busy")
            : (ev.Title ?? "");
}