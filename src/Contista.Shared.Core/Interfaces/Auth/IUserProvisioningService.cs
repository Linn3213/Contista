using Contista.Shared.Core.Models.Auth;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Auth
{
    public interface IUserProvisioningService
    {
        Task<bool> EnsureUserDocAsync(RegisterRequest req, string uid, string? email, string idToken, CancellationToken ct = default);
        Task<bool> ProvisionAsync(string firstName, string lastName, string? email = null, CancellationToken ct = default);
        Task<bool> EnsureCalendarProvisionedAsync(string userId, string idToken, CancellationToken ct = default);

        Task<bool> EnsureUserDirectoryAsync(
        string uid,
        string? email,
        string idToken,
        CancellationToken ct = default);
    }
}
