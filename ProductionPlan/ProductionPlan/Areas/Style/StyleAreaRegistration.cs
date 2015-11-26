using System.Web.Mvc;

namespace ProductionPlan.Areas.Style
{
    public class StyleAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Style";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Style_default",
                "Style/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
            context.MapRoute(
                "Styles",
                "Styles/{action}/{id}",
                new { controller = "StylesActions", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}