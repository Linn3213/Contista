namespace Contista.Shared.Client.Options;

public sealed class ServerApiOptions
{
    /// <summary>
    /// Bas-URL till servern, t.ex. https://localhost:7277/
    /// Android-emulator: https://10.0.2.2:7277/
    /// </summary>
    public string BaseUrl { get; set; } = "";
}
