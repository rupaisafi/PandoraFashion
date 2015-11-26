Controller = new function () {
    var windowModel, formModel = { }, callerOptions = {};
    function save() {
        if (formModel.IsValid) {
            callerOptions.onDataBinding && callerOptions.onDataBinding(formModel);
            Global.CallServer(callerOptions.saveUrl, function (response) {
                if (!response.IsError) {
                    callerOptions.success && callerOptions.success(response);
                    windowModel.Hide();
                } else {
                    Global.Error.Show(response, { user: callerOptions.user ||'Alien', Action: 'Approve', path: callerOptions.saveUrl });
                }
            }, function (response) {
                alert('Network error in path "' + callerOptions.saveUrl + '" and in section "ConfirmationWindow save".');
            }, callerOptions.data, 'POST')
        }
        return false;
    };
    function cancel() {
        windowModel.Hide();
    };
    function populateModel() {
        formModel.title = (callerOptions.title || 'Confirmation');
        formModel.message = (callerOptions.message || callerOptions.msg || 'Are you sure you want to this?');
    };
    this.Show = function (options) {
        callerOptions = options || {};
        if (windowModel) {
            windowModel.Show();
            populateModel();
        } else {
            Global.LoadTemplate('/Templates/ConfirmationWindow.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: 400 });
                windowModel.View.find('.btn_cancel').click(cancel);
                windowModel.View.find('.btn_save').click(save);
                var inputs = Global.Form.Bind(formModel, windowModel.View);
                populateModel();
                windowModel.Show();
            }, function (response) {
            });
        }
    };
};