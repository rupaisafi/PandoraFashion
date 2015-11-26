using ProductionPlan.Areas.Buyer.Models;
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

namespace ProductionPlan.Areas.Buyer.Controllers
{
    public class BuyerActionsController : BaseController
    {
        //
        // GET: /Buyers/Details/
        public ActionResult Index(Page model)
        {
            ViewBag.Page = new JavaScriptSerializer().Serialize(model);
            return View(CurrentUser);
        }
        public ActionResult Get(Page model)
        {
            ResponseJson response = new ResponseJson() { Data = new List<object>() };

            using (AppDB db = new AppDB())
            {
                response = IEnumerableData.GetPageResponse<BuyerModel>(model, (from b in db.Buyers
                                                                               select new BuyerModel()
                                                                                  {
                                                                                      Id = b.Id,
                                                                                      Name = b.Name,
                                                                                      Phone = b.Phone,
                                                                                      Email = b.Email,
                                                                                      Address = b.Address,
                                                                                      CreatedAt = b.CreatedAt
                                                                                  }));
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Details(Guid id)
        {
            ResponseJson response = new ResponseJson();
            using(AppDB db=new AppDB())
            {
                response.Data = (from b in db.Buyers
                                 join e in db.Employees on b.CreatedBy equals e.Id
                                 where b.Id == id
                                 select new
                                 {
                                     Name = b.Name,
                                     Email = b.Email,
                                     Phone = b.Phone,
                                     CreatedBy=e.Name,
                                     CreatedById=b.CreatedBy,
                                     Description=b.Description,
                                     UpdateInfo=b.UpdateInfo,
                                     CreatedAt = b.CreatedAt
                                 }).SingleOrDefault();
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Create(BuyerModel model)
        {
            ResponseJson response = new ResponseJson();
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(Globals.SetValidationError(ModelState));
                }
                
                UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = "Seller Created", Type = 1, UpdatedTime = DateTime.Now, UserId = CurrentUser.Id };

                using (AppDB db = new AppDB())
                {

                    DAL.Buyer seller = new DAL.Buyer()
                    {
                        CreatedBy = CurrentUser.Id,
                        Description = model.Description,
                        Id = Guid.NewGuid(),
                        Name = model.Name,
                        CreatedAt = DateTime.Now,
                        Phone = model.Phone,
                        Email = model.Email,
                        Address = model.Address,
                        UpdateInfo = new JavaScriptSerializer().Serialize(updatedInfo)
                    };
                    db.Buyers.Add(seller);
                    db.SaveChanges();
                    response.Data = new { Id = seller.Id, Name = seller.Name };
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