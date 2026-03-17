// Ignore Spelling: Firestore Uid

using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Logic;
using Contista.Shared.Core.Options;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Contista.Shared.Client.Services
{
    public class FirebaseAuthService : IFirebaseAuthService
    {
        private readonly HttpClient _http;
        private readonly FirebaseOptions _opt;
        private readonly ISecretStore _secretStore;

        private string? _idToken;
        private string? _refreshToken;
        private DateTime _tokenExpiryTime = DateTime.MinValue;

        public string IdToken
        {
            get
            {
                // Om token är nära utgång, starta refresh asynkront
                if (_tokenExpiryTime <= DateTime.UtcNow.AddMinutes(2))
                {
                    _ = SafeRefreshTokenAsync();
                }
                return _idToken ?? "";
            }
        }

        public string? RefreshTokenPublic
        {
            get => _refreshToken;
            set => _refreshToken = value;
        }

        public string? Uid { get; private set; }
        public bool IsLoggedIn => !string.IsNullOrWhiteSpace(Uid) && !string.IsNullOrWhiteSpace(_idToken);
        public string? ExpiresIn { get; private set; }
        public string? Email { get; private set; }

        public FirebaseAuthService(
            HttpClient http,
            IOptions<FirebaseOptions> options,
            ISecretStore secretStore)
        {
            _http = http;
            _opt = options.Value;
            _secretStore = secretStore;

            if (string.IsNullOrWhiteSpace(_opt.ApiKey))
                throw new InvalidOperationException("Firebase ApiKey saknas. Kontrollera FirebaseOptions i appsettings.");
        }

        public void AttachAuthHeader(HttpClient client)
        {
            if (!string.IsNullOrEmpty(_idToken))
            {
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", _idToken);
            }
        }

        // 🔹 Login user (email + password)
        public async Task<bool> SignInWithEmailPassword(string email, string password)
        {
            var payload = new
            {
                email,
                password,
                returnSecureToken = true
            };

            var response = await _http.PostAsJsonAsync(
                $"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={_opt.ApiKey}",
                payload
            );

            if (!response.IsSuccessStatusCode) return false;

            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            Email = json.TryGetProperty("email", out var e) ? e.GetString() ?? email : email;

            SetTokensFromJson(json);

            // Spara säkert (MAUI SecureStorage via ISecretStore)
            // Ingen ct här: använd default/None
            await _secretStore.SetAsync(OfflineKeys.Secret_UserId, Uid ?? "");
            await _secretStore.SetAsync(OfflineKeys.Secret_IdToken, _idToken ?? "");
            await _secretStore.SetAsync(OfflineKeys.Secret_RefreshToken, _refreshToken ?? "");
            await _secretStore.SetAsync(OfflineKeys.Secret_Email, Email ?? "");

            return true;
        }

        // 🔹 Byt custom token mot ID token
        public async Task<bool> ExchangeCustomToken(string customToken)
        {
            var payload = new
            {
                token = customToken,
                returnSecureToken = true
            };

            var response = await _http.PostAsJsonAsync(
                $"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={_opt.ApiKey}",
                payload
            );

            if (!response.IsSuccessStatusCode) return false;

            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            _idToken = json.GetProperty("idToken").GetString();
            _refreshToken = json.GetProperty("refreshToken").GetString();
            Uid = json.GetProperty("localId").GetString();
            ExpiresIn = json.GetProperty("expiresIn").GetString();

            return true;
        }

        // 🔹 Token refresh (när ID-token har gått ut)
        public async Task<bool> RefreshToken()
        {
            if (string.IsNullOrEmpty(_refreshToken)) return false;
            return await SafeRefreshTokenAsync();
        }

        private async Task<bool> SafeRefreshTokenAsync()
        {
            try
            {
                if (string.IsNullOrEmpty(_refreshToken)) return false;

                var payload = new
                {
                    grant_type = "refresh_token",
                    refresh_token = _refreshToken
                };

                var response = await _http.PostAsJsonAsync(
                    $"https://securetoken.googleapis.com/v1/token?key={_opt.ApiKey}",
                    payload
                );

                if (!response.IsSuccessStatusCode) return false;

                var json = await response.Content.ReadFromJsonAsync<JsonElement>();
                SetTokensFromJson(json, isRefresh: true);

                // (valfritt men bra) uppdatera secure store vid refresh också
                await _secretStore.SetAsync(OfflineKeys.Secret_IdToken, _idToken ?? "");
                await _secretStore.SetAsync(OfflineKeys.Secret_RefreshToken, _refreshToken ?? "");
                await _secretStore.SetAsync(OfflineKeys.Secret_UserId, Uid ?? "");

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SafeRefreshTokenAsync failed: {ex.Message}");
                return false;
            }
        }

        private void SetTokensFromJson(JsonElement json, bool isRefresh = false)
        {
            try
            {
                _idToken = json.GetProperty(isRefresh ? "id_token" : "idToken").GetString();
                _refreshToken = json.GetProperty(isRefresh ? "refresh_token" : "refreshToken").GetString();
                Uid = json.GetProperty(isRefresh ? "user_id" : "localId").GetString();

                var expiresInStr = isRefresh
                    ? (json.GetProperty("expires_in").GetString() ?? "3600")
                    : (json.GetProperty("expiresIn").GetString() ?? "3600");

                if (int.TryParse(expiresInStr, out var seconds))
                    _tokenExpiryTime = DateTime.UtcNow.AddSeconds(seconds);
                else
                    _tokenExpiryTime = DateTime.UtcNow.AddHours(1);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SetTokensFromJson failed: {ex.Message}");
                _tokenExpiryTime = DateTime.UtcNow.AddHours(1);
            }
        }

        public async Task<string> GetValidIdTokenAsync()
        {
            if (_tokenExpiryTime <= DateTime.UtcNow.AddMinutes(2))
            {
                await SafeRefreshTokenAsync();
            }

            if (string.IsNullOrEmpty(_idToken))
                throw new InvalidOperationException("Ingen giltig token. Logga in först.");

            return _idToken;
        }

        // 🔹 Registrera ny användare
        public async Task<string?> RegisterUserAsync(string email, string password)
        {
            var payload = new
            {
                email,
                password,
                returnSecureToken = true
            };

            var response = await _http.PostAsJsonAsync(
                $"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={_opt.ApiKey}",
                payload
            );

            if (!response.IsSuccessStatusCode)
            {
                var errorJson = await response.Content.ReadAsStringAsync();
                throw new Exception($"Fel vid registrering: {errorJson}");
            }

            var json = await response.Content.ReadFromJsonAsync<JsonElement>();

            _idToken = json.GetProperty("idToken").GetString();
            _refreshToken = json.GetProperty("refreshToken").GetString();
            Uid = json.GetProperty("localId").GetString();
            RefreshTokenPublic = _refreshToken;
            ExpiresIn = json.GetProperty("expiresIn").GetString();

            // Spara även direkt (så du kan auto-login offline)
            await _secretStore.SetAsync(OfflineKeys.Secret_UserId, Uid ?? "");
            await _secretStore.SetAsync(OfflineKeys.Secret_IdToken, _idToken ?? "");
            await _secretStore.SetAsync(OfflineKeys.Secret_RefreshToken, _refreshToken ?? "");
            await _secretStore.SetAsync(OfflineKeys.Secret_Email, email ?? "");

            return Uid;
        }

        public async Task LogoutAsync()
        {
            _idToken = null;
            _refreshToken = null;
            Uid = null;
            _tokenExpiryTime = DateTime.MinValue;
            ExpiresIn = null;
            Email = null;

            // Rensa secure storage
            await _secretStore.RemoveAsync(OfflineKeys.Secret_UserId);
            await _secretStore.RemoveAsync(OfflineKeys.Secret_IdToken);
            await _secretStore.RemoveAsync(OfflineKeys.Secret_RefreshToken);
            await _secretStore.RemoveAsync(OfflineKeys.Secret_Email);
        }

        // 🔹 Ändra lösenord (kräver att användaren är inloggad)
        public async Task<bool> ChangePasswordAsync(string currentPassword, string newPassword)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(_idToken))
                    throw new InvalidOperationException("Ingen giltig inloggning.");

                var payload = new
                {
                    idToken = _idToken,
                    password = newPassword,
                    returnSecureToken = true
                };

                var response = await _http.PostAsJsonAsync(
                    $"https://identitytoolkit.googleapis.com/v1/accounts:update?key={_opt.ApiKey}",
                    payload
                );

                if (!response.IsSuccessStatusCode)
                {
                    var errorText = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Password change failed: {errorText}");
                    return false;
                }

                var json = await response.Content.ReadFromJsonAsync<JsonElement>();
                SetTokensFromJson(json);

                // uppdatera secure store efter lösenordsbyte
                await _secretStore.SetAsync(OfflineKeys.Secret_IdToken, _idToken ?? "");
                await _secretStore.SetAsync(OfflineKeys.Secret_RefreshToken, _refreshToken ?? "");

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ChangePasswordAsync failed: {ex.Message}");
                return false;
            }
        }

        // 🔹 Skicka återställningsmail (”Glömt lösenord”)
        public async Task<bool> SendPasswordResetEmailAsync(string email)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                    throw new ArgumentException("E-postadress krävs.");

                var payload = new
                {
                    requestType = "PASSWORD_RESET",
                    email = email
                };

                var response = await _http.PostAsJsonAsync(
                    $"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={_opt.ApiKey}",
                    payload
                );

                if (!response.IsSuccessStatusCode)
                {
                    var errorText = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Password reset email failed: {errorText}");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SendPasswordResetEmailAsync failed: {ex.Message}");
                return false;
            }
        }

        public Task RestoreSessionAsync(string uid, string idToken, string refreshToken, string? email, CancellationToken ct = default)
        {
            Uid = uid;
            _idToken = idToken;
            _refreshToken = refreshToken;
            Email = email;

            // ✅ tvinga refresh ASAP när online
            _tokenExpiryTime = DateTime.UtcNow.AddSeconds(10);

            return Task.CompletedTask;
        }

        public async Task<bool> TryResumeSessionAsync(CancellationToken ct = default)
        {
            try
            {
                // om vi redan är inloggade – klart
                if (IsLoggedIn) return true;

                var uid = await _secretStore.GetAsync(OfflineKeys.Secret_UserId, ct);
                var idToken = await _secretStore.GetAsync(OfflineKeys.Secret_IdToken, ct);
                var refresh = await _secretStore.GetAsync(OfflineKeys.Secret_RefreshToken, ct);
                var email = await _secretStore.GetAsync(OfflineKeys.Secret_Email, ct);

                if (string.IsNullOrWhiteSpace(uid) ||
                    string.IsNullOrWhiteSpace(idToken) ||
                    string.IsNullOrWhiteSpace(refresh))
                    return false;

                await RestoreSessionAsync(uid, idToken, refresh, email, ct);

                // ✅ om vi har nät: försök refresh direkt (om den failar = behandla som utloggad)
                var ok = await SafeRefreshTokenAsync();
                if (!ok)
                {
                    await LogoutAsync(); // rensar securestore också i din kod
                    return false;
                }

                return IsLoggedIn;
            }
            catch
            {
                return false;
            }
        }


    }
}
