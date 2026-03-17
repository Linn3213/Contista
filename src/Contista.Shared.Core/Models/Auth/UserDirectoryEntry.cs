using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Models.Auth;

public sealed class UserDirectoryEntry
{
    // Primärt UID för usern (alltid satt)
    public string UserId { get; set; } = "";

    // Visningsnamn (kan vara tomt)
    public string DisplayName { get; set; } = "";

    // Normaliserad e-post (lowercase, trim)
    public string EmailLower { get; set; } = "";

    // Enklast för felsökning / städ / cache
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
