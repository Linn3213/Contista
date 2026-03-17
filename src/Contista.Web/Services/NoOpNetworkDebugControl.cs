using Contista.Shared.Core.Offline.Interfaces;

namespace Contista.Web.Services;

public sealed class NoOpNetworkDebugControl : INetworkDebugControl
{
    public bool IsSupported => false;
    public bool? ForcedOnline => null;
    public void Force(bool? forcedOnline) { /* noop */ }
}
