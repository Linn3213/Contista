using Contista.Shared.Core.Models.Sync;

namespace Contista.Shared.Core.Interfaces.Sync;

public interface ISyncUxNotifier
{
    event Action? Changed;
    SyncUxState Current { get; }
    void Set(SyncUxState state);
    void Clear();
}

public sealed class SyncUxNotifier : ISyncUxNotifier
{
    public event Action? Changed;
    public SyncUxState Current { get; private set; } = new();

    public void Set(SyncUxState state) { Current = state; Changed?.Invoke(); }
    public void Clear() { Current = new(); Changed?.Invoke(); }
}