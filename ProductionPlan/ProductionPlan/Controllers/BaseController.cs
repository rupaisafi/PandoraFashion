using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Web.Script.Serialization;
using ProductionPlan.Fiter;
using ProductionPlan.Areas.User.DAL;

namespace ProductionPlan.Controllers
{
    public class BaseController : Controller
    {
        public BaseController():base() { 
            userInfo = new AuthorizeUserInfo(null);
        }
        private AuthorizeUserInfo userInfo;
        protected string[] Roles
        {
            get
            {
                return userInfo.RolesByContext(HttpContext);
            }
        }
        protected void SetLogIn(LogIn_Result user)
        {
            
        }
        protected void BaseLogOut()
        {
            
        }
        protected LogIn_Result CurrentUser
        {
            get
            {
                return userInfo.CurrentUserByContext(HttpContext);
            }
        }
        protected bool IsLogedIn
        {
            get
            {
                return HttpContext.Request.IsAuthenticated;
            }
        }
    }
}