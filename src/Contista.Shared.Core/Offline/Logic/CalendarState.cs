using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Logic.Calendar;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models.Calendar;

namespace Contista.Shared.Core.Offline.Logic;

public sealed class CalendarState : ICalendarState
{
    private readonly ICalendarDataProvider _provider;
    private readonly IUserDirectoryState _users;


    private readonly HashSet<string> _optimisticallyHiddenCalendars = new();


    public CalendarState(ICalendarDataProvider provider, IUserDirectoryState users)
    {
        _provider = provider;
        _users = users;
    }

    public CalendarStateData? Current { get; private set; }
    public bool IsLoading { get; private set; }
    public string? LastError { get; private set; }

    public event Action? Changed;
    private void RaiseChanged() => Changed?.Invoke();

    // tempEventId -> optimistic event
    private readonly Dictionary<string, CalendarEventDto> _optimisticByTempId = new(StringComparer.Ordinal);

    // opId (LastMutationId) -> tempEventId
    private readonly Dictionary<string, string> _pendingCreates = new(StringComparer.Ordinal);

    public async Task RefreshAsync(
        string userId,
        CalendarViewMode view,
        DateTime anchorLocal,
        bool force,
        List<string>? activeCalendarIdsOverride = null,
        CancellationToken ct = default)
    {
        _ = userId;
        _ = force;

        try
        {
            IsLoading = true;
            LastError = null;
            RaiseChanged();

            var settings = await _provider.GetSettingsAsync(ct);
            var my = await _provider.GetMyAsync(ct);

            // ✅ Optimistic hide av kalendrar
            if (my?.Calendars is not null && _optimisticallyHiddenCalendars.Count > 0)
            {
                my.Calendars = my.Calendars
                    .Where(c => c is not null
                        && !string.IsNullOrWhiteSpace(c.CalendarId)
                        && !_optimisticallyHiddenCalendars.Contains(c.CalendarId))
                    .ToList();
            }

            var active = (activeCalendarIdsOverride is { Count: > 0 })
                ? activeCalendarIdsOverride.Where(x => !string.IsNullOrWhiteSpace(x)).Distinct(StringComparer.Ordinal).ToList()
                : ResolveActiveCalendarIds(settings, my);

            var primaryId = my?.Calendars?.FirstOrDefault(c => c.IsPrimary)?.CalendarId
                ?? settings?.PrimaryCalendarId;

            if (!string.IsNullOrWhiteSpace(primaryId) &&
                !active.Contains(primaryId, StringComparer.Ordinal))
            {
                active.Add(primaryId);
            }

            var (startUtc, endUtc) = GetRangeUtc(view, anchorLocal);

            var serverEvents = new List<CalendarEventDto>();

            if (active.Count > 0)
            {
                var req = new CalendarEventsRangeRequest
                {
                    CalendarIds = active,
                    StartUtc = startUtc,
                    EndUtc = endUtc
                };
                serverEvents = await _provider.GetEventsRangeAsync(req, ct) ?? new List<CalendarEventDto>();


                // ✅ Safety: expand recurrence if provider returns only masters
                if (serverEvents is { Count: > 0 })
                {
                    var hasMasters = serverEvents.Any(e => e?.Recurrence is not null);
                    var alreadyExpanded = serverEvents.Any(e =>
                        !string.IsNullOrWhiteSpace(e?.EventId) && e.EventId.Contains(':', StringComparison.Ordinal));

                    if (hasMasters && !alreadyExpanded)
                    {
                        serverEvents = RecurrenceExpander
                            .ExpandInRange(serverEvents, startUtc, endUtc);
                    }
                }
            }

            ReconcileCreates(serverEvents);

            var merged = MergeOptimistic(serverEvents, startUtc, endUtc, active);

            await _users.EnsureLoadedAsync(
                    serverEvents.Select(e => e.CreatedById),
                    ct);

            Current = new CalendarStateData
            {
                Settings = settings,
                My = my,
                ActiveCalendarIds = active,
                Events = merged,
                View = view,
                AnchorLocal = anchorLocal,
                RangeStartUtc = startUtc,
                RangeEndUtc = endUtc
            };
            _optimisticallyHiddenCalendars.Clear();
        }
        catch (Exception ex)
        {
            LastError = ex.Message;

            Current ??= new CalendarStateData
            {
                View = view,
                AnchorLocal = anchorLocal
            };

            Current.Events ??= new List<CalendarEventDto>();

            Current.Events = MergeOptimistic(
                Current.Events,
                Current.RangeStartUtc == default ? DateTime.MinValue : Current.RangeStartUtc,
                Current.RangeEndUtc == default ? DateTime.MaxValue : Current.RangeEndUtc,
                Current.ActiveCalendarIds ?? new List<string>());
        }
        finally
        {
            IsLoading = false;
            RaiseChanged();
        }
    }

