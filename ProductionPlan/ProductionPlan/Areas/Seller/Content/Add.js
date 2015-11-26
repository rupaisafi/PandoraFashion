var Controller = new function () {
    this.Wait = true;
    var that = this, view = $('<div class="add_view">'), formModel = {}, activeSave, IsNew=true, oldTitle = document.title, windowModel, callerOptions, formInputs;
    var error = new function () {
        this.Search = function (response) {
            response.Data = response.Data || {};
            response.Data.Model = response.Data.Model || {};
            response.Data.Model.length
            if (response.Data.Model.length) {
                alert('This person is already a "' + response.Data.Model[0].RoleName + '". First remove from "' + response.Data.Model[0].RoleName + '" and then try again.');
            } else if (response.ID == -1) {
                alert('Citizen could not found.');
            } else {
                Global.ShowError(response.ID, { path: '/Doctor/GetCitizen', section: 'Doctor.Add search', user: 'Citizen', });
            }
            activeSave = false;
            formModel.Name = '';
            formModel.Surname = '';
            view.find('img.citizen_img')[0].src = '/Content/Images/Icons/noCitizenPhoto.png';
            console.log(response);
        };
        this.Save = function (response, path) {
            windowModel.Free();
            if (response.ID == -9 && response.Data && response.Data.length) {
                alert('This person is already a "' + response.Data[0].RoleName + '". First remove from "' + response.Data[0].RoleName + '" and then try again.');
            } else if (response.ID == -4 && response.Data) {
                alert('This sector has already a SectorExecutiveOfficer by named "' + response.Data.Name + '".');
            } else if (response.ID == -39 || response.ID == -27) {
                alert('Email and phone number are duplicate.');
            } else if (response.ID == -13 || response.ID == -25) {
                alert('Phone number is already exist.');
            } else if (response.ID == -14 || response.ID == -26) {
                alert('Email is already exist.');
            } else {
                Global.ShowError(response.ID, { path: path, section: 'SectorExecutiveOfficer.Add', user: 'CivilRegistrar', });
            }
        };
        this.Load = function (response) {
            windowModel.Free();
            Global.Error.Show(response, { path: '/SectorExecutiveOfficer/GetDoctorWithImage', section: 'AddController loadDoctorDetails', user: 'SectorExecutiveOfficer', });
        };
    };
    function save() {
        if (formModel.IsValid) {
            callerOptions.onSave && callerOptions.onSave(formModel);
            windowModel.Wait();
            var saveUrl = '/Sellers/Create';
            if (IsNew) {
                formModel.Comment = formModel.Id = undefined;
            } else {
                saveUrl = '/Sellers/SaveChange';
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
                response.ID = -50;
                error.Save(response, saveUrl);
            }, model, 'POST');
        }
        return false;
    };
    
    function cancel() {
        activeSave = false;
        windowModel.Hide(function () {
           // windowModel.View.find('img.citizen_img')[0].src = '/Content/Images/Icons/noCitizenPhoto.png';
        });
        document.title = oldTitle;
    };
    function populate(model) {
        model = model || {};
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
        if (model)
        {
            IsNew = false;
            document.title = formModel.Title = 'Edit Seller';
            populate(model);
        } else
        {
            document.title = formModel.Title = 'Add New Seller';
            IsNew = true;
            model = { Postname: '', Surname: '', Phone: '', Email: '', StartDate: '', Search: '', DistrictId: '', SectorId: '' };
            populate(model);
        }
        
        
    }
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Areas/Seller/Templates/Add.html', function (response) {
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
                dropDownList.Bind();
            }
        };
    };
};

