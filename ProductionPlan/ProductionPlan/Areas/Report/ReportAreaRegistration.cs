using System.Web.Mvc;

namespace ProductionPlan.Areas.Report
{
    public class ReportAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Report";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Report_default",
                "Report/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
            context.MapRoute(
                "Reports",
                "Reports/{action}/{id}",
                new {controller="ReportActions" ,action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}