using System;
using System.Collections.Generic;

namespace FarmTracker_web.Models.Members
{
    public partial class Sessions
    {
        public Guid Suid { get; set; }
        public Guid Uuid { get; set; }
        public bool? IsValid { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? LastUsedDate { get; set; }
    }
}
