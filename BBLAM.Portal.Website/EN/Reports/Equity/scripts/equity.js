var valid_asof = null;
// used to sync the exports
var promises = [
    $.Deferred(),
    $.Deferred(),
    $.Deferred(),
    $.Deferred(),
];

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
                $('#txtAsof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: moment(data[1]),
                    minDate: moment(data[0]),
                    maxDate: moment(data[1]),
                }));
            }
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

    $('body').on('click', '.k-grid-excel-all', function (e) {
        e.preventDefault();
        $('#gridEQ').data('kendoGrid').saveAsExcel();
        $('#gridMX').data('kendoGrid').saveAsExcel();
        $('#gridFI').data('kendoGrid').saveAsExcel();
        $('#gridFIF').data('kendoGrid').saveAsExcel();
        // wait for both exports to finish
        $.when.apply(null, promises)
            .then(function (wbEQ, wbMX, wbFI, wbFIF) {

                var min_rows = 2;
                if (wbEQ.sheets[0].rows.length <= min_rows) {
                    wbEQ.sheets[0].rows = [];
                }
                if (wbMX.sheets[0].rows.length > min_rows) {
                    $.merge(wbEQ.sheets[0].rows, wbMX.sheets[0].rows);
                }
                if (wbFI.sheets[0].rows.length > min_rows) {
                    $.merge(wbEQ.sheets[0].rows, wbFI.sheets[0].rows);
                }
                if (wbFIF.sheets[0].rows.length > min_rows) {
                    $.merge(wbEQ.sheets[0].rows, wbFIF.sheets[0].rows);
                }

                // create a new workbook using the sheets of the products and orders workbooks
                var sheets = [
                    wbEQ.sheets[0],
                ];

                sheets[0].title = 'Equity Limit';

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
                var fund_type = $('#ddlFundType').find('option:selected').val().toLowerCase();
                kendo.saveAs({
                    dataURI: workbook.toDataURL(),
                    fileName: kendoUtility.excelExport.createFileName(fund_type + '_equity_limit', valid_asof),
                })
            });

        return false;
    })

});

function setupGrid() {
    valid_asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof = valid_asof.format('YYYY-MM-DD');

    setupGridByFundType($('#gridEQ'), true);
    setupGridByFundType($('#gridMX'));
    setupGridByFundType($('#gridFI'));
    setupGridByFundType($('#gridFIF'));

    refreshData();
}
function setupGridByFundType($grid, download) {
    var toolbar = download ? [{
        name: 'excel',
        template: $("#templateExcelAll").html(),
    }] : false;
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        toolbar: toolbar,
        excel: {
            fileName: kendoUtility.excelExport.createFileName('equity_limit', valid_asof),
        },
        excelExport: function (e) {
            e.preventDefault();
            var index = parseInt($grid.data('index'), 10);
            promises[index].resolve(e.workbook);
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
            template: function (e) {
                var fund_type = $('#ddlFundType').find('option:selected').val();
                return '<a href="EquityDetail.aspx?type=' + fund_type + '&fund=' + e.fund_code + '&date=' + valid_asof.format(DateFormats.moment.param) + '" target="_blank">' + e.fund_code + '</a>';
            },
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
            title: 'Amount (THB)',
            columns: [{
                attributes: { 'class': 'text-right' },
                field: 'equity_amount',
                title: 'Equity',
                format: '{0:N2}',
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'fixed_income_amount',
                title: 'Fixed Income',
                format: '{0:N2}',
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'unit_trust_amount',
                title: 'Unit Trust',
                format: '{0:N2}',
                width: 100,
            }],
        }, {
            title: '% of Total NAV',
            columns: [{
                attributes: { 'class': 'text-right' },
                field: 'equity_weight',
                title: 'Equity',
                format: '{0:N2}',
                width: 50,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'fixed_income_weight',
                title: 'Fixed Income',
                format: '{0:N2}',
                width: 50,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'unit_trust_weight',
                title: 'Unit Trust',
                format: '{0:N2}',
                width: 50,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'other_weight',
                title: 'Other',
                format: '{0:N2}',
                width: 50,
            }],
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
                attributes: { 'class': 'text-left breach-limit' },
                field: 'remark',
                title: 'Remark',
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
        change: function (e) {
        },
    })).data("kendoGrid");
}
function refreshData() {
    valid_asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof = valid_asof.format('YYYY-MM-DD');
    var fund_type= $('#ddlFundType').find('option:selected').val();
   var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/equity/equity-limit',
            },
            parameterMap: function (data, type) {
                return {
                    asof: asof,
                    fund_type: fund_type,
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

   setupGridDelta();
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

                    total_nav: { type: 'number', },
                    equity_amount: { type: 'number', },
                    fixed_income_amount: { type: 'number', },
                    unit_trust_amount: { type: 'number', },

                    equity_weight: { type: 'number', },
                    fixed_income_weight: { type: 'number', },
                    unit_trust_weight: { type: 'number', },
                    other_weight: { type: 'number', },

                    limit_min: { type: 'number', },
                    limit_max: { type: 'number', },
                }
            }
        },
        sort: {
            field: 'fund_code', dir: 'asc',
        },
        data: funds,
    });
    ds.read();

    var grid = $grid.data("kendoGrid");
    if (grid) {
        grid.setDataSource(ds);
        grid.refresh();
    }
    if (funds.length > 0) {
        $grid.show();
    } else {
        $grid.hide();
    }
}
function setupGridDelta() {
    var asof = valid_asof.format('YYYY-MM-DD');
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#gridDelta');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/report/equity/delta-remark',
                },
                parameterMap: function (data, type) {
                    return {
                        asof: asof,
                        fund_type: $.App.getFundType(),
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        report_date: { type: "date", },
                    }
                }
            },
            sort: {
                field: 'security', dir: 'asc',
            },
        },
        toolbar: [{
            name: 'excel',
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('equity_delta_remark', valid_asof),
        },
        messages: {
            noRecords: "No warrants found."
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
            width: 100,
        }, {
            attributes: { 'class': 'bold' },
            field: 'security',
            title: 'Security',
            width: 100,
        }, {
            attributes: { 'class': 'text-left' },
            field: 'master_stock',
            title: 'Master Stock',
            width: 100,
        }, {
            attributes: { 'class': 'breach-limit' },
            field: 'remark',
            title: 'Remark',
            width: 300,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
