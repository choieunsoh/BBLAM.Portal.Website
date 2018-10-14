var valid_asof = null;
var promises = [
    $.Deferred(),
    $.Deferred(),
    $.Deferred(),
    $.Deferred(),
];

$(function () {
    var dp_options = $.extend(true, {}, bsUtility.datePicker.monthConfig);
    $('#txtAsof').datetimepicker($.extend(true, dp_options, {
        date: moment().add('month', -1).endOf('month'),
    }));
    var fund_type = $('#ddlFundType').find('option:selected').val();
    $.App.loadFunds(fund_type);

    $('#ddlFundType').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var fund_type = $(e.currentTarget).val();
        $.App.loadFunds(fund_type);
    });

    $('#btnView').on('click', function (e) {
        e.preventDefault();
        setupGrid(false);
        return false;
    })

    $('#btnGenerate').on('click', function (e) {
        e.preventDefault();
        setupGrid(true);
        return false;
    })

    $('#btnGenerateAll').on('click', function (e) {
        e.preventDefault();
        generateAllFunds();
        return false;
    })

    $('body').on('click', '.k-grid-excel-all', function (e) {
        e.preventDefault();
        $('#grid').data('kendoGrid').saveAsExcel();
        $('#grid_act').data('kendoGrid').saveAsExcel();
        $('#grid_pa').data('kendoGrid').saveAsExcel();
        $('#grid_year').data('kendoGrid').saveAsExcel();
        // wait for both exports to finish
        $.when.apply(null, promises)
            .then(function (wb1, wb2, wb3, wb4) {

                // create a new workbook using the sheets of the products and orders workbooks
                var sheets = [
                    wb1.sheets[0],
                    wb2.sheets[0],
                    wb3.sheets[0],
                    wb4.sheets[0],
                ];

                formatDateCell(wb1);
                formatDateCell(wb2);
                formatDateCell(wb3);

                sheets[0].title = 'Factsheet';
                sheets[1].title = 'Factsheet (Actual)';
                sheets[2].title = 'Factsheet (Annualized)';
                sheets[3].title = 'Factsheet (Annually)';

                var workbook = new kendo.ooxml.Workbook({
                    sheets: sheets
                });

                promises = [
                    $.Deferred(),
                    $.Deferred(),
                    $.Deferred(),
                    $.Deferred(),
                ];

                // save the new workbook,b
                var asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
                var port_code = $('#ddlFund').find('option:selected').val();
                kendo.saveAs({
                    dataURI: workbook.toDataURL(),
                    fileName: kendoUtility.excelExport.createFileName(port_code + '_factsheet', asof.format('YYYY-MM')),
                })
            });

        return false;
    })

});

function formatDateCell(wb) {
    if (wb.sheets[0].rows.length > 2) {
        var row = wb.sheets[0].rows[2];
        for (var i = 1; i < row.cells.length; i++) {
            if (moment(row.cells[i].value).isValid()) {
                row.cells[i].value = moment(row.cells[i].value.toString(), 'YYYYMMDD').toDate();
                row.cells[i].format = 'dd/MM/yyyy';
            }
        }
    }
}
function setupGrid(regen) {
    _setupGrid($('#grid'), '');
    _setupGrid($('#grid_act'), 'Actual');
    _setupGrid($('#grid_pa'), 'Annualized');
    refreshData(regen);

    refreshAnnuallyData(regen);
}
function _setupGrid($grid, type) {
    var asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
    var port_code = $('#ddlFund').find('option:selected').val();

    var type_name = type != '' ? '_' + type : '';
    var title = type != '' ? port_code + ' ' + type : port_code;
    var toolbar = type != '' ? false : [{
        name: 'excel',
        template: $("#templateExcelAll").html(),
    }];

    var options = $.extend(true, {}, kendoUtility.gridConfig);
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        toolbar: toolbar,
        excelExport: function (e) {
            e.preventDefault();
            var index = parseInt($grid.data('index'), 10);
            promises[index].resolve(e.workbook);
        },
        selectable: false,
        scrollable: true,
        allowCopy: false,
        pageable: false,
        filterable: false,
        sorting: false,
        columns: [{
            title: 'Monthly Fund Factsheet Report: ' + asof.format('MMMM YYYY'),
            columns: [{
                attributes: { 'class': 'text-center' },
                field: 'report_date',
                title: 'Report Date',
                format: '{0:dd-MMM-yyyy}',
                parseFormats: [DateFormats.json],
                width: 80,
            }, {
                attributes: { 'class': '' },
                field: 'title',
                title: title,
                width: 200,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'p_1m',
                title: 'ย้อนหลัง 1 เดือน',
                template: function (e) {
                    return formatValue(e, 'p_1m');
                },
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'p_3m',
                title: 'ย้อนหลัง 3 เดือน',
                template: function (e) {
                    return formatValue(e, 'p_3m');
                },
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'p_6m',
                title: 'ย้อนหลัง 6 เดือน',
                template: function (e) {
                    return formatValue(e, 'p_6m');
                },
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'p_1y',
                title: 'ย้อนหลัง 1 ปี',
                template: function (e) {
                    return formatValue(e, 'p_1y');
                },
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'p_3y',
                title: 'ย้อนหลัง 3 ปี',
                template: function (e) {
                    return formatValue(e, 'p_3y');
                },
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'p_5y',
                title: 'ย้อนหลัง 5 ปี',
                template: function (e) {
                    return formatValue(e, 'p_5y');
                },
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'p_10y',
                title: 'ย้อนหลัง 10 ปี',
                template: function (e) {
                    return formatValue(e, 'p_10y');
                },
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'p_inc',
                title: 'ตั้งแต่จัดตั้งกองทุน',
                template: function (e) {
                    return formatValue(e, 'p_inc');
                },
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'p_ytd',
                title: 'YTD',
                template: function (e) {
                    return formatValue(e, 'p_ytd');
                },
                width: 100,
            }],
        }],
        dataBound: function (e) {
            kendoUtility.gridConfig.dataBound(e);

            var dataItems = e.sender.dataSource.view();
            for (var j = 0; j < dataItems.length; j++) {
                var order = dataItems[j].get('title_order');
                var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                if (order == 1) {
                    row.addClass('row-asof');
                }
            }
        },
        change: function (e) {
        },
    })).data("kendoGrid");
}
function refreshData(regen) {
    var asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
    var port_code = $('#ddlFund').find('option:selected').val();
    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/perf/report/monthly-factsheet',
            },
            parameterMap: function (data, type) {
                return {
                    report_date: asof.format('YYYY-MM-DD'),
                    fund_type: $.App.getFundType(),
                    port_code: port_code,
                    regen: regen,
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

            refreshGrid($('#grid'), result, 'Default');
            refreshGrid($('#grid_act'), result, 'Actual');
            refreshGrid($('#grid_pa'), result, 'Annualized');
        },
    });
    dataSource.read();
}
function refreshGrid($grid, result, type) {
    var funds = $.grep(result, function (e, i) {
        return e.type === type || e.title_order == 1;
    });
    var ds = new kendo.data.DataSource({
        schema: {
            model: {
                fields: {
                    report_date: { type: "date", },
                    title_order: { type: 'number', },
                    p_1m: { type: 'number', },
                    p_3m: { type: 'number', },
                    p_6m: { type: 'number', },
                    p_1y: { type: 'number', },
                    p_3y: { type: 'number', },
                    p_5y: { type: 'number', },
                    p_10y: { type: 'number', },
                    p_inc: { type: 'number', },
                    p_ytd: { type: 'number', },
                }
            }
        },
        sort: [
            { field: 'title_order', dir: 'asc', },
        ],
        data: funds,
    });
    ds.read();

    var grid = $grid.data("kendoGrid");
    if (grid) {
        grid.setDataSource(ds);
        grid.refresh();
    }
}
function formatValue(e, field) {
    var title = e.title ? e.title : e.TITLE;
    var title_order = e.title_order ? e.title_order : e.TITLE_ORDER;
    switch (title_order) {
        case 1:
            return e[field] != null ? moment(e[field].toString(), 'YYYYMMDD').format('DD-MMM-YYYY') : '';
        default:
            var format = title.indexOf('Ratio') != -1 ? '{0:N4}' : '{0:P4}';
            return e[field] ? e[field].toChangeColor(format) : '';
    }
}

