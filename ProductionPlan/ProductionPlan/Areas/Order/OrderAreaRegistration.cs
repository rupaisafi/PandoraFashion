using System.Web.Mvc;

namespace ProductionPlan.Areas.Order
{
    public class OrderAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Order";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Order_default",
                "Order/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
            context.MapRoute(
                "Order",
                "Orders/{action}/{id}",
                new { controller = "OrderActions", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}