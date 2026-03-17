using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.DTO
{
    public class Meta
    {
        public string MetaId { get; set; } = string.Empty;
        public DateTime MembershipVersion { get; set; } = DateTime.UtcNow;
        public DateTime RoleVersion { get; set; } = DateTime.UtcNow;
    }
}
