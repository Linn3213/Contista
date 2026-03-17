using System.Collections.ObjectModel;

namespace Contista.Shared.Core.Models.Auth;

public static class FeatureRequirements
{
    // Centralt register
    public static readonly IReadOnlyDictionary<FeatureKey, FeatureRequirement> Map =
        new Dictionary<FeatureKey, FeatureRequirement>
        {
            // Free (inloggad)
            [FeatureKey.Dashboard] = new(Entitlement.All),
            [FeatureKey.Categories] = new(Entitlement.Free),
            [FeatureKey.Notepad] = new(Entitlement.Free),
            [FeatureKey.DreamCustomer] = new(Entitlement.All),
            [FeatureKey.QuestionsAnswers] = new(Entitlement.All),
            [FeatureKey.SocialMedia] = new(Entitlement.Free),
            [FeatureKey.Settings] = new(Entitlement.All),
            [FeatureKey.UpgradeRequired] = new(Entitlement.All),

            // Mix & match (din modell)
            [FeatureKey.WeeklyPlanning] = new(Entitlement.All),
            [FeatureKey.ContentPillars] = new(Entitlement.All),
            [FeatureKey.ContentStrategy] = new(Entitlement.Standard),
            [FeatureKey.AllTexts] = new(Entitlement.Standard),
            [FeatureKey.MyStory] = new(Entitlement.Standard),

            [FeatureKey.CreateContent] = new(Entitlement.All),
            [FeatureKey.Calendar] = new(Entitlement.All) ,
            [FeatureKey.CalendarShare] = new(Entitlement.Standard),
            [FeatureKey.CalendarRemindersChannels] = new(Entitlement.Admin),
            [FeatureKey.CalendarRemindersChannelsEnable] = new(Entitlement.Admin),
            [FeatureKey.HooksAndCtas] = new(Entitlement.Premium),
            [FeatureKey.Avatars] = new(Entitlement.Standard | Entitlement.Premium),  
            [FeatureKey.TrendScouting] = new(Entitlement.Premium),

            // Permanent-only pack
            [FeatureKey.OneTimePack] = new(Entitlement.Permanent),

            // Admin-only + online
            [FeatureKey.AdminTools] = new(Entitlement.Admin, OnlineRequired: true),
            [FeatureKey.Sampels] = new(Entitlement.Admin, OnlineRequired: true),
        };
}
