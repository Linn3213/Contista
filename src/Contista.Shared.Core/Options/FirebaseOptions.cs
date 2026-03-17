using System;
using System.Collections.Generic;
using System.Text;

namespace Contista.Shared.Core.Options
{
    public class FirebaseOptions
    {
        public string ApiKey { get; set; } = "";
        public string AuthDomain { get; set; } = "";
        public string ProjectId { get; set; } = "";
        public string StorageBucket { get; set; } = "";
        public string MessagingSenderId { get; set; } = "";
        public string AppId { get; set; } = "";
    }
}
