//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ProductionPlan.DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class Order
    {
        public System.Guid Id { get; set; }
        public string CodeNumber { get; set; }
        public System.Guid BuyerId { get; set; }
        public System.DateTime OrderDate { get; set; }
        public System.DateTime DeliveryDate { get; set; }
        public decimal TotalQuantity { get; set; }
        public Nullable<decimal> TotalCompleted { get; set; }
        public Nullable<System.DateTime> ProductionStartAT { get; set; }
        public string Style { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }
        public string Description { get; set; }
        public System.Guid CreatedBy { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public string UpdateInfo { get; set; }
        public int Status { get; set; }
    
        public virtual Buyer Buyer { get; set; }
    }
}
