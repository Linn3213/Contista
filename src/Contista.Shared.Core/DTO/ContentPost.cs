using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO
{
    public class ContentPost
    {
        public string PostId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;

        public string? LastMutationId { get; set; }
        public string Title { get; set; } = string.Empty; // Exempel: "5 Tips för att förbättra din produktivitet"
        public string Body { get; set; } = string.Empty; // Exempel: Markdown-innehåll
        
        public string Purpose { get; set; } = string.Empty; // Exempel: Educate, Inspire, Promote
        public string Freethinking { get; set; } = string.Empty; // Exempel: "Innovativa idéer för framtiden"
        
        public string? Pillar { get; set; } = null; // Exempel: Education, Inspiration, Promotion
        
        public string Status { get; set; } = "Draft"; // Exempel: Draft, Published, Archived
        
        public List<string> Tags { get; set; } = new List<string>(); // Exempel: AI, Productivity, Wellness
        public List<string> MediaUrls { get; set; } = new List<string>(); // Exempel: URL till bilder, videor
        public List<string> MediaCannels { get; set; } = new List<string>(); // Exempel: Blog, Social Media, Newsletter
        public List<string> Categories { get; set; } = new List<string>(); // Exempel: Technology, Health, Finance
        public List<string> RelatedPostIds { get; set; } = new List<string>();
        public List<string> DreamClients { get; set; } = new List<string>();
        
        public string Language { get; set; } = "en"; // Exempel: en, sv, fr
        public string TemplateId { get; set; } = string.Empty; // Exempel: Id för: Hypothetical Story, The Big Dream
        
        public List<string> Tone { get; set; } = new List<string>(); // Exempel: Nice, Professional, Casual
        public List<string> Hooks { get; set; } = new List<string>(); // Exempel: Attention-Grabbing, Question, Statistic
        public List<string> StorytellingStructures { get; set; } = new List<string>();
        public List<string> CTAs { get; set; } = new List<string>(); // Call To Actions
        
        public DateTime PublishDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
        public DateTime ArchivedDate { get; set; } = DateTime.UtcNow;
    }
}
