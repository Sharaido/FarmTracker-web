using System;

namespace FarmTracker_web.Models.Members
{
    public class SignUpResponse
    {
        public bool Result { get; set; }
        public bool TooManyAttempts { get; set; }
    }
}
