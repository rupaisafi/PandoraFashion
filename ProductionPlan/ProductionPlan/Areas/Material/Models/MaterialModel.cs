using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Areas.Material.Models
{
    public class MaterialModel
    {
        public System.Guid Id { get; set; }
        public System.Guid SellerId { get; set; }
        public string Seller { get; set; }
        public System.Guid OrderId { get; set; }
        public string Order { get; set; }
        public double Amount { get; set; }
        public string Description { get; set; }
        public System.DateTime OrderDate { get; set; }
        public System.DateTime DeliveryDate { get; set; }
        public System.Guid CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public string UpdatedByName { get; set; }
        public Nullable<System.DateTime> ReceivedDate { get; set; }
        public string UpdateInfo { get; set; }
    }
}