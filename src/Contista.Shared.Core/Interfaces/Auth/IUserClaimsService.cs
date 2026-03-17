using Contista.Shared.Core.Models.Auth;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Auth
{
    public interface IUserClaimsService
    {
        /// <summary>
        /// Bygger en UserProfile (User + Role + Membership) från userId (Firebase uid).
        /// </summary>
        Task<UserProfile?> GetProfileAsync(string userId);

        /// <summary>
        /// Skapar en ClaimsPrincipal för Blazor Authorization baserat på profilen.
        /// </summary>
        Task<ClaimsPrincipal> BuildPrincipalAsync(string userId, string? email = null);
    }
}
