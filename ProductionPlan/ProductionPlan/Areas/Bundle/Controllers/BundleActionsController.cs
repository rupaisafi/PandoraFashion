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
    public class BundleActionsController : BaseController
    {
        //
        // GET: /Bundles/Operators
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
                                                                                   OperatorId = b.OperatorId,
                                                                                   Operator = o.Name
                                                                               }));
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Create(BundleModel model)
        {
            ResponseJson response = new ResponseJson();
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(Globals.SetValidationError(ModelState));
                }

                UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = "Bundle Created", Type = 1, UpdatedTime = DateTime.Now, UserId = CurrentUser.Id };
                using (AppDB db = new AppDB())
                {
                    DAL.Bundle bundle = new DAL.Bundle()
                    {
                        Id = Guid.NewGuid(),
                        StyleId = model.StyleId,
                        BarCode = Globals.GetBarCode(),
                        CreatedBy = CurrentUser.Id,
                        KnittingMachine = model.KnittingMachine,
                        OperatorId = model.OperatorId,
                        Status = 0,
                        CreatedAt = DateTime.Now,
                        Quantity = model.Quantity,
                        UpdateInfo = new JavaScriptSerializer().Serialize(updatedInfo)
                    };
                    db.Bundles.Add(bundle);
                    db.SaveChanges();
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
        public ActionResult SaveChange(BundleModel model)
        {
            ResponseJson response = new ResponseJson();
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(Globals.SetValidationError(ModelState));
                }

                UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = "Update Style", Type = 2, UpdatedTime = DateTime.Now, UserId = CurrentUser.Id };
                using (AppDB db = new AppDB())
                {
                    var bundle = db.Bundles.Where(s => s.Id == model.Id).SingleOrDefault();

                    if (bundle != null)
                    {
                        bundle.StyleId = model.StyleId;
                        bundle.OperatorId = model.OperatorId;
                        bundle.KnittingMachine = model.KnittingMachine;
                        bundle.Quantity = model.Quantity;
                        bundle.UpdateInfo += "," + new JavaScriptSerializer().Serialize(updatedInfo);
                        db.SaveChanges();
                    }
                    else
                    {
                        response.IsError = true;
                        response.Id = -3;
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
        public ActionResult Operators()
        {
            ResponseJson response = new ResponseJson();
            using (AppDB db = new AppDB())
            {
                response.Data = db.Employees.Where(e=>e.Role=="OPT").OrderBy(c => c.Name).Select(s => new { text = s.Name, value = s.Id }).ToList();
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Styles()
        {
            ResponseJson response = new ResponseJson();
            using (AppDB db = new AppDB())
            {
                response.Data = db.Styles.Where(s=>s.Status<5).OrderBy(c => c.Name).Select(s => new { text = s.Name, value = s.Id }).ToList();
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Card(string BundleNumber)
        {
            ViewBag.Code = BundleNumber;
            return View();
        }
        
	}
}