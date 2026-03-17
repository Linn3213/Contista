namespace Contista.Shared.UI.Models;

public sealed class FocusItem
{
    public string Id { get; init; } = Guid.NewGuid().ToString("N");

    public string Title { get; init; } = "";
    public string? Description { get; init; }

    /// <summary>Om true: renderas som klar (checkad).</summary>
    public bool IsDone { get; set; }

    /// <summary>Valfri ikon (Bootstrap icons klass), t.ex. "bi-bullseye".</summary>
    public string? IconClass { get; init; }

    /// <summary>Om satt: hela raden kan navigera dit (valfritt).</summary>
    public string? Href { get; init; }
}
