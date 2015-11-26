using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Models
{
    public class UpdatedInfoModel
    {
        public Guid UserId { get; set; }
        public DateTime UpdatedTime { get; set; }
        public string Comment { get; set; }
        public int Type { get; set; }
        public int ReasonId { get; set; }
        public string PreviousValue { get; set; }
    }
}