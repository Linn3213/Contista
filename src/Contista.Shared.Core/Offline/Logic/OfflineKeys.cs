using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Logic
{
    public static class OfflineKeys
    {
        public const string CommonCacheKey = "common.v1";
        public static string UserCacheKey(string userId) => $"user.{userId}.v1";

        // Auth secrets (SecureStorage)
        public const string Secret_IdToken = "auth.idToken";
        public const string Secret_RefreshToken = "auth.refreshToken";
        public const string Secret_UserId = "auth.userId";
        public const string Secret_Email = "auth.email";
    }
}
