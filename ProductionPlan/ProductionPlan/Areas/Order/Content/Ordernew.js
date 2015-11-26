var Order = new function () {
  var that = this;
  this.Grid = new function () {
    var grid = this, view, gridModel, editableModel;
    function getBackgroundColor(model) {
      model.ProductionStartAT = model.ProductionStartAT ? parseInt(model.ProductionStartAT.substring(6)) : null;
      model.CurrentDate = model.CurrentDate ? parseInt(model.CurrentDate.substring(6)) : null;
      model.DeliveryDate = model.DeliveryDate ? parseInt(model.DeliveryDate.substring(6)) : null;

      if (model.Completed && model.ProductionStartAT) {
        model.ProductionAccuracy = model.Completed / (model.CurrentDate - model.ProductionStartAT);
        model.NeedAccuracy = model.Quantity / (model.DeliveryDate - model.ProductionStartAT);
        model.BackgroundColor = model.ProductionAccuracy > model.NeedAccuracy ? 'blue' : model.ProductionAccuracy < model.NeedAccuracy ? 'red' : 'yellow';
      } else {
        model.BackgroundColor = 'yellow';
      }

    };
    function bind(data) {
      var form = $('#order_container_ul');
      form.empty();
      if (data) {
        data.each(function () {
          this.CompletedP = (this.Completed / this.Quantity) * 100;
          getBackgroundColor(this);
          form.append(template(this));
          console.log(this);
        });
      }
    };
    this.Load = function () {
      //var form = $(this).addClass('loading').closest('form').addClass('loading');
      Global.CallServer('/Orders/Get/', function (response) {
        //form.removeClass('loading');
        if (!response.IsError && response.Data) {
          bind(response.Data);
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
    function onDetails() {
      Global.Controller.Call({
        url: '/Areas/Order/Content/Details.js',
        functionName: 'Show',
        options: {
          model: this,
          onSaveSuccess: function () {
            //that.Grid.Reload();
          }
        }
      });
    };
    function template(model) {
      var template = $('<li>' +
      '<div class="item row">' +
          '<div class="color ' + model.BackgroundColor + ' col-md-3 btn_edit">' +
          '</div>' +
          '<div class="details col-md-9">' +
              '<div class="title btn_edit">' + model.Buyer + '</div>' +
              '<div class="progress ' + model.BackgroundColor + '" style="">' +
                  '<div class="progress-bar" style="width:' + model.CompletedP + '"></div>' +
              '</div>' +
              '<div class="Setting">Setting</div>' +
              '<div class="Share">Share</div>' +
          '</div>' +
      '</div>' +
  '</li>').data('model', model);
      template.find('.btn_edit').click(function () { onDetails.call(model); });
      return template;
    };
    this.SetPageModel = function (model) {
      model.SortBy = model.SortBy || '';
      grid.Bind(model);
    };
    this.Reload = function () {
      gridModel.Reload();
    };
    this.Load();
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
        url: '/' + name + 's/Get',
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
        url: '/Areas/Order/Content/Add.js',
        functionName: 'Show',
        options: {
          model: model,
          onSaveSuccess: function () {
            //that.Grid.Reload();
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
