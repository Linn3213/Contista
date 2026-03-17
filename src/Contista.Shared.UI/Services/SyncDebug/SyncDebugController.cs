using System.Text.Json;
using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Interfaces.SyncDebug;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Offline.Models.Operations;
using Contista.Shared.UI.Services;

namespace Contista.Shared.UI.Services.SyncDebug;

/// <summary>
/// Debug-controller: håller UI-state + ger actions.
/// Viktigt: ingen auto-refresh/timers här (läggs i komponenten).
/// </summary>
public sealed class SyncDebugController : ISyncDebugController
{
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    private readonly IFirebaseAuthService _auth;
    private readonly ISyncQueue _queue;
    private readonly IOfflineWriteService _offlineWrite;
    private readonly ISyncRunner _syncRunner;
    private readonly INetworkStatus _network;
    private readonly IServiceProvider _services;

    private readonly IUserDataState<UserDataDto> _userState;
    private readonly IUserDataOptimisticPatcher _patcher;
    private readonly IAutoSyncDispatcher _autoSync;

    private readonly ILocalizationService _loc;

    private INetworkDebugControl? _netDebug;

    // UI state (controller scoped -> överlever navigation inom samma scope)
    private readonly List<ContentPost> _postsUi = new();
    private readonly HashSet<string> _hiddenPostIds = new(StringComparer.Ordinal);

    // correlation
    private readonly Dictionary<string, string> _pendingCreates = new(StringComparer.Ordinal); // opId -> tempId
    private readonly Dictionary<string, string> _pendingUpdates = new(StringComparer.Ordinal); // opId -> postId

    public SyncDebugController(
        IFirebaseAuthService auth,
        ISyncQueue queue,
        IOfflineWriteService offlineWrite,
        ISyncRunner syncRunner,
        INetworkStatus network,
        IServiceProvider services,
        IUserDataState<UserDataDto> userState,
        IUserDataOptimisticPatcher patcher,
        IAutoSyncDispatcher autoSync,
        ILocalizationService loc)
    {
        _auth = auth;
        _queue = queue;
        _offlineWrite = offlineWrite;
        _syncRunner = syncRunner;
        _network = network;
        _services = services;
        _userState = userState;
        _patcher = patcher;
        _autoSync = autoSync;
        _loc = loc;
    }

    public IReadOnlyList<ContentPost> PostsUi => _postsUi;
    public string? SelectedPostId { get; set; }

    public string? Message { get; private set; }
    public string? PostOpsMessage { get; private set; }

    private List<SyncQueueItem> _items = new();
    public IReadOnlyList<SyncQueueItem> QueueItems => _items;

    public int PendingCount { get; private set; }
    public int ProcessingCount { get; private set; }
    public int FailedCount { get; private set; }
    public int DoneCount { get; private set; }

    // Kan finnas kvar om du vill toggla auto-refresh i UI, men controller startar inget själv.
    public bool AutoRefresh { get; private set; } = true;

    public event Func<Task>? Changed;

    public bool CanUpdateOrDeleteSelectedPost =>
        _auth.IsLoggedIn &&
        !string.IsNullOrWhiteSpace(SelectedPostId) &&
        !IsTempId(SelectedPostId) &&
        !IsPendingCreatePost(SelectedPostId);

    public Task InitializeAsync()
    {
        _netDebug = _services.GetService(typeof(INetworkDebugControl)) as INetworkDebugControl;

        RebuildPostsFromUserState();
        EnsureSelectedPostValid();
        return Task.CompletedTask;
    }

    public void Attach()
    {
        _network.OnlineChanged += OnOnlineChanged;
        _userState.Changed += OnUserStateChanged;

        // Om språk byts vill vi kunna visa nya default-texter
        _loc.LanguageChanged += OnLanguageChanged;
    }

    public void Detach()
    {
        _network.OnlineChanged -= OnOnlineChanged;
        _userState.Changed -= OnUserStateChanged;
        _loc.LanguageChanged -= OnLanguageChanged;
    }

    private void OnLanguageChanged()
    {
        // Gör inget aggressivt – bara re-render (UI kan visa samma message)
        _ = NotifyChangedAsync();
    }

    private Task NotifyChangedAsync()
        => Changed?.Invoke() ?? Task.CompletedTask;

    private void OnUserStateChanged()
    {
        _ = OnUserStateChangedAsync();
    }

