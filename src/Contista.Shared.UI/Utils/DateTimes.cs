namespace Contista.Shared.UI.Utils;

public static class DateTimes
{
    public static DateTime AsUtc(DateTime dt)
        => dt.Kind switch
        {
            DateTimeKind.Utc => dt,
            DateTimeKind.Local => dt.ToUniversalTime(),
            _ => DateTime.SpecifyKind(dt, DateTimeKind.Utc) // Unspecified => behandla som UTC
        };

    public static DateTime ToLocalFromUtc(DateTime dtUtc)
        => AsUtc(dtUtc).ToLocalTime();
}
