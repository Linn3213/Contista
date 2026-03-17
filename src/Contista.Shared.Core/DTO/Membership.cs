using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO
{
    public class Membership
    {
        public string MembershipId { get; set; } = string.Empty;
        public string MembershipName { get; set; } = string.Empty;
        public string MembershipType { get; set; } = string.Empty;
        public DateTime CreateDate { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public double MembershipPrice { get; set; } = 0.0;
        public int MaxExtraCalendars { get; set; } = 0;
        public int MaxEventQuota { get; set; } = 100; // default
    }
}
