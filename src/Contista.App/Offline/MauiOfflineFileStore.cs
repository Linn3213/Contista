using Contista.Shared.Core.Offline.Interfaces;
using Microsoft.Maui.Storage;
using System.Text;

namespace Contista.Offline
{
    public sealed class MauiOfflineFileStore : IOfflineFileStore
    {
        private static string PathFor(string fileName)
            => System.IO.Path.Combine(FileSystem.AppDataDirectory, fileName);

        public Task<bool> ExistsAsync(string fileName, CancellationToken ct = default)
            => Task.FromResult(File.Exists(PathFor(fileName)));

        public async Task<string?> ReadTextAsync(string fileName, CancellationToken ct = default)
        {
            var path = PathFor(fileName);
            if (!File.Exists(path))
                return null;

            ct.ThrowIfCancellationRequested();

            // ReadAllTextAsync tar ct och ger konsekvent encoding
            return await File.ReadAllTextAsync(path, Encoding.UTF8, ct);
        }

        public async Task WriteTextAsync(string fileName, string content, CancellationToken ct = default)
        {
            var path = PathFor(fileName);
            var dir = System.IO.Path.GetDirectoryName(path);
            if (!string.IsNullOrWhiteSpace(dir))
                Directory.CreateDirectory(dir);

            ct.ThrowIfCancellationRequested();

            // Atomisk-ish: skriv till temp och ersätt
            var tmpPath = path + ".tmp";

            // Skriv hela filen till tmp
            await File.WriteAllTextAsync(tmpPath, content ?? string.Empty, Encoding.UTF8, ct);

            ct.ThrowIfCancellationRequested();

            // Byt ut originalet
            try
            {
#if NET8_0_OR_GREATER
                // .NET 8: File.Move har overwrite
                File.Move(tmpPath, path, overwrite: true);
#else
                if (File.Exists(path))
                    File.Delete(path);
                File.Move(tmpPath, path);
#endif
            }
            finally
            {
                // om något gick fel och tmp finns kvar
                if (File.Exists(tmpPath))
                {
                    try { File.Delete(tmpPath); } catch { /* ignore */ }
                }
            }
        }

        public Task DeleteAsync(string fileName, CancellationToken ct = default)
        {
            var path = PathFor(fileName);
            if (File.Exists(path))
                File.Delete(path);

            return Task.CompletedTask;
        }
    }
}
