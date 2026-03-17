using Contista.Shared.Core.DTO.Calendar;

namespace Contista.Shared.Core.Interfaces.Calendar;

public interface IReminderScheduler
{
    void UpdateEvents(IEnumerable<CalendarEventDto>? events);
}
