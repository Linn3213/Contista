using Contista.Shared.Core.Models.Auth;

public static class EntitlementPlanHelper
{
    // För prenumerationstrappan. Permanent/Admin hanteras separat.
    //public static int? MinPlanFor(Entitlement allowed)
    //{
    //    // Om feature är tillgänglig via Premium (eller högre)
    //    if (allowed.HasFlag(Entitlement.Premium)) return PlanLevels.Premium;

    //    // Om feature är tillgänglig via Standard (eller högre)
    //    if (allowed.HasFlag(Entitlement.Standard)) return PlanLevels.Standard;

    //    // Free betyder "inloggad", men planmässigt Free
    //    if (allowed.HasFlag(Entitlement.Free)) return PlanLevels.Free;

    //    // Permanent/Admin kräver inte plan
    //    return null;
    //}
}
