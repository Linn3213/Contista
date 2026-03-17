using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Interfaces;

/// <summary>
/// Valfri DEBUG-kapacitet: låt UI kunna tvinga online/offline i runtime.
/// Finns bara på plattformar där det är implementerat.
/// </summary>
public interface INetworkDebugControl
{
    bool IsSupported { get; }

    /// <summary>null = normal, true = forced online, false = forced offline</summary>
    bool? ForcedOnline { get; }

    void Force(bool? forcedOnline);
}
