using Contista.Shared.Core.DTO;

namespace Contista.Shared.UI.Models;

public enum ContentPostModalMode
{
    Create = 0,
    Edit = 1
}

public readonly record struct ContentPostModalResult(ContentPostModalMode Mode, ContentPost Post);