    public Task OptimisticAddEventAsync(CalendarEventDto ev, CancellationToken ct = default)
    {
        _ = ct;

        Current ??= new CalendarStateData();
        Current.Events ??= new List<CalendarEventDto>();

        var tempId = ev.EventId ?? "";
        if (!string.IsNullOrWhiteSpace(tempId) && IsTempId(tempId))
        {
            _optimisticByTempId[tempId] = CloneEvent(ev);

            if (!string.IsNullOrWhiteSpace(ev.LastMutationId))
                _pendingCreates[ev.LastMutationId!] = tempId;
        }

        Current.Events.Add(CloneEvent(ev));

        Current.Events = Current.Events
            .OrderBy(x => x.StartUtc)
            .ThenBy(x => x.Title)
            .ToList();

        RaiseChanged();
        return Task.CompletedTask;
    }

    public Task OptimisticUpdateEventAsync(CalendarEventDto ev, CancellationToken ct = default)
    {
        _ = ct;

        Current ??= new CalendarStateData();
        Current.Events ??= new List<CalendarEventDto>();

        if (string.IsNullOrWhiteSpace(ev.EventId))
            return Task.CompletedTask;

        var idx = Current.Events.FindIndex(x => x.EventId == ev.EventId);
        if (idx >= 0)
            Current.Events[idx] = CloneEvent(ev);
        else
            Current.Events.Add(CloneEvent(ev));

        if (IsTempId(ev.EventId))
            _optimisticByTempId[ev.EventId] = CloneEvent(ev);

        Current.Events = Current.Events
            .OrderBy(x => x.StartUtc)
            .ThenBy(x => x.Title)
            .ToList();

        RaiseChanged();
        return Task.CompletedTask;
    }

    public Task OptimisticDeleteEventAsync(string eventId, CancellationToken ct = default)
    {
        _ = ct;

        Current ??= new CalendarStateData();
        Current.Events ??= new List<CalendarEventDto>();

        // ta bort i UI-listan
        Current.Events = Current.Events
            .Where(e => !string.Equals(e.EventId, eventId, StringComparison.Ordinal))
            .ToList();

        // ta bort ev i overlay
        _optimisticByTempId.Remove(eventId);

        // om vi tog bort ett temp-event: ta även bort pending opId->tempId koppling
        if (IsTempId(eventId))
        {
            var opIdsToRemove = _pendingCreates
                .Where(kv => string.Equals(kv.Value, eventId, StringComparison.Ordinal))
                .Select(kv => kv.Key)
                .ToList();

            foreach (var opId in opIdsToRemove)
                _pendingCreates.Remove(opId);
        }

        RaiseChanged();
        return Task.CompletedTask;
    }

    public CalendarEventDto CloneForEdit(CalendarEventDto ev)  => CloneEvent(ev);

