var Receiving = new function () {
    var that = this, name = 'Receiving';
    this.Grid = new function () {
        var grid = this, view, gridModel, editableModel;
        function edit() {
            var model = $(this).closest('tr').data('model');
            editableModel = model;
            that.Add.Open(model);
        };
        function onDetails(e) {
            e.stopPropagation();
            var model = $(this).closest('tr').data('model');
            Global.Controller.Call({
                url: '/Areas/Bundle/Content/Receiving/Details.js',
                functionName: 'Show',
                options: {
                    Id: model.Id
                }
            });
        };
        function rowBound(elm) {
            if (this.IsDeleted) {
                elm.addClass('removed').find('.btn_delete').addClass('disabled');
            }
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                //this.DateOfBirth = new Date(parseInt(this.DateOfBirth.substring(6))).format('dd/MM/yyyy');
            });
        };
        this.SetPageModel = function (model) {
            model.SortBy = model.SortBy || '';
            grid.Bind(model);
        };
        this.Reload = function () {
            gridModel.Reload();
        };

        this.Bind = function (page) {
            gridModel = Global.Grid.Bind({
                elm: $('#table_data_container'),
                columns: [{ field: 'Style', title: 'Style' },//, filter: onFullNameFilter, sortField: 'Surname', click: onDetails
                    { field: 'Quantity', title: 'Quantity' },
                    { field: 'BarCode', title: 'CodeNumber' },
                    { field: 'KnittingMachine', title: 'KnittingMachine' },
                    { field: 'KnittingTime', title: 'KnittingTime' },
                    { field: 'Operator', title: 'Operator' },
                { field: 'Status', title: 'Status' }],
                url: '/Bundle/Receiving/Get',
                action: {
                    title: {
                        items: [1, 5, 10, 25, 50, 100],
                        selected: page.PageSize || 10,
                        baseUrl: '/Bundle/Receiving',
                        showingInfo: 'Showing {0} to {1}  of {2}  bundles'
                    },
                    items: [{
                        click: edit,
                        html: '<span class="icon_container"><span class="glyphicon glyphicon-edit"></span></span>',
                    }, {
                        click: onDetails,
                        html: '<span class="icon_container" style="margin-left: 10px;"><span class="glyphicon glyphicon-open"></span></span>',
                    }],
                    className: 'action width_100'
                },
                dataBinding: onDataBinding,
                //reportContainer: $('.breadcrumb .button_container'),
                rowBound: rowBound,
                page: page
            });
        };
    };
    this.Add = new function () {
        var add = this;
        function showError(response) {
            if(response.Id==-11)
            {
                alert('Bundle is not found.');
            } else if (response.Id == -12) {
                alert('This bundle is already received.');
            } else if (response.Id == -13) {
                alert('Employee is not found.');
            } else {
                Global.Error.Show(response, {});
            }
        }
        function save(model) {
            var bundleBarCode = $('#bundleBarCode').val();
            if (bundleBarCode) {
                //windowModel.Wait();
                var saveUrl = '/Bundle/Receiving/Save';

                Global.CallServer(saveUrl, function (response) {
                    if (!response.IsError) {
                        //windowModel.Free();
                        that.Grid.Reload();
                        //cancel();
                    } else {
                        showError(response, saveUrl);
                    }
                }, function (response) {
                    response.Id = -50;
                    showError(response, saveUrl);
                }, {  bundleBarCode: bundleBarCode }, 'POST');
            }
        };
        this.Events = new function () {
            $('#add_form').submit(function () { setTimeout(save, 0); return false; });
        };
    };
    this.Events = new function () {

    }
};
