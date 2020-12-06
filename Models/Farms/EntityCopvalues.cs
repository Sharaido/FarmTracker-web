using System;

namespace FarmTracker_web.Models.Farms
{
    public partial class EntityCopvalues
    {
        public Guid Euid { get; set; }
        public int Puid { get; set; }
        public string Value { get; set; }

    }
}
