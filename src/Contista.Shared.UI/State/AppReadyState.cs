namespace Contista.Shared.UI.State;

public sealed class AppReadyState
{
    private bool _isReady;
    public bool IsReady => _isReady;

    public event Action? Changed;

    public void SetReady(bool ready)
    {
        if (_isReady == ready) return;
        _isReady = ready;
        Changed?.Invoke();
    }

    public void Reset() => SetReady(false);
}

