using System.Web.Mvc;

namespace ProductionPlan.Areas.Bundle
{
    public class BundleAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Bundle";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Bundle_default",
                "Bundle/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
            context.MapRoute(
                "Bundles",
                "Bundles/{action}/{id}",
                new { controller = "BundleActions", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}