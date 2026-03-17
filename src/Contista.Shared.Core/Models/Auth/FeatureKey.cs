
namespace Contista.Shared.Core.Models.Auth;
/// <summary>
/// FeatureKey = lista på funktioner
/// </summary>
public enum FeatureKey
{
    // Dashboard / bas (Free)
    Dashboard,
    Categories,
    Notepad,
    DreamCustomer,
    QuestionsAnswers,
    SocialMedia,
    Settings,
    UpgradeRequired,

    // Subscription tiers
    WeeklyPlanning,
    ContentPillars,
    CreateContent,
    Calendar,
    CalendarShare,
    CalendarRemindersChannels,
    CalendarRemindersChannelsEnable,
    HooksAndCtas,
    Avatars,
    TrendScouting,
    ContentStrategy,
    AllTexts,
    MyStory,

    // Permanent-specific (special entitlement)
    OneTimePack,

    // Admin-only
    AdminTools,
    Sampels,
}
