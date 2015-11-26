var LogInPartial = new function () {
    var that = this, form = $('#login_partia_form'), bindingModel = {Remember:true},inputs;

    function isValid() {

        if (!bindingModel.UserName)
        {

        }
        return true;
    };
    function submit() {
        console.log(bindingModel);
        if (isValid()) {
            Global.CallServer('/Account/LogIn/', function (response) {
                console.log(response);
                if (!response.IsError) {
                    location.href = '/';
                    //
                } else {
                    alert('UserName and Password does not match.')
                }
            }, noop, bindingModel);
        }
        return false;
    };
    this.User = {};
    this.Events = new function () {
        form.submit(submit);
        inputs=Global.Form.Bind(bindingModel, form);
    };
};