    private async Task OnUserStateChangedAsync()
    {
        RebuildPostsFromUserState();
        await ReconcileOptimisticAgainstStateAsync();
        RebuildPostsFromUserState(); // rebuild efter att temp tagits bort
        await NotifyChangedAsync();
    }

    private void OnOnlineChanged(bool online)
    {
        if (online)
        {
            // autosync när vi blir online
            _ = _autoSync.TrySyncSoonAsync(SyncNowAsync);
        }
    }

    public void SetAutoRefresh(bool enabled)
    {
        AutoRefresh = enabled;
        _ = NotifyChangedAsync();
    }

    public async Task RefreshQueueOnlyAsync()
    {
        _items = (await _queue.GetAllAsync()).ToList();

        PendingCount = _items.Count(x => x.Status == SyncQueueStatus.Pending);
        ProcessingCount = _items.Count(x => x.Status == SyncQueueStatus.Processing);
        FailedCount = _items.Count(x => x.Status == SyncQueueStatus.Failed);
        DoneCount = _items.Count(x => x.Status == SyncQueueStatus.Done);

        await NotifyChangedAsync();
    }

    public async Task SyncNowAsync()
    {
        Message = null;

        if (!_auth.IsLoggedIn)
        {
            Message = _loc["SyncDebug_NotLoggedIn"]; // "Inte inloggad."
            await RefreshQueueOnlyAsync();
            return;
        }

        if (!_network.IsOnline)
        {
            Message = _loc["SyncDebug_Offline_AutoSyncWhenOnline"]; // "Offline – sync körs automatiskt när du blir online."
            await RefreshQueueOnlyAsync();
            return;
        }

        try
        {
            await _syncRunner.RunOnceAsync();

            // Force reload av userstate efter att servern applicerat kö
            var uid = _auth.Uid!;
            await _userState.RefreshAsync(uid, force: true, CancellationToken.None);

            // reconcile + rebuild
            RebuildPostsFromUserState();
            await ReconcileOptimisticAgainstStateAsync();
            RebuildPostsFromUserState();

            Message = _loc["SyncDebug_SyncDone"]; // "Sync körd."
        }
        catch (Exception ex)
        {
            Message = _loc["SyncDebug_SyncError", ex.Message]; // "Sync-fel: {0}"
        }
        finally
        {
            await RefreshQueueOnlyAsync();
            await NotifyChangedAsync();
        }
    }

    // ---------------------------
    // Queue operations + autosync
    // ---------------------------

    public async Task QueueCreatePostOnlyAsync()
    {
        Message = null;

        var uid = _auth.Uid ?? "";
        if (string.IsNullOrWhiteSpace(uid))
        {
            Message = _loc["SyncDebug_UserIdMissing_AuthUid"]; // "UserId saknas (AuthService.Uid)."
            await NotifyChangedAsync();
            return;
        }

        var opId = Guid.NewGuid().ToString("N");

        var dto = new CreatePostOperationDto
        {
            ClientOperationId = opId,
            Title = _loc["SyncDebug_OfflinePostTitle", DateTime.Now.ToString("HH:mm:ss")], // "Offline post {0}"
            Body = _loc["SyncDebug_QueuedViaPanelBody"], // "Köad via SyncDebugPanel"
            Status = "Draft"
        };

        // Optimistic: skapa temp-post och patcha state
        var temp = CreateTempPost(opId, dto);
        _pendingCreates[opId] = temp.PostId!;

        await _patcher.UpsertPostAsync(uid, temp);

        // uppdatera UI-state direkt
        RebuildPostsFromUserState();
        SelectedPostId = temp.PostId;
        await NotifyChangedAsync();

        // enqueue
        var env = new SyncOperationEnvelope
        {
            ClientOperationId = opId,
            UserId = uid,
            OperationType = SyncOperationType.CreatePost,
            ClientTimestampUtc = DateTime.UtcNow,
            Payload = JsonSerializer.SerializeToElement(dto, JsonOpts)
        };

        await _offlineWrite.EnqueueAsync(env);

        Message = _loc["SyncDebug_CreatePostQueued", opId]; // "CreatePost köad (opId={0})."
        await RefreshQueueOnlyAsync(); // uppdatera counts/list direkt i UI

        // Om du är online hela tiden: sync direkt
        if (_network.IsOnline)
        {
            await SyncNowAsync();
        }

        await NotifyChangedAsync();
    }

