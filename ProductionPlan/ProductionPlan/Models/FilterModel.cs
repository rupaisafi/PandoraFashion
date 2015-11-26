using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Models
{
    public class FilterModel
    {
        public string field { get; set; }
        public string value { get; set; }
        public string Type { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}