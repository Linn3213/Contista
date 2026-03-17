// Ignore Spelling: Loc

using Contista.Shared.UI.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.UI.Base
{
    /// <summary>
    /// Bas-klass för sidor som har formulär, statusmeddelanden och loader-hantering.
    /// </summary>
    public abstract class FormPageBase : ComponentBase, IDisposable
    {
        [Inject] protected NavigationManager Nav { get; set; } = default!;
        [Inject] protected ILocalizationService Loc { get; set; } = default!;
        [Inject] protected IJSRuntime JS { get; set; } = default!;

        /// <summary>
        /// Visar om sidan är mitt i en asynkron process.
        /// </summary>
        protected bool IsProcessing { get; set; }
        protected bool IsLoading { get; set; }
        protected bool InitializedOnce { get; set; } = false;

        /// <summary>
        /// Statusmeddelande som kan visas i UI:t.
        /// </summary>
        protected string StatusMessage { get; set; } = string.Empty;
        protected string StatusMessageClass { get; set; } = "alert-info";

        protected override void OnInitialized()
        {
            base.OnInitialized();

            // Viktigt: när språket ändras ska sidan re-rendera direkt
            if (Loc is not null)
                Loc.LanguageChanged += OnLanguageChanged;
        }

        private void OnLanguageChanged()
        {
            // Kör på rätt tråd + tvinga uppdatering av UI
            _ = InvokeAsync(StateHasChanged);
        }

        public void Dispose()
        {
            if (Loc is not null)
                Loc.LanguageChanged -= OnLanguageChanged;
        }

        protected void SetStatus(string message, string cssClass = "alert-info")
        {
            StatusMessage = message;
            StatusMessageClass = cssClass;
            StateHasChanged();
        }

        /// <summary>
        /// Kör en asynkron uppgift med automatisk loader-hantering och felhantering.
        /// </summary>
        protected async Task RunWithProcessing(Func<Task> action)
        {
            try
            {
                IsProcessing = true;
                await InvokeAsync(StateHasChanged);

                await action.Invoke();
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("[RunWithProcessing] " + Loc["OperationAbortedText"]);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RunWithProcessing] {Loc["ErrorText"]}: {ex}");
                StatusMessage = $"{Loc["ErrorOccurredText"]}: {ex.Message}";
            }
            finally
            {
                IsProcessing = false;
                await InvokeAsync(StateHasChanged);
            }
        }

        /// <summary>
        /// Kör en asynkron uppgift som returnerar ett värde med automatisk loader-hantering.
        /// </summary>
        protected async Task<T?> RunWithProcessing<T>(Func<Task<T>> action)
        {
            try
            {
                IsProcessing = true;
                await InvokeAsync(StateHasChanged);

                return await action.Invoke();
            }
            catch (OperationCanceledException)
            {
                //Console.WriteLine("[RunWithProcessing<T>] " + Loc["OperationAbortedText"]);
                return default;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RunWithProcessing<T>] {Loc["ErrorText"]}: {ex}");
                StatusMessage = $"{Loc["ErrorOccurredText"]}: {ex.Message}";
                return default;
            }
            finally
            {
                IsProcessing = false;
                await InvokeAsync(StateHasChanged);
            }
        }

        /// <summary>
        /// Visar en bekräftelsedialog med JS interop.
        /// </summary>
        protected async Task<bool> ConfirmAsync(string message)
        {
            try
            {
                return await JS.InvokeAsync<bool>("confirm", message);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Navigerar tillbaka till föregående sida.
        /// </summary>
        protected void NavigateBack(string fallback = "/")
        {
            Nav.NavigateTo(fallback);
        }
    }
}