    public async Task QueueUpdateSelectedPostOnlyAsync()
    {
        PostOpsMessage = null;

        var uid = _auth.Uid ?? "";
        if (string.IsNullOrWhiteSpace(uid))
        {
            PostOpsMessage = _loc["SyncDebug_UserIdMissing_AuthUid"];
            await NotifyChangedAsync();
            return;
        }

        EnsureSelectedPostValid();
        if (!CanUpdateOrDeleteSelectedPost)
        {
            PostOpsMessage = _loc["SyncDebug_SelectRealPost"]; // "Välj en riktig post (inte temp/pending create)."
            await NotifyChangedAsync();
            return;
        }

        var existing = _postsUi.FirstOrDefault(p => p.PostId == SelectedPostId);
        if (existing is null)
        {
            PostOpsMessage = _loc["SyncDebug_PostNotFoundInUi"]; // "Hittade inte posten i UI-listan."
            await NotifyChangedAsync();
            return;
        }

        var opId = Guid.NewGuid().ToString("N");

        var dto = new UpdatePostOperationDto
        {
            ClientOperationId = opId,
            PostId = existing.PostId,

            Title = _loc["SyncDebug_UpdateTitleSuffix", existing.Title ?? "", DateTime.Now.ToString("HH:mm:ss")], // "{0} (upd {1})"
            Body = existing.Body,
            Status = string.IsNullOrWhiteSpace(existing.Status) ? "Draft" : existing.Status,
            UpdatedDate = DateTime.UtcNow
        };

        // optimistic: patch direkt
        var patched = ClonePost(existing);
        patched.Title = dto.Title ?? patched.Title;
        patched.Body = dto.Body ?? patched.Body;
        patched.Status = dto.Status ?? patched.Status;
        patched.UpdatedDate = dto.UpdatedDate ?? DateTime.UtcNow;
        patched.LastMutationId = opId;

        _pendingUpdates[opId] = existing.PostId!;
        await _patcher.UpsertPostAsync(uid, patched);

        RebuildPostsFromUserState();
        await NotifyChangedAsync();

        var env = new SyncOperationEnvelope
        {
            ClientOperationId = opId,
            UserId = uid,
            OperationType = SyncOperationType.UpdatePost,
            ClientTimestampUtc = DateTime.UtcNow,
            Payload = JsonSerializer.SerializeToElement(dto, JsonOpts)
        };

        await _offlineWrite.EnqueueAsync(env);

        PostOpsMessage = _loc["SyncDebug_UpdatePostQueued", opId]; // "UpdatePost köad (opId={0})."
        await RefreshQueueOnlyAsync();

        if (_network.IsOnline)
            await _autoSync.TrySyncSoonAsync(SyncNowAsync);

        await NotifyChangedAsync();
    }

    public async Task QueueDeleteSelectedPostOnlyAsync()
    {
        PostOpsMessage = null;

        var uid = _auth.Uid ?? "";
        if (string.IsNullOrWhiteSpace(uid))
        {
            PostOpsMessage = _loc["SyncDebug_UserIdMissing_AuthUid"];
            await NotifyChangedAsync();
            return;
        }

        EnsureSelectedPostValid();
        if (!CanUpdateOrDeleteSelectedPost)
        {
            PostOpsMessage = _loc["SyncDebug_SelectRealPost"];
            await NotifyChangedAsync();
            return;
        }

        var deletingId = SelectedPostId!;
        var opId = Guid.NewGuid().ToString("N");

        var dto = new DeletePostOperationDto
        {
            ClientOperationId = opId,
            PostId = deletingId
        };

        // optimistic: ta bort direkt
        _hiddenPostIds.Add(deletingId);
        await _patcher.RemovePostAsync(uid, deletingId);

        RebuildPostsFromUserState();
        EnsureSelectedPostValid();
        await NotifyChangedAsync();

        var env = new SyncOperationEnvelope
        {
            ClientOperationId = opId,
            UserId = uid,
            OperationType = SyncOperationType.DeletePost,
            ClientTimestampUtc = DateTime.UtcNow,
            Payload = JsonSerializer.SerializeToElement(dto, JsonOpts)
        };

        await _offlineWrite.EnqueueAsync(env);

        PostOpsMessage = _loc["SyncDebug_DeletePostQueued", opId]; // "DeletePost köad (opId={0})."
        await RefreshQueueOnlyAsync();

        if (_network.IsOnline)
            await _autoSync.TrySyncSoonAsync(SyncNowAsync);

        await NotifyChangedAsync();
    }

