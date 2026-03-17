using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Models.Operations;
// Operation DTO för att uppdatera användarprofil
public sealed class UpdateUserProfileOperationDto
{
    public string DisplayName { get; set; } = "";
    public string? Bio { get; set; }
    public string? Language { get; set; } // t.ex. "sv"
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
