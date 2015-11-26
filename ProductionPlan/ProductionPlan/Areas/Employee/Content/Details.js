var Controller = new function () {
    this.Wait = true;
    var that = this, view = $('<div class="add_view">'), formModel = {}, activeSave, IsNew = true, oldTitle = document.title, windowModel, callerOptions, formInputs;
    var error = new function () {
        this.Load = function (response) {
            windowModel.Free();
            Global.Error.Show(response, { path: '/SectorExecutiveOfficer/GetDoctorWithImage', section: 'AddController loadDoctorDetails', user: 'SectorExecutiveOfficer', });
        };
    };
    function cancel() {
        windowModel.Hide(function () {

        });
        document.title = oldTitle;
    };
    function populate(model) {
        model = model || {};
        formModel.Role = model.Role;
        formModel.Name = model.Name || '';
        formModel.Phone = model.Phone || '';
        formModel.Email = model.Email || '';
        formModel.CreatedBy = model.CreatedBy || '';
        formModel.IsActive = model.IsActive ? 'Yes' : 'No';
        formModel.CreatedAt = model.CreatedAt ? new Date(parseInt(model.CreatedAt.substring(6))).format('dd/MM/yyyy') : '';
    };
    function loadBuyer(id) {
        Global.CallServer('/Employees/Details/' + id, function (response) {
            if (!response.IsError && response.Data) {
                populate(response.Data);
                return;
            } else {
                !response.Data && (response.ID = -1);
            }
        }, function (response) {
            response.ID = -50;
        }, {}, 'POST')
    };
    function show(model, template) {
        oldTitle = document.title;
        document.title = 'Employee Details';
        windowModel.Show();
        console.log(model)
        loadBuyer(model.employeeId)
    }
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Areas/Employee/Templates/Details.html', function (response) {
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
            }
        };
    };
};

