using Contista.Shared.Core.Http;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Logic;

public sealed class UserDataState<T> : IUserDataState<T>, IMutableUserDataState<T> where T : class
{
    private readonly IUserDataProvider<T> _provider;
    private readonly IAuthReactor _authReactor;
    private readonly SemaphoreSlim _gate = new(1, 1);

    private string? _loadedForUserId;
    private int _bgRefreshQueued;

    public T? Current { get; private set; }
    public string? Version { get; private set; }
    public DateTime? CachedAtUtc { get; private set; }

    public bool HasData => Current is not null;
    public bool IsRefreshing { get; private set; }

    public event Action? Changed;

    public UserDataState(IUserDataProvider<T> provider, IAuthReactor authReactor)
    {
        _provider = provider;
        _authReactor = authReactor;
    }

    public void Clear()
    {
        Current = null;
        Version = null;
        CachedAtUtc = null;
        _loadedForUserId = null;
        Changed?.Invoke();
    }

    public async Task EnsureLoadedAsync(string userId, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        await _gate.WaitAsync(ct);
        try
        {
            // Redan laddad för rätt user
            if (HasData && string.Equals(_loadedForUserId, userId, StringComparison.Ordinal))
                return;

            // User byts => nollställ så vi inte visar fel data
            if (!string.Equals(_loadedForUserId, userId, StringComparison.Ordinal))
            {
                Current = null;
                Version = null;
                CachedAtUtc = null;
                _loadedForUserId = null;
                Changed?.Invoke();
            }

            UserCacheEnvelope<T>? env;

            try
            {
                env = await _provider.GetUserAsync(userId, forceRefresh: false, ct);
            }
            catch (ApiFailureException afx) when (afx.Failure.IsAuth)
            {
                await _authReactor.ForceLogoutAsync($"UserData EnsureLoaded auth-failed: {afx.Failure.Kind}", ct);
                return;
            }

            ApplyEnvelope(userId, env);
        }
        finally
        {
            _gate.Release();
        }

        // Refresh utanför låset
        QueueBackgroundRefresh(userId, force: !HasData);
    }

    public async Task RefreshAsync(string userId, bool force = false, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        await _gate.WaitAsync(ct);
        try
        {
            if (IsRefreshing) return;

            // Skydd: om vi är laddade för annan user, gör inget
            if (!string.IsNullOrWhiteSpace(_loadedForUserId) &&
                !string.Equals(_loadedForUserId, userId, StringComparison.Ordinal))
                return;

            IsRefreshing = true;
        }
        finally
        {
            _gate.Release();
        }

        try
        {
            Changed?.Invoke();

            UserCacheEnvelope<T>? env;
            try
            {
                env = await _provider.GetUserAsync(userId, forceRefresh: force, ct);
            }
            catch (ApiFailureException afx) when (afx.Failure.IsAuth)
            {
                await _authReactor.ForceLogoutAsync($"UserData Refresh auth-failed: {afx.Failure.Kind}", ct);
                return;
            }

            ApplyEnvelope(userId, env);
        }
        finally
        {
            await _gate.WaitAsync(ct);
            try { IsRefreshing = false; }
            finally { _gate.Release(); }

            Changed?.Invoke();
        }
    }

    private void QueueBackgroundRefresh(string userId, bool force)
    {
        // Debounce: en bg refresh åt gången
        if (Interlocked.Exchange(ref _bgRefreshQueued, 1) == 1)
            return;

        _ = Task.Run(async () =>
        {
            try
            {
                await RefreshAsync(userId, force: force, CancellationToken.None);
            }
            catch
            {
                // best effort
            }
            finally
            {
                Interlocked.Exchange(ref _bgRefreshQueued, 0);
            }
        });
    }

    private void ApplyEnvelope(string userId, UserCacheEnvelope<T>? env)
    {
        if (env?.Data is null) return;

        _loadedForUserId = userId;
        Current = env.Data;
        Version = env.Version;
        CachedAtUtc = env.CachedAtUtc;

        Changed?.Invoke();
    }

    public async Task<bool> TryApplyLocalPatchAsync(string userId, Func<T, T> patch, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();

        await _gate.WaitAsync(ct);
        try
        {
            // Måste vara laddad för rätt user
            if (!HasData) return false;

            if (!string.Equals(_loadedForUserId, userId, StringComparison.Ordinal))
                return false;

            Current = patch(Current!);
            Changed?.Invoke();
            return true;
        }
        finally
        {
            _gate.Release();
        }
    }
}
