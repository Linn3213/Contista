using Contista.Shared.Core.DTO;

namespace Contista.Shared.Core.Offline.Models
{
    public sealed record CommonDataDto(
    IReadOnlyList<Membership> Memberships,
    IReadOnlyList<Role> Roles
);
}
