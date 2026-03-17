using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Models.Operations;

public sealed class CreateRoleOperationDto
{
    public string RoleName { get; set; } = "";
}
