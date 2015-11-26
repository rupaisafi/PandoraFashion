var Dashboard = new function () {
    var that = this, view = $('#page_content');
    this.Details = new function () {
        var windowModel, formModel = {};
        function close() {
            windowModel && windowModel.Hide();
        };
        function populateView(model) {
            windowModel.View.find('.detail_layer').hide();
            view.find('img')[0].src = 'data:image/jpeg;base64,' + model.Photo;
            Global.Copy(formModel, model);
        };
        function loadWorker(model) {
            Global.CallServer('/Health/Dashboard/GetWorkerDetails', function (response) {
                if (!response.IsError) {
                    populateView(response.Data);
                } else {
                    Global.ShowError(response.Id, { path: '/Health/Dashboard/GetWorkerDetails', section: 'Dashboard' });
                }
            }, function (response) {
                alert('Network error in path /Health/Dashboard/GetWorkerDetails');
                console.log(response);
            }, { workerId: model.Id }, 'POST')
        };
        this.Show = function (model) {
            if (windowModel) {
                windowModel.Show();
                windowModel.View.find('.detail_layer').show();
                loadWorker(model);
            } else {
                Global.LoadTemplate('/Areas/Health/Templates/Incharge/Details.html', function (response) {
                    windowModel = Global.Window.Bind(response);
                    windowModel.View.find('.btn_cancel').click(close);
                    view = windowModel.View.find('.formContainer form.middleForm .row');
                    Global.Form.Bind(formModel, view);
                    loadWorker(model);
                    windowModel.Show();
                }, noop);
            }
        };
    };
    var error = new function () {
        this.Summery = function (response) {
            Global.Error.Show(response, { path: '/CivilRegistry/CivilRegstrar/NewLiveBirthCount', section: 'NewLiveBirthCount' });
        };
    };
    this.Summery = new function () {
        var label2 = this, isBind, model = { RequiredWorkers: 0, ActiveWorkers: 0, InActiveWorkers: 0 }, areaView = view.find('.summary_container');
        this.Load = function () {
            Global.CallServer('/CivilRegistry/CivilRegstrar/NewLiveBirthCount', function (response) {
                if (!response.IsError) {
                    var elm = $('#notifications_container'),
                        profileHtml = elm.html(),
                        li = $('<li class="grey"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="ace-icon2"></span><span class="badge badge-important">' + response .Data+ '</span></a></li>');
                    elm.html(li).append(profileHtml);
                    that.Grid.Bind(li);
                } else {
                    error.Summery(response);
                }
            }, function (response) {
                response.Id = -50;
                
            }, { workerId: model.Id }, 'POST')
        };
        label2.Load();
    };
    this.CircleMenu = new function () {
        var label2 = this, isBind, model = { RequiredWorkers: 0, ActiveWorkers: 0, InActiveWorkers: 0 }, areaView = view.find('.item_container');
        function getInfoHTML(model, cls) {
            cls = cls || '';
            var elm = '<div class="info' + cls + '"><div class="title">' + model.title + ' </div><p>' + model.value + '</p><br></div>';
            return elm;
        };
        function createElm(model) {
            var elm = $('<div class="col-xs-12 col-sm-6 col-md-4"><a href="#"><div class="grid_4"><div class="cwrap"><div class="circle pre">' + getInfoHTML(model, ' fixed') + getInfoHTML(model) + '</div></div></div></a></div>');
            areaView.append(elm);
            return elm;
        };
        function populateView(model) {
            createElm({ title: 'Birth', value: model.Total });
            createElm({ title: 'Marriage', value: 0 });
            createElm({ title: 'Death', value: 0 });
            createElm({ title: 'Recognition of paternity', value: 0 });
            createElm({ title: 'Adoption', value: 0 });
            createElm({ title: 'Guardianship', value: 0 });
            createElm({ title: 'Acquisition of nationality', value: 0 });
        };
        this.Load = function () {
            Global.CallServer('/CivilRegistry/CivilRegstrar/AllLiveBirth', function (response) {
                if (!response.IsError) {
                    populateView(response.Data)
                } else {
                    error.Summery(response);
                }
            }, function (response) {
                response.Id = -50;
                error.Summery(response);
            }, {}, 'POST')
        };
        label2.Load();
    };
    this.Grid = new function () {
        var label2 = this;
        var grid = this, view, gridModel, editableModel,liElm;
        function onDetails(e) {
            e.stopPropagation();
            var model = $(this).closest('tr').data('model');
            Global.Controller.Call({
                url: '/Areas/CivilRegistry/Content/Js/LiveBirth/DetailsController.js',
                functionName: 'Show',
                options: {
                    Id: model.Id
                }
            });
        };
        function onApprove(e) {
            e.stopPropagation();
            var model = $(this).closest('tr').data('model');
            Global.Controller.Call({
                url: '/Content/Js/ConfirmationWindow.js',
                functionName: 'Show',
                options: new function () {
                    this.user = 'Doctor';
                    this.message = 'Are you sure you want to approve the liveBirth?'
                    this.saveUrl = '/CivilRegistry/CivilRegstrar/Approve';
                    this.data = {
                        birthId: model.Id
                    };
                    this.success = function () {
                        var elm = liElm.find('span.badge-important'), value = parseInt(elm.text(), 10);
                        elm.html(value - 1);
                        gridModel.Reload();
                    };
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
                        this.title = 'DeActivate LiveBirth';
                        this.user = 'LiveBirth';
                        this.saveUrl = '/CivilRegistry/CivilRegstrar/DeactivateLiveBirth';
                        this.onDataBinding = function (option) {
                            option.birthId = model.Id;
                        };
                        this.success = function () {
                            var elm = liElm.find('span.badge-important'), value = parseInt(elm.text(), 10);
                            elm.html(value-1);
                            grid.Reload();
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
            return [{ field: 'Surnames', value: value[0] }, { field: 'Name', value: value[1] }];

        };
        function onDataBinding(response) {
            grid.Data = {};
            response.Data.Data.each(function () {
                this.FullName = this.Surnames + ' ' + this.Name;
                grid.Data[this.Id] = this;
            });
        };
        this.Data = {};
        this.Reload = function (func) {
            gridModel.Reload(func);
        };
        function bind(elm, page) {
            gridModel = Global.Grid.Bind({
                elm: elm,
                columns: [{ field: 'FullName', title: 'Name', filter: onFullNameFilter, sortField: 'Name', className: 'width_100' },
                    { field: 'Village', title: 'Village' },
                    { field: 'HealthCenter', title: 'HealthCenter' },
                    { field: 'Hospital', title: 'Hospital' }],
                url: '/CivilRegistry/CivilRegstrar/NewLiveBirth',
                action: {
                    title: {
                        items: [1, 5, 10, 25, 50, 100],
                        selected: page.PageSize || 10,
                        baseUrl: '/',
                        showingInfo: 'Showing {0} to {1}  of {2}  liveBirths'
                    },
                    items: [{
                        click: onApprove,
                        html: '<span class="icon_container" style="margin-left: 10px;"><span class="glyphicon glyphicon-save"></span></span>',
                    }, {
                        click: onDetails,
                        html: '<span class="icon_container" style="margin-left: 10px;"><span class="glyphicon glyphicon-open"></span></span>',
                    }],
                    className: 'action width_100'
                },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                page: page
            });
        };
        this.Bind = function (li) {
            liElm = li;
            var container = $('<div class="pull-right dropdown-menu dropdown-arrow dropdown-notifications profile_form_container">');
            li.append(container);
            container.click(function (e) { e.stopPropagation(); });
            bind(container, { "SortBy": '', "PageNumber": 1, "PageSize": 10 })
        };
    };
    this.Add = new function () {
        var add = this;
        function show(model) {
            if (that.Add.Show) {
                that.Add.Show(model);
            } else {
                LazyLoading.Load(['/Areas/Health/Content/Js/Incharge/Add.js'], function () {
                    Global.LoadTemplate('/Areas/Health/Templates/Incharge/Add.html', function (response) {
                        //$(document.body).append(response);
                        that.Add.Show(model, response);
                    }, function (response) {
                    })
                })
            }
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
}

//<li class="grey"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="ace-icon2"></span><span class="badge badge-important">7</span></a></li>