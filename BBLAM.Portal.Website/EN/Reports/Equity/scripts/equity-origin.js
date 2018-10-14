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

                var min_rows = 4;
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

                sheets[0].title = 'Equity Origin';

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
                    fileName: kendoUtility.excelExport.createFileName(fund_type + '_equity_origin', valid_asof),
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
            fileName: kendoUtility.excelExport.createFileName('equity_origin', valid_asof),
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
            width: 90,
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
            attributes: { 'class': 'text-right' },
            field: 'total_nav',
            title: 'Total NAV',
            format: '{0:N2}',
            width: 100,
        }, {
            title: 'Amount (THB)',
            columns: [{
                title: 'Equity',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'equity_thai_amount',
                    title: 'Thai',
                    format: '{0:N2}',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'equity_foreign_amount',
                    title: 'Foreign',
                    format: '{0:N2}',
                    width: 100,
                }],
            }, {
                title: 'Fixed Income',
                columns: [{
                    title: 'Thai',
                    columns: [{
                        attributes: { 'class': 'text-right' },
                        field: 'gov_thai_amount',
                        title: 'Gov',
                        format: '{0:N2}',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'corp_thai_amount',
                        title: 'Corp',
                        format: '{0:N2}',
                        width: 100,
                    }],
                }, {
                    title: 'Foreign',
                    columns: [{
                        attributes: { 'class': 'text-right' },
                        field: 'gov_foreign_amount',
                        title: 'Gov',
                        format: '{0:N2}',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'corp_foreign_amount',
                        title: 'Corp',
                        format: '{0:N2}',
                        width: 100,
                    }],
                }],
            }, {
                title: 'Unit Trust',
                columns: [{
                    title: 'Thai',
                    columns: [{
                        attributes: { 'class': 'text-right' },
                        field: 'unit_trust_thai_amount',
                        title: 'Equity',
                        format: '{0:N2}',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'unit_trust_fi_thai_amount',
                        title: 'FI',
                        format: '{0:N2}',
                        width: 100,
                    }],
                }, {
                    title: 'Foreign',
                    columns: [{
                        attributes: { 'class': 'text-right' },
                        field: 'unit_trust_foreign_amount',
                        title: 'Equity',
                        format: '{0:N2}',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'unit_trust_fi_foreign_amount',
                        title: 'FI',
                        format: '{0:N2}',
                        width: 100,
                    }],
                }],
            }],
        }, {
            title: '% of Total NAV',
            columns: [{
                title: 'Equity',
                columns: [{
                    headerAttributes: { 'data-tooltip': 'Thai', },
                    attributes: { 'class': 'text-right', },
                    field: 'equity_thai_weight',
                    title: 'Thai',
                    format: '{0:N2}',
                    width: 40,
                }, {
                    headerAttributes: { 'data-tooltip': 'Foreign', },
                    attributes: { 'class': 'text-right', },
                    field: 'equity_foreign_weight',
                    title: 'Foreign',
                    format: '{0:N2}',
                    width: 40,
                }],
            }, {
                title: 'Fixed Income',
                columns: [{
                    title: 'Thai',
                    columns: [{
                        headerAttributes: { 'data-tooltip': 'Gov', },
                        attributes: { 'class': 'text-right', },
                        field: 'gov_thai_weight',
                        title: 'Gov',
                        format: '{0:N2}',
                        width: 40,
                    }, {
                        headerAttributes: { 'data-tooltip': 'Corp', },
                        attributes: { 'class': 'text-right', },
                        field: 'corp_thai_weight',
                        title: 'Corp',
                        format: '{0:N2}',
                        width: 40,
                    }],
                }, {
                    title: 'Foreign',
                    columns: [{
                        headerAttributes: { 'data-tooltip': 'Gov', },
                        attributes: { 'class': 'text-right', },
                        field: 'gov_foreign_weight',
                        title: 'Gov',
                        format: '{0:N2}',
                        width: 40,
                    }, {
                        headerAttributes: { 'data-tooltip': 'Corp', },
                        attributes: { 'class': 'text-right', },
                        field: 'corp_foreign_weight',
                        title: 'Corp',
                        format: '{0:N2}',
                        width: 40,
                    }],
                }],
            }, {
                title: 'Unit Trust',
                columns: [{
                    title: 'Thai',
                    columns: [{
                        headerAttributes: { 'data-tooltip': 'Equity', },
                        attributes: { 'class': 'text-right', },
                        field: 'unit_trust_thai_weight',
                        title: 'Equity',
                        format: '{0:N2}',
                        width: 40,
                    }, {
                        headerAttributes: { 'data-tooltip': 'Fixed Income', },
                        attributes: { 'class': 'text-right', },
                        field: 'unit_trust_fi_thai_weight',
                        title: 'FI',
                        format: '{0:N2}',
                        width: 40,
                    }],
                }, {
                    title: 'Foreign',
                    columns: [{
                        headerAttributes: { 'data-tooltip': 'Equity', },
                        attributes: { 'class': 'text-right', },
                        field: 'unit_trust_foreign_weight',
                        title: 'Equity',
                        format: '{0:N2}',
                        width: 40,
                    }, {
                        headerAttributes: { 'data-tooltip': 'Fixed Income', },
                        attributes: { 'class': 'text-right', },
                        field: 'unit_trust_fi_foreign_weight',
                        title: 'FI',
                        format: '{0:N2}',
                        width: 40,
                    }],
                }],
            }],
        }, {
            attributes: { 'class': 'text-center' },
            field: 'asof',
            title: 'As of',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 90,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
function refreshData() {
    valid_asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof = valid_asof.format('YYYY-MM-DD');
    var fund_type = $('#ddlFundType').find('option:selected').val();
    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/equity/equity-origin',
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

                    equity_thai_amount: { type: 'number', },
                    equity_foreign_amount: { type: 'number', },
                    gov_thai_amount: { type: 'number', },
                    gov_foreign_amount: { type: 'number', },
                    corp_thai_amount: { type: 'number', },
                    corp_foreign_amount: { type: 'number', },
                    unit_trust_thai_amount: { type: 'number', },
                    unit_trust_foreign_amount: { type: 'number', },
                    unit_trust_fi_thai_amount: { type: 'number', },
                    unit_trust_fi_foreign_amount: { type: 'number', },

                    equity_thai_weight: { type: 'number', },
                    equity_foreign_weight: { type: 'number', },
                    gov_thai_weight: { type: 'number', },
                    gov_foreign_weight: { type: 'number', },
                    corp_thai_weight: { type: 'number', },
                    corp_foreign_weight: { type: 'number', },
                    unit_trust_thai_weight: { type: 'number', },
                    unit_trust_foreign_weight: { type: 'number', },
                    unit_trust_fi_thai_weight: { type: 'number', },
                    unit_trust_fi_foreign_weight: { type: 'number', },
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