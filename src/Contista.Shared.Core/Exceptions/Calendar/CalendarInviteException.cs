namespace Contista.Shared.Core.Exceptions.Calendar;

public sealed class CalendarInviteException : Exception
{
    public string Code { get; }

    public CalendarInviteException(string code, string message)
        : base(message)
    {
        Code = code;
    }
}
