namespace ProductionPlan.Areas.Employee.Controllers
{
  using System;
  using System.Linq;
  using System.Web.Mvc;
  using ProductionPlan.DAL;
  using ProductionPlan.Helper;
  using ProductionPlan.Models;
  using ProductionPlan.Controllers;
  using System.Collections.Generic;
  using System.Web.Script.Serialization;
  using ProductionPlan.Areas.Employee.Models;
  public class EmployeeActionsController : BaseController
  {    
    public ActionResult Designations()
    {
      ResponseJson response = new ResponseJson();
      using (AppDB db = new AppDB())
      {
        var currentRole = db.Roles.Where(r => CurrentUser.Roles.Contains(r.Code)).Min(r => r.Priority);
        response.Data = db.Roles.Where(r => r.Priority > currentRole).OrderBy(c => c.Priority).Select(s => new { text = s.Name, value = s.Code }).ToList();
      }
      return Json(response, JsonRequestBehavior.AllowGet);
    }
    public ActionResult Get(Page model)
    {
      ResponseJson response = new ResponseJson() { Data = new List<object>() };

      using (AppDB db = new AppDB())
      {
        var currentRole = db.Roles.Where(r => CurrentUser.Roles.Contains(r.Code)).Min(r => r.Priority);
        response = IEnumerableData.GetPageResponse<EmployeeModel>(model, (from b in db.Employees
                                                                          join
                                                                          r in db.Roles on b.Role equals r.Code
                                                                          where r.Priority > currentRole
                                                                          select new EmployeeModel()
                                                                        {
                                                                          Id = b.Id,
                                                                          BarCode = b.BarCode,
                                                                          Name = b.Name,
                                                                          Phone = b.Phone,
                                                                          Email = b.Email,
                                                                          Address = b.Address,
                                                                          Role = r.Name,
                                                                          CreatedAt = b.CreatedAt,
                                                                          IsActive = b.IsActive
                                                                        }));
      }
      return Json(response, JsonRequestBehavior.AllowGet);
    }
    public ActionResult Details(Guid id)
    {
      ResponseJson response = new ResponseJson();
      using (AppDB db = new AppDB())
      {
        response.Data = (from b in db.Employees
                         join e in db.Employees on b.CreatedBy equals e.Id
                         join r in db.Roles on b.Role equals r.Code
                         where b.Id == id
                         select new
                         {
                           Name = b.Name,
                           Email = b.Email,
                           Phone = b.Phone,
                           CreatedBy = e.Name,
                           CreatedAt = b.CreatedAt,
                           IsActive = b.IsActive,
                           Role = r.Name
                         }).SingleOrDefault();
      }
      return Json(response, JsonRequestBehavior.AllowGet);
    }
    public ActionResult Index(Page model)
    {
      ViewBag.Page = new JavaScriptSerializer().Serialize(model);
      return View(CurrentUser);
    }
    public ActionResult Create(EmployeeModel model)
    {
      ResponseJson response = new ResponseJson();
      try
      {
        if (!ModelState.IsValid)
        {
          return Json(Globals.SetValidationError(ModelState));
        }

        UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = "Employee Created", Type = 1, UpdatedTime = DateTime.Now, UserId = CurrentUser.Id };
        using (AppDB db = new AppDB())
        {
          DAL.Employee bundle = new DAL.Employee()
          {
            Id = Guid.NewGuid(),
            Name = model.Name,
            BarCode = Globals.GetBarCode(),
            CreatedBy = CurrentUser.Id,
            UserName = model.UserName,
            Password = Globals.Encrypt(model.Password),
            Phone = model.Phone,
            Email = model.Email,
            IsActive = true,
            Address = model.Address,
            Role = model.Role,
            CreatedAt = DateTime.Now,
            UpdateInfo = new JavaScriptSerializer().Serialize(updatedInfo)
          };
          db.Employees.Add(bundle);
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
    public ActionResult SaveChange(EmployeeModel model)
    {
      ResponseJson response = new ResponseJson();
      try
      {
        if (!ModelState.IsValid)
        {
          return Json(Globals.SetValidationError(ModelState));
        }

        UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = "Update Employee", Type = 2, UpdatedTime = DateTime.Now, UserId = CurrentUser.Id };
        using (AppDB db = new AppDB())
        {
          var bundle = db.Employees.Where(s => s.Id == model.Id).SingleOrDefault();

          if (bundle != null)
          {
            bundle.Name = model.Name;
            bundle.Phone = model.Phone;
            bundle.Email = model.Email;
            bundle.Address = model.Address;
            bundle.Role = model.Role;
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
  }
}