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
    
    public partial class Store
    {
        public System.Guid Id { get; set; }
        public System.Guid OrderId { get; set; }
        public System.Guid MaterialId { get; set; }
        public Nullable<double> UsedAmount { get; set; }
        public double UseableAmount { get; set; }
        public System.Guid CreatedBy { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public string UpdateInfo { get; set; }
        public int StatusId { get; set; }
        public Nullable<System.DateTime> ReadyToUseAt { get; set; }
    }
}
