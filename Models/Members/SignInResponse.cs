using System;

namespace FarmTracker_web.Models
{
    public class SignInResponse
    {
        public bool Result { get; set; }
        public bool ShowCaptcha { get; set; }
        public bool InvalidSignInKey { get; set; }
        public bool InvalidPassword { get; set; }
        public bool TooManyAttempts { get; set; }
        public bool SessionTerminated { get; set; }
        public string RedirectAddress { get; set; }
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
    }
}
