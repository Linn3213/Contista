using Contista.Shared.Core.Models.Calendar;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Calendar;

public interface ICalendarQuotaService
{
    Task<AutoCleanupResult> EnforceQuotaAsync(
         string userId,
         int maxEventQuota,
         CancellationToken ct = default);
}
