var Controller = new function () {
    this.Wait = true;
    var that = this, view = $('<div class="add_view">'), formModel = {}, activeSave, oldTitle = document.title, IsNew = true, windowModel, callerOptions, formInputs;
    var error = new function () {
        this.Load = function (response) {
            windowModel.Free();
            Global.Error.Show(response, { path: '/SectorExecutiveOfficer/GetDoctorWithImage', section: 'AddController loadDoctorDetails', user: 'SectorExecutiveOfficer', });
        };
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
        formModel.Id = model.Id;
        formModel.CreatedById = model.CreatedById;
        formModel.Name = model.Name || '';
        formModel.Phone = model.Phone || '';
        formModel.Email = model.Email || '';
        formModel.CreatedBy = model.CreatedBy || '';
        formModel.Description = model.Description || '';
        formModel.CreatedAt = model.CreatedAt ? new Date(parseInt(model.CreatedAt.substring(6))).format('dd/MM/yyyy') : '';
    };
    function loadBuyer(id) {
        Global.CallServer('/Sellers/Details/' + id, function (response) {
            //form.removeClass('loading');
            if (!response.IsError && response.Data) {
                populate(response.Data);
                //view.find('img.citizen_img')[0].src = '/Citizens/GetFacialImage/' + response.Data.ApplicationNumber;
                return;
            } else {
                !response.Data && (response.ID = -1);
                //error.Search(response);
            }
        }, function (response) {
            response.ID = -50;
            //error.Search(response);
            //form.removeClass('loading');
        }, {}, 'POST')
    };
    function show(model, template) {
        oldTitle = document.title;
        document.title = 'Seller Details';
        windowModel.Show();
        console.log(model)
        loadBuyer(model.Id)
    }
    function onShowUserDetails() {
        Global.Controller.Call({
            url: '/Areas/Employee/Content/Details.js',
            functionName: 'Show',
            options: {
                model: { employeeId: formModel.CreatedById }
            }
        });
    };
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Areas/Seller/Templates/Details.html', function (response) {
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
                view.find('#btn_user_details').click(onShowUserDetails);
            }
        };
    };
};

