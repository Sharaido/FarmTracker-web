using System;

namespace FarmTracker_web.Models.Farms
{
    public partial class EntityOfFp
    {
        public Guid Euid { get; set; }
        public int Cuid { get; set; }
        public Guid Puid { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? Count { get; set; }
        public DateTime? PurchasedDate { get; set; }
        public decimal? Cost { get; set; }
        public bool SoldFlag { get; set; }
        public DateTime? SoldDate { get; set; }
        public decimal? SoldPrice { get; set; }
        public string SoldDetail { get; set; }
        public Guid? SoldByUuid { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid CreatedByUuid { get; set; }
        public bool DeletedFlag { get; set; }
        public DateTime? DeletedDate { get; set; }
        public Guid? DeletedByUuid { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public Categories Cu { get; set; }
        public string CP_1 { get; set; }
        public string CP_2 { get; set; }
        public string CP_3 { get; set; }
        public string CP_4 { get; set; }
        public string CP_5 { get; set; }
        public string CP_6 { get; set; }
        public string CP_7 { get; set; }
        public string CP_8 { get; set; }
        public string CP_9 { get; set; }
        public string CP_10 { get; set; }


    }
}
