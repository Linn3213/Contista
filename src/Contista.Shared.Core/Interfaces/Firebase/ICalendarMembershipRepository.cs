using Contista.Shared.Core.DTO.Calendar;

namespace Contista.Shared.Core.Interfaces.Firebase;

public interface ICalendarMembershipRepository
{
    Task<List<CalendarMembershipDto>> GetMembersAsync(string calendarId, CancellationToken ct = default);
    Task<CalendarMembershipDto?> GetMemberAsync(string calendarId, string userId, CancellationToken ct = default);

    Task<List<CalendarMemberRowDto>> GetMemberRowsAsync(string calendarId, CancellationToken ct = default);

    Task<bool> CreateMemberWithTokenAsync(
        string calendarId,
        string userId,
        CalendarMembershipDto membership,
        string idToken,
        CancellationToken ct = default);

    Task<bool> UpsertMemberAsync(string calendarId, string userId, CalendarMembershipDto membership, CancellationToken ct = default);
    Task<bool> UpsertMemberWithTokenAsync(string calendarId, string userId, CalendarMembershipDto membership, string idToken, CancellationToken ct = default);

    Task<bool> RemoveMemberAsync(string calendarId, string userId, CancellationToken ct = default);

    Task<bool> PatchInviteAcceptedWithTokenAsync(
    string calendarId,
    string userId,
    string idToken,
    CancellationToken ct = default);
}
