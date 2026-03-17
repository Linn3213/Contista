using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Models.Auth
{
    public sealed record ProvisionRequest(
    string FirstName,
    string LastName,
    string? Email
        );
}
