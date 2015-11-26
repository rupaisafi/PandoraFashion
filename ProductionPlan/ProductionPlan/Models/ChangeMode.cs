using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Models
{
    public class ChangeMode
    {
        public string ChangeBy { get; set; }
        public DateTime ChangeDate { get; set; }
        public int ChangeType { get; set; }
        public string PreviousValue { get; set; }
    }
}