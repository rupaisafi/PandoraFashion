var Global = new function ()
{
    var that = this, loadingForm, waitForm;
    this.BaseUrl = '';
    this.Form = new function ()
    {
        var label2 = this;
        function bind(model, elm, key)
        {
            model[key] = typeof model[key] ? model[key] : undefined;
            if (elm.type == 'checkbox' || elm.type == 'radio')
            {
                elm.checked = model[key];
                Object.defineProperty(model, key, {
                    get: function ()
                    {
                        return elm.checked;
                    },
                    set: function (val)
                    {
                        elm.checked = val;
                    }
                });
            } else
            {
                Object.defineProperty(model, key, {
                    get: function ()
                    {
                        return elm.value;
                    },
                    set: function (val)
                    {
                        elm.value = val;
                    }
                });
                label2.DropDownList.Bind(elm);
            }
            label2.Validation.BindElm(elm);
        };
        function bindHTML(model, elm, key)
        {
            model[key] = typeof model[key] ? model[key] : '';
            Object.defineProperty(model, key, {
                get: function ()
                {
                    return elm.innerHTML;
                },
                set: function (val)
                {
                    elm.innerHTML = val;
                }
            });
        };
        this.DropDownList = new function () {
            var label3 = this;

            function load(model) {
                that.CallServer(model.url, function (response) {
                    model.elm.empty();
                    if (!response.IsError) {
                        var data = response.Data;
                        model.elm.data('dataSource', { data: data, reLoad: function () { load(model); } });
                        for (var i = 0; i < data.length; i++) {
                            model.elm.append('<option value=' + data[i][model.valueField] + '>' + data[i][model.textField] + '</option>');
                        }
                    }else
                    {
                        that.Error.Show(response, {path:model.url,section:'DropDown',user:model.elm[0].name});
                    }
                }, function (response) {
                    response.ID = -8;
                    that.Error.Show(response, { path: model.url, section: 'DropDown', user: model.elm[0].name });
                }, '', 'GET');
            };
            this.Bind = function (elm) {
                var dataSource = elm.dataset.url;
                if (dataSource) {
                    var model = {url:dataSource, valueField: elm.dataset.valueField || 'value', textField: elm.dataset.textField || 'text' };
                    elm = $(elm);
                    model.elm = elm;
                    elm.data('dataSource', { reLoad: function () { load(model); } });
                    load(model);
                }
            }
        };
        this.Validation = new function () {
            var label3 =this, maxDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            function setValid() {
                var msg = $(this).removeClass('input-validation-error').data('validationMessage');
                msg && msg.hide();

            };
            this.SetInValid = function () {
                var elm = $(this), msg = elm.addClass('input-validation-error').data('validationMessage');
                if (msg) {
                    msg.html('<div style="position: relative;"><div style="position: absolute; top:-5px; z-index:999; white-space: nowrap;">' + this.validationMessage + '</div></div>').show();
                } else {
                    var varvalidationMessage = $('<div style="height: 0px;border: 0 none;" class="error-validation-message alert-danger"><div style="position: relative;"><div style="position: absolute; top:-5px; z-index:999; white-space: nowrap;">' + this.validationMessage + '</div></div></div>'), parent = elm.parent();
                    elm.data('validationMessage', varvalidationMessage);
                    if (parent.hasClass('input-group')) {
                        parent.after(varvalidationMessage);
                    } else {
                        elm.after(varvalidationMessage);
                    }
                }
            };
            function setInValid() {
                label3.SetInValid.call(this);
            };
            function checkForDate() {
                if (!/\d+/.test(this.value.replace(/\//g, ''))) {
                    return false;
                }
                var format = this.dataset.dateformat.split('/');
                var value = this.value.split('/');
                var obj = {};
                for (var i = 0; i < format.length; i++) {
                    obj[format[i]] = parseInt(value[i], 10);
                }
                var flag = !(obj.yyyy % 4) && obj.MM == 2 ? 1 : 0;
                if (obj.MM > 12 || obj.MM < 1) {
                    return false;
                } else if (obj.dd < 1 || obj.dd > (maxDays[obj.MM] + flag)) {
                    return false;
                } else if (obj.yyyy < 1) {
                    return false;
                }
                return true;
            };
            function checkForMaxMin() {
                var value = this.value;
                if (!/^\d+$/.test(value)) {
                    this.setCustomValidity("Invalid value.");
                    setInValid.call(this);
                    return false;
                } else if ((this.max == '0' || this.max) && parseInt(value) > parseInt(this.max)) {
                    this.setCustomValidity('Invalid! Max value is ' + this.max);
                    setInValid.call(this);
                    return false;
                } else if ((this.min == '0' || this.min) && parseInt(value) < parseInt(this.min)) {
                    this.setCustomValidity('Invalid! Min value is ' + this.min);
                    setInValid.call(this);
                    return false;
                }
                setValid.call(this);
                return true;
            };
            function checkForPhoneNumber() {
                var value = this.value;
                if (value[0] !== '0' || value[1] != 7) {
                    this.setCustomValidity("PhoneNumber should be started with \"07\".");
                    setInValid.call(this);
                    return false;
                } else if (value.length != 10) {
                    this.setCustomValidity("Phone number should be 10 charecters long.");
                    setInValid.call(this);
                    return false;
                } else if (!/^[0][7][\d]{8}$/.test(value)) {
                    this.setCustomValidity("Invalid Phone number.");
                    setInValid.call(this);
                    return false;
                }
                return true;
            };
            function checkForCustomValidation() {
                if (this.type == 'email' && this.value && !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.value)) {
                    this.setCustomValidity("The email format is invalid.");
                    setInValid.call(this);
                    return false;
                } else if (this.dataset.dateformat && !checkForDate.call(this)) {
                    this.setCustomValidity("Invalid date. Your date should be " + this.dataset.dateformat + ' format.');
                    setInValid.call(this);
                    return false;
                } else if (this.dataset.minlength && this.value.length < this.dataset.minlength) {
                    this.setCustomValidity("Text should be minimum " + this.dataset.minlength + " characters.");
                    setInValid.call(this);
                    return false;
                } else if (this.maxLength > 0 && this.value.length > this.maxLength) {
                    this.setCustomValidity("Text should be maximum " + this.maxLength + " characters.");
                    setInValid.call(this);
                    return false;
                } else if (this.type == 'tel' && this.value && !checkForPhoneNumber.call(this)) {
                    return false;
                }
                    //else if (this.type == 'number') {
                    //    if (!/^\d+$/.test(this.value)) {
                    //        this.setCustomValidity("Invalid! Value should be number only.");
                    //        setInValid.call(this);
                    //        return false;
                    //    }
                    //}
                else if ((this.max == '0' || this.min == '0' || this.max || this.min) && !checkForMaxMin.call(this)) {
                    return false;
                }
                setValid.call(this);
                return true;
            };
            function checkValidation() {
                var elm = $(this), defaultAttrValues = elm.data('defaultValidationValues');
                for (var attr in defaultAttrValues) {
                    this[attr] = defaultAttrValues[attr];
                }
                this.setCustomValidity("");

                if (this.checkValidity()) {
                    return checkForCustomValidation.call(this);
                } else {
                    setInValid.call(this);
                    return false;
                }
            };
            this.Bind = function (model, inputs) {
                Object.defineProperty(model, 'IsValid', {
                    get: function () {
                        var isValid = true;
                        inputs.each(function () {
                            isValid = checkValidation.call(this) && isValid;
                        });
                        return isValid;
                    },
                    set: function (val) {
                        alert('You can not set this attributes. Its only readable.');
                    }
                });
            };
            this.BindElm = function (input) {
                var defaultValues = { max: input.max, min: input.min, type: input.type, required: input.required };
                input.maxLength > 0 && (defaultValues.maxLength = input.maxLength);
                $(input).focus(setValid).blur(checkValidation).data('defaultValidationValues', defaultValues);
                if (input.dataset.dateformat) {
                    DatePicker.Bind($(input), { format: input.dataset.dateformat });
                }
            };
        };
        this.Bind = function (model, form)
        {
            var elmModel = {},validationInputs=[];
            form.find('input,select,textarea').each(function ()
            {
                var key = this.dataset.binding;
                elmModel[key] = this;
                validationInputs.push(this);
                key && bind(model, this, key);
            });
            form.find('.auto_bind').each(function ()
            {
                var key = this.dataset.binding;
                key && bindHTML(model, this, key);
            });
            label2.Validation.Bind(model, validationInputs);
            return elmModel;
        };
    };
    this.Copy = function (toModel, fromModel,isNotDeep)
    {
        for (var key in fromModel)
        {
            if (typeof fromModel[key] == 'object' && fromModel[key] != null && !isNotDeep)
            {
                toModel[key] = toModel[key] || {};
                that.Copy(toModel[key], fromModel[key]);
            } else
            {
                toModel[key] = fromModel[key];
            }
        }

        return toModel;
    };
    this.Busy = function (msg)
    {
        if (!loadingForm)
        {
            loadingForm = $('<div class="loading_container">' +
                            '<div class="loading_img">' +
                            '</div>' +
                            '<div class="layer">' +
                            '</div>' +
                            '<div class="text">' +
                            '</div>' +
                        '</div>');

            loadingForm.find('.layer').css({
                'background-color': 'white',
                'height': '100%',
                'left': '0',
                'opacity': '0.4',
                'position': 'fixed',
                'top': '0',
                'width': '100%',
                'z-index': '9999990'
            });
            loadingForm.find('.loading_img').css({
                'background-image': 'url("/Content/Images/loading_img.gif")',
                'background-repeat': 'no-repeat',
                'background-position': 'center center',
                'height': '100%',
                'left': '0',
                'position': 'fixed',
                'top': '0',
                'width': '100%',
                'z-index': '9999999'
            });
            $(document.body).append(loadingForm);
        }
        loadingForm.show();

    };
    this.Wait = function (text) {
        if (!waitForm) {
            waitForm = $('<div style="position: absolute; width: 100%; height: 100%; z-index: 9999999; top: 0px; left: 0px;"> <div style="text-align: center; width: 100%; height: 100%; background-color: rgb(106, 195, 152); opacity: 0.4; position: absolute; top: 0px; left: 0px; z-index: -1;"></div><div style="text-align: center; color: rgb(51, 51, 51); padding: 10px 0px 0px;"><span style="padding: 10px 0px 10px 30px; background-image: url(&quot;/Content/Images/loading_img.gif&quot;); background-size: 50px auto; background-repeat: no-repeat; background-position: -12px -16px;">Please wait while saving....</span></div></div>');
            $(document.body).append(waitForm);
        }
        text = text || 'Please wait while loading template....';
        waitForm.show().find('span').html(text);
    };
    this.Free = function ()
    {
        loadingForm && loadingForm.hide();
        waitForm && waitForm.hide();
    };
    this.CallServer = function (urlPath, success, error, data, type, dataType,async) {
        $.ajax({
            url: that.BaseUrl + urlPath,
            type: type || "POST",
            data: JSON.stringify(data || {}),
            contentType: 'application/json',
            dataType: dataType || "json",
            success: success || function() {},
            error: error || function() {},
            async: async ? false : true
        });
    };
    this.CallServerOption = function (option) {
        $.ajax({
            url: that.BaseUrl + option.url,
            type: option.type || "POST",
            data: JSON.stringify(option.data || {}),
            contentType: 'application/json',
            dataType: option.dataType || "json",
            success: function (response) {
                if (!response.IsError) {
                    typeof option.success == 'function' && option.success(response);
                } else {
                    option.path = option.url;
                    option.Error = response.Data;
                    that.Error.Show(response, option);
                    typeof option.error == 'function' && option.error(response);
                }
            },
            error: function (response) {
                response.ID = -50;
                that.Error.Show(response, option);
                typeof option.error == 'function' && option.error(response);
            },
        });
    };
    this.LoadTemplate = function (urlPath, success, error) {
        console.log(that.BaseUrl);
        $.ajax({
            url: that.BaseUrl + urlPath,
            type: "GET",
            success: success || function () { },
            error: error || function () { },
        });
    };
    this.Error = new function () {
        function showValidationError(options) {
            alert('Valiation error has occured');
            if (options.inputModel && options.Error && options.Error.length) {
                options.Error.each(function () {
                    var fields = this.Field.split('.'), input;
                    fields.each(function () {
                        input = (input && input[this]) || options.inputModel[this];
                        //console.log(input);
                    });
                    input &&
                    input.validationMessage != undefined &&
                    input.setCustomValidity &&
                    (input.setCustomValidity(this.Message), that.Form.Validation.SetInValid.call(input));
                });
            }
        };
        function showExistanceError(response, options) {
            var roleName = options.user;
            if (response.Data && response.Data.Model && response.Data.Model[0] && response.Data.Model[0].RoleName)
            {
                roleName = response.Data.Model[0].RoleName;
            }
            alert('This user is already a "' + roleName + '".');
        };
        function showNotFoundError(response, options) {
            var user = options.user || 'Data';
            alert(user + ' could not found.');
        };
        function showInterNalServerError(response, options) {
            var path = options.path ? ' in path "' + options.path + '"' : '';
            alert('Internal server error occurs' + path + '.');
        };
        this.Show = function (response, options) {
            console.log(response);
            options = options || {};
            var value = response.ID;
            if (value == -1) {
                alert('You are not logedIn.');
            } else if (value == -2) {
                alert('You called to a unauthorized url.');
            } else if (value == -3) {
                showNotFoundError(response, options);
            } else if (value == -4) {
                showExistanceError(response, options);
            } else if (value == -5) {
                showValidationError(options);
            } else if (value == -6) {
                showInterNalServerError(response, options)
            } else if (value == -7) {
                alert('Can\'t create ' + options.user + '.');
            } else if (value == -8) {
                alert('Network Error in path "' + (options.path || '') + '".');
            } else if (value == -30) {
                alert('This ' + (options && options.user || 'item') + ' does not exist.');
            }
        };
    };
    this.ShowError = function (value,options) {
        that.Error.Show({ ID: value }, options);
        //console.log(options);
    };
    this.Window = new function () {
        var wnd = this, layer = $('<div class="window_layer">').hide().css({ left: '100%' }), zIndex = { layer: 100, window: 999 }, stack = [];
        function setZIndex(model) {
            model.zIndex = that.Copy({}, zIndex);
            var newArr = [];
            stack.each(function () { this.Id != model.Id && newArr.push(this) });
            stack = newArr;
            stack.push(model);
            zIndex.layer = zIndex.window + 1;
            zIndex.window = zIndex.layer + 1;
        };
        function createWindowWithOptions(view, options) {
            var model = this;
            this.Id = Math.random();
            this.View = $('<div class="new_window"><div class="form_container"><div class="form" style="width:auto; left: 0"></div></div></div>').hide();
            var form = model.FormView = model.View.find('.form').append(view);
            this.Show = function (func) {
                func = func || noop;
                setZIndex(model);
                var width = options.width;
                options.width && form.css({ width: (options.width) + 'px' });
                model.View.css({'z-index': zIndex.window }).fadeTo(200, 1, function () {
                    func();
                });
                layer.css({ 'z-index': zIndex.layer, left: 0 }).fadeTo(200, 0.6);
                setPositions(model);
                setScroll(model);
            };
            this.Hide = function (func) {
                zIndex = stack.length ? stack.pop().zIndex : zIndex;
                func = func || noop;
                model.View.fadeOut(200, function () {
                    func();
                });
                if (stack.length) {
                    layer.animate({ 'z-index': zIndex.layer });
                } else {
                    layer.fadeOut(200, function () {
                        layer.css({ left: '100%', display: 'none' })
                    });
                }
            };
            this.Wait = function (text) {
                if (!model.waitElm) {
                    model.waitElm = $('<div style="position: absolute; width: 100%; height: 100%; z-index: 9999999; top: 0px; left: 0px;"> <div style="text-align: center; width: 100%; height: 100%; background-color: rgb(106, 195, 152); opacity: 0.4; position: absolute; top: 0px; left: 0px; z-index: -1;"></div><div style="text-align: center; color: rgb(51, 51, 51); padding: 10px 0px 0px;"><span style="padding: 10px 0px 10px 30px; background-image: url(&quot;/Content/Images/loading_img.gif&quot;); background-size: 50px auto; background-repeat: no-repeat; background-position: -12px -16px;">Please wait while saving....</span></div></div>');
                    model.View.find('.form').append(model.waitElm);
                }
                text = text || 'Please wait while saving....';
                model.waitElm.find('text').html(text).show();
            };
            this.Free = function () {
                if (model.waitElm) {
                    model.waitElm.hide();
                }
            };
            $(document.body).append(model.View);
            dragable.Set(model);
        };
        function setScroll(model) {
            var scrollTop = $(document).scrollTop();
            model.View.find('.form').css({
                top: (model.top+scrollTop) + 'px',
            });
        };
        function setPositions(model) {
            var elm = model.View.find('.form'),
                width = elm.width(),
                height = elm.height(),
                windowWidth = model.View.width(),
                windowHeight = ($(window).height() - height) / 2;
            model.top = windowHeight > 30 ? windowHeight : 30;
            //console.log(height);
            elm.css({
                top: model.top + 'px',
                left: windowWidth - width > 30 ? 'calc(50% - ' + width / 2 + 'px)' : '30px'
            });
        };
        function createWindow(view) {
            var model = this;
            this.Id = Math.random();
            this.View = $('<div class="new_window"><div class="form_container"><div class="form"></div></div></div>').hide().css({ left: '100%' });
            model.FormView = model.View.find('.form').append(view);
            this.Show = function (func) {
                func = func || noop;
                setZIndex(model);
                model.View.css({ position: 'fixed', 'z-index': zIndex.window });
                model.View.show().animate({ left: 0 }, function () {
                    model.View.css({ position: 'absolute' });
                    setScroll(model);
                    func();
                });
                layer.show().css({ 'z-index': zIndex.layer }).animate({ left: 0 });
                setPositions(model);
            };
            this.Hide = function (func) {
                stack.pop();
                func = func || noop;
                model.View.css({ position: 'fixed' });
                model.View.animate({ left: '100%' }, function () {
                    model.View.css({ position: 'absolute' });
                    model.View.hide();
                    func();
                });
                if (stack.length) {
                    var lastModel = stack.pop();
                    stack.push(lastModel);
                    layer.animate({ 'z-index': lastModel.zIndex.layer });
                }else
                {
                    layer.animate({ left: '100%' }, function () {
                        layer.hide();
                    });
                }
            };
            this.Wait = function (text) {
                if (!model.waitElm) {
                    model.waitElm = $('<div style="position: absolute; width: 100%; height: 100%; z-index: 9999999; top: 0px; left: 0px;"> <div style="text-align: center; width: 100%; height: 100%; background-color: rgb(106, 195, 152); opacity: 0.4; position: absolute; top: 0px; left: 0px; z-index: -1;"></div><div style="text-align: center; color: rgb(51, 51, 51); padding: 10px 0px 0px;"><span style="padding: 10px 0px 10px 30px; background-image: url(&quot;/Content/Images/loading_img.gif&quot;); background-size: 50px auto; background-repeat: no-repeat; background-position: -12px -16px;">Please wait while saving....</span></div></div>');
                    model.View.find('.form').append(model.waitElm);
                }
                text = text || 'Please wait while saving....';
                model.waitElm.show().find('span').html(text);
            };
            this.Free = function () {
                if (model.waitElm) {
                    model.waitElm.hide();
                }
            };
            $(document.body).append(model.View);
            dragable.Set(model);
        };
        var dragable = new function () {
            var Active, offset = { left: 0, top: 0 },windowModel, boundary;
            function mouseDown(e, model) {
                windowModel = model;
                e.stopPropagation();
                e.preventDefault();
                boundary = { left: 0, top: 0, bottom: $(window).height() - 100, right: $(window).width() - model.FormView.width() };
                offset = model.FormView.offset();
                offset = { left: offset.left - e.pageX, top: offset.top - e.pageY };
                Active = true;
            };
            $(document).mousemove(function (e) {
                if (Active) {
                    e.stopPropagation();
                    e.preventDefault();
                    setReposition({ left: offset.left + e.pageX, top: offset.top + e.pageY });
                }
            });
            $(document).mouseup(function (e) {
                if (Active) {
                    e.stopPropagation();
                    e.preventDefault();
                    Active = false;
                }
            });
            function setReposition(model) {
                (model.left > boundary.right) && (model.left = boundary.right);
                (model.left < 0) && (model.left = 0);
                (model.top > boundary.bottom) && (model.top = boundary.bottom);
                (model.top < 0) && (model.top = 0);
                windowModel.FormView.css(model);
            };
            this.Set = function (model) {
                console.log(model);
                model.FormView.find('.formHeader.headerFormMenu').mousedown(function (e) { mouseDown(e, model); return false; });
            };
        };
        this.Bind = function (view,options) {
            return options ? new createWindowWithOptions(view, options) : new createWindow(view);
        };
        $(document).ready(function () {
            $(document.body).append(layer);
        });
        
    };
    this.Grid = new function () {
        var label1 = this;
        function busy(model) {
            if(!model.busyLayer)
            {
                model.busyLayer = $('<div style="position: absolute; width: 100%; height: 100%; top: 0px; z-index: 5;"><div style="width: 100%; height: 100%; position: absolute; z-index: 1; opacity: 0.4; background-color: rgb(255, 255, 255);"></div><div style="width: 100%; height: 100%; position: absolute; z-index: 2; background-image: url(\'/Content/Images/loading_line.gif\'); background-repeat: no-repeat; background-position: center center;"></div></div>');
                model.views.container.prepend(model.busyLayer);
            }
            model.busyLayer.show();
        };
        function free(model) {
            model.busyLayer && model.busyLayer.hide();
        };
        var report = new function () {
            var form;
            function submitReport(model, reportUrl) {
                if (model.response) {
                    var Header = '', objList = [];
                    if (!form)
                    {
                        form = $('<form action="/Health/Report/ExportToCSV" method="post"></form>');
                        $(document.body).append(form);
                    }
                    
                    form.html('<input type="hidden" class="column_header" name="columnHeader"/>');
                    form.attr('action', reportUrl);
                    var colomns = model.exportColumns || model.columns;
                    colomns.each(function () {
                        Header += this.title + ',';
                    });
                    model.response.Data.Data.each(function (i) {
                        var data = this, column='';
                        colomns.each(function () {
                            var text = data[this.field];
                            column += (typeof text != 'undefined' && text != null ? text : '') + ',';
                        });
                        form.append('<input type="hidden" name="columns[' + i + ']" value="' + column + '"/>');
                    });
                    form.find('.column_header').val(Header);
                    form.submit();
                }
            };
            function exportToCSV() {
                var model = $(this).parent().data('model');
                //console.log(model.response.Data.Data);
                submitReport(model, '/Report/ExportToCSV', ',');
            };
            function exportToXl() {
                var model = $(this).parent().data('model');
                //console.log(model.response.Data.Data);
                submitReport(model, '/Health/Report/ExportToXl');
            };
            this.Bind = function (model) {
                //console.log(model.reportContainer);
                if(model.reportContainer)
                {
                    model.reportContainer.data('model', model);
                    model.reportContainer.append($('<a class="btn btn-white btn-default btn_export btn-round pull-right" style="margin: 5px;"><span class="glyphicon glyphicon-export"></span>Export To CSv</a>').click(exportToCSV));
                    //model.reportContainer.append($('<a id="btn_Add_new" class="btn btn-white btn-default btn-round pull-right" style="margin-right: 5px;"><i class="ace-icon fa fa-save blue"></i>Export To Excel</a>').click(exportToXl));
                }
            };
        };
        var columns = new function () {
            function getColumn(model) {
                var data = {title: model.title || model.field || '',className: model.className || ''};
                for (var key in model){data[key] = model[key];}
                return data;
            };
            this.Get = function (model) {
                var columns = [];
                model.columns.each(function () {
                    columns.push(getColumn(this));
                });
                return columns;
            };
        };
        var pageSize = new function () {
            var label2 = this;
            function onChange() {
                var model = $(this).data('model');
                model.page.PageNumber = 1;
                model.page.PageSize = parseInt($(this).val());
                if (model.pagger && model.pagger.onChange)
                {
                    model.pagger.onChange(model.page);
                    return;
                }
                gridBody.Reload(model);
            }
            this.Create = function (model, items, selected, container, showingInfo) {
                selected = selected || items[parseInt(items.length / 2)];
                model.page = model.page || { PageNumber: 1, PageSize: selected, SortBy: '' };
                model.page.baseUrl = model.page.baseUrl || (model.action && model.action.title && model.action.title.baseUrl) || (model.pagger && model.pagger.baseUrl) || '/';
                model.page.showingInfo = showingInfo || 'Showing {0} to {1}  of {2}  items';
                var slt = $('<select class="form-control input-sm">').change(onChange).data('model', model);
                items.each(function (i) {
                    if (this == model.page.PageSize)
                    {
                        slt.append('<option selected="selected">' + this + '</option>');
                    }else
                    {
                        slt.append('<option>' + this + '</option>');
                    }
                });
                container.append(slt);
                model.PageSize = {view:slt}
            };
        };
        var header = new function () {
            var label2 = this,sortElm;
            var filter = new function () {
                function setPageModel(model, fieldModel, value) {
                    model.page = model.page || {};
                    model.page.filter = model.page.filter || [];
                    var filters = [];
                    for (var i = 0; i < model.page.filter.length; i++) {
                        if (model.page.filter[i].field != fieldModel.field) {
                            filters.push(model.page.filter[i]);
                        }
                    }
                    var filterModel={ field: fieldModel.field, value: value };
                    value && filters.push(filterModel) && fieldModel.type &&
                    (filterModel.Type = fieldModel.type, filterModel.StartDate = fieldModel.StartDate, filterModel.EndDate = fieldModel.EndDate);
                    model.page.filter = filters;
                };
                function checkForCustorField(model, fieldModel,value) {
                    if (typeof fieldModel.filter == 'function') {
                        var data = fieldModel.filter(value);
                        data && data.each(function () {
                            setPageModel(model, this, this.value);
                        });
                    } else {
                        setPageModel(model, fieldModel, value);
                    }
                };
                function submit(model, fieldModel) {
                    if (!model.onValidate || model.onValidate())
                    {
                        var value = this.parent().find('input').val();
                        checkForCustorField(model, fieldModel, value);
                        model.page.PageNumber = 1;
                        gridBody.Reload(model);
                        $(document).click();
                    }
                    return false;
                };
                function onKeyUp(e, model, fieldModel) {
                    if (e.key == 'Enter' || e.keyCode == 13 || e.which == 13)
                    {
                        submit.call(this.parent().find('.btn_submit'), model, fieldModel)
                        return false;
                    }
                };
                function onBlur(model, fieldModel) {
                    checkForCustorField(model, fieldModel, this.val());
                    return false;
                };
                function createView(model, fieldModel) {
                    var view = $('<div class="search_container datepicker datepicker-dropdown dropdown-menu datepicker-orient-right datepicker-orient-bottom"><div class="datepicker-days"><input type="text"><span class="btn_submit no_padding"><span class="search_icon" style="height: 20px; margin-top: 6px;"></span></span></div></div>');
                    this.find('div').append(view).css('position', 'relative');
                    this.data('view', view);
                    view.show().click(function (e) { e.stopPropagation() }).find('input')
                        .keyup(function (e) { onKeyUp.call($(this), e, model, fieldModel) })
                        .blur(function (e) { onBlur.call($(this), model, fieldModel) }).focus()
                        .next().click(function () { submit.call($(this), model, fieldModel) });
                    $(document).click(function () { view.hide(); });
                };
                function show(e) {
                    e.stopPropagation();
                    var elm = $(this).closest('th'), fieldModel = elm.data('model'), model = elm.parent().data('model');
                    //console.log(fieldModel);
                    var view = elm.data('view');
                    view ? view.show().find('input').focus() : createView.call(elm,model, fieldModel);
                    return false;
                };
                this.Bind = function () {
                    this.find('.icon_container').append($('<span class="search_icon"></span>').click(show)).addClass('filter_icon_container');
                };
            };
            function sort() {
                var elm = $(this),
                        fieldModel = elm.data('model'),
                        model = elm.parent().data('model'),
                        field = fieldModel.sortField || fieldModel.field;

                if (!model.onValidate || model.onValidate()) {
                    model.page = model.page || {};
                    if (model.page.SortBy != field) {
                        sortElm && sortElm.removeClass('desending asending');
                        elm.addClass('asending');
                        model.page.IsDescending = false;
                        model.page.SortBy = field;
                        sortElm = elm;
                    } else if (model.page.SortBy == field && !model.page.IsDescending) {
                        elm.removeClass('asending').addClass('desending');
                        model.page.IsDescending = true;
                        sortElm = elm;
                    } else {
                        sortElm = elm;
                        elm.removeClass('desending asending');
                        model.page.SortBy = '';
                        model.page.IsDescending = false;
                    }
                    model.page.PageNumber = 1;
                    gridBody.Reload(model);
                }
                return false;
            };
            function setActionField(model, tr) {
                var cls=model.action.className?' '+model.action.className:'';
                var th = $('<th class="dataTables_length' + cls + '" colspan="1" rowspan="1" ></th>');
                if (typeof model.action.title == 'object' && model.paggging)
                {
                    pageSize.Create(model, model.action.title.items, model.action.title.selected, th, (model.action.title.showingInfo || model.pagger.showingInfo));
                }else
                {
                    th.append(model.action.title);
                }
                return th;
            }
            this.GetTemplate = function (model) {
                model.columns = columns.Get(model);
                var tr = $('<tr role="row">').data('model', model), tHead = $('<thead>').append(tr);
                model.columns.each(function () {
                    var th;
                    if (this.sorting === false) {
                        th = $('<th colspan="1" rowspan="1" class="table_header sorting ' + this.className + '"><div>' + this.title + '<span class="icon_container"></span></div></th>').data('model', this);
                    } else
                    {
                        th = $('<th colspan="1" rowspan="1" class="table_header sorting ' + this.className + '"><div><a>' + this.title + '</a><span class="icon_container"></span></div></th>').click(sort).data('model', this);
                    }
                    tr.append(th);
                    this.filter && filter.Bind.call(th);
                    //console.log(this);
                });
                model.action && tr.append(setActionField(model,tr));
                model.header = { view: tHead };
                return tHead;
            };
        };
        var gridBody = new function () {
            var label2 = this;
            function getUrl(model) {
                if(typeof model.url=='function')
                {
                    return model.url();
                }
                return model.url;
            };
            function setActionField(model, tr) {
                var td = $('<td class="' + (model.action.className || '') + '" >');
                model.action.items.each(function () {
                    var btn = this.html ? $(this.html) : $('<input type="button" value="' + (this.text || '') + '">');
                    btn.click(this.click || noop);
                    td.append(btn);
                });
                return td;
            }
            function createRow(model) {
                var tr = $('<tr  role="row">').data('model', this), data = this, td = '';
                model.columns.each(function () {
                    var cls = this.className ? 'class="' + this.className + '"' : '';
                    var text = data[this.field];
                    text = typeof text != 'undefined' && text != null ? text : '';
                    if (typeof this.click == 'function') {
                        tr.append($('<td ' + cls + '><a data-field="' + this.field + '">' + text + '</a></td>').click(this.click))
                    } else {
                        tr.append('<td data-field="' + this.field + '" ' + cls + '>' + text + '</td>')
                    }
                });
                this.elm = tr;
                model.Body.view.append(tr);
                model.action && tr.append(setActionField(model, tr));
                (typeof model.rowBound == 'function') && model.rowBound.call(this,tr);
            }
            function createBody(model) {
                model.Body.view.empty();
                model.response.Data.Data.each(function () {
                    createRow.call(this, model);
                });
                (model.PageSize || model.pagger) && pagging.SetPagging(model);
            };
            this.Add = function (item, model) {
                createRow.call(item, model);
            };
            this.SaveChange = function (item) {
                if (item.tr && item.tr.find)
                {
                    item.tr.find('td,a').each(function () {
                        this.dataset.field && (this.innerHTML = item[this.dataset.field]);
                    });
                }
            };
            this.Reload = function (model, func) {
                if (model.isActive != false)
                {
                    busy(model);
                    var page = {
                        "SortBy": model.page.SortBy,
                        "filter": model.page.filter,
                        "IsDescending": model.page.IsDescending,
                        "PageNumber": model.page.PageNumber,
                        "PageSize": model.page.PageSize,
                        "Id": model.page.Id
                    };
                    console.log(model.page);
                    Global.CallServer(getUrl(model), function (response) {
                        if (!response.IsError) {
                            model.response = response;
                            model.dataBinding(response);
                            createBody(model);
                            model.dataBound(response);
                            typeof func == 'function' && func();
                        } else {
                            typeof model.onError == 'function' && model.onError(response);
                            Global.ShowError(response.ID, { path: model.url, section: 'Grid' });
                        }
                        free(model);
                    }, function (response) {
                        alert('Network error had occured.');
                        free(model);
                    }, page, 'POST')
                }
            };
        };
        var footer = new function () {
            this.GetTemplate = function (model) {
                var container = '';
                if (model.paggging) {
                    var showingInfo = $('<div class="col-sm-6 footer_info empty_style"><label></label></div>'), pagging, cls = 'col-sm-6';
                    container = $('<div class="row empty_style">').append(showingInfo)
                    if (!model.PageSize && model.pagger) {
                        var pagger = $('<div class="col-sm-4 dataTables_length empty_style">');
                        pageSize.Create(model, model.pagger.items, model.pagger.selected, pagger, (model.pagger.showingInfo || model.action.title.showingInfo));
                        container.append(pagger);
                        cls = 'col-sm-4';
                        showingInfo.addClass(cls);
                    }
                    pagging = $('<div class="' + cls + ' empty_style"><div class="dataTables_paginate paging_simple_numbers empty_style"><div class="pagination-container"><ul class="pagination"></ul></div></div></div>');
                    container.append(pagging);
                    model.footer = { showingInfo: showingInfo.find('label'), pagging: pagging.find('ul') }
                    model.footer.pagging.data('model', model);
                }
                return container;
            };
        };
        var templates = new function () {
            var label2 = this;
            this.Create = function (model) {
                var div = $('<div style="position: relative;">'), template = $('<div class="dataTables_wrapper form-inline no-footer">').append(div),
                    tBody = $('<tbody>').data('model',model),
                    table = $('<table class="table table-striped table-bordered table-hover dataTable no-footer" role="grid">').append(header.GetTemplate(model)).append(tBody);
                model.views = { wrapper: template, table: table, tBody: tBody, tHead: model.header,container:div };
                model.Body = { view: tBody };
                div.append(table).append(footer.GetTemplate(model));
                model.elm.append(template);
                report.Bind(model);
            };
        };
        var pagging = new function () {
            var totalItemToShow = 7;
            function createEmptyPageElm(model) {
                model.footer.pagging.append('<li class="disabled PagedList-ellipses"><a>…</a></li>');
            };
            function createPageElm(model,page, cls, text, baseUrl) {
                cls = cls ? 'class="' + cls + '"' : '';
                model.footer.pagging.append($('<li ' + cls + '>').append($('<a href="' + baseUrl + '?PageNumber=' + page + '&PageSize=' + model.page.PageSize + '&SortBy=' + model.page.SortBy + '&IsDescending=' + model.page.IsDescending + '">' + (text || page) + '</a>').click(pagging.Go).data('model', { PageNumber: page, PageSize: model.page.PageSize, SortBy: model.page.SortBy, IsDescending: model.page.IsDescending })));
            };
            function processingPageElm(model, start, end, total, baseUrl) {
                var paggingContainer = model.footer.pagging;
                paggingContainer.empty()
                if (start > 1) {
                    createPageElm(model,1, 'PagedList-skipToFirst', '««', baseUrl);
                    createPageElm(model, model.page.PageNumber - 1, 'PagedList-skipToPrevious', '«', baseUrl);
                    createEmptyPageElm(model);
                } else if (model.page.PageNumber > 1) {
                    createPageElm(model, model.page.PageNumber - 1, 'PagedList-skipToPrevious', '«', baseUrl);
                }
                for (var i = start; i <= end; i++) {
                    if (i == model.page.PageNumber) {
                        createPageElm(model, i, 'active', i, baseUrl);
                    } else {
                        createPageElm(model, i, '', i, baseUrl);
                    }
                }

                if (end < total) {
                    createEmptyPageElm(model);
                    createPageElm(model, model.page.PageNumber + 1, 'PagedList-skipToNext', '»', baseUrl);
                    createPageElm(model, total, 'PagedList-skipToLast', '»»', baseUrl);

                } else if (model.page.PageNumber < total) {
                    createPageElm(model, model.page.PageNumber + 1, 'PagedList-skipToNext', '»', baseUrl);
                }
            };
            function displayShowingDataInformation(model) {
                var start = (model.response.Data.PageNumber - 1) * model.response.Data.PageSize;
                model.page.showingInfo = model.page.showingInfo || 'Showing {0} to {1}  of {2}  items';
                model.footer.showingInfo.html(model.page.showingInfo.format(start + 1, start + model.response.Data.Data.length, model.response.Data.Total));
            };
            this.Go = function () {
                var elm = $(this), model = elm.closest('ul').data('model');
                Global.Copy(model.page, $(this).data('model'));
                if (model.pagger && model.pagger.Go)
                {
                    model.pagger.Go(model.page);
                    return false;
                }
                gridBody.Reload(model);
                return false
            };
            this.SetPagging = function (model) {
                model.page.total = model.response.Data.Total;
                var totalPage = Math.ceil(model.page.total / model.page.PageSize), start, end;
                if (totalItemToShow < totalPage && model.page.PageNumber > (totalItemToShow / 2)) {
                    end = Math.ceil(model.page.PageNumber + (totalItemToShow / 2));
                    end > totalPage && (end = totalPage);
                    start = end - 7;
                } else {
                    start = 1;
                    end = totalPage > totalItemToShow ? totalItemToShow : totalPage;
                }
                //console.log(model.page);
                processingPageElm(model, start, end, totalPage, model.page.baseUrl);
                displayShowingDataInformation(model);
            };
        };
        this.GetFooterTemplate = function (model) {
            return footer.GetTemplate(model);
        };
        this.SetPagging = function (model) {
            return pagging.SetPagging(model);
        };
        this.Bind = function (options) {
            var model = options;
            model.paggging = typeof model.paggging == 'undefined' ? true : model.paggging;
            model.dataBinding = model.dataBinding || noop;
            model.dataBound = model.dataBound || noop;
            templates.Create(model);
            gridBody.Reload(model);
            model.elm.data('model', model)
            model.Reload = function (func) {
                if (typeof model.page == 'object') {
                    model.page.PageNumber = 1;
                    model.page.SortBy = ''
                }
                gridBody.Reload(model, func);
            };
            model.Add = function (item) {
                if (typeof model.page == 'object') {
                    model.page.PageNumber = 1;
                    model.page.SortBy = ''
                }
                gridBody.Reload(model);
            };
            model.SaveChange = function () {
                if (typeof model.page == 'object')
                {
                    model.page.PageNumber = 1;
                    model.page.SortBy = ''
                }
                gridBody.Reload(model);
            };
            return model;
        };
    };
    this.Controller = new function () {
        var object = {}, label2 = this;
        function callWithLazyLoading(options) {
            that.Wait();
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = that.BaseUrl + '/Content/Js/lazyLoading.js';
            document.getElementsByTagName("head")[0].appendChild(script);
            script.onload = function () {
                LazyLoading.Load([options.url], function () {
                    object[options.url] = Controller;
                    !object[options.url].Wait && that.Free();
                    object[options.url][options.functionName] && object[options.url][options.functionName](options.options);
                    options.onComplete && options.onComplete(object[options.url]);
                });
            };
        };
        function call(options) {
            if (object[options.url]) {
                object[options.url][options.functionName](options.options);
            } else {
                that.Wait();
                LazyLoading.Load([options.url], function () {
                    object[options.url] = Controller;
                    !object[options.url].Wait && that.Free();
                    object[options.url][options.functionName] && object[options.url][options.functionName](options.options);
                    options.onComplete && options.onComplete(object[options.url]);
                });
            }
        };
        this.Call = function (options) {
            LazyLoading ? call(options) : callWithLazyLoading(options);
        };
    };
    this.ChangePassword = new function () {
        var label2 = this, windowModel, formModel = {}, inputs;
        var error = new function () {
            this.Save = function (response) {
                if (response.ID == -1) {
                    alert('Your old password is incorrect.');
                } else {
                    Global.ShowError(response.ID, { path: '/Health/Dashboard/ChangePassword', section: 'Global.Deactivate save', user: 'Global', });
                }
            };
        };
        function checkValidation() {
            var value = inputs['NewPassword'].value;
            if (!/[A-Z]/.test(value))
            {
                inputs['NewPassword'].setCustomValidity("Password should contains at least 1 upper case latter.");
                that.Form.Validation.SetInValid.call(inputs['NewPassword']);
                return false;
            }
            if (!/[a-z]/.test(value)) {
                inputs['NewPassword'].setCustomValidity("Password should contains at least 1 lower case latter.");
                that.Form.Validation.SetInValid.call(inputs['NewPassword']);
                return false;
            }
            if (!/[0-9]/.test(value)) {
                inputs['NewPassword'].setCustomValidity("Password should contains at least 1 number.");
                that.Form.Validation.SetInValid.call(inputs['NewPassword']);
                return false;
            }
            if (value != inputs['ConfirmPassword'].value) {
                inputs['ConfirmPassword'].setCustomValidity("Password and confirm password did not match.");
                that.Form.Validation.SetInValid.call(inputs['ConfirmPassword']);
                return false;
            }
            return true;
        };
        function save() {
            if (formModel.IsValid && checkValidation()) {
                Global.CallServer('/User/Account/Manage', function (response) {
                    if (!response.IsError) {
                        cancel();
                    } else {
                        error.Save(response);
                    }
                }, function (response) {
                    Global.ShowError(response);
                }, formModel, 'POST')
            }
            return false;
        };
        function cancel() {
            windowModel.Hide();
        };
        function populateModel() {
            formModel.OldPassword = '';
            formModel.NewPassword = '';
            formModel.ConfirmPassword = '';
        };
        this.Show = function () {
            console.log($('#btn_change_password'));
            populateModel();
            if (windowModel) {
                windowModel.Show();
            } else {
                that.Wait();
                Global.LoadTemplate('/Templates/ChangePassword.html', function (response) {
                    that.Free();
                    windowModel = Global.Window.Bind(response, { width: 400 });
                    windowModel.View.find('.btn_cancel').click(cancel);
                    windowModel.View.find('form.form-horizontal.smart-form').submit(save);
                    inputs = Global.Form.Bind(formModel, windowModel.View);
                    $(inputs['NewPassword']).blur(checkValidation);
                    $(inputs['ConfirmPassword']).blur(checkValidation);
                    windowModel.Show();
                }, function (response) {
                })
            }
        };
        this.Events = new function () {
            $(document).ready(function () {
                console.log($('#btn_change_password'));
                $('#btn_change_password').click(label2.Show);
            });
        };
    };
    this.Menu = new function () {
        var label2=this, view, isActive,data;
        function createItem(model) {
            var menuHtml = '<li class="menu_base"><a href="#" class="dropdown-toggle" data-toggle="dropdown">'+
                                '<span>' + model.name + '</span> <b class="caret"></b>' +
                            '</a>';
            if (model.items instanceof Array) {
                menuHtml += '<ul class="pull-right dropdown-menu dropdown-arrow dropdown-notifications profile_form_container">'
                model.items.each(function () {
                    menuHtml += '<li><a href="' + this.url + '" style="width:100%">' + this.name + '</a></li>';
                   // menuHtml += '<li class="' + (this.class || '') + '"><a href="' + this.url + '">' + this.name + '</li>';
                });
                menuHtml += '</ul>'
            }

            menuHtml += '</li>';
            view.append(menuHtml);
        };
        function set() {
            view = $('#access_menu_container').empty();
            (data||[]).each(function () {
                createItem(this);
            });
            return true;
        };
        this.Set = function () {
            data && set() || (isActive = true);
        };
        (function () {
            that.CallServer('/Menu/Get', function (response) {
                if (!response.IsError) {
                    data = response.Data;
                    isActive && set();
                } else {
                    that.Error.Show(response, { path: '/Menu/Get', section: 'Menu' });
                }
            }, function (response) {

            });
        })();
        $(document).ready(function () {
            label2.Set();
            $('#menu-toggler').click(function () {
                $('#sidebar').toggleClass('expand');
            });
        });
    };
    this.ByteToImageUrl = function (byteData) {
        byteData = byteData || [];
        var str = String.fromCharCode.apply(null, byteData);
        return 'data:image/jpeg;base64,' + btoa(str).replace(/.{76}(?=.)/g, '$&\n');
    };
    this.Uploader = new function () {
        var self = this;
        function getFormData(obj, model_data, hrk) {
            hrk = hrk || "";
            var cc = model_data;
            for (var prop in model_data) {
                if (model_data.hasOwnProperty(prop) && model_data[prop] != null && typeof model_data[prop]) {
                    if (typeof model_data[prop] == 'object' && !model_data[prop].IsFile) {
                        if (model_data[prop] instanceof Array) {
                            for (var i = 0; i < model_data[prop].length; i++) {
                                if (model_data[prop][i].IsFile) {
                                    obj.append(hrk + prop + '[' + i + ']', model_data[prop][i].File);
                                } else {
                                    getFormData(obj, model_data[prop][i], hrk + prop + '[' + i + '].');
                                }
                            }
                        } else {
                            getFormData(obj, model_data[prop], hrk + prop + '.');
                        }
                    } else {
                        if (model_data.hasOwnProperty(prop)) {
                            if (model_data[prop].IsFile) {
                                obj.append(hrk + prop, model_data[prop].File);
                            } else {
                                obj.append(hrk + prop, model_data[prop]);
                            }
                        }
                    }
                }
            }
        }
        this.upload = function (options) {
            var formData = new FormData();
            options.data = getFormData(formData, options.data);
            var xhr;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xhr = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            options.onProgress && xhr.upload.addEventListener("progress", options.onProgress, false);
            options.onComplete && xhr.addEventListener("load", function (response) {
                console.log(this)
                if (this.status == 200) {
                    options.onComplete && options.onComplete(JSON.parse(this.response));
                } else {
                    console.log(response)
                    options.onError && options.onError(this);
                }
            }, false);
            options.onError && xhr.addEventListener("error", function () { options.onError(this) }, false);
            options.onCanceled && xhr.addEventListener("abort", options.onCanceled, false);
            xhr.open("POST", that.BaseUrl + options.url);
            xhr.send(formData);
        }
    };
    this.Events = new function () {
        var allEvents = {};
        this.Set = function (key,func) {
            allEvents[key] = allEvents[key] || [];
            typeof func == 'function' && allEvents[key].push(func);
        };
        this.Fire = function (key, options) {
            allEvents[key] = allEvents[key] || [];
            allEvents[key].each(function () {
                this(options);
            });
        };
    };
    this.ConvertDateString = function (dateString) {
        dateString = dateString.split('/');
        return dateString[1] + '/' + dateString[0] + '/' + dateString[2]
    };
};

Array.prototype.each = function (func)
{
    for (var i = 0; i < this.length; i++)
    {
        func.call(this[i], i);
    }
};
Date.prototype.format = function (format) {
    var d = this;
    if (!d)
        return "";
    return format.replace(/hh|mmm|mm|MM|dd|ss|yyyy/g, function (match) {
        return d.getValue(match);
    });
};
Date.prototype.getValue = function (parm) {
    var shortMonthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    switch (parm) {
        case "mmm":
            return shortMonthName[this.getMonth()];
        case "mm":
            return parm = this.getMinutes(), parm < 10 && '0' + parm || parm;
        case "hh":
            return parm = this.getHours(), parm < 10 && '0' + parm || parm;
        case "MM":
            return parm = this.getMonth() + 1, parm < 10 && '0' + parm || parm;
            break;
        case "dd":
            return parm = this.getDate(), parm < 10 && '0' + parm || parm;
            break;
        case "ss":
            return parm = this.getSeconds(), parm < 10 && '0' + parm || parm;
            break;
        case "yyyy":
            return this.getFullYear();
            break;
    }
};
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
};
String.prototype.getBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
    }
    return bytes;
};
String.prototype.getDate = function () {
    return new Date(parseInt(this.substring(6),10));
};
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}
function convertDate(dateString) {
    dateString=(dateString+'').split('/');

    if(dateString.length!=3)
    {
        return '';
    }else
    {
        return dateString[1]+'/'+dateString[0]+'/'+dateString[2]
    }
};
function noop() { };

//default Definations getDate().format()
var LazyLoading;