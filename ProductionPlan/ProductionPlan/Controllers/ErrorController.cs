using ProductionPlan.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductionPlan.Controllers
{
    public class ErrorController : Controller
    {
        //
        // GET: /Error/NotFound
        public ActionResult Unauthorised()
        {
            return View();
        }
        public ActionResult NotFound()
        {
            return View();
        }
        public JsonResult AjaxCall()
        {
            ResponseJson response = new ResponseJson();
            response.IsError = true;
            response.Id = -10;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
	}
}