    public CalendarEventDto? FindMasterBySeriesId(string seriesId)
    {
        if (Current?.Events is null) return null;

        return Current.Events.FirstOrDefault(e =>
            e.Recurrence is not null &&
            (
                string.Equals(e.Recurrence.SeriesId, seriesId, StringComparison.Ordinal) ||
                string.Equals(e.EventId, seriesId, StringComparison.Ordinal)
            ));
    }

    // ----------------------------
    // Reconcile + merge helpers
    // ----------------------------

    private void ReconcileCreates(List<CalendarEventDto> serverEvents)
    {
        if (_pendingCreates.Count == 0)
            return;

        var serverByMutation = serverEvents
            .Where(e => e is not null)
            .Where(e => !string.IsNullOrWhiteSpace(e.LastMutationId))
            .GroupBy(e => e.LastMutationId!, StringComparer.Ordinal)
            .ToDictionary(g => g.Key, g => g.First(), StringComparer.Ordinal);

        var doneOps = new List<string>();

        foreach (var kv in _pendingCreates)
        {
            var opId = kv.Key;
            var tempId = kv.Value;

            if (serverByMutation.ContainsKey(opId))
            {
                _optimisticByTempId.Remove(tempId);
                doneOps.Add(opId);
            }
        }

        foreach (var opId in doneOps)
            _pendingCreates.Remove(opId);
    }

    private List<CalendarEventDto> MergeOptimistic(
        List<CalendarEventDto> baseEvents,
        DateTime rangeStartUtc,
        DateTime rangeEndUtc,
        List<string> activeCalendarIds)
    {
        var merged = new List<CalendarEventDto>();
        merged.AddRange(baseEvents ?? new List<CalendarEventDto>());

        if (_optimisticByTempId.Count == 0)
        {
            return merged
                .OrderBy(x => x.StartUtc)
                .ThenBy(x => x.Title)
                .ToList();
        }

        var ids = new HashSet<string>(
            merged.Where(e => e is not null && !string.IsNullOrWhiteSpace(e.EventId))
                  .Select(e => e.EventId!),
            StringComparer.Ordinal);

        foreach (var opt in _optimisticByTempId.Values)
        {
            if (opt is null) continue;

            if (activeCalendarIds is { Count: > 0 } &&
                !string.IsNullOrWhiteSpace(opt.CalendarId) &&
                !activeCalendarIds.Contains(opt.CalendarId, StringComparer.Ordinal))
            {
                continue;
            }

            if (rangeStartUtc != DateTime.MinValue && rangeEndUtc != DateTime.MaxValue)
            {
                if (!(opt.StartUtc < rangeEndUtc && opt.EndUtc > rangeStartUtc))
                    continue;
            }

            if (!string.IsNullOrWhiteSpace(opt.EventId) && ids.Contains(opt.EventId))
                continue;

            merged.Add(CloneEvent(opt));

            if (!string.IsNullOrWhiteSpace(opt.EventId))
                ids.Add(opt.EventId);
        }

        return merged
            .OrderBy(x => x.StartUtc)
            .ThenBy(x => x.Title)
            .ToList();
    }

    private static List<string> ResolveActiveCalendarIds(CalendarSettingsDto? settings, CalendarMyResponse? my)
    {
        var set = new HashSet<string>(StringComparer.Ordinal);

        if (settings?.SelectedCalendarIds?.Count > 0)
        {
            foreach (var id in settings.SelectedCalendarIds)
                if (!string.IsNullOrWhiteSpace(id)) set.Add(id);
        }
        else if (!string.IsNullOrWhiteSpace(settings?.PrimaryCalendarId))
        {
            set.Add(settings.PrimaryCalendarId);
        }
        else
        {
            var defaults = my?.CalendarRefs?
              .Where(r => r.IsSelectedByDefault)
              .Select(r => r.CalendarId)
              .Where(id => !string.IsNullOrWhiteSpace(id))
              .ToList() ?? new();

            foreach (var id in defaults)
                set.Add(id);
        }

        return set.ToList();
    }

