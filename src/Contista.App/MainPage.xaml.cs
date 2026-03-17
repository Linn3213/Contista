namespace Contista
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
#if WINDOWS
        blazorWebView.BlazorWebViewInitialized += (sender, e) =>
        {
            // Öppnar webbläsarens DevTools-fönster (Console/Network osv)
            e.WebView.CoreWebView2.OpenDevToolsWindow();
        };
#endif
        }
    }
}
