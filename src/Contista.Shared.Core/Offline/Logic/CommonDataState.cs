using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Logic
{
    public sealed class CommonDataState<T> : ICommonDataState<T>
        where T : class
    {
        private readonly ICommonDataProvider _provider;
        private readonly SemaphoreSlim _gate = new(1, 1);

        // Skydda mot att starta massa bakgrundsrefresh parallellt
        private int _bgRefreshQueued;

        public T? Current { get; private set; }
        public string? Version { get; private set; }
        public DateTime? CachedAtUtc { get; private set; }

        public bool HasData => Current is not null;
        public bool IsRefreshing { get; private set; }

        public event Action? Changed;

        public CommonDataState(ICommonDataProvider provider)
        {
            _provider = provider;
        }

        public void Clear()
        {
            Current = null;
            Version = null;
            CachedAtUtc = null;
            Changed?.Invoke();
        }

        public async Task EnsureLoadedAsync(CancellationToken ct = default)
        {
            // 1) Försök ladda cache/known data (offline-first), men blockera inte UI för evigt.
            await _gate.WaitAsync(ct);
            try
            {
                if (HasData) return;

                var env = await _provider.GetCommonAsync(forceRefresh: false, ct);
                ApplyEnvelope(env);
            }
            finally
            {
                _gate.Release();
            }

            // 2) Best effort refresh i bakgrunden (inga UI-token här)
            QueueBackgroundRefresh(force: !HasData);
        }

        public async Task RefreshAsync(bool force = false, CancellationToken ct = default)
        {
            await _gate.WaitAsync(ct);
            try
            {
                if (IsRefreshing) return;
                IsRefreshing = true;
            }
            finally
            {
                _gate.Release();
            }

            try
            {
                Changed?.Invoke();

                var env = await _provider.GetCommonAsync(forceRefresh: force, ct);
                ApplyEnvelope(env);
            }
            finally
            {
                await _gate.WaitAsync(ct);
                try
                {
                    IsRefreshing = false;
                }
                finally
                {
                    _gate.Release();
                }

                Changed?.Invoke();
            }
        }

        private void QueueBackgroundRefresh(bool force)
        {
            // Enkelt “debounce”: om redan köad, lägg inte fler
            if (Interlocked.Exchange(ref _bgRefreshQueued, 1) == 1)
                return;

            _ = Task.Run(async () =>
            {
                try
                {
                    // Om första load saknade cache -> gör force refresh i bakgrunden.
                    await RefreshAsync(force: force, CancellationToken.None);
                }
                catch
                {
                    // Best effort
                }
                finally
                {
                    Interlocked.Exchange(ref _bgRefreshQueued, 0);
                }
            });
        }

        private void ApplyEnvelope(CommonCacheEnvelope? env)
        {
            if (env?.Data is null) return;

            if (env.Data is T typed)
            {
                Current = typed;
                Version = env.Version;
                CachedAtUtc = env.CachedAtUtc;
                Changed?.Invoke();
                return;
            }

            throw new InvalidOperationException(
                $"Common cache contains '{env.Data.GetType().Name}' but CommonDataState is '{typeof(T).Name}'.");
        }
    }
}
