var valid_asof = null;
var param_from = $.getUrlVar('from');
var param_to = $.getUrlVar('to');
var param_fund = $.getUrlVar('fund');
var param_type = $.getUrlVar('type');

$(function () {
    $.ajax({
        async: false,
        type: 'GET',
        url: rootapi + '/api/report/equity/avail',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { fund_type: $('#ddlFundType').find('option:selected').val(), },
        success: function (data, status, xhr) {
            if (data.length == 2) {
                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, false));
                var from_date = param_from ? moment(param_from, DateFormats.moment.param) : moment(data[0]);
                var to_date = param_to ? moment(param_to, DateFormats.moment.param) : moment(data[1]);
                $('#txtAsof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: from_date,
                    minDate: moment(data[0]),
                    maxDate: moment(data[1]),
                }));
                $('#txtAsof2').datetimepicker($.extend(true, dp_options, {
                    defaultDate: to_date,
                    minDate: moment(data[0]),
                    maxDate: moment(data[1]),
                }));
            }
            if (!param_type) {
                param_type = 'MF';
            }
            $('#ddlFundType').val(param_type);
            $('#ddlFundType').selectpicker('refresh');
            $.App.loadFunds(param_type, $('#ddlFund'), param_fund);
            setupGrid();
        },
        error: function (xhr, status, error) {
            $.App.ui.dialog.alert('Error. ' + error);
        }
    });

    $('#btnView').on('click', function (e) {
        e.preventDefault();
        refreshData();
        return false;
    })

    $('#ddlFundType').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var fund_type = $(e.currentTarget).val();
        $.App.loadFunds(fund_type);
    });

});

function setupGrid() {
    setupGridByFundType($('#gridEQ'), true);
    setupGridByFundType($('#gridMX'));
    setupGridByFundType($('#gridFI'));
    setupGridByFundType($('#gridFIF'));

    refreshData();
}
function setupGridByFundType($grid, download) {
    var asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof2 = moment($('#txtAsof2').data('DateTimePicker').date());
    var fund_type = $('#ddlFundType').find('option:selected').val();
    var fund_code = $('#ddlFund').find('option:selected').val();

    var toolbar = download ? [{
        name: 'excel',
        template: $("#template").html(),
    }] : false;
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        toolbar: toolbar,
        excel: {
            fileName: kendoUtility.excelExport.createFileName('equity_limit', asof, asof2),
        },
        excelExport: function (e) {
            var sheet = e.workbook.sheets[0];
            for (var i = 0; i < sheet.rows.length; i++) {
                if (sheet.rows[i].type == 'data') {
                    sheet.rows[i].cells[8].value = sheet.rows[i].cells[8].value ? 'breach limit' : '';
                }
            }
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        columns: [{
            attributes: { 'class': 'text-center' },
            field: 'report_date',
            title: 'Date',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 60,
        }, {
            attributes: { 'class': 'bold' },
            field: 'fund_code',
            title: $grid.data('fund'),
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'fund_name',
            title: 'Name',
            width: 150,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'total_nav',
            title: 'Total NAV',
            format: '{0:N2}',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'equity_amount',
            title: 'Total Equity',
            format: '{0:N2}',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'equity_weight',
            title: '% Equity',
            format: '{0:N2}',
            width: 50,
        }, {
            title: 'Limit',
            columns: [{
                attributes: { 'class': 'text-right' },
                field: 'limit_min',
                title: 'Min',
                format: '{0:N2}',
                width: 50,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'limit_max',
                title: 'Max',
                format: '{0:N2}',
                width: 50,
            }, {
                attributes: { 'class': 'text-left' },
                field: 'breach_limit',
                title: 'Remark',
                template: '#= breach_limit.formatValue("breach limit", " ", true, "", "", true) #',
                width: 150,
            }],
        }, {
            attributes: { 'class': 'text-center' },
            field: 'asof',
            title: 'As of',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 60,
        }],
        dataBound: function (e) {
            kendoUtility.gridConfig.dataBound(e);

            var dataItems = e.sender.dataSource.view();
            for (var j = 0; j < dataItems.length; j++) {
                var breach = dataItems[j].get('breach_limit');
                var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                if (breach) {
                    row.addClass('row-breach-limit');
                }
            }
        },
        change: function (e) {
        },
    })).data("kendoGrid");
}
function refreshData() {
    var asof = moment($('#txtAsof').data('DateTimePicker').date()).format('YYYY-MM-DD');
    var asof2 = moment($('#txtAsof2').data('DateTimePicker').date()).format('YYYY-MM-DD');
    var fund_type = $('#ddlFundType').find('option:selected').val();
    var fund_code = $('#ddlFund').find('option:selected').val();

    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/equity/period-limit',
            },
            parameterMap: function (data, type) {
                return {
                    from_date: asof,
                    to_date: asof2,
                    fund_type: fund_type,
                    fund_code: fund_code,
                };
            },
        },
        requestStart: function () {
            kendoUtility.setProgress(true);
        },
        requestEnd: function () {
            kendoUtility.setProgress(false);
        },
        change: function (e) {
            var result = this.data().toJSON();

            refreshGrid($('#gridEQ'), result, 1);
            refreshGrid($('#gridMX'), result, 2);
            refreshGrid($('#gridFI'), result, 3);
            refreshGrid($('#gridFIF'), result, 4);
        },
    });
    dataSource.read();
}
function refreshGrid($grid, result, fundID) {
    var funds = $.grep(result, function (e, i) {
        return e.group_order === fundID;
    });
    var ds = new kendo.data.DataSource({
        schema: {
            model: {
                fields: {
                    asof: { type: "date", },
                    report_date: { type: 'date', },
                    effective_date: { type: 'date', },

                    total_nav: { type: 'number', },
                    equity_amount: { type: 'number', },
                    equity_weight: { type: 'number', },

                    limit_min: { type: 'number', },
                    limit_max: { type: 'number', },
                }
            }
        },
        sort: [
            { field: 'fund_code', dir: 'asc', },
            { field: 'report_date', dir: 'asc', },
        ],
        data: funds,
    });
    ds.read();

    if (funds.length > 0) {
        $grid.show();
        var grid = $grid.data("kendoGrid");
        if (grid) {
            grid.options.excel.fileName = kendoUtility.excelExport.createFileName(funds[0].fund_code + '_equity_limit', moment(funds[0].report_date), moment(funds[funds.length - 1].report_date));
            grid.setDataSource(ds);
            grid.refresh();
        }
    } else {
        $grid.hide();
    }
}