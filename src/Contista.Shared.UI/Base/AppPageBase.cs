using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Logic;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.UI.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.UI.Base
{
    public abstract class AppPageBase : ComponentBase, IDisposable
    {
        [Inject] protected ICommonDataState<CommonDataDto> CommonState { get; set; } = default!;
        [Inject] protected IUserDataState<UserDataDto> UserState { get; set; } = default!;
        [Inject] protected IFirebaseAuthService Auth { get; set; } = default!;
        [Inject] protected AppAuthStateProvider AuthState { get; set; } = default!;
        [Inject] protected INetworkStatus NetworkStatus { get; set; } = default!;
        [Inject] protected NavigationManager Nav { get; set; } = default!;
        [Inject] protected ILocalizationService Loc { get; set; } = default!;
        [Inject] protected IJSRuntime JS { get; set; } = default!;

        protected bool IsProcessing { get; set; }
        protected bool IsLoading { get; set; }
        protected bool InitializedOnce { get; set; } = false;
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

        protected void NavigateBack(string fallback = "/")
        {
            Nav.NavigateTo(fallback);
        }
    }
}
