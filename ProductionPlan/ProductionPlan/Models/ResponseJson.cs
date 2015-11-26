using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace ProductionPlan.Models
{
    public class ResponseJson
    {
        
        public long Id { get; set; }

        public object Data { get; set; }

        public bool IsError { get; set; }

        public string Msg { get; set; }

    }
}