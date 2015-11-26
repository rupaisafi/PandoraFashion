using ProductionPlan.Helper;
using ProductionPlan.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductionPlan.Controllers
{
    public class MenuController : BaseController
    {
        //
        // GET: /Menu/
        public ActionResult Get()
        {

            ResponseJson response = new ResponseJson() { };
            if (IsLogedIn)
            {
                response.Data = Menu.Get(Roles);
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
	}
}