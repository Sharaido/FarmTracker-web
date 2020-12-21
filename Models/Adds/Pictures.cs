using System;
using System.Collections.Generic;

namespace FarmTracker_web.Models.Adds
{
    public partial class Pictures
    {
        public Guid Puid { get; set; }
        public string Address { get; set; }
        public Guid? Auid { get; set; }

        public virtual Adds Au { get; set; }
    }
}
