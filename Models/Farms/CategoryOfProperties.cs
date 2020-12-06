using System;

namespace FarmTracker_web.Models.Farms
{
    public partial class CategoryOfProperties
    {
        public int Puid { get; set; }
        public string Name { get; set; }
        public int Tuid { get; set; }
        public int Cuid { get; set; }
        public virtual Coptypes Tu { get; set; }
    }
}
