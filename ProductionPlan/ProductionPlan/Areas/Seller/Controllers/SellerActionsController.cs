using ProductionPlan.Areas.Seller.Models;
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

namespace ProductionPlan.Areas.Seller.Controllers
{
    public class SellerActionsController : BaseController
    {
        //
        // GET: /Sellers/Create
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Details(Guid id)
        {
            ResponseJson response = new ResponseJson();
            using (AppDB db = new AppDB())
            {
                response.Data = (from b in db.Sellers
                                 join e in db.Employees on b.CreatedBy equals e.Id
                                 where b.Id == id
                                 select new
                                 {
                                     Name = b.Name,
                                     Email = b.Email,
                                     Phone = b.Phone,
                                     CreatedBy = e.Name,
                                     CreatedById = b.CreatedBy,
                                     Description = b.Description,
                                     UpdateInfo = b.UpdateInfo,
                                     CreatedAt = b.CreatedAt
                                 }).SingleOrDefault();
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Create(SellerModel model)
        {
            ResponseJson response = new ResponseJson();
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(Globals.SetValidationError(ModelState));
                }
                //response = Validation(response, model);
                //if (response.IsError)
                //{
                //    return Json(response);
                //}
                //ObjectParameter ErrorCode = new ObjectParameter("ErrorCode", 0);
                UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = "Seller Created", Type = 1, UpdatedTime = DateTime.Now, UserId = CurrentUser.Id };
                
                using (AppDB db = new AppDB())
                {

                    DAL.Seller seller = new DAL.Seller()
                    {
                        CreatedBy = CurrentUser.Id,
                        Description = model.Description,
                        Id = Guid.NewGuid(),
                        Name=model.Name,
                        CreatedAt = DateTime.Now,
                        Phone = model.Phone,
                        Email = model.Email,
                        Address = model.Address,
                        UpdateInfo = new JavaScriptSerializer().Serialize(updatedInfo)
                    };
                    db.Sellers.Add(seller);
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