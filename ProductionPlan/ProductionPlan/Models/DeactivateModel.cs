using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ProductionPlan.Models
{
    public class DeactivateModel
    {
        public string CitizenId { get; set; }
        [Required]
        public string Comment { get; set; }
        public string UpdateInfo { get; set; }
        [Required]
        public Int32 ReasonId { get; set; }
    }
}