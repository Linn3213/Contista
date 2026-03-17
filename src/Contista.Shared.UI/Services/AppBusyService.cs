using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace Contista.Shared.UI.Services;

public sealed class AppBusyService
{
    private readonly ILocalizationService _loc;

    private int _count;

    public bool IsBusy => _count > 0;
    private string _message;
    public event Action? Changed;
    public string Message => _message;

    public AppBusyService(ILocalizationService loc)
    {
        _loc = loc;

        // Default-text via localization
        _message = _loc["Common_Messages_Loading"]; // ex: "Laddar..."

        // Uppdatera text när språk byts
        _loc.LanguageChanged += OnLanguageChanged;
    }

    public IDisposable Begin(string? message = null, [CallerMemberName] string caller = "")
    {
        var newCount = Interlocked.Increment(ref _count);

        if (!string.IsNullOrWhiteSpace(message))
        {
            _message = message!;
        }
        else
        {
            _message = _loc["Common_Messages_Loading"];
        }

        Changed?.Invoke();

        return new Scope(this, caller);
    }

    private void End(string caller)
    {
        var newCount = Interlocked.Decrement(ref _count);
        if (newCount < 0)
        {
            Interlocked.Exchange(ref _count, 0);
            newCount = 0;
        }

        if (newCount == 0)
            _message = _loc["Common_Messages_Loading"];

        Changed?.Invoke();
    }

    public void Reset(string reason = "manual")
    {
        Interlocked.Exchange(ref _count, 0);
        _message = _loc["Common_Messages_Loading"];

        Changed?.Invoke();
    }

    private void OnLanguageChanged()
    {
        if (!IsBusy)
        {
            _message = _loc["Common_Messages_Loading"];
            Changed?.Invoke();
        }
    }

    private sealed class Scope : IDisposable
    {
        private AppBusyService? _svc;
        private int _disposed;
        private readonly string _caller;

        public Scope(AppBusyService svc, string caller)
        {
            _svc = svc;
            _caller = caller;
        }

        public void Dispose()
        {
            if (Interlocked.Exchange(ref _disposed, 1) == 1) return;
            var svc = Interlocked.Exchange(ref _svc, null);
            svc?.End(_caller);
        }
    }
}
