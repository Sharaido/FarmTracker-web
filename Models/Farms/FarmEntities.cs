using System;
using System.Collections.Generic;

namespace FarmTracker_services.Models.DB
{
    public partial class FarmEntities
    {
        public Guid Euid { get; set; }
        public string Name { get; set; }
        public int? Cuid { get; set; }
        public Guid? Fuid { get; set; }
        public int? Count { get; set; }
        public Guid? CreatedByUuid { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool DeletedFlag { get; set; }
        public DateTime? DeletedDate { get; set; }
        public Guid? DeletedByUuid { get; set; }
    }
}
