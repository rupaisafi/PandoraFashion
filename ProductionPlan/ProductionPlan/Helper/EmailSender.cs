using ProductionPlan.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace ProductionPlan.Helper
{
    public class EmailSender
    {
        public static ResponseJson Send(string to, string subject, string body)
        {
            ResponseJson response = new ResponseJson();
            try
            {
                MailMessage mail = new MailMessage();
                mail.To.Add(to);
                mail.From = new MailAddress("chw.rwanda@gmail.com");
                mail.Subject = subject;
                string Body = body;
                mail.Body = Body;
                mail.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp.gmail.com";
                smtp.Port = 587;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new System.Net.NetworkCredential("chw.rwanda@gmail.com", "NsVtEa1&Ei+iGbZK");// Enter seders User name and password
                smtp.EnableSsl = true;
                smtp.Send(mail);
            }
            catch (Exception e)
            {
                response.IsError = true;
                response.Id = -6;
            }
            return response;
        }

        public static ResponseJson SendToCHWUser(string to, string userName, string password, string firstName, string role)
        {
            string subject = "Regarding your CHW user account as " + role;
            string body = "Dear " + firstName + "<br /><br />" +
                @"THIS E-MAIL CONTAINS IMPORTANT INFORMATION PERTAINING TO YOUR ABILITY TO ACCESS THE COMMUNITY HEALTH WORKER SYSTEM - DO NOT LOSE THIS MESSAGE!
                <br />
                <br />
                <br />" +
                "The temporary password for your account associated with :" + userName + " is " + password + " <br /><div style=\"padding-left:20px;\">" +
                    @"<br />Log into the CHW System by clicking the ‘Login’ button in the upper right corner of the CHW and change your password now.<br />
                    Your new password must meet the following criteria:<br /><br />

                    1) A password must be between 8 and 16 characters in length.<br />
                    2) A password cannot start with more than 3 characters from the beginning of the user name.<br />
                    3) A password must contain characters from three of the four following categories:<br />
                    - English uppercase characters (A to Z)<br />
                    - English lowercase characters (a to z)<br />
                    - Base 10 digits (0 to 9)<br />
                    - Special characters (For example, #, $, and ^)<br /><br />

                    Tips on copying and pasting the system-generated temporary password:<br />
                    Due to the cryptic nature of the system-generated password, it may be easier for you to copy and paste the password from this e-mail into the password field on the CHW login page. To copy and paste the password from this e-mail:<br />
                    (1) highlight the temporary password with your mouse (be sure to include ONLY the characters in the password and NOT the blank spaces that precede or follow the password);<br />
                    (2) with the password highlighted, press both the Ctrl key and letter ‘C’ to copy the password;<br />
                    (3) position your cursor in the password field in the NMLS login screen and press both the Ctrl key and letter ‘V’ to paste the password into the password field. You will need to again paste (press Ctrl key and V) this password into the Password Change screen after logging into CHW.<br />
                    Note: these instructions work for PC users only.<br /><br /><br />


                    CHW System Administrator
                </div>";
            return Send(to, subject, body);
        }
        public static ResponseJson SendToPassword(string to, string userName, string password, string firstName)
        {
            string subject = "Regarding your Forget Passowrd";
            string body = "Dear " + firstName + "<br /><br />" +
                @"THIS E-MAIL CONTAINS IMPORTANT INFORMATION PERTAINING TO YOUR ABILITY TO ACCESS THE COMMUNITY HEALTH WORKER SYSTEM - DO NOT LOSE THIS MESSAGE!
                <br />
                <br />
                <br />" +
                "The password for your account <b style=\"color:#6ac398\">" + userName + "</b>  is <b style=\"color:#6ac398\">" + password + "</b> <br /><br /><br /> CHW System Administrator </div>";
            return Send(to, subject, body);
        }
    }
}