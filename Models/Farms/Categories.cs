using System;
using System.Collections.Generic;

namespace FarmTracker_web.Models.Farms
{
    public partial class Categories
    {
        public int Cuid { get; set; }
        public string Name { get; set; }
        public bool? EndPointFlag { get; set; }
        public int? SubCategoryOfCuid { get; set; }
    }
}
