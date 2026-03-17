namespace Contista.Shared.Core.Offline.Models.Operations
{
    public sealed class CreatePostOperationDto
    {
        public string ClientOperationId { get; set; } = "";

        public string? Title { get; set; }
        public string? Body { get; set; }
        public string? Purpose { get; set; }
        public string? Freethinking { get; set; }
        public string? Pillar { get; set; }
        public string? Status { get; set; }

        public List<string>? Tags { get; set; }
        public List<string>? MediaUrls { get; set; }
        public List<string>? MediaCannels { get; set; }
        public List<string>? Categories { get; set; }
        public List<string>? RelatedPostIds { get; set; }
        public List<string>? DreamClients { get; set; }

        public string? Language { get; set; }
        public string? TemplateId { get; set; }

        public List<string>? Tone { get; set; }
        public List<string>? Hooks { get; set; }
        public List<string>? StorytellingStructures { get; set; }
        public List<string>? CTAs { get; set; }

        public DateTime? PublishDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ArchivedDate { get; set; }
    }

    public sealed class UpdatePostOperationDto
    {
        public string ClientOperationId { get; set; } = "";
        public string PostId { get; set; } = "";

        public string? Title { get; set; }
        public string? Body { get; set; }
        public string? Purpose { get; set; }
        public string? Freethinking { get; set; }
        public string? Pillar { get; set; }
        public string? Status { get; set; }

        public List<string>? Tags { get; set; }
        public List<string>? MediaUrls { get; set; }
        public List<string>? MediaCannels { get; set; }
        public List<string>? Categories { get; set; }
        public List<string>? RelatedPostIds { get; set; }
        public List<string>? DreamClients { get; set; }

        public string? Language { get; set; }
        public string? TemplateId { get; set; }

        public List<string>? Tone { get; set; }
        public List<string>? Hooks { get; set; }
        public List<string>? StorytellingStructures { get; set; }
        public List<string>? CTAs { get; set; }

        public DateTime? PublishDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? ArchivedDate { get; set; }
    }

    public sealed class DeletePostOperationDto
    {
        public string ClientOperationId { get; set; } = "";
        public string PostId { get; set; } = "";
    }
}
