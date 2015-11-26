var Employee = new function () {
    var that = this, name = 'Employee';
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
                url: '/Areas/Employee/Content/Details.js',
                functionName: 'Show',
                options: {
                    model: { employeeId: model.Id }
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
                this.CreatedAt = new Date(parseInt(this.CreatedAt.substring(6))).format('dd/MM/yyyy');
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
                columns: [{ field: 'Name', title: 'Name' },//, filter: onFullNameFilter, sortField: 'Surname', click: onDetails
                    { field: 'BarCode', title: 'CodeNumber' },
                    { field: 'Phone', title: 'Phone' },
                    { field: 'Email', title: 'Email' },
                { field: 'Address', title: 'Address' },
                { field: 'Role', title: 'Role' },
                { field: 'CreatedAt', title: 'CreatedAt' }],
                url: '/'+name+'s/Get',
                action: {
                    title: {
                        items: [1, 5, 10, 25, 50, 100],
                        selected: page.PageSize || 10,
                        baseUrl: '/' + name + 's',
                        showingInfo: 'Showing {0} to {1}  of {2}  ' + name + 's'
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
        function show(model) {
            Global.Controller.Call({
                url: '/Areas/' + name + '/Content/Add.js',
                functionName: 'Show',
                options: {
                    model: model,
                    onSaveSuccess: function () {
                        that.Grid.Reload();
                    }
                }
            });
        };
        this.Open = function (model) {
            show(model);
        };
        this.Events = new function () {
            $('#btn_Add_new').click(function () { show() });
        };
    };
    this.Events = new function () {

    }
};
