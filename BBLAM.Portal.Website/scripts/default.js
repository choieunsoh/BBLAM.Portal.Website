var searchString = [
    { text: 'Contains', value: 0 },
    { text: 'Does not contain', value: 1 },
    { text: 'Starts with', value: 2 },
    { text: 'Ends with', value: 3 },
];
var searchDate = [
    { text: 'Is equal to', value: 0 },
    { text: 'Is not equal to', value: 1 },
    { text: 'Is after or equal to', value: 2 },
    { text: 'Is after', value: 3 },
    { text: 'Is before or equal to', value: 4 },
    { text: 'Is before', value: 5 },
    { text: 'Between', value: 6 },
];
var searchNumber = [
    { text: 'Is equal to', value: 0 },
    { text: 'Is not equal to', value: 1 },
    { text: 'Is greater than or equal to', value: 2 },
    { text: 'Is greater than', value: 3 },
    { text: 'Is less than or equal to', value: 4 },
    { text: 'Is less than', value: 5 },
    { text: 'Between', value: 6 },
];

var $my = null;
var $id = $.getUrlVar('id');
var $key = $.getUrlVar('key');

$(function () {
    if ($('#myObject').val() != '') {
        $my = JSON.parse($('#myObject').val());
    }

    // re-size chart
    $(window).on('resize', function () {
        if ($('.k-chart').length > 0) {
            kendo.resize($('.k-chart'));
        }
    });

    // Search String
    for (var i = 0; i < searchString.length; i++) {
        var $opt = $('<option></option>').text(searchString[i].text).val(searchString[i].value);
        $('.search-string').append($opt);
    }

    // Search Date
    for (var i = 0; i < searchDate.length; i++) {
        var $opt = $('<option></option>').text(searchDate[i].text).val(searchDate[i].value);
        $('.search-date').append($opt);
    }
    $('.search-date').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var searchBy = $(e.currentTarget).val();
        // Between Search = 6
        var $to = $(e.currentTarget).closest('.search-group').find('.input-group input:last');
        $to.prop('disabled', searchBy != 6);
    });

    // Search Number
    for (var i = 0; i < searchNumber.length; i++) {
        var $opt = $('<option></option>').text(searchNumber[i].text).val(searchNumber[i].value);
        $('.search-number').append($opt);
    }
    $('.text-money').mask('#,##0.00', { reverse: true, });
    $('.search-number').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var searchBy = $(e.currentTarget).val();
        // Between Search = 6
        var $to = $(e.currentTarget).closest('.search-group').find('input:last');
        $to.prop('disabled', searchBy != 6);
    });


    // Nice Scroll
    $('textarea').niceScroll({
        cursorcolor: '#ecaaaa',
        cursorwidth: '10px',
    });

    // Default Button
    $('input').keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $('button.default-submit').click();
            return false;
        } else {
            return true;
        }
    });

    // Upper
    $(document).on('input', '.upper', function (evt) {
        var input = $(this);
        var start = input[0].selectionStart;
        $(this).val(function (_, val) {
            return val.toUpperCase();
        });
        input[0].selectionStart = input[0].selectionEnd = start;
    });

    // Copy Grid Cell to Clipboard
    $(document).on('click', 'td[role="gridcell"]', function (e) {
        var $cell = $(this);
        $('body').attr('data-copy', $cell.text());
        /*$cell.addClass('cell-highlight');
        setTimeout(function () {
            $cell.removeClass('cell-highlight');
        }, 500);*/
    });
    $(document).on('keydown', function (e) {
        if (e.keyCode == 67 && e.ctrlKey) {
            var text = $('body').data('copy');
            clipboard.copy(text);
            $('body').removeAttr('data-copy');
        }
    });

});

