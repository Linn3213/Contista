using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Models.Calendar;
using Contista.Shared.UI.Services;

namespace Contista.Shared.UI.Utils;

public static class CalendarAvailabilityPolicy
{
    // När eventet är maskat (BusyOnly/private för andra) ska availability alltid upplevas som Busy
    public static CalendarAvailability GetDisplayAvailability(CalendarEventDto ev, CalendarVisibility effectiveVisibility)
    {
        if (ev is null) return CalendarAvailability.Busy;

        if (effectiveVisibility != CalendarVisibility.Details)
            return CalendarAvailability.Busy;

        return ev.Availability;
    }

    // Visa decorations (badge/stripes/ooo-markering) bara när vi får se detaljer
    public static bool ShouldShowAvailabilityDecorations(CalendarVisibility effectiveVisibility)
        => effectiveVisibility == CalendarVisibility.Details;

    public static bool IsBlocking(CalendarAvailability availability)
        => availability == CalendarAvailability.Busy
           || availability == CalendarAvailability.OutOfOffice;

    public static string CssKey(CalendarAvailability a) => a switch
    {
        CalendarAvailability.Free => "free",
        CalendarAvailability.Busy => "busy",
        CalendarAvailability.OutOfOffice => "ooo",
        CalendarAvailability.Tentative => "tentative",
        _ => "busy"
    };

    public static string Label(ILocalizationService loc, CalendarAvailability a) => a switch
    {
        CalendarAvailability.Free => loc.GetOr("Page_Calendar_Availability_Free", "Free"),
        CalendarAvailability.Busy => loc.GetOr("Page_Calendar_Availability_Busy", "Busy"),
        CalendarAvailability.OutOfOffice => loc.GetOr("Page_Calendar_Availability_OutOfOffice", "Out of office"),
        CalendarAvailability.Tentative => loc.GetOr("Page_Calendar_Availability_Tentative", "Tentative"),
        _ => loc.GetOr("Page_Calendar_Availability_Busy", "Busy")
    };
}