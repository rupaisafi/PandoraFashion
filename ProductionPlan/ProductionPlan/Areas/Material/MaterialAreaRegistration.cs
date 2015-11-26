using System.Web.Mvc;

namespace ProductionPlan.Areas.Material
{
    public class MaterialAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Material";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Material_default",
                "Material/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
            context.MapRoute(
                "Materials",
                "Materials/{action}/{id}",
                new { controller = "MaterialActions", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}