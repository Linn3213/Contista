using Contista.Shared.Core.DTO;
using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Mappers;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Offline.Models.Operations;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;

namespace Contista.Infrastructure.Firestore.Repos;

public sealed class ContentPostRepository
    : BaseSubcollectionRepository<ContentPost>, IContentPostRepository
{
    public ContentPostRepository(HttpClient http, IOptions<FirebaseOptions> opts, IRequestAuth auth)
        : base(http, opts.Value.ProjectId, auth) { }

    private static string PostsPath(string userId) => $"users/{userId}/posts";

    public Task<List<ContentPost>> GetAllAsync(string userId, CancellationToken ct = default)
        => GetAllAtPathAsync(
            PostsPath(userId),
            (doc, id) => ContentPostMapper.ToContentPost(doc, id, userId),
            ct);

    public async Task<string?> CreateAsync(string userId, CreatePostOperationDto dto, CancellationToken ct = default)
    {
        var post = new ContentPost
        {
            UserId = userId,
            LastMutationId = dto.ClientOperationId,

            Title = dto.Title ?? "",
            Body = dto.Body ?? "",
            Purpose = dto.Purpose ?? "",
            Freethinking = dto.Freethinking ?? "",
            Pillar = dto.Pillar,
            Status = dto.Status ?? "Draft",

            Tags = dto.Tags ?? new(),
            MediaUrls = dto.MediaUrls ?? new(),
            MediaCannels = dto.MediaCannels ?? new(),
            Categories = dto.Categories ?? new(),
            RelatedPostIds = dto.RelatedPostIds ?? new(),
            DreamClients = dto.DreamClients ?? new(),

            Language = string.IsNullOrWhiteSpace(dto.Language) ? "en" : dto.Language!,
            TemplateId = dto.TemplateId ?? "",

            Tone = dto.Tone ?? new(),
            Hooks = dto.Hooks ?? new(),
            StorytellingStructures = dto.StorytellingStructures ?? new(),
            CTAs = dto.CTAs ?? new(),

            PublishDate = dto.PublishDate ?? DateTime.UtcNow,
            CreatedDate = dto.CreatedDate ?? DateTime.UtcNow,
            UpdatedDate = dto.CreatedDate ?? DateTime.UtcNow,
            ArchivedDate = dto.ArchivedDate ?? DateTime.UtcNow,
        };

        var fsDoc = ContentPostMapper.FromContentPost(post);

        // ✅ Firestore genererar docId
        var newId = await CreateAtPathAsync(PostsPath(userId), fsDoc, ct);
        return newId;
    }

    public async Task UpdateAsync(string userId, UpdatePostOperationDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.PostId))
            throw new InvalidOperationException("UpdatePostOperationDto.PostId saknas.");

        var patch = new ContentPost
        {
            LastMutationId = dto.ClientOperationId,

            Title = dto.Title ?? "",
            Body = dto.Body ?? "",
            Purpose = dto.Purpose ?? "",
            Freethinking = dto.Freethinking ?? "",
            Pillar = dto.Pillar,
            Status = dto.Status ?? "Draft",

            Tags = dto.Tags ?? new(),
            MediaUrls = dto.MediaUrls ?? new(),
            MediaCannels = dto.MediaCannels ?? new(),
            Categories = dto.Categories ?? new(),
            RelatedPostIds = dto.RelatedPostIds ?? new(),
            DreamClients = dto.DreamClients ?? new(),

            Language = string.IsNullOrWhiteSpace(dto.Language) ? "en" : dto.Language!,
            TemplateId = dto.TemplateId ?? "",

            Tone = dto.Tone ?? new(),
            Hooks = dto.Hooks ?? new(),
            StorytellingStructures = dto.StorytellingStructures ?? new(),
            CTAs = dto.CTAs ?? new(),

            PublishDate = dto.PublishDate ?? DateTime.UtcNow,
            UpdatedDate = dto.UpdatedDate ?? DateTime.UtcNow,
            ArchivedDate = dto.ArchivedDate ?? DateTime.UtcNow,
        };

        var fsDoc = ContentPostMapper.FromContentPost(patch);
        var fieldPaths = (fsDoc.Fields ?? new Dictionary<string, FirestoreValue>()).Keys;

        var ok = await PatchWithUpdateMaskAtPathAsync(
            PostsPath(userId),
            dto.PostId!,
            fsDoc,
            fieldPaths,
            ct);

        if (!ok)
            throw new InvalidOperationException("Update post failed (PatchWithUpdateMaskAtPathAsync returned false).");
    }

    public async Task DeleteAsync(string userId, string postId, CancellationToken ct = default)
    {
        var ok = await DeleteAtPathAsync(PostsPath(userId), postId, ct);
        if (!ok) throw new InvalidOperationException("Delete post failed.");
    }
}
