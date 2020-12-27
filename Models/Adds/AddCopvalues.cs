using System;
using System.Collections.Generic;

namespace FarmTracker_web.Models.Adds
{
    public partial class AddCopvalues
    {
        public Guid Auid { get; set; }
        public int Puid { get; set; }
        public string Value { get; set; }
    }
}
