using System;
using System.Collections.Generic;

namespace FarmTracker_web.Models.Members
{
    public partial class Users
    {
        public Guid Uuid { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public bool? EmailActivated { get; set; }
        public string PhoneNumber { get; set; }
        public bool? PhoneNumberActivated { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string ProfilPic { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool DeletedFlag { get; set; }
        public DateTime? DeletedDate { get; set; }
        public Guid? DeletedByUuid { get; set; }
        public int Ruid { get; set; }
        public int Mtuid { get; set; }
        public string MemberTypeName { get; set; }
    }
}
