using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Offline.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.SyncDebug;

public interface ISyncDebugController
{
    // UI state
    IReadOnlyList<ContentPost> PostsUi { get; }
    string? SelectedPostId { get; set; }

    string? Message { get; }
    string? PostOpsMessage { get; }

    // Queue state
    IReadOnlyList<SyncQueueItem> QueueItems { get; }
    int PendingCount { get; }
    int ProcessingCount { get; }
    int FailedCount { get; }
    int DoneCount { get; }

    bool AutoRefresh { get; }
    void SetAutoRefresh(bool enabled);

    // Derived flags
    bool CanUpdateOrDeleteSelectedPost { get; }

    // Lifecycle hooks from component
    Task InitializeAsync();
    void Attach();   // subscribe to events
    void Detach();   // unsubscribe (component Dispose)

    // Commands
    Task RefreshQueueOnlyAsync();
    Task SyncNowAsync();

    Task ClearQueueAsync();
    Task DeleteQueueItemAsync(string id);
    Task SetPendingAsync(string id);

    Task QueueCreatePostOnlyAsync();
    Task QueueUpdateSelectedPostOnlyAsync();
    Task QueueDeleteSelectedPostOnlyAsync();

    Task QueueCreateRoleOnlyAsync();
    Task QueueCreateMembershipOnlyAsync();
}
