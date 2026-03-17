using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;

namespace Contista.Infrastructure.Firestore.Repos;

public sealed class CalendarSettingsRepository
    : BaseSubcollectionRepository<CalendarSettingsDto>, ICalendarSettingsRepository
{
    public CalendarSettingsRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
        : base(http, opts.Value.ProjectId, auth) { }

    private static string SettingsPath(string userId) => $"users/{userId}/calendarSettings";
    private const string DocId = "settings";

    public Task<CalendarSettingsDto?> GetSettingsAsync(string userId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");

        return GetByIdAtPathAsync(
            SettingsPath(userId),
            DocId,
            (doc, _id) => CalendarSettingsMapper.ToCalendarSettings(doc, userId),
            ct);
    }

    public Task<CalendarSettingsDto?> GetSettingsWithTokenAsync(string userId, string idToken, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) throw new InvalidOperationException("userId saknas.");
        if (string.IsNullOrWhiteSpace(idToken)) throw new InvalidOperationException("idToken saknas.");

        return GetByIdWithTokenAsync(
            SettingsPath(userId),
            DocId,
            (doc, _id) => CalendarSettingsMapper.ToCalendarSettings(doc, userId),
            idToken,
            ct);
    }

    public Task<bool> UpsertSettingsAsync(CalendarSettingsDto settings, CancellationToken ct = default)
        => UpsertSettingsCoreAsync(settings, tokenOverride: null, ct);

    public Task<bool> UpsertSettingsWithTokenAsync(CalendarSettingsDto settings, string idToken, CancellationToken ct = default)
        => UpsertSettingsCoreAsync(settings, tokenOverride: idToken, ct);

    private async Task<bool> UpsertSettingsCoreAsync(CalendarSettingsDto settings, string? tokenOverride, CancellationToken ct)
    {
        if (settings is null) throw new ArgumentNullException(nameof(settings));
        if (string.IsNullOrWhiteSpace(settings.UserId)) throw new InvalidOperationException("settings.UserId saknas.");

        var fsDoc = CalendarSettingsMapper.FromCalendarSettings(settings);

        return tokenOverride is null
            ? await PatchAtPathAsync(SettingsPath(settings.UserId), DocId, fsDoc, ct)
            : await PatchAtPathWithTokenAsync(SettingsPath(settings.UserId), DocId, fsDoc, tokenOverride, ct);
    }
}
