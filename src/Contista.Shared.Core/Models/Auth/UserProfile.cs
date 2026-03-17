using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Models.Auth;

public sealed record UserProfile(
    string UserId,
    string Email,
    string Firstname,
    string Lastname,
    string DisplayName,
    string ? Bio,
    string Language,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string RoleId,
    string RoleName,
    string MembershipId,
    string MembershipName,
    string MembershipType
);
