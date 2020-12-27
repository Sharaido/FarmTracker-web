using FarmTracker_web.Models.Members;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace FarmTracker_web.Models.Adds
{
    public partial class Adds
    {

        public Guid Auid { get; set; }
        public int? Cuid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Price { get; set; }
        public int? Discount { get; set; }
        public Guid? CreatedByUuid { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool ConfirmedFlag { get; set; }
        public Guid? ConfirmedByUuid { get; set; }
        public bool PublishedFlag { get; set; }
        public DateTime? PublishedDate { get; set; }
        public bool DeletedFlag { get; set; }
        public DateTime? DeletedDate { get; set; }
        public Guid? DeletedByUuid { get; set; }
        public IEnumerable<Pictures> Pictures { get; set; }
        public Users CreatedByUu { get; set; }
        public IEnumerable<AddCopvalues> AddCopvalues { get; set; }
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
        public IFormFile Picture_1 { get; set; }
        public IFormFile Picture_2 { get; set; }
        public IFormFile Picture_3 { get; set; }
    }
}
