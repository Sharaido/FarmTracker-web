using FarmTracker_web.Models.Members;
using System;
using System.Collections.Generic;

namespace FarmTracker_web.Models.Farms
{
    public partial class Collaborators
    {
        public Guid Fuid { get; set; }
        public Guid Uuid { get; set; }
        public Guid Ruid { get; set; }
        public Users uu { get; set; }
    }
}
