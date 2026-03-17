using Microsoft.AspNetCore.Components;

namespace Contista.Shared.UI.Routing;

public static class RouteTitleMap
{
    /// <summary>
    /// Returnerar RouteMeta (Title + Section) baserat på URL.
    /// Reglerna är ordnade: första match vinner.
    /// </summary>
    public static RouteMeta Resolve(string absoluteUrl, NavigationManager nav, Func<string, string?> loc)
    {
        var path = NormalizePath(nav, absoluteUrl);

        #region Single links
        // =========================
        // ADMIN (accordion)
        // =========================
        if (path == "app/admin/admintools")
            return new RouteMeta(
                loc("Page_Sidebar_AdminTools_Nav") ?? "Admin tools",
                "admin"
            );

        if (path == "app/admin/sampels")
            return new RouteMeta(
                loc("Page_Sidebar_Sampels_Nav") ?? "Sampels",
                "admin"
            );

        if (path.StartsWith("app/admin/"))
            return new RouteMeta("Admin", "admin");

        // =========================
        // DASHBOARD (single link)
        // =========================
        if (path == "app/home")
            return new RouteMeta(
                loc("Page_Sidebar_Dashboard_Nav") ?? "Dashboard",
                "dashboard"
            );

        // =========================
        // SETTINGS (single link)
        // =========================
        if (path == "app/settings")
            return new RouteMeta(
                loc("Page_Sidebar_Settings_Nav") ?? "Settings",
                "system"
            );

        // =========================
        // SINGLE LINKS (no accordion)
        // =========================
        if (path.StartsWith("app/uc/creator"))
            return new RouteMeta(
                loc("Page_Sidebar_CreateContent_Nav") ?? "Create content",
                "" // ingen accordion-sektion
            );

        if (path.StartsWith("app/uc/week"))
            return new RouteMeta(
                loc("Page_Sidebar_WeeklyPlanning_Nav") ?? "Weekly planning",
                "" // ingen accordion-sektion
            );

        if (path.StartsWith("app/calendar"))
            return new RouteMeta(
                loc("Page_Sidebar_Calendar_Nav") ?? "Calendar",
                "" // ingen accordion-sektion
            );

        if (path.StartsWith("app/uc/dreamclient"))
            return new RouteMeta(
                loc("Page_Sidebar_DreamCustomer_Nav") ?? "Dream customer",
                "" // ingen accordion-sektion
            );

        if (path.StartsWith("app/uc/social"))
            return new RouteMeta(
                loc("Page_Sidebar_SocialMedia_Nav") ?? "Social media",
                "" // ingen accordion-sektion
            );

        #endregion

        #region CONTENT LIBRARY
        // =========================
        // CONTENT LIBRARY (accordion)
        // =========================
        if (path.StartsWith("app/uc/avatars"))
            return new RouteMeta(
                loc("Page_Sidebar_Avatars_Nav") ?? "Avatars",
                "library"
            );

        if (path.StartsWith("app/uc/resources"))
            return new RouteMeta(
                loc("Page_Sidebar_HooksCTAs_Nav") ?? "Hooks & CTAs",
                "library"
            );

        if (path.StartsWith("app/uc/texts"))
            return new RouteMeta(
                loc("Page_Sidebar_AllTexts_Nav") ?? "All texts",
                "library"
            );

        if (path.StartsWith("app/uc/story"))
            return new RouteMeta(
                loc("Page_Sidebar_MyStory_Nav") ?? "My story",
                "library"
            );

        if (path.StartsWith("app/uc/questions"))
            return new RouteMeta(
                loc("Page_Sidebar_QuestionsAnswers_Nav") ?? "Q & A",
                "library"
            );

        #endregion



        #region INSPIRATION & IDEAS
        // =========================
        // INSPIRATION & IDEAS (accordion)
        // =========================
        if (path.StartsWith("app/uc/pillars"))
            return new RouteMeta(
                loc("Page_Sidebar_ContentPillars_Nav") ?? "Content pillars",
                "ideas"
            );

        if (path.StartsWith("app/uc/trends"))
            return new RouteMeta(
                loc("Page_Sidebar_TrendScouting_Nav") ?? "Trend scouting",
                "ideas"
            );

        if (path.StartsWith("app/uc/inspiration"))
            return new RouteMeta(
                loc("Page_Sidebar_Notepad_Nav") ?? "Notepad",
                "ideas"
            );

        if (path.StartsWith("app/uc/strategy"))
            return new RouteMeta(
                loc("Page_Sidebar_ContentStrategy_Nav") ?? "Content strategy",
                "ideas"
            );
        #endregion


        #region FALLBACKS
        // =========================
        // FALLBACK
        // =========================
        return new RouteMeta(
            loc("Page_Sidebar_Dashboard_Title") ?? "Dashboard",
            "dashboard"
        );
        #endregion
    }

    /// <summary>
    /// Behåll din gamla signatur om du vill (TopBar kan fortsätta använda ResolveTitle).
    /// </summary>
    public static string ResolveTitle(string absoluteUrl, NavigationManager nav, Func<string, string?> loc)
        => Resolve(absoluteUrl, nav, loc).Title;

    /// <summary>
    /// Behåll också en helper för Sidebar om du vill.
    /// </summary>
    public static string ResolveSection(string absoluteUrl, NavigationManager nav, Func<string, string?> loc)
        => Resolve(absoluteUrl, nav, loc).Section;

    private static string NormalizePath(NavigationManager nav, string absoluteUrl)
    {
        var rel = nav.ToBaseRelativePath(absoluteUrl) ?? "";
        var path = rel.Split('?', '#')[0].Trim('/');
        return path.ToLowerInvariant();
    }

}

public record RouteMeta(
    string Title,
    string Section // "admin", "library", "ideas", "dashboard", …
);
