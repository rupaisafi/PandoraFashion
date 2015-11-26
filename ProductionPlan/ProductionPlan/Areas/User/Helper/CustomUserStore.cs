using Microsoft.AspNet.Identity;
using ProductionPlan.Areas.User.Models;
using ProductionPlan.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;

namespace ProductionPlan.Areas.User.Helper
{
    public class CustomUserStore : IUserStore<ApplicationUser>, IUserPasswordStore<ApplicationUser>, IUserSecurityStampStore<ApplicationUser>
    {
        public Task CreateAsync(ApplicationUser model)
        {
            //try
            //{
            //    using (AccountDB db = new AccountDB())
            //    {
            //        ObjectParameter ErrorCode = new ObjectParameter("ErrorCode", 0);
            //        UpdatedInfoModel updatedInfo = new UpdatedInfoModel() { Comment = model.Groups, Type = 1, UpdatedTime = DateTime.Now, UserId = model.CurrentUserId };
            //        db.CreateStaff(
            //            Guid.NewGuid(),
            //            model.CitizenId,
            //            model.UserName,
            //            model.PasswordHash,
            //            model.SecurityStamp,
            //            model.Phone,
            //            model.Email,
            //            model.Groups,
            //            model.CreatedDate,
            //            new JavaScriptSerializer().Serialize(updatedInfo),
            //            ErrorCode);

            //        Int32 errorCode = Int32.Parse(ErrorCode.Value.ToString());
            //        if (errorCode < 0)
            //        {
            //            model.Response.IsError = true;
            //            model.Response.ID = errorCode;
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    model.Response.IsError = true;
            //    model.Response.ID = -6;
            //}
            return Task.FromResult(0);
        }
        public Task DeleteAsync(ApplicationUser user)
        {
            throw new NotImplementedException();
        }
        public Task<ApplicationUser> FindByIdAsync(string userId)
        {
            //using (AppDB db = new AppDB())
            //{
            //    var id = Guid.Parse(userId);
            //    var user = db.Staffs.Where(o => o.UserId == id).SingleOrDefault();
            //    if (user == null)
            //    {
            //        ApplicationUser appUser = null;
            //        return Task.FromResult(appUser);
            //    }
            //    else
            //    {
            //        return Task.FromResult(new ApplicationUser() { Id = user.UserId.ToString(), UserName = user.Login, PasswordHash = user.Password, SecurityStamp = user.SecurityStamp });
            //    }
            //}
            return Task.FromResult(new ApplicationUser());
        }
        public Task<ApplicationUser> FindByNameAsync(string userName)
        {

            //using (AccountDB db = new AccountDB())
            //{
            //    var user = db.LogIn(userName).SingleOrDefault();
            //    if (user == null)
            //    {
            //        ApplicationUser appUser = null;
            //        return Task.FromResult(appUser);
            //    }
            //    else
            //    {
            //        return Task.FromResult(new ApplicationUser() { Id = user.Id.ToString(), UserName = user.Login, PasswordHash = user.Password, SecurityStamp = user.SecurityStamp });
            //    }
            //}
            return Task.FromResult(new ApplicationUser());
        }
        public Task UpdateAsync(ApplicationUser user)
        {
            //using (AppDB db = new AppDB())
            //{
            //    var id = Guid.Parse(user.Id);
            //    var dbUser = db.Staffs.Where(o => o.UserId == id).SingleOrDefault();
            //    dbUser.SecurityStamp = user.SecurityStamp;
            //    dbUser.Password = user.PasswordHash;
            //    db.SaveChanges();
            //}
            return Task.FromResult(0);
        }
        public void Dispose()
        {

        }
        public Task<string> GetPasswordHashAsync(ApplicationUser user)
        {
            return Task.FromResult(GetHashPassword(Globals.Decrypt(user.PasswordHash)));
        }
        public Task<bool> HasPasswordAsync(ApplicationUser user)
        {
            return Task.FromResult(true);
        }
        public Task SetPasswordHashAsync(ApplicationUser user, string passwordHash)
        {
            user.PasswordHash = passwordHash;
            return Task.FromResult("");
        }
        public Task<string> GetSecurityStampAsync(ApplicationUser user)
        {
            return Task.FromResult(user.SecurityStamp);
        }
        public Task SetSecurityStampAsync(ApplicationUser user, string stamp)
        {
            user.SecurityStamp = stamp;
            return Task.FromResult(0);
        }
        public string GetHashPassword(string password)
        {
            byte[] salt;
            byte[] buffer2;
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, 0x10, 0x3e8))
            {
                salt = bytes.Salt;
                buffer2 = bytes.GetBytes(0x20);
            }
            byte[] dst = new byte[0x31];
            Buffer.BlockCopy(salt, 0, dst, 1, 0x10);
            Buffer.BlockCopy(buffer2, 0, dst, 0x11, 0x20);
            return Convert.ToBase64String(dst);
        }
        //To check hashPassword
        public static bool VerifyHashedPassword(string hashedPassword, string password)
        {
            byte[] buffer4;
            if (hashedPassword == null)
            {
                return false;
            }
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            byte[] src = Convert.FromBase64String(hashedPassword);
            if ((src.Length != 0x31) || (src[0] != 0))
            {
                return false;
            }
            byte[] dst = new byte[0x10];
            Buffer.BlockCopy(src, 1, dst, 0, 0x10);
            byte[] buffer3 = new byte[0x20];
            Buffer.BlockCopy(src, 0x11, buffer3, 0, 0x20);
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, dst, 0x3e8))
            {
                buffer4 = bytes.GetBytes(0x20);
            }
            //need to create a function to to check equal
            return buffer3 == buffer4;
        }
    }
}