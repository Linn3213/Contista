using Contista.Shared.Core.Http;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models.Auth;
using Microsoft.AspNetCore.Components.Authorization;
using System.Security.Claims;

namespace Contista.Shared.UI.Services;

public sealed class AppAuthStateProvider : AuthenticationStateProvider, IDisposable
{
    private static readonly ClaimsPrincipal Anonymous = new(new ClaimsIdentity());

    private readonly IFirebaseAuthService _auth;
    private readonly IUserClaimsService _claims;
    private readonly IClaimsSnapshotStore _snapshots;
    private readonly ILastUserStore _lastUser;
    private readonly INetworkStatus? _network;

    // ✅ "Current" state ska vara den enda sanningen som GetAuthState returnerar
    private ClaimsPrincipal _current = Anonymous;
    private string? _currentUserId;

    // ✅ Version: varje login/logout/refresh bump:ar
    private int _version;

    // ✅ En refresh i taget + enrich i taget
    private readonly SemaphoreSlim _refreshGate = new(1, 1);
    private readonly SemaphoreSlim _enrichGate = new(1, 1);

    private Task? _enrichTask;
    private DateTime _lastEnrichAttemptUtc = DateTime.MinValue;
    private static readonly TimeSpan EnrichMinInterval = TimeSpan.FromSeconds(3);

    public AppAuthStateProvider(
        IFirebaseAuthService auth,
        IUserClaimsService claims,
        IClaimsSnapshotStore snapshots,
        ILastUserStore lastUser,
        INetworkStatus? network = null)
    {
        _auth = auth;
        _claims = claims;
        _snapshots = snapshots;
        _lastUser = lastUser;
        _network = network;

        if (_network is not null)
            _network.OnlineChanged += OnOnlineChanged;
    }

    // ✅ Passiv: inga sid-effekter här
    public override Task<AuthenticationState> GetAuthenticationStateAsync()
        => Task.FromResult(new AuthenticationState(_current));

    /// <summary>
    /// Kalla efter login/logout och vid app-start om du vill.
    /// - isLogout=true: sätter Anonymous direkt och rensar lastUser/snapshot.
    /// - annars: bygger state från snapshot/base och startar enrich (online).
    /// </summary>
    public async Task RefreshAsync(bool isLogout = false, CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();
        var myVersion = Interlocked.Increment(ref _version);

        await _refreshGate.WaitAsync(ct);
        try
        {
            // Om en nyare refresh redan startat när vi väntade, avbryt denna
            if (myVersion != _version) return;

            if (isLogout)
            {
                // ✅ Sätt anonymous DIREKT (det här tar bort “mellanläge”)
                _current = Anonymous;
                _currentUserId = null;

                NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_current)));

                // Best effort: rensa snapshot för senaste user
                try
                {
                    var last = await _lastUser.TryGetAsync();
                    if (last is not null && !string.IsNullOrWhiteSpace(last.UserId))
                        await _snapshots.RemoveAsync(last.UserId);
                }
                catch { }

                try { await _lastUser.ClearAsync(); } catch { }

