using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Areas.Employee.Models
{
    public class EmployeeModel
    {
        public System.Guid Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string BarCode { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Role { get; set; }
        public System.Guid CreatedBy { get; set; }
        public Nullable<System.Guid> UpdatedBy { get; set; }
        public string UpdateInfo { get; set; }
        public bool IsActive { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
    }
}