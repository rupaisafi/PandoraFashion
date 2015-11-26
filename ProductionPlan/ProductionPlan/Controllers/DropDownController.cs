using ProductionPlan.DAL;
using ProductionPlan.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductionPlan.Controllers
{
    public class DropDownController : BaseController
    {
        //
        // GET: /DropDown/Buyer
        public ActionResult Buyer()
        {
            ResponseJson response = new ResponseJson();
            using (AppDB db = new AppDB())
            {
                response.Data = db.Buyers.OrderBy(c => c.Name).Select(s => new { text = s.Name, value = s.Id }).ToList();
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Order()
        {
            ResponseJson response = new ResponseJson();
            using (AppDB db = new AppDB())
            {
                response.Data = db.Orders.OrderBy(c => c.CodeNumber).Select(s => new { text = s.CodeNumber, value = s.Id }).ToList();
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Seller()
        {
            ResponseJson response = new ResponseJson();
            using (AppDB db = new AppDB())
            {
                response.Data = db.Sellers.OrderBy(c => c.Name).Select(s => new { text = s.Name, value = s.Id }).ToList();
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
	}
}