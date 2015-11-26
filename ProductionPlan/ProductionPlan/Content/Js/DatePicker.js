var DatePicker = new function () {
    var that = this,isActiveVisible;
    function getDefaultOption(options) {
        options = options || {};
        var option = {};
        for (var key in options) { option[key.toLowerCase()] = options[key]; }
        option.max = new Date(2200,0,1);
        return {
            value: option.value || null,
            format: option.format || 'MM/dd/yyyy',
            defaultView: option.defaultView || 'day',
            max: option.max || null,
            min: option.min || null
        };
    };
    var validation = new function () {
        var maxDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        function checkForValue(obj) {
            for (var key in obj)
            {
                if (!/^\d+$/.test(obj[key]))
                    return false;

                obj[key] = parseInt(obj[key], 10);
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
        this.GetDateObjectFromString = function (text, format) {
            var dateModel = {};
            var formatedValue = format.replace(/MM|dd|yyyy|hh|mm|ss/g, function (match, startPosition) {
                return dateModel[match] = text.substring(startPosition, (startPosition + match.length));
            });
            if(text == formatedValue && checkForValue(dateModel))
            {
                return new Date(dateModel.yyyy, dateModel.MM - 1, dateModel.dd);
            }else
            {
                return null;
            }
        };
        this.IsValid = function (model) {
            var dateModel = {}, startPosition = 0;
            this.value = this.value.trim();
        };
    };
    var objectModel = new function () {
        var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.SetDateView = function (model) {
            var endDate = new Date(model.DateModel.Date.getFullYear(), model.DateModel.Date.getMonth(), model.DateModel.Date.getDate()), today = new Date();
            var today = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime(),
                selectedDate = model.value ? model.value.getTime() : 0;
            endDate.setDate(1);
            model.DateModel.Date = new Date(endDate);
            var startDate = new Date(endDate);
            model.DateModel.Month = endDate.getMonth()
            startDate.setDate(1-startDate.getDay());
            endDate.setMonth(model.DateModel.Month + 1);
            endDate.setDate(0);
            endDate.setDate(endDate.getDate() + 6 - endDate.getDay());
            model.DateModel.tbody.empty();
            var tr = $('<tr>');
            for(;startDate<=endDate;)
            {
                var cls = startDate.getMonth() > model.DateModel.Month ? 'day new' : startDate.getMonth() < model.DateModel.Month ? 'day old' : 'day',
                    time = startDate.getTime();
                (time == selectedDate) && (cls += ' selected');
                (time == today) && (cls += ' today');
                (model.max < time) && (cls = 'disabled');
                var date = startDate.getDate();
                tr.append($('<td class="' + cls + '">' + date + '</td>').click(function () { objectModel.SelectDate.call($(this), model);}).data('date', new Date(startDate)));
                if (startDate.getDay() == 6)
                {
                    model.DateModel.tbody.append(tr);
                    tr = $('<tr>');
                }
                startDate.setDate(date + 1);
            }
            model.DateModel.title.html(monthName[model.DateModel.Month] + ' ' + model.DateModel.Date.getFullYear());
            model.DateModel.tbody.append(tr);
        };
        this.SetMonthView = function (model) {
            model.MonthModel.title.html(model.MonthModel.Date.getFullYear());
            var date = new Date(model.MonthModel.Date.getFullYear() + 1, -1);
            var td = model.MonthModel.tbody.find('td').removeClass('disabled');
            if (date.getTime() > model.max) {
                
                var i = new Date(model.max).getMonth() + 1;
                for(;i<12;i++)
                {
                    $(td[i]).addClass('disabled');
                }
            }
        };
        this.SetYearView = function (model) {
            var startYear = model.YearModel.Date.getFullYear() - 6, endYear = startYear+12;
            model.YearModel.title.html(startYear + ' - ' + (endYear-1));
            model.YearModel.tbody.empty();
            var tr = $('<tr>');
            for (var i = 1; startYear < endYear; startYear++, i++) {
                var date = new Date(startYear, 0);
                var cls = date.getTime() > model.max ? 'class="disabled"' : '';
                tr.append($('<td ' + cls + '>' + startYear + '</td>').click(function () { objectModel.SelectYear.call($(this), model); }).data('year', startYear));
                if (!(i % 3)) {
                    model.YearModel.tbody.append(tr);
                    tr = $('<tr>');
                }
            }
            model.YearModel.tbody.append(tr);
        };
        this.SetYear = function (model) {

        };
        this.SelectDate = function (model) {
            var date = this.data('date');
            if (date.getTime() > model.max)
            {
                return;
            }
            model.DateModel.tbody.find('.selected').removeClass('selected');
            this.addClass('selected');
            model.value = date;
            model.elm.val(date.format(model.format));
            model.text = model.elm.val();
            if(date.getMonth()!=model.DateModel.Month)
            {
                model.DateModel.Date.setMonth(date.getMonth());
                objectModel.SetDateView(model);
                setPosition(model);
            }
            hide(model);
        };
        this.SelectMonth = function (model) {
            var date = new Date(model.MonthModel.Date);
            date.setMonth(this.dataset.value);
            date.setDate(1);
            if (date.getTime() > model.max) {
                return;
            }
            model.DateModel.Date = model.MonthModel.Date;
            model.DateModel.Date.setMonth(this.dataset.value);
            objectModel.SwitchToDateView(model);
        };
        this.SelectYear = function (model) {
            var date = new Date(this.data('year'),0);
            if (date.getTime() > model.max) {
                return;
            }
            model.DateModel.Date = model.YearModel.Date;
            model.DateModel.Date.setFullYear(this.data('year'));
            objectModel.SwitchToMonthView(model);
        };
        this.NextMonth = function (model) {
            var date = new Date(model.DateModel.Date);
            date.setMonth(date.getMonth() + 1);
            if (date.getTime() > model.max) {
                return;
            }
            model.DateModel.Date.setMonth(model.DateModel.Date.getMonth() + 1); objectModel.SetDateView(model);
            setPosition(model);
        };
        this.PrevMonth = function (model) {
            model.DateModel.Date.setMonth(model.DateModel.Date.getMonth() - 1); objectModel.SetDateView(model);
            setPosition(model);
        };
        this.NextYear = function (model) {
            var date = new Date(model.MonthModel.Date.getFullYear() + 1,0);
            if (date.getTime() > model.max) {
                return;
            }
            model.MonthModel.Date.setFullYear(model.MonthModel.Date.getFullYear() + 1); objectModel.SetMonthView(model);
            setPosition(model);
        };
        this.PrevYear = function (model) {
            model.MonthModel.Date.setFullYear(model.MonthModel.Date.getFullYear() - 1); objectModel.SetMonthView(model);
            setPosition(model);
        };
        this.NextYearRange = function (model) {
            var date = new Date(model.YearModel.Date.getFullYear() + 12, 0);
            if (date.getTime() > model.max) {
                return;
            }
            model.YearModel.Date.setFullYear(model.YearModel.Date.getFullYear() + 12); objectModel.SetYearView(model);
            setPosition(model);
        };
        this.PrevYearRange = function (model) {
            model.YearModel.Date.setFullYear(model.YearModel.Date.getFullYear() - 12); objectModel.SetYearView(model);
            setPosition(model); 
        };
        this.SwitchToDateView = function (model) {
            model.DateModel.template.show();
            model.MonthModel.template.hide();
            if (model.DateModel.Date.getMonth() != model.DateModel.Month) {
                objectModel.SetDateView(model);
            }
            setPosition(model);
        };
        this.SwitchToMonthView = function (model) {
            if(!model.MonthModel)
            {
                model.template.append(template.GetMonthTemplate(model));
            }
            model.DateModel.template.hide();
            model.YearModel && model.YearModel.template.hide();
            model.MonthModel.template.show();
            if(model.MonthModel.Date.getFullYear()!=model.DateModel.Date.getFullYear())
            {
                model.MonthModel.Date = new Date(model.DateModel.Date);
                objectModel.SetMonthView(model);
            }
            setPosition(model);
        };
        this.SwitchToYearView = function (model) {
            if (!model.YearModel) {
                model.template.append(template.GetYearTemplate(model));
            }
            model.DateModel.template.hide();
            model.MonthModel.template.hide();
            model.YearModel.template.show();
            if (model.YearModel.Date.getFullYear() != model.DateModel.Date.getFullYear()) {
                model.YearModel.Date = new Date(model.DateModel.Date);
                objectModel.SetYearView(model);
            }
            setPosition(model);
        };
    };
    var template = new function () {
        var that = this;
        this.GetDateTemplate = function (model) {
            var template = $('<div class="datepicker-days" style="display: block;"><table class=" table-condensed"><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch" colspan="5">February 2015</th><th class="next" style="visibility: visible;">»</th></tr>' +
                '<tr><th class="dow">Su</th><th class="dow">Mo</th><th class="dow">Tu</th><th class="dow">We</th><th class="dow">Th</th><th class="dow">Fr</th><th class="dow">Sa</th></tr></thead><tbody></tbody></table></div>');
            var thead = template.find('thead');
            model.DateModel = { template: template, tbody: thead.next(), title: thead.find('.datepicker-switch'), Date: model.value && new Date(model.value) || new Date() }
            thead.find('.prev').click(function () { objectModel.PrevMonth(model) });
            thead.find('.datepicker-switch').click(function () { objectModel.SwitchToMonthView(model) });
            thead.find('.next').click(function () { objectModel.NextMonth(model); }); 
            return template;
        };
        this.GetMonthTemplate = function (model) {
            var template = $('<div class="datepicker-months" style="display: none;"><table class="table-condensed"><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch">2015</th><th class="next" style="visibility: visible;">»</th></tr></thead>'+
            '<tbody><tr><td data-value="0">Jan</td><td data-value="1">Feb</td><td data-value="2">Mar</td></tr><tr><td data-value="3">Apr</td><td data-value="4">May</td><td data-value="5">Jun</td></tr><tr><td data-value="6">Jul</td><td data-value="7">Aug</td><td data-value="8">Sep</td></tr><tr><td data-value="9">Oct</td><td data-value="10">Nov</td><td data-value="11">Dec</td></tr></tbody></table></div>');
            var thead = template.find('thead');
            model.MonthModel = { template: template, tbody: thead.next(), title: thead.find('.datepicker-switch'), Date: model.value && new Date(model.value) || new Date() }
            thead.find('.prev').click(function () { objectModel.PrevYear(model) });
            thead.find('.datepicker-switch').click(function () { objectModel.SwitchToYearView(model) });
            thead.find('.next').click(function () { objectModel.NextYear(model); });
            model.MonthModel.tbody.find('td').click(function () {
                objectModel.SelectMonth.call(this, model);
            });
            objectModel.SetMonthView(model);
            return template;
        };
        this.GetYearTemplate = function (model) {
            var template = $('<div class="datepicker-months" style="display: none;"><table class="table-condensed"><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch">2015</th><th class="next" style="visibility: visible;">»</th></tr></thead>' +
            '<tbody></tbody></table></div>');
            var thead = template.find('thead');
            model.YearModel = { template: template, tbody: thead.next(), title: thead.find('.datepicker-switch'), Date: new Date(model.DateModel.Date) }
            thead.find('.prev').click(function () { objectModel.PrevYearRange(model) });
            thead.find('.next').click(function () { objectModel.NextYearRange(model); });
            objectModel.SetYearView(model);

            return template;
        };
    };
    function getTemplate(model) {
        var tmp = $('<div class="datepicker datepicker-dropdown dropdown-menu datepicker-orient-left datepicker-orient-bottom">').append(template.GetDateTemplate(model));
        model.template = tmp;
        objectModel.SetDateView(model);
        return tmp;
    };
    function set(model) {
        var timeOutEvent;
        model.elm.focus(model.open).click(model.open).blur(function () { setTimeout(function () { if (!isActiveVisible) hide(model); }, 130); });
        model.max = model.max ? model.max.getTime() : Math.max;
        model.min = model.min ? model.min.getTime() : Math.min;
        $(document.body).append(getTemplate(model));
        model.template.mousedown(function () {
            isActiveVisible = true;
            timeOutEvent && clearTimeout(timeOutEvent);
            timeOutEvent=setTimeout(function () { isActiveVisible = false; }, 150);
        }).mouseup(function () { model.elm.focus(); });
    };
    function setPosition(model) {
        var h = model.template.height(), offset = model.elm.offset();
        offset.top = offset.top - h - 15;
        model.template.css(offset)
    };
    function checkForValue(model) {
        if (model.elm.val() != model.text) {
            var date = validation.GetDateObjectFromString(model.elm.val(), model.format);
            if (date) {
                model.DateModel.Date = model.value = date;
                model.DateModel.Date.setMonth(date.getMonth());
            } else {
                model.value = null;
                model.elm.val('')
            }
            objectModel.SetDateView(model);
            model.text = model.elm.val();
        }
    };
    function show(model) {
        model.template.show();
        checkForValue(model);
        setPosition(model);
    };
    function hide(model) {
        checkForValue(model);
        model.template.hide().offset({ top: '100%', left: '100%' });
    };
    this.Bind = function (elm, model) {
        if (elm.data('DatePicker')) { return elm.data('DatePicker'); }
        //var max = model.max;
        model = getDefaultOption(model);
        //model.max = max || model.max;
        model.elm = elm;
        if (model.value)
        {
            elm.val(model.value.format(model.format));
            model.text = elm.val();
        }
        
        model.open = function () {
            show(model);
        };
        model.hide = function () {
            hide(model)
        };
        set(model);
    };
};