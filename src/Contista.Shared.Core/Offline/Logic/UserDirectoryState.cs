using Contista.Shared.Core.Interfaces.UserDirectory;
using Contista.Shared.Core.Offline.Interfaces;
using System.Collections.Concurrent;


namespace Contista.Shared.Core.Offline.Logic;

public sealed class UserDirectoryState : IUserDirectoryState
{
    private readonly IUserDirectoryDataProvider _provider;

    // uid -> displayName
    private readonly ConcurrentDictionary<string, string> _map = new(StringComparer.Ordinal);

    public UserDirectoryState(IUserDirectoryDataProvider provider)
    {
        _provider = provider;
    }

    public string? TryGetName(string? uid)
    {
        if (string.IsNullOrWhiteSpace(uid)) return null;
        return _map.TryGetValue(uid, out var name) ? name : null;
    }

    public async Task EnsureLoadedAsync(IEnumerable<string?> uids, CancellationToken ct = default)
    {
        var missing = uids
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => x!.Trim())
            .Distinct(StringComparer.Ordinal)
            .Where(uid => !_map.ContainsKey(uid))
            .Take(200)
            .ToList();

        if (missing.Count == 0)
            return;

        var resolved = await _provider.ResolveUidsAsync(missing, ct);

        foreach (var kv in resolved)
        {
            if (!string.IsNullOrWhiteSpace(kv.Key) && !string.IsNullOrWhiteSpace(kv.Value))
                _map[kv.Key] = kv.Value;
        }
    }
}
