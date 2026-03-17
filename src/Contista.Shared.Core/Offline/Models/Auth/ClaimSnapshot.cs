using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace Contista.Shared.Core.Offline.Models.Auth;

public sealed record ClaimSnapshot(
    string UserId,
    DateTime UpdatedAtUtc,
    List<ClaimSnapshotItem> Claims)
{
    public ClaimsPrincipal ToPrincipal(string authenticationType = "la-auth")
    {
        var identity = new ClaimsIdentity(authenticationType);

        foreach (var c in Claims)
            identity.AddClaim(new Claim(
                c.Type,
                c.Value,
                c.ValueType ?? ClaimValueTypes.String,
                c.Issuer ?? ClaimsIdentity.DefaultIssuer));

        return new ClaimsPrincipal(identity);
    }

    public static ClaimSnapshot FromPrincipal(string userId, ClaimsPrincipal principal)
    {
        var list = principal.Claims
            .Select(c => new ClaimSnapshotItem(c.Type, c.Value, c.ValueType, c.Issuer))
            .ToList();

        return new ClaimSnapshot(
            UserId: userId,
            UpdatedAtUtc: DateTime.UtcNow,
            Claims: list);
    }
}

public sealed record ClaimSnapshotItem(
    string Type,
    string Value,
    string? ValueType = null,
    string? Issuer = null);
