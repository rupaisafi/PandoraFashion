var Controller = new function () {
    this.Wait = true;
    var that = this, view = $('<div class="add_view">'), formModel = {}, activeSave, IsNew = true, searchingForm, windowModel, callerOptions, formInputs;
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
            windowModel.Wait();
            var saveUrl = '/Orders/Create';
            if (IsNew) {
                formModel.Comment = formModel.Id = undefined;
            } else {
                saveUrl = '/Orders/SaveChange';
            }
            var deliveryDate = formModel.DeliveryDate.split('/'), model = Global.Copy({}, formModel, true);
            model.DeliveryDate = deliveryDate[1] + '/' + deliveryDate[0] + '/' + deliveryDate[2];
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
    function search() {
        activeSave = false;
        var form = $(this).addClass('loading').closest('form').addClass('loading');
        Global.CallServer('/CitizenData/Get', function (response) {
            form.removeClass('loading');
            if (!response.IsError && response.Data) {
                activeSave = true;
                formModel.Postname = response.Data.Postname;
                formModel.Surname = response.Data.Surname;
                formModel.CitizenId = response.Data.ApplicationNumber;
                formModel.IdNumber = response.Data.IdNumber;
                view.find('img.citizen_img')[0].src = '/Citizens/GetFacialImage/' + response.Data.ApplicationNumber;
                return;
            } else {
                !response.Data && (response.ID = -1);
                error.Search(response);
            }
        }, function (response) {
            response.ID = -50;
            error.Search(response);
            form.removeClass('loading');
        }, { IdNumber: formModel.Search }, 'POST')

        return false;
    };
    function cancel() {
        activeSave = false;
        windowModel.Hide(function () {
           // windowModel.View.find('img.citizen_img')[0].src = '/Content/Images/Icons/noCitizenPhoto.png';
        });
        document.title = 'Order List';
    };
    function populate(model) {
        model = model || {};
        var newModel = {};

        model.SectorId = model.SectorId.trim();
        model.DistrictId = model.DistrictId.trim();

        formModel.Id = model.Id;
        formModel.CitizenId = model.CitizenId;
        formModel.Postname = model.Postname||'';
        formModel.Surname = model.Surname||'';
        formModel.Phone = newModel.Phone = model.Phone || '';
        formModel.Email = newModel.Email = model.Email || '';
        formModel.SectorId = newModel.SectorId = model.SectorId;
        formModel.DistrictId = newModel.DistrictId = model.DistrictId;
        formModel.StartDate = newModel.StartDate = model.StartDate ? new Date(parseInt(model.StartDate.substring(6))).format('dd/MM/yyyy') : '';
        formModel.IsDeleted = newModel.IsDeleted = model.IsDeleted;
        formModel.Comment = JSON.stringify(newModel);
        dropDownList.Model = model;
        console.log(formModel);
        $(formInputs['DistrictId']).change();
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
    function show(model, template) {
        windowModel.Show();
        searchingForm = searchingForm || view.find('.form-search');
        if (model)
        {
            activeSave = true;
            IsNew = false;
            document.title = formModel.Title = 'Edit SectorExecutiveOfficer';
            searchingForm.hide();
            //view.find('img.citizen_img')[0].src = '/Citizens/GetFacialImage/' + model.CitizenId + '?' + new Date().getTime()
            populate(model);
        } else
        {
            activeSave = false;
            document.title = formModel.Title = 'Add New SectorExecutiveOfficer';
            IsNew = true;
            searchingForm.show();
            model = { Postname: '', Surname: '', Phone: '', Email: '', StartDate: '', Search: '', DistrictId: '', SectorId: '' };
            populate(model);
            //view.find('img.citizen_img')[0].src = '/Content/Images/Icons/noCitizenPhoto.png';
        }
        
        
    }
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Areas/Order/Templates/Add.html', function (response) {
                Global.Free();
                windowModel = Global.Window.Bind(response);
                view = windowModel.View.find('.form');
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
                view.find('#btn_Add_new').click(onShowBuyer);
                view.find('.formContainer form.middleForm').submit(function () { setTimeout(save, 0); return false; });
                dropDownList.Bind();
            }
        };
    };
};

