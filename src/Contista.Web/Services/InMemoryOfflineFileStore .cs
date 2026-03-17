using Contista.Shared.Core.Offline.Interfaces;
using System.Collections.Concurrent;

namespace Contista.Web.Services;

public sealed class InMemoryOfflineFileStore : IOfflineFileStore
{
    private readonly ConcurrentDictionary<string, string> _files = new();

    public Task<bool> ExistsAsync(string fileName, CancellationToken ct = default)
        => Task.FromResult(_files.ContainsKey(fileName));

    public Task<string?> ReadTextAsync(string fileName, CancellationToken ct = default)
        => Task.FromResult(_files.TryGetValue(fileName, out var v) ? v : null);

    public Task WriteTextAsync(string fileName, string content, CancellationToken ct = default)
    {
        _files[fileName] = content ?? "";
        return Task.CompletedTask;
    }

    public Task DeleteAsync(string fileName, CancellationToken ct = default)
    {
        _files.TryRemove(fileName, out _);
        return Task.CompletedTask;
    }
}
