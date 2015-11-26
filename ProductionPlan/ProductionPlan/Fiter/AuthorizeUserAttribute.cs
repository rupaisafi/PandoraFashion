using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Script.Serialization;

namespace ProductionPlan.Fiter
{
    public class AuthorizeUserAttribute : AuthorizeAttribute
    {
        // Custom property
        public string AccessLevel { get; set; }
        public string[] RoleList { get; set; }
        private bool IsAjaxCall = false;
        private bool IsAuthenticated = false;
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            IsAuthenticated=httpContext.Request.IsAuthenticated;
            IsAjaxCall = httpContext.Request.IsAjaxRequest();

            return IsAuthenticated && IsValid(httpContext);
        }

        private bool IsValid(HttpContextBase httpContext)
        {
            AuthorizeUserInfo userInfo = new AuthorizeUserInfo(httpContext);
            return userInfo.Roles.Contains(this.AccessLevel) || (RoleList != null && RoleList.Any(r => userInfo.Roles.Any(u => u == r)));
        }
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {

            AuthenticatedCallBack(filterContext);
            
        }

        private void AuthenticatedCallBack(AuthorizationContext filterContext)
        {
            string action = IsAjaxCall ? "AjaxCall" : "Unauthorised";
            filterContext.Result = new RedirectToRouteResult(
                                    "Default",
                                    new RouteValueDictionary(
                                        new
                                        {
                                            controller = "Error",
                                            action = action
                                        })
                                    );
        }
        private void NotAuthenticatedCallBack(AuthorizationContext filterContext)
        {
            string action = IsAjaxCall ? "NotLogin" : "Login";
            filterContext.Result = new RedirectToRouteResult(
                                    "Account_default",
                                    new RouteValueDictionary(
                                        new
                                        {
                                            controller = "Account",
                                            action = action
                                        })
                                    );
        }
    }
}