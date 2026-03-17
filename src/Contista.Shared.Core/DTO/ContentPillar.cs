namespace Contista.Shared.Core.DTO
{
    public class ContentPillar
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public string Title { get; set; } = "";

        // Kort beskrivning (valfri, modal)
        public string? Description { get; set; }

        // Listpunkter (dashboard + modal)
        public List<string> Items { get; set; } = new();

        // UI-hjälp
        public bool IsActive { get; set; } = true;
        public int Order { get; set; }
    }
}
