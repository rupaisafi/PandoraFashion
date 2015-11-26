using ProductionPlan.Areas.Order.Models;
using ProductionPlan.Controllers;
using ProductionPlan.DAL;
using ProductionPlan.Fiter;
using ProductionPlan.Helper;
using ProductionPlan.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace ProductionPlan.Areas.Order.Controllers
{
  [AuthorizeUser(RoleList = new string[] { "ADM", "SAD", "IEO" })]
  public class OrderActionsController : BaseController
  {
    public ActionResult Index(Page model)
    {
      ViewBag.Page = new JavaScriptSerializer().Serialize(model);
      return View(CurrentUser);
    }
    public ActionResult Details(Guid id)
    {
      ResponseJson response = new ResponseJson();
      using (AppDB db = new AppDB())
      {
        response.Data = (from o in db.Orders
                         join b in db.Buyers on o.BuyerId equals b.Id
                         where o.Status != 10
                         select new OrderModel()
                         {
                           Id = b.Id,
                           Buyer = b.Name,
                           BuyerId = o.BuyerId,
                           CodeNumber = o.CodeNumber,
                           Color = o.Color,
                           DeliveryDate = o.DeliveryDate,
                           Description = o.Description,
                           Size = o.Size,
                           Style = o.Style,
                           Quantity = o.TotalQuantity,
                           Completed = o.TotalCompleted,
                           ProductionStartAT = o.ProductionStartAT,
                           CurrentDate = DateTime.Now
                         }).ToList();

      }
      return Json(response, JsonRequestBehavior.AllowGet);
    }

    [AuthorizeUser(AccessLevel = "ADM")]
    public ActionResult Get(Page model)
    {
      ResponseJson response = new ResponseJson();
      using (AppDB db = new AppDB())
      {
        response.Data = (from o in db.Orders
                         join b in db.Buyers on o.BuyerId equals b.Id
                         where o.Status != 10
                         select new OrderModel()
                         {
                           Id = o.Id,
                           Buyer = b.Name,
                           BuyerId = o.BuyerId,
                           CodeNumber = o.CodeNumber,
                           Color = o.Color,
                           DeliveryDate = o.DeliveryDate,
                           Description = o.Description,
                           Size = o.Size,
                           Style = o.Style,
                           Quantity = o.TotalQuantity,
                           Completed = o.TotalCompleted,
                           ProductionStartAT = o.ProductionStartAT,
                           OrderDate = o.OrderDate,
                           CurrentDate = DateTime.Now
                         }).ToList();

      }
      return Json(response, JsonRequestBehavior.AllowGet);
    }
    [HttpPost, AuthorizeUser(AccessLevel = "ADM")]
    public ActionResult Create(OrderModel model)
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
        UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = "Order Created", Type = 1, UpdatedTime = DateTime.Now, UserId = CurrentUser.Id };
        string login = "";
        using (AppDB db = new AppDB())
        {

          DAL.Order order = new DAL.Order()
          {
            BuyerId = model.BuyerId,
            CodeNumber = "",
            Color = model.Color,
            CreatedBy = CurrentUser.Id,
            DeliveryDate = model.DeliveryDate,
            Description = model.Description,
            Id = Guid.NewGuid(),
            OrderDate = DateTime.Now,
            Size = model.Size,
            Status = 0,
            Style = model.Style,
            TotalQuantity = model.Quantity,
            UpdateInfo = new JavaScriptSerializer().Serialize(updatedInfo)
          };
          db.Orders.Add(order);
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
  }
}