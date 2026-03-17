namespace Contista.Shared.Core.DTO
{
    public class DreamCustomer
    {
        // Grund
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int Order { get; set; } = 0;   // ✅ styr ordningen (0 = först)
        public bool IsPrimary { get; set; }
        public string Name { get; set; } = "";
        public int? Age { get; set; }

        // Kort sammanfattning (visas i kortet)
        public string? Tagline { get; set; }
        public string? RoleOrPersona { get; set; }

        // Fördjupning (modal)
        public string? Goals { get; set; }
        public string? Challenges { get; set; }
        public string? Notes { get; set; }
    }
}
