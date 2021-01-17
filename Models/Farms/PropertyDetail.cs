using System;
using System.Collections.Generic;

namespace FarmTracker_web.Models.Farms
{
    public partial class PropertyDetail
    {
        public Guid Duid { get; set; }
        public Guid Puid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Cost { get; set; }
        public DateTime? RemainderDate { get; set; }
        public bool? RemainderCompletedFlag { get; set; }
        public DateTime? RemainderCompletedDate { get; set; }
        public Guid? RemainderCompletedByUuid { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid CreatedByUuid { get; set; }
        public bool DeletedFlag { get; set; }
        public DateTime? DeletedDate { get; set; }
        public Guid? DeletedByUuid { get; set; }
        public string RDate { get; set; }
        public string RTime { get; set; }
        public bool ExpenseFlag { get; set; }
    }
}
