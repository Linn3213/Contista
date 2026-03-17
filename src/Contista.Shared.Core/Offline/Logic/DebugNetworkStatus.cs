using Contista.Shared.Core.Offline.Interfaces;

namespace Contista.Shared.Core.Offline.Logic;

public sealed class DebugNetworkStatus : INetworkStatus, INetworkDebugControl
{
    private readonly INetworkStatus _inner;

    public DebugNetworkStatus(INetworkStatus inner)
    {
        _inner = inner;
        _inner.OnlineChanged += InnerOnlineChanged;
    }

    public bool IsSupported => true;

    public bool IsOnline => ForcedOnline ?? _inner.IsOnline;

    public bool? ForcedOnline { get; private set; }

    public event Action<bool>? OnlineChanged;

    public void Force(bool? forced)
    {
        ForcedOnline = forced;
        OnlineChanged?.Invoke(IsOnline);
    }

    private void InnerOnlineChanged(bool _)
    {
        // om vi inte force:ar så speglar vi inner
        if (ForcedOnline is null)
            OnlineChanged?.Invoke(IsOnline);
    }
}
