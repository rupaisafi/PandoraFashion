using ProductionPlan.Areas.Bundle.Models;
using ProductionPlan.Controllers;
using ProductionPlan.DAL;
using ProductionPlan.Helper;
using ProductionPlan.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace ProductionPlan.Areas.Bundle.Controllers
{
    public class ReceivingController : BaseController
    {
        //
        // GET: /Bundle/Receiving/
        public ActionResult Index(Page model)
        {
            ViewBag.Page=new JavaScriptSerializer().Serialize(model);
            return View(CurrentUser);
        }
        public ActionResult Get(Page model)
        {
            ResponseJson response = new ResponseJson() { Data = new List<object>() };
            var data = new Pagger<dynamic>();
            using (AppDB db = new AppDB())
            {
                response = IEnumerableData.GetPageResponse<BundleModel>(model, (from b in db.Bundles
                                                                                join s in db.Styles on b.StyleId equals s.Id
                                                                                join st in db.Status on b.Status equals st.Id
                                                                                join o in db.Employees on b.OperatorId equals o.Id
                                                                                join l in db.Employees on b.LinkingBy equals l.Id
                                                                                where b.Status == 2
                                                                                select new BundleModel()
                                                                                {
                                                                                    BarCode = b.BarCode,
                                                                                    Style = s.Name,
                                                                                    StyleId = b.StyleId,
                                                                                    Id = b.Id,
                                                                                    Quantity = b.Quantity,
                                                                                    Status = st.Name,
                                                                                    StatusId = st.Id,
                                                                                    KnittingMachine = b.KnittingMachine,
                                                                                    LinkingEndAt = b.LinkingEndAt,
                                                                                    OperatorId = b.OperatorId,
                                                                                    Operator = o.Name,
                                                                                    LinkingBy = l.Name,
                                                                                    LinkingById = l.Id
                                                                                }));
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Save(string bundleBarCode)
        {
            ResponseJson response = new ResponseJson();
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(Globals.SetValidationError(ModelState));
                }

                UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = "Linking Ended", Type = 5, UpdatedTime = DateTime.Now, UserId = CurrentUser.Id };
                using (AppDB db = new AppDB())
                {
                    var bundle = db.Bundles.Where(s => s.BarCode == bundleBarCode).SingleOrDefault();
                    if (bundle != null && bundle.Status==2)
                    {
                        bundle.LinkingEndAt = DateTime.Now;
                        //bundle.LinkingEndAt = employee.Id;
                        bundle.UpdateInfo += "," + new JavaScriptSerializer().Serialize(updatedInfo);
                        bundle.Status = 3;
                        db.SaveChanges();
                    } else if (bundle == null)
                    {
                        response.IsError = true;
                        response.Id = -11;
                    }
                    else if (bundle.Status != 2)
                    {
                        response.IsError = true;
                        response.Id = -12;
                    } else
                    {
                        response.IsError = true;
                        response.Id = -13;
                    }
                    //EmailSender.SendToCHWUser(model.Email, login, login, model.Surname, "Sector Executive Officer");
                }

            }
            catch (Exception ex)
            {
                response.IsError = true;
                response.Id = -6;
            }
            return Json(response);
        }
	}
}