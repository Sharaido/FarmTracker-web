using System;
using System.Collections.Generic;

namespace FarmTracker_web.Models.Farms
{
    public partial class Farms
    {
        public Farms()
        {}

        public Guid Fuid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid CreatedByUuid { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool DeletedFlag { get; set; }
        public DateTime? DeletedDate { get; set; }
        public Guid? DeletedByUuid { get; set; }
    }
}
