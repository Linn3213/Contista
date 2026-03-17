using Contista.Shared.Core.DTO;
using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Models.Auth;
using Contista.Shared.Core.Models.Calendar;

namespace Contista.Infrastructure.Firestore.Services;

public sealed class UserProvisioningService : IUserProvisioningService
{
    private readonly IUserRepository _users;
    private readonly ICalendarRepository _cal;
    private readonly ICalendarSettingsRepository _calSettings;
    private readonly ICalendarMembershipRepository _calMembers;
    private readonly ICalendarRefRepository _calRefs;
    private readonly IUserDirectoryRepository _userDirectory;


    public UserProvisioningService(
        IUserRepository users,
        IUserDirectoryRepository userDirectory,
        ICalendarSettingsRepository calSettings,
        ICalendarMembershipRepository calMembers,
        ICalendarRepository cal,
        ICalendarRefRepository calRefs)
    {
        _users = users;
        _userDirectory = userDirectory;
        _cal = cal;
        _calSettings = calSettings;
        _calMembers = calMembers;
        _calRefs = calRefs;
    }

    public async Task<bool> EnsureUserDocAsync(
        RegisterRequest req,
        string uid,
        string? email,
        string idToken,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(uid))
            throw new InvalidOperationException("UID saknas.");

        if (string.IsNullOrWhiteSpace(idToken))
            throw new InvalidOperationException("IdToken saknas (provisioning kräver auth-token).");

        var now = DateTime.UtcNow;

        var user = new User
        {
            UserId = uid,
            Email = (email ?? req.Email).Trim(),
            FirstName = (req.FirstName ?? "").Trim(),
            LastName = (req.LastName ?? "").Trim(),
            DisplayName = (req.FirstName ?? "").Trim(),
            Created = now,
            UpdatedAt = now
        };

        var docId = await _users.CreateWithIdAsync(uid, user, idToken, ct);

        if (string.IsNullOrWhiteSpace(docId))
            throw new InvalidOperationException("Kunde inte skapa användardokument i Firestore.");


        await _userDirectory.UpsertBothAsync(uid, user.DisplayName, user.Email, idToken, ct);

        return true;
    }
    
    public async Task<bool> EnsureUserDirectoryAsync(
        string uid,
        string? email,
        string idToken,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(uid))
            throw new InvalidOperationException("UID saknas.");

        if (string.IsNullOrWhiteSpace(idToken))
            throw new InvalidOperationException("IdToken saknas (provisioning kräver auth-token).");

        var now = DateTime.UtcNow;

        await _userDirectory.UpsertBothAsync(uid, "", email, idToken, ct);

        return true;
    }

    public async Task<bool> EnsureCalendarProvisionedAsync(
        string userId,
        string idToken,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new InvalidOperationException("UID saknas.");

        if (string.IsNullOrWhiteSpace(idToken))
            throw new InvalidOperationException("IdToken saknas (provisioning kräver auth-token).");


        // 1) Settings redan har primary -> (men säkerställ ref + membership om du vill)
        var settings = await _calSettings.GetSettingsWithTokenAsync(userId, idToken, ct);
        if (settings != null && !string.IsNullOrWhiteSpace(settings.PrimaryCalendarId))
        {
            // “self-heal”: se till att ref finns för primary
            await EnsurePrimaryRefExistsAsync(userId, settings.PrimaryCalendarId!, idToken, ct);
            return true;
        }

        var now = DateTime.UtcNow;

        // 2) Skapa primary calendar
        var calendar = new CalendarDto
        {
            OwnerUserId = userId,
            Name = "Contista",
            IsPrimary = true,
            IsShared = false,
            Color = CalendarColors.Primary,
            ConflictPolicy = CalendarConflictPolicy.Warn,
            DefaultVisibility = CalendarVisibility.Details,
            Provider = CalendarProvider.Contista,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        var calendarId = await _cal.CreateCalendarWithTokenAsync(calendar, idToken, ct);
        if (string.IsNullOrWhiteSpace(calendarId))
            throw new InvalidOperationException("Kunde inte skapa primary calendar.");

        // 3) Skapa owner-member UNDER kalendern: calendars/{calendarId}/members/{userId}
        var membership = new CalendarMembershipDto
        {
            Role = CalendarMemberRole.Owner,
            CanEdit = true,
            CanShare = true,
            CanSeeDetails = true,
            UpdatedAtUtc = now,
            LastMutationId = ""
        };

        var memberOk = await _calMembers.CreateMemberWithTokenAsync(calendarId, userId, membership, idToken, ct);
        if (!memberOk)
            throw new InvalidOperationException("Kunde inte skapa owner membership (rules/payload?).");

        // 3b) Skapa calendarRef: users/{userId}/calendarRefs/{calendarId}
        var refDto = new CalendarRefDto
        {
            CalendarId = calendarId,
            Role = CalendarMemberRole.Owner,
            CanEdit = true,
            CanShare = true,
            CanSeeDetails = true,

            IsSelectedByDefault = true,
            DefaultView = CalendarViewMode.Month,
            UpdatedAtUtc = now,
            LastMutationId = "",
            InviteStatus = CalendarInviteStatus.Accepted
        };

        var refOk = await _calRefs.UpsertRefWithTokenAsync(userId, refDto, idToken, ct);
        if (!refOk)
            throw new InvalidOperationException("Kunde inte skapa calendarRef (rules/payload?).");

        // 4) Skapa/uppdatera settings (under users)
        settings ??= new CalendarSettingsDto { UserId = userId };

        settings.PrimaryCalendarId = calendarId;
        settings.DefaultView = CalendarViewMode.Month;

        settings.SelectedCalendarIds ??= new List<string>();
        if (!settings.SelectedCalendarIds.Contains(calendarId))
            settings.SelectedCalendarIds.Add(calendarId);

        settings.UpdatedAtUtc = now;

        var settingsOk = await _calSettings.UpsertSettingsWithTokenAsync(settings, idToken, ct);
        if (!settingsOk)
            throw new InvalidOperationException("Kunde inte spara calendar settings.");

        return true;
    }

    private async Task EnsurePrimaryRefExistsAsync(string userId, string calendarId, string idToken, CancellationToken ct)
    {
        // Om ref redan finns -> ok
        var existing = await _calRefs.GetRefWithTokenAsync(userId, calendarId, idToken, ct);
        if (existing is not null) return;

        var now = DateTime.UtcNow;
        var refDto = new CalendarRefDto
        {
            CalendarId = calendarId,
            Role = CalendarMemberRole.Owner,
            CanEdit = true,
            CanShare = true,
            CanSeeDetails = true,
            IsSelectedByDefault = true,
            UpdatedAtUtc = now,
            LastMutationId = "",
            InviteStatus = CalendarInviteStatus.Accepted
        };

        await _calRefs.UpsertRefWithTokenAsync(userId, refDto, idToken, ct);
    }

    public Task<bool> ProvisionAsync(string firstName, string lastName, string? email = null, CancellationToken ct = default)
        => Task.FromException<bool>(new NotSupportedException(
            "ProvisionAsync anropas från klient (Shared.Client), inte från serverns Firestore-service."));
}
