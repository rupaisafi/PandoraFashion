using ProductionPlan.Controllers;
using ProductionPlan.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductionPlan.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            if (IsLogedIn)
            {
                return View(CurrentUser);
            }
            return Redirect("/User/Account/LogIn");
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}