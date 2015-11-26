using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductionPlan.Helper
{
    public enum ErrorCodes
    {
        NotLogedIn=-1,
        UnAuthorized=-2,
        NotFound=-3,
        AlreadyExist=-4,
        Validation=-5,
        InternalServer=-6,
        NotCreate=-7,
        Network=-8,
        AlreadyExistInAnother=-9
    };
}