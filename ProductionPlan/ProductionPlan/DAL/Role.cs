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
    
    public partial class Role
    {
        public System.Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string AccessRole { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }
        public System.Guid CreatedBy { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public string UpdateInfo { get; set; }
    }
}
