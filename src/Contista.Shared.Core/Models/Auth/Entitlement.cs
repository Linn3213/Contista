using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Models.Auth;

[Flags]
public enum Entitlement
{
    None = 0,
    All = 1 << 0,          // synlig för alla (även ej inloggad) – mest för Public-sidor
    Free = 1 << 1,         // inloggad (bas)
    Standard = 1 << 2,
    Premium = 1 << 3,
    Permanent = 1 << 4,
    Admin = 1 << 5,
}
