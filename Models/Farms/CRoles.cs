using System;
using System.Collections.Generic;

namespace FarmTracker_web.Models.Farms
{
    public partial class CRoles
    {
        public Guid Ruid { get; set; }
        public Guid CreatedByUuid { get; set; }
        public string Name { get; set; }
        public bool? BasicRoleFlag { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool DeletedFlag { get; set; }
        public DateTime? DeletedDate { get; set; }
        public Guid? DeletedByUuid { get; set; }
        public bool? CanCreateProperty { get; set; }
    }
}
