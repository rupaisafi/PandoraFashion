Controller = new function () {
    var windowModel, formModel = {}, callerOptions = {};
    var error = new function () {
        this.Save = function (response) {
            if (response.Id == -1 && response.Data) {
                alert('This ' + callerOptions.user + ' was not found.');
            } else if (response.Id == -2 && response.Data) {
                alert('This ' + callerOptions.user + ' is already deactivated.');
            } else {
                Global.ShowError(response.Id, { path: callerOptions.saveUrl, section: 'DeactivsteController save', user: callerOptions.user , });
            }
        };
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please wait while deactivating......');
            callerOptions.onDataBinding && callerOptions.onDataBinding(formModel);
            Global.CallServer(callerOptions.saveUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.success && callerOptions.success(response);
                    windowModel.Hide();
                } else {
                    error.Save(response);
                }
            }, function (response) {
                windowModel.Free();
                alert('Network error in path "' + callerOptions.saveUrl + '" and in section "DeactivsteController save".');
            }, formModel, 'POST')
        }
        return false;
    };
    function cancel() {
        windowModel.Hide();
    };
    function populateModel(model) {
        model = model || {};
        formModel.Id = model.Id;
        formModel.Comment = '';
        formModel.title = (callerOptions.title || callerOptions.user || formModel.title);
    };
    this.Show = function (options) {
        callerOptions = options || {};
        if (windowModel) {
            windowModel.Show();
            populateModel(callerOptions.model);
        } else {
            Global.LoadTemplate('/Templates/Remove.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: 400 });
                windowModel.View.find('.btn_cancel').click(cancel);
                windowModel.View.find('form.form-horizontal.smart-form').submit(function () {
                    setTimeout(save, 0);
                    return false;
                });
                var inputs = Global.Form.Bind(formModel, windowModel.View);
                populateModel(callerOptions.model);
                windowModel.Show();
            }, function (response) {
            });
        }
    };
};