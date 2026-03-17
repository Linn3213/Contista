using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Models.Auth;

public sealed record FeatureRequirement(
    Entitlement Allowed,
    bool OnlineRequired = false
);
