using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Offline.Interfaces;

namespace Contista.Shared.Core.Services.Calendar;

public sealed class ReminderStartupService : IReminderStartupService, IDisposable
{
    private readonly ICalendarDataProvider _provider;
    private readonly IReminderScheduler _scheduler;

    private readonly object _gate = new();
    private readonly SemaphoreSlim _refreshGate = new(1, 1);

    private Timer? _timer;
    private bool _started;

    private static readonly TimeSpan LookAhead = TimeSpan.FromDays(7);
    private static readonly TimeSpan LookBack = TimeSpan.FromHours(2);
    private static readonly TimeSpan RefreshInterval = TimeSpan.FromMinutes(2);

    public ReminderStartupService(ICalendarDataProvider provider, IReminderScheduler scheduler)
    {
        _provider = provider;
        _scheduler = scheduler;
    }

    public void Start()
    {
        lock (_gate)
        {
            if (_started) return;
            _started = true;

            _ = RefreshSafeAsync();

            _timer = new Timer(_ => _ = RefreshSafeAsync(), null, RefreshInterval, RefreshInterval);
        }
    }

    public void Stop()
    {
        lock (_gate)
        {
            _timer?.Dispose();
            _timer = null;
            _started = false;
        }

        // Rensa så vi inte har kvar gamla events efter logout
        _scheduler.UpdateEvents(Array.Empty<CalendarEventDto>());
    }

    private async Task RefreshSafeAsync()
    {
        // bara en refresh åt gången
        if (!await _refreshGate.WaitAsync(0))
            return;

        try
        {
            await RefreshNowAsync();
        }
        finally
        {
            _refreshGate.Release();
        }
    }

    private async Task RefreshNowAsync()
    {
        try
        {
            var settings = await _provider.GetSettingsAsync(CancellationToken.None);
            var my = await _provider.GetMyAsync(CancellationToken.None);

            var activeCalendarIds = ResolveActiveCalendarIds(settings, my);
            if (activeCalendarIds.Count == 0)
            {
                _scheduler.UpdateEvents(Array.Empty<CalendarEventDto>());
                return;
            }

            var startUtc = DateTime.UtcNow.Subtract(LookBack);
            var endUtc = DateTime.UtcNow.Add(LookAhead);

            var req = new CalendarEventsRangeRequest
            {
                CalendarIds = activeCalendarIds,
                StartUtc = startUtc,
                EndUtc = endUtc
            };

            var events = await _provider.GetEventsRangeAsync(req, CancellationToken.None)
                         ?? new List<CalendarEventDto>();

            _scheduler.UpdateEvents(events);
        }
        catch
        {
            // Reminders ska aldrig krascha appen
        }
    }

    private static List<string> ResolveActiveCalendarIds(CalendarSettingsDto? settings, CalendarMyResponse? my)
    {
        var set = new HashSet<string>(StringComparer.Ordinal);

        if (settings?.SelectedCalendarIds is { Count: > 0 })
        {
            foreach (var id in settings.SelectedCalendarIds)
                if (!string.IsNullOrWhiteSpace(id))
                    set.Add(id);
        }

        if (set.Count == 0 && !string.IsNullOrWhiteSpace(settings?.PrimaryCalendarId))
            set.Add(settings!.PrimaryCalendarId);

        if (set.Count == 0)
        {
            var defaults = my?.CalendarRefs?
                .Where(r => r.IsSelectedByDefault)
                .Select(r => r.CalendarId)
                .Where(id => !string.IsNullOrWhiteSpace(id))
                .ToList() ?? new();

            foreach (var id in defaults)
                set.Add(id);
        }

        var primaryId = my?.Calendars?.FirstOrDefault(c => c.IsPrimary)?.CalendarId;
        if (!string.IsNullOrWhiteSpace(primaryId))
            set.Add(primaryId);

        return set.ToList();
    }

    public void Dispose()
    {
        Stop();
        _refreshGate.Dispose();
    }
}