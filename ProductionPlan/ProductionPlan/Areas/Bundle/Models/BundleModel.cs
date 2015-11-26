using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Areas.Bundle.Models
{
    public class BundleModel
    {
        public System.Guid Id { get; set; }
        public string BarCode { get; set; }
        public System.Guid StyleId { get; set; }
        public string Style { get; set; }
        public int Quantity { get; set; }
        public int StatusId { get; set; }
        public string Status { get; set; }
        public string KnittingMachine { get; set; }
        public System.Guid OperatorId { get; set; }
        public String Operator { get; set; }
        public System.Guid LinkingById { get; set; }
        public String LinkingBy { get; set; }
        public System.DateTime? LinkingEndAt { get; set; }
        public System.DateTime? LinkingStartAt { get; set; }                   
        public System.DateTime CreatedAt { get; set; }
        public System.Guid CreatedBy { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public string UpdateInfo { get; set; }
    }
}