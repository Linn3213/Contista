using Contista.Shared.Core.DTO.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Calendar;

public interface ICalendarRefRepository
{
    Task<List<CalendarRefDto>> GetRefsForUserAsync(string userId, CancellationToken ct = default);
    Task<CalendarRefDto?> GetRefAsync(string userId, string calendarId, CancellationToken ct = default);

    Task<List<CalendarRefDto>> GetRefsForUserWithTokenAsync(string userId, string idToken, CancellationToken ct = default);
    Task<CalendarRefDto?> GetRefWithTokenAsync(string userId, string calendarId, string idToken, CancellationToken ct = default);

    Task<bool> UpsertRefAsync(string userId, CalendarRefDto r, CancellationToken ct = default);
    Task<bool> UpsertRefWithTokenAsync(string userId, CalendarRefDto r, string idToken, CancellationToken ct = default);

    Task<bool> RemoveRefAsync(string userId, string calendarId, CancellationToken ct = default);
    Task<bool> RemoveRefWithTokenAsync(string userId, string calendarId, string idToken, CancellationToken ct = default);
}

