using System.Text.Json;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;

namespace Contista.Shared.Core.Offline.Logic;

public sealed class UserCacheService<T> : IUserCacheService<T> where T : class
{
    private readonly IOfflineFileStore _files;
    public UserCacheService(IOfflineFileStore files) => _files = files;

    private static string Key(string userId) => $"usercache/{userId}.json";

    public async Task<UserCacheEnvelope<T>?> TryLoadAsync(string userId, CancellationToken ct = default)
    {
        var json = await _files.ReadTextAsync(Key(userId), ct);
        if (string.IsNullOrWhiteSpace(json)) return null;

        try
        {
            return JsonSerializer.Deserialize<UserCacheEnvelope<T>>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch { return null; }
    }

    public async Task SaveAsync(string userId, UserCacheEnvelope<T> envelope, CancellationToken ct = default)
    {
        envelope.UserId = userId;
        var json = JsonSerializer.Serialize(envelope);
        await _files.WriteTextAsync(Key(userId), json, ct);
    }

    public Task ClearAsync(string userId, CancellationToken ct = default)
        => _files.DeleteAsync(Key(userId), ct);
}

