using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Offline.Models.Operations;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Firebase
{
    public interface IContentPostRepository
    {
        Task<List<ContentPost>> GetAllAsync(string userId, CancellationToken ct = default);
        Task<string?> CreateAsync(string userId, CreatePostOperationDto dto, CancellationToken ct = default);
        Task UpdateAsync(string userId, UpdatePostOperationDto dto, CancellationToken ct = default);
        Task DeleteAsync(string userId, string postId, CancellationToken ct = default);
    }
}
