using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Security;
using Microsoft.AspNet.Identity;
using ProductionPlan.Areas.User.DAL;

namespace ProductionPlan.Fiter
{
    public class AuthorizeUserInfo
    {
        public AuthorizeUserInfo(HttpContextBase httpContext)
        {
            this.httpContext = httpContext;
        }
        HttpContextBase httpContext;
        public string[] Roles
        {
            get
            {
                if (CurrentUser != null && CurrentUser.Roles != null)
                {
                    return CurrentUser.Roles.Split(',');
                }
                return new string[] { };
            }
        }
        public string[] RolesByContext(HttpContextBase httpContext)
        {
            this.httpContext = httpContext;
            return Roles;
        }
        public LogIn_Result CurrentUser
        {
            get
            {
                return GetCurrentUser();
            }
        }
        public LogIn_Result CurrentUserByContext(HttpContextBase httpContext)
        {
            this.httpContext = httpContext;
            return CurrentUser;
        }
        internal LogIn_Result GetCurrentUser()
        {
            LogIn_Result user = httpContext.Session["login"] as LogIn_Result;
            if (user == null && httpContext.Request.IsAuthenticated)
            {
                using (UserDB db = new UserDB())
                {
                    user = db.LogIn(httpContext.User.Identity.GetUserName(),null).SingleOrDefault();
                    httpContext.Session["login"] = user;
                }
            }
            return user;
        }
    }
}