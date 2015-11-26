var Controller = new function () {
    this.Wait = true;
    var that = this, name = 'Style', view = $('<div class="add_view">'), formModel = {}, IsNew = true, oldTitle = document.title, windowModel, callerOptions, formInputs;
    var error = new function () {
        this.Save = function (response, path) {
            windowModel.Free();
            Global.Error.Show(response, { path: path, section: 'AddController save', user: name, });
        };
        this.Load = function (response) {
            windowModel.Free();
            Global.Error.Show(response, { path: '/' + name + 's/Details', section: 'AddController Details', user: name, });
        };
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var saveUrl = '/' + name + 's/Create';
            if (IsNew) {
                //formModel.Comment = formModel.Id = undefined;
            } else {
                saveUrl = '/' + name + 's/SaveChange';
            }
            
            var shippingDate = formModel.ShippingDate.split('/'), model = Global.Copy({}, formModel, true);
            model.ShippingDate = shippingDate[1] + '/' + shippingDate[0] + '/' + shippingDate[2];
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
        var newModel = {};
        Global.Copy(newModel, model, true);
        newModel.ShippingDate = model.ShippingDate ? new Date(parseInt(model.ShippingDate.substring(6))).format('dd/MM/yyyy') : '';
        Global.Copy(formModel, newModel, true);
    };
    var dropDownList = new function () {
        var drp = this;
        this.Model = {};
        function bindDropDownList(options) {
            var elm = $(formInputs[options.Id]).empty();
            Global.CallServer(options.url, function (response) {
                response.Data.each(function () {
                    elm.append('<option value="' + this.value + '">' + this.text + '</option>');
                });
                drp.Model[options.Id] && elm.val(drp.Model[options.Id]);
                options.change && !elm.data('onChange') && (elm.change(options.change), elm.data('onChange', true));
                elm.change();
            }, function (response) {
            }, null, 'GET')
            return elm;
        };
        this.Bind = function (elm, value) {
            bindDropDownList({
                Id: 'BuyerId', url: '/DropDown/Buyer',
            });
        };
    };
    function show(model, template) {
        windowModel.Show();
        oldTitle = document.title;
        if (model)
        {
            IsNew = false;
            document.title = formModel.Title = 'Edit ' + name + '';
            populate(model);
        } else
        {
            document.title = formModel.Title = 'Add New ' + name + '';
            IsNew = true;
            model = { Name: '', Phone: '', Email: '', Address: '', Description: '' };
            populate(model);
        }
    }
    function onShowBuyer() {
        Global.Controller.Call({
            url: '/Areas/Buyer/Content/Add.js',
            functionName: 'Show',
            options: {
                onSaveSuccess: function (response) {
                    $(formInputs['BuyerId']).append('<option value="' + response.Data.Id + '">' + response.Data.Name + '</option>').val(response.Data.Id);
                }
            }
        });
    };
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Areas/' + name + '/Templates/Add.html', function (response) {
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
                view.find('#btn_Add_new').click(onShowBuyer);
                view.find('.btn_cancel').click(cancel);
                view.find('.formContainer form.middleForm').submit(function () { setTimeout(save, 0); return false; });
                dropDownList.Bind();
            }
        };
    };
};

