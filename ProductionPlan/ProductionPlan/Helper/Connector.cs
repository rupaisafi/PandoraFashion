using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Helper
{
    public class Connector
    {
        //private static string ConnectionString = "data source=.;initial catalog=GovAppDb;integrated security=True;MultipleActiveResultSets=True;application name=EntityFramework";
        //When UserName and Password then
        //data source=41.74.173.166,51972;initial catalog=GovAppDev;persist security info=True;user id=chwadmin;password=05000622489;MultipleActiveResultSets=True;App=EntityFramework

         private static string ConnectionString = "data source=41.74.170.83,57389;initial catalog=TPR_2751;persist security info=True;user id=HybridUser;password=05000622489;MultipleActiveResultSets=True;App=EntityFramework";
        public static string AppDB()
        {
            return "metadata=res://*/DAL.AppDBM.csdl|res://*/DAL.AppDBM.ssdl|res://*/DAL.AppDBM.msl;provider=System.Data.SqlClient;provider connection string=\""+ConnectionString+"\"";
        }
        public static string AccountDB()
        {
            return "metadata=res://*/Areas.Account.DAL.AccountDBM.csdl|res://*/Areas.Account.DAL.AccountDBM.ssdl|res://*/Areas.Account.DAL.AccountDBM.msl;provider=System.Data.SqlClient;provider connection string=\"" + ConnectionString + "\"";
        }
        public static string CivilRegistryDB()
        {
            return "metadata=res://*/Areas.CivilRegistry.DAL.CivilRegistryDBM.csdl|res://*/Areas.CivilRegistry.DAL.CivilRegistryDBM.ssdl|res://*/Areas.CivilRegistry.DAL.CivilRegistryDBM.msl;provider=System.Data.SqlClient;provider connection string=\"" + ConnectionString + "\"";
        }
        public static string HealthDB()
        {
            return "metadata=res://*/Areas.Health.DAL.HealthDBM.csdl|res://*/Areas.Health.DAL.HealthDBM.ssdl|res://*/Areas.Health.DAL.HealthDBM.msl;provider=System.Data.SqlClient;provider connection string=\"" + ConnectionString + "\"";
        }
        public static string PeopleDB()
        {
            return "metadata=res://*/Areas.Citizen.DAL.PeopleDBM.csdl|res://*/Areas.Citizen.DAL.PeopleDBM.ssdl|res://*/Areas.Citizen.DAL.PeopleDBM.msl;provider=System.Data.SqlClient;provider connection string=\"" + ConnectionString + "\"";
        }
    }
}