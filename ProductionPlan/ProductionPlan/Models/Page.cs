using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Models
{
    public class Page
    {
        public Page() {
            this.PageSZ = 10;
            this.PageNR = 1;
        }
        public Guid id { get; set; }
        public Int64 Total { get; set; }
        private Int32 PageNR;
        private Int32 PageSZ;
        public string SortBy { get; set; }
        public List<FilterModel> filter { get; set; }
        public bool IsDescending { get; set; }
        public Int32 PageNumber
        {
            get
            {
                return PageNR;
            }
            set
            {
                if (value<1)
                    PageNR = 1;
                else
                    PageNR = value;
            }
        }
        public Int32 PageSize
        {
            get
            {
                return PageSZ;
            }
            set
            {
                if (value < 1)
                    PageSZ = 10;
                else
                    PageSZ = value;
            }
        }
    }
}