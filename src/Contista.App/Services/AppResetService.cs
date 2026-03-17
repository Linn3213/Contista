using Contista.Shared.Core.Interfaces.Auth;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Offline.Interfaces;
using Contista.Shared.Core.Offline.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Services;

public sealed class AppResetService : IAppResetService
{
    private readonly IFirebaseAuthService _auth;
    private readonly ICommonDataState<CommonDataDto> _commonState;
    private readonly IUserDataState<UserDataDto> _userState;

    public AppResetService(
        IFirebaseAuthService auth,
        ICommonDataState<CommonDataDto> commonState,
        IUserDataState<UserDataDto> userState)
    {
        _auth = auth;
        _commonState = commonState;
        _userState = userState;
    }

    public async Task ResetAsync()
    {
        // 1) Logout -> ska rensa SecureStorage via din FirebaseAuthService
        await _auth.LogoutAsync();

        // 2) Clear states
        _commonState.Clear();
        _userState.Clear();

        // 3) Rensa appens lokala filer (cache/queue/offline)
        var dir = FileSystem.AppDataDirectory;

        try
        {
            if (Directory.Exists(dir))
            {
                foreach (var f in Directory.GetFiles(dir, "*", SearchOption.AllDirectories))
                {
                    try { File.Delete(f); } catch { }
                }
            }
        }
        catch
        {
            // ignoreras i reset
        }
    }
}