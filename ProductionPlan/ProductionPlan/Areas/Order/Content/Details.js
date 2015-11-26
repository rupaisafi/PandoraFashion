var Controller = new function () {
    this.Wait = true;
    var that = this, view = $('<div class="add_view">'), formModel = {}, activeSave, oldTitle = document.title, IsNew = true, searchingForm, windowModel, callerOptions, formInputs;
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
        //var newModel = {};

        formModel.Id = model.Id;
        formModel.DeliveryDate = model.DeliveryDate ? new Date(model.DeliveryDate).format('dd/MM/yyyy') : '';
        formModel.ProductionStartAT = model.ProductionStartAT ? new Date(model.ProductionStartAT).format('dd/MM/yyyy') : '';
        formModel.Quantity = model.Quantity || '';
        formModel.Buyer = model.Buyer || '';
        formModel.Style = model.Style || '';
        formModel.Size = model.Size || '';
        formModel.Completed = model.Completed ? new Date(model.Completed).format('dd/MM/yyyy') : '';
        formModel.Color = model.Color || '';
        formModel.OrderDate = new Date(parseInt(model.OrderDate.substring(6),10)).format('dd/MM/yyyy');
        formModel.Description = model.Description || '';
        formModel.CodeNumber = model.CodeNumber || '';
    };
    function show(model, template) {
        oldTitle = document.title;
        document.title = 'Order Details';
        windowModel.Show();
        materials.Grid.Bind(model.Id);
        populate(model);
    }
    function onShowBuyer() {

        Global.Controller.Call({
            url: '/Areas/Buyer/Content/Details.js',
            functionName: 'Show',
            options: {
                model: { Id: callerOptions.model.BuyerId },
                onSaveSuccess: function () {
                    //that.Grid.Reload();
                }
            }
        });
    };
    var materials = new function () {
        var that = this;
        this.Grid = new function () {
            var grid = this, view, gridModel, editableModel, page = { "SortBy": "", "IsDescending": false, "PageNumber": 1, "PageSize": 10 };
            function edit() {
                var model = $(this).closest('tr').data('model');
                editableModel = model;
                that.Add.Open(model);
            };
            function onDetails(e) {
                e.stopPropagation();
                var model = $(this).closest('tr').data('model');
                Global.Controller.Call({
                    url: 'Areas/CivilRegistry/Content/Js/SectorExecutiveOfficer/Add.js',
                    functionName: 'Show',
                    options: {
                        Id: model.Id
                    }
                });
            };
            function remove() {
                var model = $(this).closest('tr').data('model');
                if (!model.IsDeleted) {
                    Global.Controller.Call({
                        url: '/Content/Js/DeactivateController.js',
                        functionName: 'Show',
                        options: new function () {
                            this.title = 'Sector Executive Secretary ';
                            this.user = 'SectorExecutiveOfficer';
                            this.saveUrl = '/SectorExecutiveOfficers/Deactivate';
                            this.onDataBinding = function (option) {
                                option.CitizenId = model.CitizenId;
                            };
                            this.success = function () {
                                that.Grid.Reload();
                            };
                        }
                    });
                }
            };
            function rowBound(elm) {
                if (this.IsDeleted) {
                    elm.addClass('removed').find('.btn_delete').addClass('disabled');
                }
            };
            function onFullNameFilter(value) {
                value = value.split(' ');
                return [{ field: 'Surname', value: value[0] }, { field: 'Postname', value: value[1] }];

            };
            function onDataBinding(response) {
                response.Data.Data.each(function () {
                    //this.FullName = this.Surname + ' ' + this.Postname;
                    this.DeliveryDate = new Date(parseInt(this.DeliveryDate.substring(6))).format('dd/MM/yyyy');
                    this.ReceivedDate = this.ReceivedDate ? new Date(parseInt(this.ReceivedDate.substring(6))).format('dd/MM/yyyy') : '';
                });
            };
            function onShowSeller(model) {
                var model=$(this).closest('tr').data('model');
                Global.Controller.Call({
                    url: '/Areas/Seller/Content/Details.js',
                    functionName: 'Show',
                    options: {
                        model: { Id: model.SellerId },
                        onSaveSuccess: function () {
                            //that.Grid.Reload();
                        }
                    }
                });
            };
            this.SetPageModel = function (model) {
                model.SortBy = model.SortBy || '';
                grid.Bind(model);
            };
            this.Reload = function () {
                gridModel.Reload();
                return true;
            };
            this.SaveChange = function (model) {
                //editableModel && Global.Copy(editableModel, model);
                gridModel.Reload();
            };
            this.Add = function (model) {
                gridModel.Reload();
            };
            this.Bind = function (Id) {
                page.Id = Id;
                console.log(page);
                gridModel && grid.Reload() || (gridModel = Global.Grid.Bind({
                    elm: $('#material_grid'),
                    columns: [{ field: 'Seller', title: 'Seller', click: onShowSeller, filter: true },
                        { field: 'Amount', title: 'Amount', filter: true },
                        { field: 'DeliveryDate', title: 'DeliveryDate', filter: true },
                    { field: 'ReceivedDate', title: 'ReceivedDate', filter: true }],
                    exportColumns: [{ field: 'FullName', title: 'Name' },
                        { field: 'Sector', title: 'Sector', filter: true },
                        { field: 'District', title: 'District', filter: true },
                        { field: 'Phone', title: 'Phone' },
                        { field: 'Email', title: 'Email' },
                    { field: 'IsDeleted', title: 'Is Deleted?' }],
                    url: '/Materials/Get',
                    action: {
                        title: {
                            items: [1, 5, 10, 25, 50, 100],
                            selected: page.PageSize || 10,
                            baseUrl: '/Materials',
                            showingInfo: 'Showing {0} to {1}  of {2}  Sector Materials'
                        },
                        items: [{
                            click: onDetails,
                            html: '<span class="icon_container"><span class="glyphicon glyphicon-open"></span></span>',
                        }, {
                            click: edit,
                            html: '<span class="icon_container"><span class="glyphicon glyphicon-edit"></span></span>',
                        }, {
                            click: remove,
                            html: '<span class="icon_container" style="margin-left: 10px;"><span class="glyphicon glyphicon-trash"></span></span>',
                        }],
                        className: 'action width_100'
                    },
                    dataBinding: onDataBinding,
                    reportContainer: $('.breadcrumb .button_container'),
                    rowBound: rowBound,
                    page: page
                }));
            };
        };
        
        this.Add = new function () {
            var add = this;
            function show(model) {
                callerOptions.model.IsNew = true;
                Global.Controller.Call({
                    url: '/Areas/Material/Content/Add.js',
                    functionName: 'Show',
                    options: {
                        model: callerOptions.model,
                        onOpen: function (view) {
                            view.find('#order_section').remove();
                        },
                        onSave: function (model) {
                            model.OrderId = callerOptions.model.Id;
                        },
                        onSaveSuccess: function () {
                            that.Grid.Reload();
                        }
                    }
                });
            };
            this.Open = function (model) {
                show(model);
            };
            this.Bind = function (view) {
                view.find('#btn_Add_new').click(function () { show() });
            };
        };
    };
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Areas/Order/Templates/Details.html', function (response) {
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
                view.find('#btn_buyer_details').click(onShowBuyer);
                materials.Add.Bind(view);
            }
        };
    };
};

