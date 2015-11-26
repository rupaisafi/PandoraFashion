using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Areas.Seller.Models
{
    public class SellerModel
    {
        public System.Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public System.Guid CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
    }
}