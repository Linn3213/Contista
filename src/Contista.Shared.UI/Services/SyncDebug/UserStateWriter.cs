using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Interfaces.SyncDebug;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.UI.Services.SyncDebug;

public sealed class UserStateWriter : IUserStateWriter
{
    private readonly IFirebaseAuthService _auth;
    private readonly IUserDataState<UserDataDto> _state;
    private readonly IMutableUserDataState<UserDataDto> _mutable;

    public UserStateWriter(
        IFirebaseAuthService auth,
        IUserDataState<UserDataDto> state,
        IMutableUserDataState<UserDataDto> mutable)
    {
        _auth = auth;
        _state = state;
        _mutable = mutable;
    }

    public string? GetUserId() => _auth.Uid;

    public IReadOnlyList<ContentPost> GetPosts()
        => _state.Current?.ContentPostList ?? Array.Empty<ContentPost>();

    public void UpsertPost(ContentPost post)
    {
        var uid = _auth.Uid;
        if (string.IsNullOrWhiteSpace(uid)) return;

        _ = _mutable.TryApplyLocalPatchAsync(uid, current =>
        {
            var list = current.ContentPostList?.ToList() ?? new List<ContentPost>();

            var idx = list.FindIndex(p => string.Equals(p.PostId, post.PostId, StringComparison.Ordinal));
            if (idx >= 0) list[idx] = post;
            else list.Insert(0, post);

            return current with { ContentPostList = list };
        });
    }

    public void RemovePost(string postId)
    {
        var uid = _auth.Uid;
        if (string.IsNullOrWhiteSpace(uid)) return;

        _ = _mutable.TryApplyLocalPatchAsync(uid, current =>
        {
            var list = current.ContentPostList?.ToList() ?? new List<ContentPost>();
            list.RemoveAll(p => string.Equals(p.PostId, postId, StringComparison.Ordinal));
            return current with { ContentPostList = list };
        });
    }

    public Task RefreshAsync(bool force)
    {
        var uid = _auth.Uid;
        if (string.IsNullOrWhiteSpace(uid)) return Task.CompletedTask;

        return _state.RefreshAsync(uid, force: force, CancellationToken.None);
    }
}
