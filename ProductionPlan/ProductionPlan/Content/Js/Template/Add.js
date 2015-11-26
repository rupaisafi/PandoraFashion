var Controller = new function () {
    this.Wait = true, models = {};
    function bind() {
        var that = this, formModel = {}, formInputs, windowModel, callerOptions;
        var error = new function () {
            this.Save = function (response) {
                windowModel.Free();
                callerOptions.onError && callerOptions.onError(response, 'save');
                Global.Error.Show(response, { path: callerOptions.saveUrl, section: 'AddController save', user: callerOptions.user });
            };
            this.Load = function (response) {
                windowModel.Free();
                callerOptions.onError && callerOptions.onError(response, 'load');
                Global.Error.Show(response, { path: callerOptions.loadUrl, section: 'AddController loadData', user: callerOptions.user });
            };
        };
        function save() {
            if (formModel.IsValid && (!callerOptions.onValidate || callerOptions.onValidate(formModel, formInputs, windowModel))) {
                windowModel.Wait();
                var model = Global.Copy({}, formModel, true);
                callerOptions.onSubmit && callerOptions.onSubmit(model);
                Global.CallServer(callerOptions.saveUrl, function (response) {
                    if (!response.IsError) {
                        windowModel.Free();
                        callerOptions.onSaveSuccess && callerOptions.onSaveSuccess(response);
                        cancel();
                    } else {
                        error.Save(response);
                    }
                }, function (response) {
                    response.Id = -8;
                    error.Save(response);
                }, model, 'POST');
            }
            return false;
        };
        function cancel() {
            windowModel.Hide(function () {
                callerOptions.onCancel && callerOptions.onCancel(windowModel, formInputs, formModel);
            });
        };
        function populate(model) {
            model = model || {};
            callerOptions.onPopulate && callerOptions.onPopulate(model, formModel, windowModel, formInputs);
            Global.Copy(formModel, model, true);
        };
        function loadData(model) {
            windowModel.Wait('Please wait while loading data.......');
            Global.CallServer(callerOptions.loadUrl, function (response) {
                if (!response.IsError) {
                    if (!response.Data) {
                        response.Id = -3;
                        error.Load(response);
                        return;
                    }
                    windowModel.Free();
                    populate(model);
                } else {
                    error.Load(response);
                }
            }, function (response) {
                response.Id = -8;
                error.Load(response);
            }, 'GET');
        };
        function show(model) {
            windowModel.Show();
            if (model) {
                loadData(model)
            } else {
                populate({});
            }
            callerOptions.onShow && callerOptions.onShow(windowModel, formInputs, formModel);
        }
        this.Show = function (options) {
            callerOptions = options;
            if (windowModel) {
                show(options.model);
            } else {
                Global.LoadTemplate(callerOptions.htmlUrl, function (response) {
                    Global.Free();
                    windowModel = Global.Window.Bind(response);
                    that.Events.Bind(options.model);
                    show(options.model);
                }, function (response) {
                });
            }
        }
        this.Events = new function () {
            this.Bind = function () {
                var view = windowModel.View.find('.form');
                formInputs = Global.Form.Bind(formModel, view);
                view.find('.btn_cancel').click(cancel);
                view.find('.formContainer form.middleForm').submit(function (e) {
                    e.preventDefault();
                    setTimeout(callerOptions.onSubmit || save, 0);
                    return false;
                });
            };
        };
    }
    this.Bind = function (options) {
        models[options.htmlUrl] = models[options.htmlUrl] || new bind();
        models[options.htmlUrl].Show(options);
    };
};

