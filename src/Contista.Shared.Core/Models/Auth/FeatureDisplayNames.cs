using Contista.Shared.Core.Models.Auth;

public static class FeatureDisplayNames
{
    public static readonly IReadOnlyDictionary<FeatureKey, string> Map =
        new Dictionary<FeatureKey, string>
        {
            // Free (inloggad)
            [FeatureKey.Dashboard] = "Dashboard",
            [FeatureKey.Categories] = "Categories",
            [FeatureKey.Notepad] = "Notepad",
            [FeatureKey.DreamCustomer] = "Dream Customer",
            [FeatureKey.QuestionsAnswers] = "Q & A",
            [FeatureKey.SocialMedia] = "Social Media",
            [FeatureKey.Settings] = "Settings",
            [FeatureKey.UpgradeRequired] = "Upgrade required",

            // Mix & match (din modell)
            [FeatureKey.WeeklyPlanning] = "Weekly Planning",
            [FeatureKey.ContentPillars] = "Content Pillars",
            [FeatureKey.ContentStrategy] = "Content Strategy",
            [FeatureKey.AllTexts] = "All Texts",
            [FeatureKey.MyStory] = "My Story",

            [FeatureKey.CreateContent] = "Create content",
            [FeatureKey.Calendar] = "Content Calendar",
            [FeatureKey.CalendarShare] = "Calendar sharing",
            [FeatureKey.CalendarRemindersChannels] = "Calendar reminder channels",
            [FeatureKey.CalendarRemindersChannelsEnable] = "Calendar reminder channel selection",
            [FeatureKey.HooksAndCtas] = "Hooks & CTAs",
            [FeatureKey.Avatars] = "Avatars",
            [FeatureKey.TrendScouting] = "Trend Scouting",

            // Permanent-only pack
            [FeatureKey.OneTimePack] = "Permanent feature",

            // Admin-only + online
            [FeatureKey.AdminTools] = "Admin tools",
            [FeatureKey.Sampels] = "Sampels"
        };
}
