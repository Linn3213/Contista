using Contista.Shared.Core.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.SyncDebug;

public interface IUserDataOptimisticPatcher
{
    Task<bool> UpsertPostAsync(string userId, ContentPost post, CancellationToken ct = default);
    Task<bool> RemovePostAsync(string userId, string postId, CancellationToken ct = default);
}
