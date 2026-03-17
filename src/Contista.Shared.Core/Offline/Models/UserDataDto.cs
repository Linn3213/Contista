using Contista.Shared.Core.DTO;

namespace Contista.Shared.Core.Offline.Models;

public sealed record UserDataDto(
    string UserId,
    string FirstName,
    string LastName,
    string? DisplayName,
    string? Bio,
    string Language,
    string? Email,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string? RoleId,
    string? MembershipId,
    IReadOnlyList<ContentPost> ContentPostList
);
