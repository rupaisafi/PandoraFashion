using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Areas.Order.Models
{
    public class OrderModel
    {
        public System.Guid Id { get; set; }
        public string CodeNumber { get; set; }
        public System.Guid BuyerId { get; set; }
        public string Buyer { get; set; }
        public System.DateTime DeliveryDate { get; set; }
        public System.DateTime? ProductionStartAT { get; set; }
        public decimal Quantity { get; set; }
        public decimal? Completed { get; set; }
        public string Style { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }
        public string Description { get; set; }
        public System.DateTime OrderDate { get; set; }
        public DateTime CurrentDate { get; set; }
    }
}