    private static (DateTime startUtc, DateTime endUtc) GetRangeUtc(CalendarViewMode view, DateTime anchorLocal)
    {
        if (view == CalendarViewMode.Month)
        {
            var startLocal = new DateTime(anchorLocal.Year, anchorLocal.Month, 1, 0, 0, 0, DateTimeKind.Local);
            var endLocal = startLocal.AddMonths(1);
            return (startLocal.ToUniversalTime(), endLocal.ToUniversalTime());
        }

        if (view == CalendarViewMode.Week)
        {
            var d = anchorLocal.Date;
            var diff = (7 + (d.DayOfWeek - DayOfWeek.Monday)) % 7;
            var weekStartLocal = DateTime.SpecifyKind(d.AddDays(-diff), DateTimeKind.Local);
            var endLocal = weekStartLocal.AddDays(7);
            return (weekStartLocal.ToUniversalTime(), endLocal.ToUniversalTime());
        }

        var aStartLocal = DateTime.SpecifyKind(anchorLocal.Date, DateTimeKind.Local);
        var aEndLocal = aStartLocal.AddDays(7);
        return (aStartLocal.ToUniversalTime(), aEndLocal.ToUniversalTime());
    }

    private static bool IsTempId(string id)
        => id.StartsWith("temp_", StringComparison.Ordinal);

    private static CalendarEventDto CloneEvent(CalendarEventDto e)
    {
        return new CalendarEventDto
        {
            EventId = e.EventId,
            CalendarId = e.CalendarId,
            CreatedById = e.CreatedById,

            Type = e.Type,
            Title = e.Title,
            Description = e.Description,
            Location = e.Location,

            StartUtc = e.StartUtc,
            EndUtc = e.EndUtc,
            IsAllDay = e.IsAllDay,

            Availability = e.Availability,
            Visibility = e.Visibility,

            OccurrenceOverrideSeriesId = e.OccurrenceOverrideSeriesId,
            OriginalStartUtc = e.OriginalStartUtc,
            IsOccurrenceOverride = e.IsOccurrenceOverride,
            IsOccurrenceCancelled = e.IsOccurrenceCancelled,

            Reminders = e.Reminders?.Select(r => new ReminderDto
            {
                Channel = r.Channel,
                MinutesBeforeStart = r.MinutesBeforeStart
            }).ToList() ?? new List<ReminderDto>(),

            Recurrence = e.Recurrence is null ? null : new RecurrenceDto
            {
                Frequency = e.Recurrence.Frequency,
                Interval = e.Recurrence.Interval,
                ByWeekDays = e.Recurrence.ByWeekDays?.ToList() ?? new List<DayOfWeek>(),
                UntilUtc = e.Recurrence.UntilUtc,
                Count = e.Recurrence.Count,
                SeriesId = e.Recurrence.SeriesId
            },

            IsDone = e.IsDone,
            Checklist = e.Checklist?.Select(c => new ChecklistItemDto
            {
                Id = c.Id,
                Text = c.Text,
                Done = c.Done,
                Order = c.Order
            }).ToList() ?? new List<ChecklistItemDto>(),

            ContentPostId = e.ContentPostId,

            HasConflict = e.HasConflict,
            ConflictWithEventIds = e.ConflictWithEventIds?.ToList() ?? new List<string>(),
            ConflictAcknowledgedByUserIds = e.ConflictAcknowledgedByUserIds?.ToList() ?? new List<string>(),

            CreatedAtUtc = e.CreatedAtUtc,
            UpdatedAtUtc = e.UpdatedAtUtc,
            LastMutationId = e.LastMutationId
        };
    }

    public void HideCalendar(string calendarId)
    {
        if (string.IsNullOrWhiteSpace(calendarId))
            return;

        _optimisticallyHiddenCalendars.Add(calendarId);
        RaiseChanged();
    }

}
