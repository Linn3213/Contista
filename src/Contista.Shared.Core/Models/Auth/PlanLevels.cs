namespace Contista.Shared.Core.Models.Auth;

public static class PlanLevels
{
    // Prenumerationsnivå (0..4). Permanent ingår INTE i trappan.
    public static int MapPlanLevel(string? membershipType, bool isAdmin)
    {
        if (isAdmin) return 4;

        var mt = string.IsNullOrWhiteSpace(membershipType) ? "Free" : membershipType;

        return mt switch
        {
            "Free" => 0,
            "Standard" => 1,
            "Premium" => 2,
            "Full" => 4,

            // Permanent är inte “level 3”
            "Permanent" => 0,

            _ => 0
        };
    }

    public static string NormalizeMembershipType(string? membershipType, bool isAdmin)
        => isAdmin ? "Full" : (string.IsNullOrWhiteSpace(membershipType) ? "Free" : membershipType);

    public static bool IsPermanent(string? membershipType)
        => string.Equals(membershipType, "Permanent", StringComparison.OrdinalIgnoreCase);


}
