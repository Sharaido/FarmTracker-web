using System;

namespace FarmTracker_web.Models
{
    public class SignInRequest
    {
        public string SignInKey { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
        public bool KeepMeSignIn { get; set; }
        public string SessionUID { get; set; }
    }
}
