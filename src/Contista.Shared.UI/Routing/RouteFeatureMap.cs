using Contista.Shared.Core.Models.Auth;

namespace Contista.Shared.UI.Routing;

public static class RouteFeatureMap
{
    // nyckel: route template (som i @page)
    // värde: feature
    public static readonly IReadOnlyDictionary<string, FeatureKey> Map =
        new Dictionary<string, FeatureKey>(StringComparer.OrdinalIgnoreCase)
        {
            ["/app/home"] = FeatureKey.Dashboard,
            ["/app/upgrade"] = FeatureKey.UpgradeRequired,

            ["/app/uc/week"] = FeatureKey.WeeklyPlanning,
            ["/app/uc/pillars"] = FeatureKey.ContentPillars,
            ["/app/uc/creator"] = FeatureKey.CreateContent,
            ["/app/calendar"] = FeatureKey.Calendar,
            ["/app/uc/resources"] = FeatureKey.HooksAndCtas,
            ["/app/uc/avatars"] = FeatureKey.Avatars,
            ["/app/uc/trends"] = FeatureKey.TrendScouting,
            ["/app/uc/inspiration"] = FeatureKey.Notepad,
            ["/app/uc/dreamclient"] = FeatureKey.DreamCustomer,
            ["/app/uc/strategy"] = FeatureKey.ContentStrategy,
            ["/app/uc/texts"] = FeatureKey.AllTexts,
            ["/app/uc/story"] = FeatureKey.MyStory,
            ["/app/uc/questions"] = FeatureKey.QuestionsAnswers,

            // Admin (online required + admin entitlement)
            ["/app/admin/adminTools"] = FeatureKey.AdminTools,
            ["/app/admin/sampels"] = FeatureKey.Sampels,

            ["/app/settings"] = FeatureKey.Settings,
            ["/app/uc/social"] = FeatureKey.SocialMedia,
        };

    public static bool TryGetFeature(string absolutePath, out FeatureKey feature)
    {
        feature = default;

        // normalisera
        var path = (absolutePath ?? "").Trim();
        if (!path.StartsWith("/")) path = "/" + path;

        foreach (var (prefix, f) in Map)
        {
            if (path.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            {
                feature = f;
                return true;
            }
        }

        return false;
    }
}