function setupAnnuallyGrid(data) {
    var asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
    var port_code = $('#ddlFund').find('option:selected').val();

    var columns = [
        {
            attributes: { 'class': 'text-center' },
            field: 'REPORT_DATE',
            title: 'Report Date',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 80,
        }, {
            attributes: { 'class': '' },
            field: 'TITLE',
            title: port_code,
            width: 200,
        },
    ];
    if (data != null && data.length > 0) {
        columns = columns.concat(getAnnuallyColumns(data[0], 100));
    }

    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid_year');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            data: data,
            schema: getAnnuallySchema(data[0]),
            sort: [
                { field: 'TITLE_ORDER', dir: 'asc', },
            ],
        },
        toolbar: false,
        excelExport: function (e) {
            e.preventDefault();
            var index = parseInt($grid.data('index'), 10);
            promises[index].resolve(e.workbook);
        },
        selectable: false,
        scrollable: true,
        allowCopy: false,
        pageable: false,
        filterable: false,
        sorting: false,
        columns: [{
            title: 'Monthly Fund Factsheet Report: ' + asof.format('MMMM YYYY'),
            columns: columns,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
function refreshAnnuallyData(regen) {
    var asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
    var port_code = $('#ddlFund').find('option:selected').val();
    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/perf/report/annually-factsheet',
            },
            parameterMap: function (data, type) {
                return {
                    report_date: asof.format('YYYY-MM-DD'),
                    fund_type: $.App.getFundType(),
                    port_code: port_code,
                    regen: regen,
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
            setupAnnuallyGrid(result);
        },
    });
    dataSource.read();
}

function getAnnuallyColumns(data, width) {
    return $.map($.grep(Object.keys(data), function (e, i) {
        return e.startsWith('P_');
    }), function (o) {
        return {
            attributes: { 'class': 'text-right' },
            field: o,
            title: o.substring(3),
            template: function (e) {
                return formatValue(e, o);
            },
            width: width,
        };
    });

}
function getAnnuallySchema(data) {
    var fields = new Object();
    if (data != null) {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith('P_')) {
                fields[keys[i]] = { type: 'number' };
            }
        }
    }
    fields['REPORT_DATE'] = { type: 'date', };
    fields['TITLE_ORDER'] = { type: 'number', };
    return {
        model: {
            fields: fields,
        }
    };
}
function generateAllFunds() {
    var asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
    var msg = 'Are you sure you want to generate Fund Factsheet of all funds ?';
    $.App.ui.dialog.confirm(msg, function(result) {
        if (result) {
            $.ajax({
                data: {
                    report_date: asof.format('YYYY-MM-DD'),
                    fund_type: $.App.getFundType(),
                },
                url: rootapi + '/api/perf/report/gen-factsheet',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(data, status, xhr) {
                    $.App.ui.dialog.success('Fund Factsheet of all funds were generated successfully.', function() {

                    });
                },
                error: function(xhr, status, error) {
                    $.App.ui.dialog.alert('Error. ' + error);
                }
            });
        }
    });

}
