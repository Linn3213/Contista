using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Models.Sync;

public sealed class ApplySyncResponse
{
    public bool Applied { get; set; }
    public bool DuplicateIgnored { get; set; }

    // Om man vill att klienten ska kunna uppdatera common-cache version
    public string? NewCommonVersion { get; set; }

    // (framtid) om man senare vill versionera user-profile:
    public string? NewUserVersion { get; set; }
}