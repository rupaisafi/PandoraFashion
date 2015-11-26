using ProductionPlan.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductionPlan.Areas.Report.Controllers
{
    public class ReportActionsController : BaseController
    {
        //
        // GET: /Report/ReportActions/
        public ActionResult Daily()
        {
            return View(CurrentUser);
        }
	}
}