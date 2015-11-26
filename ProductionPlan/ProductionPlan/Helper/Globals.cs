namespace ProductionPlan.Helper
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Diagnostics;
    using System.Text.RegularExpressions;
    using System.Web.WebPages.Html;
    using ProductionPlan.Models;
    using System.Text;
    using System.Security.Cryptography;
    using System.IO;


    public static class Globals
    {
        internal static ResponseJson SetValidationError(System.Web.Mvc.ModelStateDictionary ModelState)
        {
            ResponseJson response = new ResponseJson();
            response.IsError = true;
            response.Id = -5;
            List<object> errlist = new List<object>();
            foreach (var item in ModelState)
            {

                if (ModelState[item.Key].Errors.Count > 0)
                {
                    foreach (var error in ModelState[item.Key].Errors)
                    {
                        errlist.Add(new { Field = item.Key, Message = error.ErrorMessage });
                    }
                }
            }
            response.Data = errlist;
            return response;
        }
        public static string Encrypt(string clearText)
        {
            string EncryptionKey = "SAMARUKBD0123456789";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }
            return clearText;
        }
        public static string Decrypt(string cipherText)
        {
            string EncryptionKey = "SAMARUKBD0123456789";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }
        public static string GetBarCode()
        {
            var barCode = "";
            var random = new Random();
            barCode = random.Next() + "" + random.Next() + "" + random.Next();
            return barCode.Substring(0,12);
        }
    }
}