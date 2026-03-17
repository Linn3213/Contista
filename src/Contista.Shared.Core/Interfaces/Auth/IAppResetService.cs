using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Interfaces.Auth;

public interface IAppResetService
{
    Task ResetAsync();
}
