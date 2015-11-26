using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Models
{
    public class Pagger<T> : Page
    {
        public IEnumerable<T> Data { get; set; }
    }
}