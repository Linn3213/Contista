using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Models.Calendar;

namespace Contista.Shared.Core.Services.Calendar;

public sealed class ReminderScheduler : IReminderScheduler, IDisposable
{
    private readonly IReminderHub _hub;
    private readonly object _gate = new();
    private readonly HashSet<string> _firedKeys = new(StringComparer.Ordinal);
    private List<CalendarEventDto> _events = new();
    private Timer? _timer;

    // Hur länge efter en trigger vi fortfarande tillåter den att triggas "direkt" vid app-start
    private static readonly TimeSpan PastDueGrace = TimeSpan.FromHours(1);

    // Hur länge vi behåller fired-keys innan vi städar bort dem (för att undvika minnesläck)
    private static readonly TimeSpan FiredKeyRetention = TimeSpan.FromDays(7);

    public ReminderScheduler(IReminderHub hub) => _hub = hub;

    public void UpdateEvents(IEnumerable<CalendarEventDto>? events)
    {
        lock (_gate)
        {
            _events = events?.ToList() ?? new List<CalendarEventDto>();

            // ✅ städa firedKeys baserat på nuvarande events + tid
            PruneFiredKeysLocked();

            ScheduleNextLocked();
        }
    }

    private void OnTimer(object? _)
    {
        TriggeredReminder? reminderToPublish = null;

        lock (_gate)
        {
            var now = DateTime.Now;

            var next = FindNextReminderLocked(now, includePastDue: true);
            if (next is null)
            {
                ScheduleNextLocked();
                return;
            }

            var key = BuildReminderKey(next.Event, next.TriggerLocalTime);

            if (_firedKeys.Add(key))
            {
                var startLocal = DateTime.SpecifyKind(next.Event.StartUtc, DateTimeKind.Utc).ToLocalTime();

                reminderToPublish = new TriggeredReminder
                {
                    EventId = next.Event.EventId ?? "",
                    EventTitle = next.Event.Title,
                    TriggeredLocalTime = next.TriggerLocalTime,
                    EventStartLocalTime = startLocal,
                    MinutesBeforeStart = next.MinutesBeforeStart
                };
            }

            // städa lite då och då
            PruneFiredKeysLocked();

            ScheduleNextLocked();
        }

        if (reminderToPublish is not null)
            _hub.Publish(reminderToPublish);
    }

    private void ScheduleNextLocked()
    {
        _timer?.Dispose();
        _timer = null;

        var next = FindNextReminderLocked(DateTime.Now, includePastDue: true);
        if (next is null)
            return;

        var due = next.TriggerLocalTime - DateTime.Now;
        if (due < TimeSpan.Zero)
            due = TimeSpan.Zero;

        _timer = new Timer(OnTimer, null, due, Timeout.InfiniteTimeSpan);
    }

    private CandidateReminder? FindNextReminderLocked(DateTime nowLocal, bool includePastDue)
    {
        CandidateReminder? best = null;

        foreach (var ev in _events)
        {
            if (ev is null || string.IsNullOrWhiteSpace(ev.EventId))
                continue;

            if (ev.Recurrence is not null)
                continue;

            if (ev.StartUtc == default)
                continue;

            var baseReminder = ev.Reminders?.FirstOrDefault(r => r.Channel == ReminderChannel.InApp);
            if (baseReminder is null)
                continue;

            var minutesBefore = baseReminder.MinutesBeforeStart;
            if (minutesBefore < 0) minutesBefore = 0;

            var startLocal = DateTime.SpecifyKind(ev.StartUtc, DateTimeKind.Utc).ToLocalTime();

            // Om eventet är "för gammalt" -> ignorera helt
            if (startLocal < nowLocal - PastDueGrace)
                continue;

            // 1) före-start-trigger (start - minutesBefore) bara om minutesBefore > 0 och event ej startat
            if (minutesBefore > 0 && startLocal > nowLocal)
            {
                var preTriggerLocal = startLocal.AddMinutes(-minutesBefore);

                if (IsCandidateAllowed(preTriggerLocal, nowLocal, includePastDue))
                {
                    var cand = BuildCandidate(ev, preTriggerLocal, minutesBeforeStart: minutesBefore);
                    if (cand is not null)
                        best = PickBest(best, cand);
                }
            }

            // 2) start-trigger (Startar nu) – triggas alltid vid start (0-min)
            // Om minutesBefore > 0 får man alltså två toasts: före + vid start.
            var startTriggerLocal = startLocal;

            if (IsCandidateAllowed(startTriggerLocal, nowLocal, includePastDue))
            {
                var cand = BuildCandidate(ev, startTriggerLocal, minutesBeforeStart: 0);
                if (cand is not null)
                    best = PickBest(best, cand);
            }
        }

        return best;
    }

    private static bool IsCandidateAllowed(DateTime triggerLocal, DateTime nowLocal, bool includePastDue)
    {
        if (!includePastDue)
            return triggerLocal > nowLocal;

        return triggerLocal >= (nowLocal - PastDueGrace);
    }

    private CandidateReminder? BuildCandidate(CalendarEventDto ev, DateTime triggerLocal, int minutesBeforeStart)
    {
        var key = BuildReminderKey(ev, triggerLocal);
        if (_firedKeys.Contains(key))
            return null;

        return new CandidateReminder(ev, triggerLocal, minutesBeforeStart);
    }

    private static CandidateReminder PickBest(CandidateReminder? best, CandidateReminder cand)
        => best is null || cand.TriggerLocalTime < best.TriggerLocalTime ? cand : best;

    private static string BuildReminderKey(CalendarEventDto ev, DateTime triggerLocal)
        => $"{ev.EventId}|{triggerLocal:O}";

    // ✅ STÄDNING: behåll bara keys som hör till events som fortfarande finns och inte är uråldriga
    private void PruneFiredKeysLocked()
    {
        if (_firedKeys.Count == 0) return;

        var now = DateTime.Now;
        var cutoff = now - FiredKeyRetention;

        // Bygg set av giltiga keys från nuvarande events:
        // - pre-trigger (om minutesBefore > 0)
        // - start-trigger
        var valid = new HashSet<string>(StringComparer.Ordinal);

        foreach (var ev in _events)
        {
            if (ev is null || string.IsNullOrWhiteSpace(ev.EventId)) continue;
            if (ev.StartUtc == default) continue;

            var reminder = ev.Reminders?.FirstOrDefault(r => r.Channel == ReminderChannel.InApp);
            if (reminder is null) continue;

            var minutesBefore = reminder.MinutesBeforeStart;
            if (minutesBefore < 0) minutesBefore = 0;

            var startLocal = DateTime.SpecifyKind(ev.StartUtc, DateTimeKind.Utc).ToLocalTime();

            // bara städa inom rimlig horisont (och inte långt bak)
            if (startLocal < cutoff) continue;

            // start-trigger
            valid.Add(BuildReminderKey(ev, startLocal));

            // pre-trigger
            if (minutesBefore > 0)
            {
                var pre = startLocal.AddMinutes(-minutesBefore);
                if (pre >= cutoff)
                    valid.Add(BuildReminderKey(ev, pre));
            }
        }

        _firedKeys.RemoveWhere(k => !valid.Contains(k));
    }

    public void Dispose()
    {
        lock (_gate)
        {
            _timer?.Dispose();
            _timer = null;
            _events.Clear();
            _firedKeys.Clear();
        }
    }

    private sealed record CandidateReminder(CalendarEventDto Event, DateTime TriggerLocalTime, int MinutesBeforeStart);
}