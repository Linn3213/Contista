namespace Contista.Shared.UI.Models;

public enum FocusItemModalMode
{
    Add = 0,
    Edit = 1
}

public readonly record struct FocusItemModalResult(FocusItemModalMode Mode, FocusItem Item);
