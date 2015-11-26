using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ProductionPlan.Startup))]
namespace ProductionPlan
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
