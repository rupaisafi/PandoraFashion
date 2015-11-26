using ProductionPlan.Areas.Material.Models;
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

namespace ProductionPlan.Areas.Material.Controllers
{
    public class MaterialActionsController : BaseController
    {
        //
        // GET: /Materials/Create
        public ActionResult Get(Page model)
        {
            using (AppDB db = new AppDB())
            {

                return Json(IEnumerableData.GetPageResponse<MaterialModel>(model, (from m in db.Materials
                                                                                   join s in db.Sellers on m.SellerId equals s.Id
                                                                                   join o in db.Orders on m.OrderId equals o.Id
                                                                                   join u in db.Employees on m.CreatedBy equals u.Id
                                                                                   where m.OrderId == model.id
                                                                                   select new MaterialModel() { 
                                                                                    Id=m.Id,
                                                                                    SellerId=m.SellerId,
                                                                                    Seller=s.Name,
                                                                                    OrderId = m.OrderId,
                                                                                    Order=o.CodeNumber,
                                                                                    Amount = m.Amount,
                                                                                    Description = m.Description,
                                                                                    OrderDate = m.OrderDate,
                                                                                    DeliveryDate = m.DeliveryDate,
                                                                                    CreatedBy = m.CreatedBy,
                                                                                    CreatedByName=u.Name,
                                                                                    ReceivedDate = m.ReceivedDate
                                                                                   })), JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Create(MaterialModel model)
        {
            ResponseJson response = new ResponseJson();
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(Globals.SetValidationError(ModelState));
                }

                UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = "Material Created", Type = 1, UpdatedTime = DateTime.Now, UserId = CurrentUser.Id };

                using (AppDB db = new AppDB())
                {

                    DAL.Material seller = new DAL.Material()
                    {
                        SellerId=model.SellerId,
                        OrderId=model.OrderId,
                        Amount=model.Amount,
                        OrderDate=DateTime.Now,
                        DeliveryDate=model.DeliveryDate,
                        CreatedBy = CurrentUser.Id,
                        Description = model.Description,
                        Id = Guid.NewGuid(),
                        CreatedAt = DateTime.Now,
                        UpdateInfo = new JavaScriptSerializer().Serialize(updatedInfo)
                    };
                    db.Materials.Add(seller);
                    db.SaveChanges();
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