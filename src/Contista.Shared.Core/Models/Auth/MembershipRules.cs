using Contista.Shared.Core.Offline.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Models.Auth;

public static class MembershipRules
{
    public static int GetMaxExtraCalendars(CommonDataDto? common, string? membershipId)
    {
        if (common?.Memberships is null || string.IsNullOrWhiteSpace(membershipId))
            return 0;

        var m = common.Memberships.FirstOrDefault(x => x.MembershipId == membershipId && x.IsActive);
        return m?.MaxExtraCalendars ?? 0;
    }
}
