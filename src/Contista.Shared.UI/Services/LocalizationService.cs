using Contista.Shared.UI.Resources;
using System.Globalization;
using System.Resources;

namespace Contista.Shared.UI.Services
{
    public interface ILocalizationService
    {
        string this[string key] { get; }
        string this[string key, params object[] args] { get; }
        // <summary>
        /// Returnerar fallback om nyckeln saknas eller inte har översättning.
        /// </summary>
        string GetOr(string key, string fallback);

        /// <summary>
        /// Samma som GetOr men med format-args.
        /// </summary>
        string GetOr(string key, string fallback, params object[] args);

        event Action? LanguageChanged;

        Task SetLanguageAsync(string culture);
        string CurrentCulture { get; }
    }

    public class LocalizationService : ILocalizationService
    {
        private readonly ResourceManager _resources = AppResources.ResourceManager;
        private CultureInfo _currentCulture = CultureInfo.CurrentUICulture;

        public event Action? LanguageChanged;

        public string this[string key] => _resources.GetString(key, _currentCulture) ?? key;

        public string this[string key, params object[] args]
        {
            get
            {
                var value = _resources.GetString(key, _currentCulture) ?? key;
                return (args is { Length: > 0 }) ? string.Format(value, args) : value;
            }
        }

        public Task SetLanguageAsync(string culture)
        {
            var newCulture = new CultureInfo(culture);

            CultureInfo.CurrentUICulture = newCulture;
            CultureInfo.CurrentCulture = newCulture;
            newCulture.DateTimeFormat.ShortDatePattern = "yyyy-MM-dd";

            _currentCulture = newCulture;

            LanguageChanged?.Invoke();
            return Task.CompletedTask;
        }
        public string GetOr(string key, string fallback)
        {
            var value = _resources.GetString(key, _currentCulture);

            if (string.IsNullOrWhiteSpace(value))
                return fallback;

            return value;
        }

        public string GetOr(string key, string fallback, params object[] args)
        {
            var value = _resources.GetString(key, _currentCulture);

            if (string.IsNullOrWhiteSpace(value))
                return fallback;

            return (args is { Length: > 0 })
                ? string.Format(value, args)
                : value;
        }


        public string CurrentCulture => _currentCulture.Name; 
    }

}
