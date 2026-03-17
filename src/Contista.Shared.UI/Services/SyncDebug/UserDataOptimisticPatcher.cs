using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Interfaces.SyncDebug;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.UI.Services.SyncDebug;

public sealed class UserDataOptimisticPatcher : IUserDataOptimisticPatcher
{
    private readonly IMutableUserDataState<UserDataDto> _userState;

    public UserDataOptimisticPatcher(IMutableUserDataState<UserDataDto> userState)
    {
        _userState = userState;
    }

    public Task<bool> UpsertPostAsync(string userId, ContentPost post, CancellationToken ct = default)
        => _userState.TryApplyLocalPatchAsync(userId, current =>
        {
            var list = current.ContentPostList?.ToList() ?? new List<ContentPost>();

            var idx = list.FindIndex(p => string.Equals(p.PostId, post.PostId, StringComparison.Ordinal));
            if (idx >= 0) list[idx] = post;
            else list.Insert(0, post);

            return current with { ContentPostList = list };
        }, ct);

    public Task<bool> RemovePostAsync(string userId, string postId, CancellationToken ct = default)
        => _userState.TryApplyLocalPatchAsync(userId, current =>
        {
            var list = current.ContentPostList?.ToList() ?? new List<ContentPost>();
            list.RemoveAll(p => string.Equals(p.PostId, postId, StringComparison.Ordinal));
            return current with { ContentPostList = list };
        }, ct);
}