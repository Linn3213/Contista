using Contista.Shared.Core.Models.Calendar;

namespace Contista.Shared.Core.Interfaces.Calendar;

public interface IReminderHub
{
    event Action<TriggeredReminder>? ReminderTriggered;
    void Publish(TriggeredReminder reminder);
}
