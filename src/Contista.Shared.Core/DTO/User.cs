using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO
{
    public class User
    {
        public string UserId { get; set; } = "";
        public string Email { get; set; } = "";
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";

        public string DisplayName { get; set; } = ""; // e.g. "Linn Artistry". Hur man visas i UI, inte vem man är juridiskt.
        public string? Bio { get; set; } // Kort beskrivning av användaren
        public string Language { get; set; } = "sv";

        public DateTime Created { get; set; } = DateTime.UtcNow;

        public string PlanId { get; set; } = "";
        public string RoleId { get; set; } = "qEDXwPJaMZQq9pwMaXRN"; // Default to 'Creator' role
        public string MembershipId { get; set; } = "B9nEqMB8CzOGyGF9yo5b"; // Default to 'Free' membership
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