    public async Task QueueCreateRoleOnlyAsync()
    {
        Message = null;

        var uid = _auth.Uid ?? "";
        if (string.IsNullOrWhiteSpace(uid))
        {
            Message = _loc["SyncDebug_UserIdMissing"]; // "UserId saknas."
            await NotifyChangedAsync();
            return;
        }

        var dto = new CreateRoleOperationDto
        {
            RoleName = _loc["SyncDebug_RoleNameTemplate", DateTime.Now.ToString("HHmmss")] // "Role {0}"
        };

        var env = new SyncOperationEnvelope
        {
            UserId = uid,
            OperationType = SyncOperationType.CreateRole,
            ClientTimestampUtc = DateTime.UtcNow,
            Payload = JsonSerializer.SerializeToElement(dto, JsonOpts)
        };

        await _offlineWrite.EnqueueAsync(env);

        Message = _loc["SyncDebug_CreateRoleQueued"]; // "CreateRole köad."
        await RefreshQueueOnlyAsync();

        if (_network.IsOnline)
            await _autoSync.TrySyncSoonAsync(SyncNowAsync);

        await NotifyChangedAsync();
    }

    public async Task QueueCreateMembershipOnlyAsync()
    {
        Message = null;

        var uid = _auth.Uid ?? "";
        if (string.IsNullOrWhiteSpace(uid))
        {
            Message = _loc["SyncDebug_UserIdMissing"];
            await NotifyChangedAsync();
            return;
        }

        var dto = new CreateMembershipOperationDto
        {
            MembershipName = _loc["SyncDebug_MembershipNameTemplate", DateTime.Now.ToString("HHmmss")], // "Membership {0}"
            MembershipType = "Free",
            MembershipPrice = 0,
            IsActive = true
        };

        var env = new SyncOperationEnvelope
        {
            UserId = uid,
            OperationType = SyncOperationType.CreateMembership,
            ClientTimestampUtc = DateTime.UtcNow,
            Payload = JsonSerializer.SerializeToElement(dto, JsonOpts)
        };

        await _offlineWrite.EnqueueAsync(env);

        Message = _loc["SyncDebug_CreateMembershipQueued"]; // "CreateMembership köad."
        await RefreshQueueOnlyAsync();

        if (_network.IsOnline)
            await _autoSync.TrySyncSoonAsync(SyncNowAsync);

        await NotifyChangedAsync();
    }

    // ---- queue admin
    public async Task ClearQueueAsync()
    {
        Message = null;
        try
        {
            await _queue.ClearAsync();
            Message = _loc["SyncDebug_QueueCleared"]; // "Queue rensad."
        }
        catch (Exception ex)
        {
            Message = _loc["SyncDebug_ClearQueueError", ex.Message]; // "ClearQueue-fel: {0}"
        }
        finally
        {
            await RefreshQueueOnlyAsync();
            await NotifyChangedAsync();
        }
    }

    public async Task DeleteQueueItemAsync(string id)
    {
        Message = null;
        try
        {
            await _queue.DeleteAsync(id);
            Message = _loc["SyncDebug_DeletedItem", id]; // "Tog bort {0}."
        }
        catch (Exception ex)
        {
            Message = _loc["SyncDebug_DeleteError", ex.Message]; // "Delete-fel: {0}"
        }
        finally
        {
            await RefreshQueueOnlyAsync();
            await NotifyChangedAsync();
        }
    }

    public async Task SetPendingAsync(string id)
    {
        Message = null;
        try
        {
            var all = await _queue.GetAllAsync();
            var item = all.FirstOrDefault(x => x.Id == id);
            if (item is null)
            {
                Message = _loc["SyncDebug_ItemNotFound", id]; // "Hittade inte {0}."
                await NotifyChangedAsync();
                return;
            }

            item.Status = SyncQueueStatus.Pending;
            item.LastError = null;
            item.LastAttemptUtc = null;

            await _queue.UpsertAsync(item);
            Message = _loc["SyncDebug_SetPendingOk", id]; // "{0} => Pending."
        }
        catch (Exception ex)
        {
            Message = _loc["SyncDebug_SetPendingError", ex.Message]; // "SetPending-fel: {0}"
        }
        finally
        {
            await RefreshQueueOnlyAsync();
            await NotifyChangedAsync();
        }
    }

    // ---------------------------
    // State helpers
    // ---------------------------

    private void RebuildPostsFromUserState()
    {
        _postsUi.Clear();

        var list = _userState.Current?.ContentPostList;
        if (list is null) return;

        foreach (var p in list)
        {
            if (p is null) continue;
            if (string.IsNullOrWhiteSpace(p.PostId)) continue;
            if (_hiddenPostIds.Contains(p.PostId)) continue;
            _postsUi.Add(p);
        }
    }

