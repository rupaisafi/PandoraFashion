var Controller = new function () {
    this.Wait = true;
    var that = this, view = $('<div class="add_view">'), formModel = {}, IsNew = true, oldTitle = document.title, windowModel, callerOptions, formInputs;
    var error = new function () {
        this.Save = function (response, path) {
            windowModel.Free();
            Global.Error.Show(response, { path: path, section: 'AddController save', user: 'Buyer', });
        };
        this.Load = function (response) {
            windowModel.Free();
            Global.Error.Show(response, { path: '/Buyers/Details', section: 'AddController Details', user: 'Buyer', });
        };
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var saveUrl = '/Buyers/Create';
            if (IsNew) {
                //formModel.Comment = formModel.Id = undefined;
            } else {
                saveUrl = '/Buyers/SaveChange';
            }
            var model = Global.Copy({}, formModel, true);
            Global.CallServer(saveUrl, function (response) {
                if (!response.IsError) {
                    windowModel.Free();
                    callerOptions.onSaveSuccess && callerOptions.onSaveSuccess(response);
                    cancel();
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -50;
                error.Save(response, saveUrl);
            }, model, 'POST');
        }
        return false;
    };
    function cancel() {
        windowModel.Hide(function () {
        });
        document.title = oldTitle;
    };
    function populate(model) {
        model = model || {};
        Global.Copy(formModel, model, true);
    };
    function show(model, template) {
        windowModel.Show();
        oldTitle = document.title;
        if (model)
        {
            IsNew = false;
            document.title = formModel.Title = 'Edit Buyer';
            populate(model);
        } else
        {
            document.title = formModel.Title = 'Add New Buyer';
            IsNew = true;
            model = { Name: '', Phone: '', Email: '', Address: '', Description: '' };
            populate(model);
        }
    }
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Areas/Buyer/Templates/Add.html', function (response) {
                Global.Free();
                windowModel = Global.Window.Bind(response);
                view = windowModel.View.find('.form');
                callerOptions.onOpen && callerOptions.onOpen(view);
                that.Events.Bind(options.model);
                show(options.model);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var evt = this, isBind = false;
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, view);
                view.find('.btn_cancel').click(cancel);
                view.find('.formContainer form.middleForm').submit(function () { setTimeout(save, 0); return false; });
            }
        };
    };
};

