using Contista.Shared.Core.DTO.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Firebase;

public interface ICalendarSettingsRepository
{
    Task<CalendarSettingsDto?> GetSettingsAsync(string userId, CancellationToken ct = default);
    Task<CalendarSettingsDto?> GetSettingsWithTokenAsync(string userId, string idToken, CancellationToken ct = default);

    Task<bool> UpsertSettingsAsync(CalendarSettingsDto settings, CancellationToken ct = default);
    Task<bool> UpsertSettingsWithTokenAsync(CalendarSettingsDto settings, string idToken, CancellationToken ct = default);
}
