/// <reference path="../Templates/BarCode.html" />
var Bundle = new function () {
    var that = this, name = 'Bundle';
    this.Card = new function () {
        var card = this, frame1;
        this.Print = function () {
            Global.LoadTemplate('/Areas/Bundle/Templates/BarCode.html', function (response) {
                var frame1 = document.createElement('iframe');
                frame1.name = "frame1";
                frame1.style.position = "absolute";
                frame1.style.top = "-1000000px";
                document.body.appendChild(frame1);
                var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
                frameDoc.document.open();
                frameDoc.document.write(response);
                //frameDoc.document.write('</head><body>');
                //frameDoc.document.write(contents);
                //frameDoc.document.write('</body></html>');
                frameDoc.document.close();
                setTimeout(function () {
                    window.frames["frame1"].focus();
                    window.frames["frame1"].print();
                    document.body.removeChild(frame1);
                }, 200);
            }, function (response) {
            });
        };
    };
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
                url: '/Areas/' + name + '/Content/Details.js',
                functionName: 'Show',
                options: {
                    Id: model.Id
                }
            });
        };
        function rowBound(elm) {
            elm.find('.btn_print').attr('href', '/Bundles/Card?BundleNumber=' + this.BarCode);
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
                    { field: 'Operator', title: 'Operator' },
                { field: 'Status', title: 'Status' }],
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
                    }, {
                        click: noop,
                        html: '<a target="_blank" class="btn_print"><span class="icon_container" style="margin-left: 10px;"><span class="glyphicon glyphicon-print"></span></span></a>',
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
        function printPreview() {
                //var contents = document.getElementById("dvContents").innerHTML;
                var frame1 = document.createElement('iframe');
                frame1.name = "frame1";
                frame1.style.position = "absolute";
                frame1.style.top = "-1000000px";
                document.body.appendChild(frame1);
                var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
                frameDoc.document.open();
                frameDoc.document.write('<html><head><title>DIV Contents</title>');
                frameDoc.document.write('</head><body>');
                frameDoc.document.write(contents);
                frameDoc.document.write('</body></html>');
                frameDoc.document.close();
                setTimeout(function () {
                    window.frames["frame1"].focus();
                    window.frames["frame1"].print();
                    document.body.removeChild(frame1);
                }, 50);
                return false;
            
        };
    }
};
