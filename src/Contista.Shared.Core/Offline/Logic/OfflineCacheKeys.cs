using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Offline.Logic
{
    public static class OfflineCacheKeys
    {

        // Filnamn för common-cache (ej secrets)
        public const string CommonCacheFileName = "common-cache.json";

        // Du har redan dessa i din app:
        public const string Secret_UserId = "secret_userid";
        public const string Secret_IdToken = "secret_idtoken";
        public const string Secret_RefreshToken = "secret_refreshtoken";
        public const string Secret_Email = "secret_email";
    }
}