$.App = {
    loadFunds: function(fund_type, $ddlFund, param_fund) {
        $.ajax({
            url: rootapi + '/api/report/equity/active-fund',
            global: false,
            type: 'GET',
            data: { 'fund_type': fund_type },
            async: false,
            success: function (data) {
                if (!$ddlFund) {
                    $ddlFund = $('#ddlFund');
                }
                $ddlFund.html('');
                var $optgroup = {};
                var temp = 0;
                for (var i = 0; i < data.length; i++) {
                    if (temp !== data[i].group_order) {
                        temp = data[i].group_order;
                        if ($optgroup) {
                            $ddlFund.append($optgroup);
                        }
                        $optgroup = $('<optgroup label="' + data[i].fund_type + '"></optgroup>');
                    }
                    var $opt = $('<option></option>').val(data[i].fund_code).html(data[i].fund_code + ': ' + data[i].fund_name);
                    if (param_fund) {
                        if (param_fund === data[i].fund_code) {
                            $opt.prop('selected', true);
                        }
                    }
                    $optgroup.append($opt);
                }
                $ddlFund.append($optgroup);
                $ddlFund.selectpicker('refresh');
            },
        });
    },
    getFundType: function () {
        return $('#ddlFundType').find('option:selected').val();
    },
    getPreviousWorkingDate: function (date) {
        var prev = null;
        if (!date) date = moment();
        $.ajax({
            async: false,
            type: 'GET',
            url: rootapi + '/api/util/prev-workday',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: {
                asof: moment(date).format('YYYY-MM-DD'),
                days: 1,
            },
            success: function (data, status, xhr) {
                prev = moment(data);
            },
            error: function (xhr, status, error) {
                $.App.ui.dialog.alert('Error. ' + error);
            }
        });
        return prev;
    },
};
$.App.ui = {
    bind: function (o, selector, options) {
        if (!o) return;

        var default_options = {
            nullValue: '-',
        };
        options = $.extend(true, default_options, options);

        if (arguments.length < 2) {
            selector = 'div.form-data-wrapper';
        }

        // textbox / textarea
        var $controls;
        if (typeof selector === 'string') {
            $controls = $(selector).find(':input[data-field], textarea[data-field], span[data-field]');
        } else {
            $controls = selector.find(':input[data-field], textarea[data-field], span[data-field]');
        }
        $.each($controls, function (i, control) {
            var $c = $(control);
            var value = o[$c.data('field')];
            if (value != null) {
                var type = $c.data('control');
                if (type == 'datetime') {
                    $c.parent().data("DateTimePicker").date(moment(value));
                } else {
                    var format = $c.data('format');
                    if (format) {
                        if (format === 'date') {
                            setValue($c, moment(value).format('D MMMM YYYY'));
                        } else if (format === 'datetime') {
                            setValue($c, moment(value).format('D MMMM YYYY HH:mm:ss'));
                        } else if (format.toUpperCase().startsWith('N')) {
                            setValue($c, kendo.format('{0:' + format + '}', parseFloat(value)));
                        } else {
                            setValue($c, value);
                        }
                    } else {
                        setValue($c, value);
                    }
                }
            } else {
                setValue($c, options.nullValue);
            }
        });

        // dropdown
        if (typeof selector === 'string') {
            $controls = $(selector).find('select[data-field].selectpicker, select[data-field].selectpicker-dialog');
        } else {
            $controls = selector.find('select[data-field].selectpicker, select[data-field].selectpicker-dialog');
        }
        $.each($controls, function (i, control) {
            var $c = $(control);
            var value = o[$c.data('field')];
            if (value != undefined) {
                value = value.toString();
                if ($c.find("option[value='" + value + "']").length == 0) {
                    if (value == 'true') {
                        value = '1';
                    } else if (value == 'false') {
                        value = '0';
                    }
                }
                $c.val(value);
                $c.selectpicker('refresh');
            }
        });

        // checkbox
        if (typeof selector === 'string') {
            $controls = $(selector).find(':checkbox[data-field]');
        } else {
            $controls = selector.find(':checkbox[data-field]');
        }
        $.each($controls, function (i, control) {
            var $c = $(control);
            var type = $c.data('element');
            var value = o[$c.data('field')];
            if (type == 'toggle') {
                $c.bootstrapToggle(value ? 'on' : 'off');
            } else {
                $c.prop('checked', value);
            }
        });

        // version
        $('#myVersion').val(o['version']);

        function setValue($c, value) {
            var method = $c.is('input,select,textarea') ? 'val' : 'html';
            $c[method](value);
        }

    },
    read: function (idfield, selector) {
        var o = {};

        if (arguments.length < 2) {
            selector = 'div.form-data-wrapper';
        }

        // textbox / textarea
        var $controls;
        if (typeof selector === 'string') {
            //$controls = $(selector + ' :input[data-field], ' + selector + ' textarea[data-field]');
            $controls = $(selector).find(':input[data-field], textarea[data-field]');
        } else {
            $controls = selector.find(':input[data-field], textarea[data-field]');
        }
        $.each($controls, function (i, control) {
            var $c = $(control);
            var type = $c.data('control');
            var hasid = $c.data('id');
            if (!hasid) {
                if (type == 'datetime') {
                    o[$c.data('field')] = moment($c.parent().data("DateTimePicker").date());
                } else if (type == 'mask') {
                    o[$c.data('field')] = $c.cleanVal();
                } else {
                    o[$c.data('field')] = $c.val();
                }
            }
        });

        // checkbox
        if (typeof selector === 'string') {
            //$controls = $(selector + ' :checkbox[data-field]');
            $controls = $(selector).find(' :checkbox[data-field]');
        } else {
            $controls = selector.find(' :checkbox[data-field]');
        }
        $.each($controls, function (i, control) {
            var $c = $(control);
            o[$c.data('field')] = $c.is(':checked');
        });

        if ($my) {
            o.created_by = $my.UserName;
            o.updated_by = $my.UserName;
        }

        // version
        o.version = $('#myVersion').val();

        // PK
        if ($id && idfield) {
            o[idfield] = $id;
        }

        return o;
    },
    search: {
        read: function (selector) {
            if (!selector) {
                selector = 'div.form-data-wrapper :input[data-column], div.form-data-wrapper :input[data-field]';
            }
            var col = [];
            var $controls = $(selector).not('[id$="To"]');
            $.each($controls, function (i, control) {
                var $c = $(control);
                if ($c.parent().attr('id') == undefined || !$c.parent().attr('id').endsWith('To')) {
                    var dataType = $c.data('type') ? $c.data('type') : '';
                    var value = $c.val();
                    if (value !== '' && value !== null) {
                        var type = $c.is('select') ? '' : $c.parents('div.search-group').find('select option:selected').val();
                        if ($c.data('control') === 'datetime') {
                            value = moment($c.parent().data("DateTimePicker").date());
                        } else if ($c.data('control') === 'checkbox') {
                            value = $c.is(':checked');
                        } else if ($c.data('control') === 'money') {
                            value = value.replace(/,/ig, '');
                        } else if ($c.data('mask')) {
                            value = $c.cleanVal();
                        }

                        if ($c.data('id')) {
                            value = $c.data('id');
                        }
                        var o = {
                            Column: $c.data('column') ? $c.data('column') : $c.data('field'),
                            DataType: dataType,
                            Type: type,
                            Value: value
                        };

                        // BETWEEN
                        if (type === "6") {
                            if ($c.data('control') === 'datetime') {
                                $c = $('#' + $c.parent().attr('id') + 'To > :input');
                            } else {
                                $c = $('#' + $c.attr('id') + 'To');
                            }
                            value = $c.val();
                            if (value !== '' && value !== null) {
                                if ($c.data('control') === 'datetime') {
                                    value = moment($c.parent().data("DateTimePicker").date());
                                } else if ($c.data('control') === 'checkbox') {
                                    value = $c.is(':checked');
                                } else if ($c.data('control') === 'money') {
                                    value = value.replace(/,/ig, '');
                                }
                            }
                            o.Value2 = value;
                        }

                        col.push(o);
                    }
                }
            });

            return { Columns: col };
        },
    },
    refreshOpener: function (url, refresh) {
        // ทำแบบนี้ไม่ได้ ถ้าเค้าตรงเข้ามาหน้า add เลย ไม่ได้คลิกผ่านหน้า search มาจะน๊อคไปเลย
        if (window.opener != null && window.opener.location != null) {
            if (arguments.length > 1 && refresh) {
                window.opener.location.reload(true);
            }
            window.close();
        } else {
            if (arguments.length > 0) {
                window.location.replace(url);
            }
        }
    },
};
$.App.data = {
    log: {
        reshape: function (data, jsonprop, options) {
            var cols = [];
            if (data && data.length > 0) {
                var json = JSON.parse(data[0][jsonprop]);
                if (json instanceof Array) {
                    json = json[0];
                }

                for (var key in json) {
                    var value = json[key];
                    if ((!key.endsWith('id') || !value.isGuid())
                        && !key.startsWith('created') && !key.startsWith('updated') //ไม่แสดง created และ updated เพราะมีในตาราง log อยู่แล้ว
                        && key != 'version') {
                        var type = typeof value;
                        var column = {
                            align: 'left',
                            field: key,
                            title: key.toFriendlyName(),
                            format: '{0}',
                            width: 120,
                        };

                        // type by column name
                        if (key.endsWith('_date')) {
                            type = 'date';
                        } else if (key.startsWith('is_') || key.startsWith('has_')) {
                            type = 'boolean';
                        }
                            //achara add 
                        else if (key == 'member_status' || key == 'license_status' || key == 'initial_not_full_pay_status') {
                            type = 'boolean';
                        }

                        // width
                        if (key.endsWith('name_en') || key.endsWith('name_th')) {
                            column.width = 200;
                        }

                        // custom from options
                        var hasformat = false;
                        var visible = true;
                        var cssclass = '';
                        if (options[key]) {
                            if (options[key].title) {
                                column.title = options[key].title;
                            }
                            if (options[key].width) {
                                column.width = options[key].width;
                            }
                            if (options[key].format) {
                                hasformat = true;
                                column.format = options[key].format;
                            }
                            if (options[key].type) {
                                type = options[key].type;
                            }
                            if (options[key].cssclass) {
                                cssclass = options[key].cssclass;
                            }
                            if (options[key].visible != undefined) {
                                visible = options[key].visible;
                            }
                        }

                        if (type === 'number') {
                            if (column.format == '{0}') {
                                column.format = '{0:N2}';
                            }
                        } else if (type == 'object') {
                            var arr = $.grep(data, function (o, i) {
                                var jsonx = JSON.parse(o[jsonprop]);
                                return (jsonx[key] !== '' && jsonx[key] != null);
                            });
                            if (arr.length > 0) {
                                var json2 = JSON.parse(arr[0][jsonprop]);
                                value = json2[key];
                                type = typeof value;

                                if (type == 'number') {
                                    column.format = '{0:N2}';
                                } else if (moment(value).isValid()) {
                                    column.type = 'date';
                                    column.format = DateFormats.grid.format;
                                    if (moment(value).format('hh:mm:ss') !== '12:00:00') {
                                        column.format = DateFormats.grid.datetime;
                                    }
                                }
                            }
                        }

                        if (type === 'boolean') {
                            column.align = 'center';
                            column.filterable = { multi: true, };
                            column.template = "#= " + key + " != null ? (" + key + " == '1' ? true : false).formatValue('Yes', 'No', true) : '' #";
                        } else if (type === 'number') {
                            column.align = 'right';
                        } else if (type === 'date') {
                            if (moment(value).isValid() || value == null) {
                                column.align = 'center';
                                column.type = 'date';
                                if (!hasformat) {
                                    column.format = DateFormats.grid.format;
                                    if (moment(value).format('hh:mm:ss') !== '12:00:00') {
                                        column.format = DateFormats.grid.datetime;
                                        column.width = 150;
                                    }
                                }
                            }
                        } else {

                        }

                        column.attributes = { 'class': 'text-' + column.align + ' ' + cssclass };

                        if (visible) {
                            cols.push(column);
                        }
                    }
                }

                var result = [];
                for (var i = 0; i < data.length; i++) {
                    var json_array = JSON.parse(data[i][jsonprop]);
                    if ((json_array instanceof Array) == false) {
                        json_array = [json_array];
                    }

                    for (var k = 0; k < json_array.length; k++) {
                        var o = $.extend(true, {}, data[i]);
                        var json = json_array[k];

                        for (var j = 0; j < cols.length; j++) {
                            var key = cols[j].field;
                            var value = json[key];

                            // custom from options
                            if (options[key]) {
                                if (options[key].type) {
                                    switch (options[key].type) {
                                        case 'number':
                                            value = parseFloat(value);
                                            break;
                                    }
                                }
                            }

                            o[key] = value;
                        }
                        result.push(o);
                    }
                }
            }
            return {
                data: result,
                columns: cols
            };
        },
    },
};
$.App.ui.dialog = {
    success: function (message, callback, options) {
        var default_options = {
            title: BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_INFO],
            type: BootstrapDialog.TYPE_SUCCESS,
            //messageCss: 'has-success',
            closable: false,
            draggable: true,
            buttons: [{
                label: 'Close',
                cssClass: 'btn-success',
                action: function (dialogRef) {
                    dialogRef.close();
                    if (callback) callback();
                }
            }]
        };
        options = $.extend(true, default_options, options);

        // Support array of messages
        if (message instanceof Array) {
            options.message = function () {
                var $content = $('<div />');
                if (options.messageCss) {
                    $content.addClass(options.messageCss);
                }
                $.each(message, function (i, msg) {
                    $content.append($('<div />').addClass('help-block').text(msg));
                });
                return $content;
            };
        } else {
            options.message = message;
        }

        BootstrapDialog.show(options);
    },
    alert: function (message, callback, options) {
        var default_options = {
            title: BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_WARNING],
            type: BootstrapDialog.TYPE_DANGER,
            //messageCss: 'has-error',
            closable: false,
            draggable: true,
            buttons: [{
                label: 'Close',
                cssClass: 'btn-danger',
                action: function (dialogRef) {
                    dialogRef.close();
                    if (callback) callback();
                }
            }]
        };
        options = $.extend(true, default_options, options);

        // Support array of messages
        if (message instanceof Array) {
            options.message = function () {
                var $content = $('<div />');
                if (options.messageCss) {
                    $content.addClass(options.messageCss);
                }
                $.each(message, function (i, msg) {
                    $content.append($('<div />').addClass('help-block').text(msg));
                });
                return $content;
            };
        } else {
            options.message = message;
        }

        BootstrapDialog.show(options);
    },
    confirm: function (message, callback, closable) {
        if (arguments.length < 3) {
            closable = false;
        }
        BootstrapDialog.confirm({
            title: 'CONFIRM',
            message: message,
            type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: closable, // <-- Default value is false
            draggable: true, // <-- Default value is false
            //btnCancelLabel: 'Cancel!', // <-- Default value is 'Cancel',
            btnOKLabel: 'Yes', // <-- Default value is 'OK',
            //btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
            callback: callback
        });
    },
};
