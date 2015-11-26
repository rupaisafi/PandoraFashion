using ProductionPlan.Areas.Style.Models;
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

namespace ProductionPlan.Areas.Style.Controllers
{
    public class StylesActionsController : BaseController
    {
        //
        // GET: /Styles/
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
                response = IEnumerableData.GetPageResponse<StyleModel>(model, (from s in db.Styles
                                                                                    join b in db.Buyers on s.BuyerId equals b.Id
                                                                                    join st in db.Status on s.Status equals st.Id
                                                                                    select new StyleModel() {
                                                                                        BarCode=s.BarCode,
                                                                                        Buyer=b.Name,
                                                                                        BuyerId=s.BuyerId,
                                                                                        Id=s.Id,
                                                                                        Name=s.Name,
                                                                                        Quantity=s.Quantity,
                                                                                        Status=st.Name,
                                                                                        StatusId=st.Id,
                                                                                        ShippingDate=s.ShippingDate,
                                                                                        Description=s.Description,
                                                                                        YarnType=s.YarnType,
                                                                                        Size=s.Size,
                                                                                    }));
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Create(StyleModel model)
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
                UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = "Style Created", Type = 1, UpdatedTime = DateTime.Now, UserId = CurrentUser.Id };
                using (AppDB db = new AppDB())
                {
                    DAL.Style style = new DAL.Style()
                    {
                        Id=Guid.NewGuid(),
                        BuyerId = model.BuyerId,
                        BarCode = Globals.GetBarCode(),
                        Name = model.Name,
                        CreatedBy = CurrentUser.Id,
                        YarnType = model.YarnType,
                        Size = model.Size,
                        Description = model.Description,
                        ShippingDate = model.ShippingDate,
                        Status = 0,
                        CreatedAt = DateTime.Now,
                        Quantity = model.Quantity,
                        UpdateInfo = new JavaScriptSerializer().Serialize(updatedInfo)
                    };
                    db.Styles.Add(style);
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
        public ActionResult SaveChange(StyleModel model)
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
                    var style = db.Styles.Where(s => s.Id == model.Id).SingleOrDefault();

                    if (style != null)
                    {
                        style.BuyerId = model.BuyerId;
                        style.Name = model.Name;
                        style.YarnType = model.YarnType;
                        style.Size = model.Size;
                        style.Description = model.Description;
                        style.ShippingDate = model.ShippingDate;
                        style.Quantity = model.Quantity;
                        style.UpdateInfo += "," + new JavaScriptSerializer().Serialize(updatedInfo);

                        //db.Styles.Add(style);
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
	}
}