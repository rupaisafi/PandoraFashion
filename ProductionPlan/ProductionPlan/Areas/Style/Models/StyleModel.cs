using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Areas.Style.Models
{
    public class StyleModel
    {
        public System.Guid Id { get; set; }
        public string BarCode { get; set; }
        public string Name { get; set; }
        public System.Guid BuyerId { get; set; }
        public string Buyer { get; set; }
        public string YarnType { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public int StatusId { get; set; }
        public string Size { get; set; }
        public DateTime ShippingDate { get; set; }
        public string Status { get; set; }

    }
}