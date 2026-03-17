using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Models.Auth
{
    public sealed record RegisterRequest(string Email, string Password, string FirstName, string LastName);
}
