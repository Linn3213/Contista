using System.Threading.Channels;
using Contista.Shared.Core.Interfaces.SyncDebug;

namespace Contista.Shared.UI.Services.SyncDebug;

public sealed class AutoSyncDispatcher : IAutoSyncDispatcher
{
    private readonly Channel<Func<Task>> _queue = Channel.CreateUnbounded<Func<Task>>();
    private int _running;

    public bool IsSyncRunning => Interlocked.CompareExchange(ref _running, 0, 0) == 1;

    public AutoSyncDispatcher()
    {
        _ = Task.Run(RunLoopAsync);
    }

    public Task TrySyncSoonAsync(Func<Task> syncFunc)
    {
        _queue.Writer.TryWrite(syncFunc);
        return Task.CompletedTask;
    }

    private async Task RunLoopAsync()
    {
        while (await _queue.Reader.WaitToReadAsync())
        {
            // drain -> kör bara senaste requesten
            Func<Task>? last = null;
            while (_queue.Reader.TryRead(out var f))
                last = f;

            if (last is null) continue;

            await Task.Delay(250); // debounce

            if (Interlocked.Exchange(ref _running, 1) == 1)
                continue;

            try { await last(); }
            catch { }
            finally { Interlocked.Exchange(ref _running, 0); }
        }
    }
}
