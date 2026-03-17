using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Models;

namespace Contista.Shared.Core.Mappers
{
    public static class ContentPostMapper
    {
        public static ContentPost ToContentPost(FirestoreDocument doc, string id, string userId)
        {
            var f = doc.Fields ?? new Dictionary<string, FirestoreValue>();

            return new ContentPost
            {
                PostId = id,
                UserId = userId,
                LastMutationId = f.GetString("LastMutationId"),

                Title = f.GetString("Title"),
                Body = f.GetString("Body"),
                Purpose = f.GetString("Purpose"),
                Freethinking = f.GetString("Freethinking"),
                Pillar = string.IsNullOrWhiteSpace(f.GetString("Pillar")) ? null : f.GetString("Pillar"),
                Status = string.IsNullOrWhiteSpace(f.GetString("Status")) ? "Draft" : f.GetString("Status"),

                Tags = f.GetStringList("Tags"),
                MediaUrls = f.GetStringList("MediaUrls"),
                MediaCannels = f.GetStringList("MediaCannels"),
                Categories = f.GetStringList("Categories"),
                RelatedPostIds = f.GetStringList("RelatedPostIds"),
                DreamClients = f.GetStringList("DreamClients"),

                Language = string.IsNullOrWhiteSpace(f.GetString("Language")) ? "en" : f.GetString("Language"),
                TemplateId = f.GetString("TemplateId"),

                Tone = f.GetStringList("Tone"),
                Hooks = f.GetStringList("Hooks"),
                StorytellingStructures = f.GetStringList("StorytellingStructures"),
                CTAs = f.GetStringList("CTAs"),

                PublishDate = f.GetDate("PublishDate"),
                CreatedDate = f.GetDate("CreatedDate"),
                UpdatedDate = f.GetDate("UpdatedDate"),
                ArchivedDate = f.GetDate("ArchivedDate"),
            };
        }

        public static FirestoreDocument FromContentPost(ContentPost p)
        {
            var fields = new Dictionary<string, FirestoreValue>
            {
                ["Title"] = (p.Title ?? "").ToFirestoreValue(),
                ["Body"] = (p.Body ?? "").ToFirestoreValue(),

                ["Purpose"] = (p.Purpose ?? "").ToFirestoreValue(),
                ["Freethinking"] = (p.Freethinking ?? "").ToFirestoreValue(),

                ["Pillar"] = (p.Pillar ?? "").ToFirestoreValue(),
                ["Status"] = (p.Status ?? "Draft").ToFirestoreValue(),

                ["Tags"] = (p.Tags ?? new()).ToFirestoreArrayValue(),
                ["MediaUrls"] = (p.MediaUrls ?? new()).ToFirestoreArrayValue(),
                ["MediaCannels"] = (p.MediaCannels ?? new()).ToFirestoreArrayValue(),
                ["Categories"] = (p.Categories ?? new()).ToFirestoreArrayValue(),
                ["RelatedPostIds"] = (p.RelatedPostIds ?? new()).ToFirestoreArrayValue(),
                ["DreamClients"] = (p.DreamClients ?? new()).ToFirestoreArrayValue(),

                ["Language"] = (p.Language ?? "en").ToFirestoreValue(),
                ["TemplateId"] = (p.TemplateId ?? "").ToFirestoreValue(),

                ["Tone"] = (p.Tone ?? new()).ToFirestoreArrayValue(),
                ["Hooks"] = (p.Hooks ?? new()).ToFirestoreArrayValue(),
                ["StorytellingStructures"] = (p.StorytellingStructures ?? new()).ToFirestoreArrayValue(),
                ["CTAs"] = (p.CTAs ?? new()).ToFirestoreArrayValue(),

                ["PublishDate"] = p.PublishDate.ToFirestoreTimestamp(),
                ["CreatedDate"] = p.CreatedDate.ToFirestoreTimestamp(),
                ["UpdatedDate"] = p.UpdatedDate.ToFirestoreTimestamp(),
                ["ArchivedDate"] = p.ArchivedDate.ToFirestoreTimestamp(),
            };

            if (!string.IsNullOrWhiteSpace(p.LastMutationId))
                fields["LastMutationId"] = p.LastMutationId.ToFirestoreValue();

            return new FirestoreDocument { Fields = fields };
        }
    }
}
