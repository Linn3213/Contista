using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Models.Calendar;

namespace Contista.Shared.Core.Services.Calendar;

public sealed class ReminderHub : IReminderHub
{
    public event Action<TriggeredReminder>? ReminderTriggered;

    public void Publish(TriggeredReminder reminder)
        => ReminderTriggered?.Invoke(reminder);
}
