using Contista.Shared.Core.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.SyncDebug;

public interface IUserStateWriter
{
    string? GetUserId();
    IReadOnlyList<ContentPost> GetPosts();

    // Optimistiska patchar
    void UpsertPost(ContentPost post);
    void RemovePost(string postId);

    // När vi vill tvinga reload från backend
    Task RefreshAsync(bool force);
}
