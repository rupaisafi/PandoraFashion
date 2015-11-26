using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Helper
{
    public static class Menu
    {
        public static object Get(string[] roles)
        {
            MenuType.Empty();
            var newMenu = new List<object>();
            Dictionary<string, dynamic> menu = new Dictionary<string, dynamic>();
            foreach (string role in roles)
            {
                switch(role)
                {
                    case "ADM":
                    case "IEO":
                        Set(menu, MenuForADM, newMenu);
                        break;
                    case "DEO":
                        Set(menu, MenuForDEO, newMenu);
                        break;
                    case "MGR":
                        Set(menu, MenuForMGR, newMenu);
                        break;
                    case "OPT":
                        Set(menu, MenuForOPT, newMenu);
                        break;
                    
                }
            }
            return newMenu;
        }

        public static void Set(Dictionary<string, dynamic> menu, List<MenuItem> items, List<object> newMenu)
        {
            foreach(dynamic item in items)
            {
                if(!menu.ContainsKey(item.type.name))
                {
                    item.type.items = item.items;
                    menu[item.type.name] = item.type;
                    newMenu.Add(item.type);
                }else
                {
                    var newItems = new object[menu[item.type.name].items.Length + item.items.Length];
                    var oo = menu[item.type.name].items;
                    int i=0;
                    for (; i < menu[item.type.name].items.Length; i++)
                    {
                        newItems[i] = menu[item.type.name].items[i];
                    }
                    var length =item.items.Length+ i - 1;
                    for (var j = 0; j < item.items.Length; i++,j++)
                    {
                        newItems[i] = item.items[j];
                    }
                    menu[item.type.name].items = newItems;
                }
            }
        }
        
        public static List<MenuItem> MenuForADM = new List<MenuItem>() { 
            new MenuItem(){
                type=MenuType.Registrar,
                items=new object[]{
                    new{
                        name="In-hand Order",
                        url="/Orders"
                    },
                    new{
                        name="Knitting",
                        url="/Buyers"
                    },
                    new{
                        name="Makeup",
                        url="/Sellers"
                    },
                    new{
                        name="Washing",
                        url="/Orders"
                    },
                    new{
                        name="Finishing",
                        url="/Styles"
                    },
                    new{
                        name="Packing",
                        url="/Bundles"
                    },
                    new{
                        name="Styles",
                        url="/Bundle/Issuing"
                    },
                    new{
                        name="Production Report",
                        url="/Bundle/Receiving"
                    }
                }
            }
        };

        public static List<MenuItem> MenuForMGR = new List<MenuItem>() { 
            new MenuItem(){
                type=MenuType.Registrar,
                items=new object[]{
                    new{
                        name="Styles",
                        url="/Styles"
                    },
                    new{
                        name="Bundles",
                        url="/Bundles"
                    },
                    new{
                        name="Issuing",
                        url="/Bundle/Issuing"
                    },
                    new{
                        name="Receiving",
                        url="/Bundle/Receiving"
                    }
                }
            }
        };
        public static List<MenuItem> MenuForDEO = new List<MenuItem>() { 
            new MenuItem(){
                type=MenuType.Registrar,
                items=new object[]{
                    new{
                        name="Bundles",
                        url="/Bundles"
                    },
                    new{
                        name="Issuing",
                        url="/Bundle/Issuing"
                    },
                    new{
                        name="Receiving",
                        url="/Bundle/Receiving"
                    }
                }
            }
        };
        public static List<MenuItem> MenuForOPT = new List<MenuItem>() { 
            new MenuItem(){
                type=MenuType.Registrar,
                items=new object[]{
                    new{
                        name="Bundles",
                        url="/Bundles"
                    },
                    new{
                        name="Issuing",
                        url="/Bundle/Issuing"
                    },
                    new{
                        name="Receiving",
                        url="/Bundle/Receiving"
                    }
                }
            }
        };
        
    }
    public class MenuItem
    {
        public string html { get; set; }
        public string name { get; set; }
        public MenuItem type { get; set; }
        public string className { get; set; }
        public object[] items { get; set; }
    }
    public class SubMenuItem
    {
        public string name { get; set; }
        public string url { get; set; }
    }
    public class MenuType
    {
        public static MenuItem Registrar = new MenuItem() {
            className = "nav1",
            html = "<a class=\"glyphicon glyphicon-user\" href=\"#\"></a>",
            name = "My Production Plan",

        };
        public static MenuItem HealthFacility = new MenuItem()
        {
            className = "nav1",
            html = "<a class=\"glyphicon fa fa-h-square\" href=\"#\"></a>",
            name = "ZCO",
        };
        public static MenuItem Citizen = new MenuItem()
        {
            className = "nav1",
            html = "<a class=\"glyphicon fa fa-user-md\" href=\"#\"></a>",
            name = "CITIZENS",
        };
        public static void Empty() {
            Registrar.items = null;
            HealthFacility.items = null;
            Citizen.items = null;
        }
    }


    //public class MenuType
    //{
    //  public static MenuItem Registrar = new MenuItem()
    //  {
    //    className = "nav1",
    //    html = "<a class=\"glyphicon glyphicon-user\" href=\"#\"></a>",
    //    name = "My Production Plan",

    //  };
    //  public static MenuItem HealthFacility = new MenuItem()
    //  {
    //    className = "nav1",
    //    html = "<a class=\"glyphicon fa fa-h-square\" href=\"#\"></a>",
    //    name = "ZCO",
    //  };
    //  public static MenuItem Citizen = new MenuItem()
    //  {
    //    className = "nav1",
    //    html = "<a class=\"glyphicon fa fa-user-md\" href=\"#\"></a>",
    //    name = "CITIZENS",
    //  };
    //  public static void Empty()
    //  {
    //    Registrar.items = null;
    //    HealthFacility.items = null;
    //    Citizen.items = null;
    //  }
    //}
}