    private async Task ReconcileOptimisticAgainstStateAsync()
    {
        var stateList = _userState.Current?.ContentPostList;
        if (stateList is null || stateList.Count == 0) return;

        // mutationId -> real post (från state)
        var byMutation = stateList
            .Where(p => p is not null)
            .Where(p => !string.IsNullOrWhiteSpace(p.PostId))
            .Where(p => !string.IsNullOrWhiteSpace(p.LastMutationId))
            .GroupBy(p => p!.LastMutationId!, StringComparer.Ordinal)
            .ToDictionary(g => g.Key, g => g.First()!, StringComparer.Ordinal);

        if (_pendingCreates.Count > 0)
        {
            var toRemove = new List<string>();

            foreach (var kv in _pendingCreates)
            {
                var opId = kv.Key;
                var tempId = kv.Value;

                if (byMutation.TryGetValue(opId, out var realPost))
                {
                    // temp kan ligga kvar eftersom vi patchade in den i userState.
                    if (!string.Equals(realPost.PostId, tempId, StringComparison.Ordinal))
                    {
                        await _patcher.RemovePostAsync(_auth.Uid!, tempId);
                    }

                    if (string.Equals(SelectedPostId, tempId, StringComparison.Ordinal))
                        SelectedPostId = realPost.PostId;

                    toRemove.Add(opId);
                }
            }

            foreach (var opId in toRemove)
                _pendingCreates.Remove(opId);
        }

        if (_pendingUpdates.Count > 0)
        {
            var toRemove = _pendingUpdates.Keys.Where(byMutation.ContainsKey).ToList();
            foreach (var opId in toRemove)
                _pendingUpdates.Remove(opId);
        }

        EnsureSelectedPostValid();
    }

    private void EnsureSelectedPostValid()
    {
        if (string.IsNullOrWhiteSpace(SelectedPostId))
        {
            SelectedPostId = _postsUi.FirstOrDefault()?.PostId;
            return;
        }

        if (!_postsUi.Any(p => p.PostId == SelectedPostId))
            SelectedPostId = _postsUi.FirstOrDefault()?.PostId;
    }

    private static ContentPost CreateTempPost(string opId, CreatePostOperationDto dto)
    {
        var tempId = "temp_" + opId;

        return new ContentPost
        {
            PostId = tempId,
            Title = dto.Title ?? "(without title)",
            Body = dto.Body ?? "",
            Status = dto.Status ?? "Draft",
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            LastMutationId = opId
        };
    }

    private static bool IsTempId(string? postId)
        => !string.IsNullOrWhiteSpace(postId) &&
           postId.StartsWith("temp_", StringComparison.Ordinal);

    private bool IsPendingCreatePost(string? postId)
        => !string.IsNullOrWhiteSpace(postId) &&
           _pendingCreates.Values.Contains(postId, StringComparer.Ordinal);

    private static ContentPost ClonePost(ContentPost p)
    {
        return new ContentPost
        {
            PostId = p.PostId,
            UserId = p.UserId,
            LastMutationId = p.LastMutationId,

            Title = p.Title,
            Body = p.Body,
            Purpose = p.Purpose,
            Freethinking = p.Freethinking,
            Pillar = p.Pillar,
            Status = p.Status,

            Tags = p.Tags?.ToList() ?? new List<string>(),
            MediaUrls = p.MediaUrls?.ToList() ?? new List<string>(),
            MediaCannels = p.MediaCannels?.ToList() ?? new List<string>(),
            Categories = p.Categories?.ToList() ?? new List<string>(),
            RelatedPostIds = p.RelatedPostIds?.ToList() ?? new List<string>(),
            DreamClients = p.DreamClients?.ToList() ?? new List<string>(),

            Language = p.Language,
            TemplateId = p.TemplateId,

            Tone = p.Tone?.ToList() ?? new List<string>(),
            Hooks = p.Hooks?.ToList() ?? new List<string>(),
            StorytellingStructures = p.StorytellingStructures?.ToList() ?? new List<string>(),
            CTAs = p.CTAs?.ToList() ?? new List<string>(),

            PublishDate = p.PublishDate,
            CreatedDate = p.CreatedDate,
            UpdatedDate = p.UpdatedDate,
            ArchivedDate = p.ArchivedDate
        };
    }
}
