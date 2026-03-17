namespace Contista.Shared.Core.Interfaces.Calendar;

public interface IReminderStartupService
{
    /// <summary>
    /// Startar bakgrundsuppdatering av reminders (idempotent).
    /// Ska kallas efter login/session-resume.
    /// </summary>
    void Start();

    /// <summary>
    /// Stoppar timer och rensar scheduler (idempotent).
    /// Ska kallas vid logout.
    /// </summary>
    void Stop();
}