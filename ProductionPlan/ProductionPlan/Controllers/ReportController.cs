using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductionPlan.Controllers
{
    public class ReportController : Controller
    {
        //
        // GET: /Report/ExportToCSV
        [ValidateInput(false)]
        public ActionResult ExportToCSV(string columnHeader, List<string> columns)
        {
            System.IO.MemoryStream output = new System.IO.MemoryStream();
            System.IO.StreamWriter writer = new System.IO.StreamWriter(output, System.Text.Encoding.UTF8);
            try
            {
                writer.Write(columnHeader);
                writer.WriteLine();


                foreach (var ex in columns)
                {
                    writer.Write(ex);
                    writer.WriteLine();
                }
                writer.Flush();
                output.Position = 0;
            }
            catch (Exception ex)
            {

            }
            return File(output, "text/comma-separated-values", "Report.csv");
        }
        public ActionResult ExportToXl(string columnHeader, List<string> columns)
        {
            System.IO.MemoryStream output = new System.IO.MemoryStream();
            System.IO.StreamWriter writer = new System.IO.StreamWriter(output, System.Text.Encoding.UTF8);
            try
            {
                writer.Write(columnHeader);
                writer.WriteLine();


                foreach (var ex in columns)
                {
                    writer.Write(ex);
                    writer.WriteLine();
                }
                writer.Flush();
                output.Position = 0;
            }
            catch (Exception ex)
            {

            }
            return File(output, "application/vnd.ms-excel", "Report.xls");
        }
    }
}