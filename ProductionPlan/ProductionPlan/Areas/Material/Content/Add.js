var Controller = new function () {
    this.Wait = true;
    var that = this, view = $('<div class="add_view">'), formModel = {}, activeSave, IsNew=true, oldTitle = document.title, windowModel, callerOptions, formInputs;
    var error = new function () {
        this.Save = function (response, path) {
            windowModel.Free();
            if (response.Id == -9 && response.Data && response.Data.length) {
                alert('This person is already a "' + response.Data[0].RoleName + '". First remove from "' + response.Data[0].RoleName + '" and then try again.');
            } else if (response.Id == -4 && response.Data) {
                alert('This sector has already a SectorExecutiveOfficer by named "' + response.Data.Name + '".');
            } else if (response.Id == -39 || response.Id == -27) {
                alert('Email and phone number are duplicate.');
            } else if (response.Id == -13 || response.Id == -25) {
                alert('Phone number is already exist.');
            } else if (response.Id == -14 || response.Id == -26) {
                alert('Email is already exist.');
            } else {
                Global.ShowError(response.Id, { path: path, section: 'SectorExecutiveOfficer.Add', user: 'CivilRegistrar', });
            }
        };
        this.Load = function (response) {
            windowModel.Free();
            Global.Error.Show(response, { path: '/SectorExecutiveOfficer/GetDoctorWithImage', section: 'AddController loadDoctorDetails', user: 'SectorExecutiveOfficer', });
        };
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var saveUrl = '/Materials/Create';
            if (IsNew) {
                formModel.Comment = formModel.Id = undefined;
            } else {
                saveUrl = '/Materials/SaveChange';
            }
            var deliveryDate = formModel.DeliveryDate.split('/'), model = Global.Copy({}, formModel, true);
            model.DeliveryDate = deliveryDate[1] + '/' + deliveryDate[0] + '/' + deliveryDate[2];
            callerOptions.onSave && callerOptions.onSave(model);
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
           // windowModel.View.find('img.citizen_img')[0].src = '/Content/Images/Icons/noCitizenPhoto.png';
        });
        document.title = oldTitle;
    };
    function populate(model) {
        model = model || {};
        Global.Copy(formModel, model, true);
        dropDownList.Model = model;
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
                Id: 'OrderId', url: '/DropDown/Order',
            });
            bindDropDownList({
                Id: 'SellerId', url: '/DropDown/Seller',
            });
        };
    };
    function show(model, template) {
        windowModel.Show();
        oldTitle = document.title;
        if (!model.IsNew)
        {
            IsNew = false;
            document.title = formModel.Title = 'Edit Material';
            populate(model);
        } else
        {
            formModel.Amount = (model.Quantity * 1.2).toFixed(2);
            activeSave = false;
            document.title = formModel.Title = 'Add New Material';
            IsNew = true;
            model = { Quentity: model.Quantity, PerItem: 1.2, DeliveryDate: '', Description: '' };
            populate(model);
            //view.find('img.citizen_img')[0].src = '/Content/Images/Icons/noCitizenPhoto.png';
        }
        
        
    }
    function onShowSeller() {
        Global.Controller.Call({
            url: '/Areas/Seller/Content/Add.js',
            functionName: 'Show',
            options: {
                onSaveSuccess: function (response) {
                    $(formInputs['SellerId']).append('<option value="' + response.Data.Id + '">' + response.Data.Name + '</option>').val(response.Data.Id);
                }
            }
        });
    };
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Areas/Material/Templates/Add.html', function (response) {
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
        function onChangePerItem() {
            var ammount = parseFloat(this.value);
            if (ammount) {
                ammount = (ammount * callerOptions.model.Quantity).toFixed(2);
                $(formInputs['Amount']).val(ammount);
            } else {
                $(formInputs['Amount']).val(0);
                this.value = 0;
            }
        };
        function onChangeAmount() {
            var ammount = parseFloat(this.value);
            if (ammount) {
                console.log({ ammount: ammount, Quentity: formModel.Quantity });
                ammount = (ammount / callerOptions.model.Quantity).toFixed(2);
                $(formInputs['PerItem']).val(ammount);
            } else {
                $(formInputs['PerItem']).val(0);
                this.value = 0;
            }
        };
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, view);
                view.find('.btn_cancel').click(cancel);
                view.find('#btn_Add_new').click(onShowSeller);
                view.find('.formContainer form.middleForm').submit(function () { setTimeout(save, 0); return false; });
                dropDownList.Bind();
                $(formInputs['PerItem']).change(onChangePerItem);
                $(formInputs['Amount']).change(onChangeAmount);
            }
        };
    };
};

