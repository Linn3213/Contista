using Contista.Shared.Core.Offline.Interfaces;
using Microsoft.Maui.Networking;

namespace Contista.Offline
{
    public sealed class MauiNetworkStatus : INetworkStatus, IDisposable, INetworkDebugControl
    {
        private bool _lastOnline;
        private bool? _forced; // null = normal

        public bool IsOnline => _forced ?? (Connectivity.Current.NetworkAccess == NetworkAccess.Internet);

        public event Action<bool>? OnlineChanged;

        // INetworkDebugControl
        public bool IsSupported => true;
        public bool? ForcedOnline => _forced;
        public void Force(bool? forcedOnline)
        {
            _forced = forcedOnline;
            OnlineChanged?.Invoke(IsOnline);
        }

        public MauiNetworkStatus()
        {
            _lastOnline = Connectivity.Current.NetworkAccess == NetworkAccess.Internet;
            Connectivity.Current.ConnectivityChanged += OnChanged;
        }

        private void OnChanged(object? sender, ConnectivityChangedEventArgs e)
        {
            var online = e.NetworkAccess == NetworkAccess.Internet;
            if (online == _lastOnline) return;

            _lastOnline = online;
            OnlineChanged?.Invoke(IsOnline); // tar hänsyn till _forced via IsOnline
        }

        public void Dispose()
            => Connectivity.Current.ConnectivityChanged -= OnChanged;
    }
}
