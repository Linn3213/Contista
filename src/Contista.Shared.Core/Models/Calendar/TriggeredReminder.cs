namespace Contista.Shared.Core.Models.Calendar;

public sealed class TriggeredReminder
{
    public string EventId { get; init; } = "";
    public string EventTitle { get; init; } = "";

    // När den var tänkt att trigga (lokalt)
    public DateTime TriggeredLocalTime { get; init; }

    // När eventet startar (lokalt) – så UI kan skriva “Startar 11:00”
    public DateTime EventStartLocalTime { get; init; }

    // Behöver du för logik/felsökning men vi visar inte detta i UI längre
    public int MinutesBeforeStart { get; init; }
}