                return;
            }

            // 1) Bestäm vilken user vi ska visa: auth först, annars lastUser snapshot
            if (!_auth.IsLoggedIn || string.IsNullOrWhiteSpace(_auth.Uid))
            {
                var last = await _lastUser.TryGetAsync();
                if (last is null || string.IsNullOrWhiteSpace(last.UserId))
                {
                    SetCurrent(Anonymous, null);
                    return;
                }

                // Snapshot restore (offline/F5)
                var snap = await _snapshots.TryGetAsync(last.UserId);
                if (snap is null)
                {
                    SetCurrent(Anonymous, null);
                    return;
                }

                var snapPrincipal = snap.ToPrincipal(authenticationType: "la-auth");
                SetCurrent(snapPrincipal, last.UserId);

                // online? då kan vi försöka enrich (om vi vill)
                TryStartEnrich(last.UserId, last.Email, myVersion);
                return;
            }

            // 2) Auth bekräftad
            var uid = _auth.Uid!;
            var email = _auth.Email;

            // Best effort: persist lastUser
            try { await _lastUser.SetAsync(new LastUser(uid, email)); } catch { }

            // 3) Starta från snapshot om finns, annars base
            ClaimsPrincipal principalToShow;

            try
            {
                var snap = await _snapshots.TryGetAsync(uid);
                if (snap is not null)
                    principalToShow = snap.ToPrincipal(authenticationType: "la-auth");
                else
                    principalToShow = BuildBasePrincipal(uid, email);
            }
            catch
            {
                principalToShow = BuildBasePrincipal(uid, email);
            }

            SetCurrent(principalToShow, uid);

            // 4) Försök enrich (online)
            TryStartEnrich(uid, email, myVersion);
        }
        finally
        {
            _refreshGate.Release();
        }
    }

    private void SetCurrent(ClaimsPrincipal principal, string? uid)
    {
        _current = principal;
        _currentUserId = uid;
        NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_current)));
    }

    private static ClaimsPrincipal BuildBasePrincipal(string uid, string? email)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, uid),
            new(ClaimTypes.Name, string.IsNullOrWhiteSpace(email) ? "Inloggad" : email),
        };

        var identity = new ClaimsIdentity(claims, authenticationType: "la-auth");
        return new ClaimsPrincipal(identity);
    }

    private void TryStartEnrich(string uid, string? email, int versionAtSchedule)
    {
        if (_network is not null && !_network.IsOnline)
            return;

        var now = DateTime.UtcNow;
        if (now - _lastEnrichAttemptUtc < EnrichMinInterval)
            return;

        if (_enrichTask is not null && !_enrichTask.IsCompleted)
            return;

        _lastEnrichAttemptUtc = now;
        _enrichTask = EnrichAndMaybeNotifyAsync(uid, email, versionAtSchedule);
    }

    private async Task EnrichAndMaybeNotifyAsync(string uid, string? email, int versionAtStart)
    {
        // ✅ Om state har ändrats sedan vi startade: gör inget
        if (versionAtStart != _version)
            return;

        // ✅ Om auth inte matchar längre: gör inget
        if (!_auth.IsLoggedIn || _auth.Uid != uid)
            return;

        if (!await _enrichGate.WaitAsync(0))
            return;

        try
        {
            if (versionAtStart != _version)
                return;

            if (_network is not null && !_network.IsOnline)
                return;

            ClaimsPrincipal enriched;

            try
            {
                enriched = await _claims.BuildPrincipalAsync(uid, email);
            }
            catch (ApiFailureException afx) when (afx.Failure.IsAuth)
            {
                // ✅ token/cookie ogiltig -> logout hårt
                await RefreshAsync(isLogout: true);
                return;
            }
            catch (ApiFailureException)
            {
                // offline/timeout/server: behåll current och försök senare
                return;
            }

            // ✅ Skriv aldrig över med “tom principal”
            if (enriched.Identity?.IsAuthenticated != true || !enriched.Claims.Any())
                return;

            // ✅ Om state ändrats under tiden: skriv inte över
            if (versionAtStart != _version)
                return;

            // ✅ Spara snapshot (best effort)
            try
            {
                var snap = ClaimSnapshot.FromPrincipal(uid, enriched);
                await _snapshots.SetAsync(snap);
            }
            catch { }

            // ✅ Uppdatera current + notify
            _current = enriched;
            _currentUserId = uid;
            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_current)));
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine("EnrichAndMaybeNotifyAsync FAILED: " + ex);
        }
        finally
        {
            _enrichGate.Release();
        }
    }

    private void OnOnlineChanged(bool online)
    {
        if (!online)
            return;

        // ✅ INTE: Notify(GetAuthenticationStateAsync())
        // Gör istället: försök enrich om vi har en user
        var uid = _currentUserId;
        if (string.IsNullOrWhiteSpace(uid))
            return;

        TryStartEnrich(uid, _auth.Email, _version);
    }

    public void Dispose()
    {
        if (_network is not null)
            _network.OnlineChanged -= OnOnlineChanged;

        _refreshGate.Dispose();
        _enrichGate.Dispose();
    }
}
