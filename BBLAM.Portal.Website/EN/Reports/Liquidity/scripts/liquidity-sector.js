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
        url: rootapi + '/api/report/liquidity/avail',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { fund_type: 'MF', },
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

                var min_rows = 1;
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

                sheets[0].title = 'Liquidity Limit';

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
                kendo.saveAs({
                    dataURI: workbook.toDataURL(),
                    fileName: kendoUtility.excelExport.createFileName('liquidity_detail', valid_asof),
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
            fileName: kendoUtility.excelExport.createFileName('liquidity_detail', valid_asof),
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
            field: 'REPORT_DATE',
            title: 'Date',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 75,
        }, {
            attributes: { 'class': 'bold' },
            field: 'FUND_CODE',
            title: $grid.data('fund'),
            width: 150,
        }, {
            attributes: { 'class': '' },
            field: 'FUND_NAME',
            title: 'Name',
            width: 200,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'TOTAL_NAV',
            title: 'Total NAV',
            format: '{0:N2}',
            width: 100,
        }, {
            title: 'Liquidity (Baht)',
            columns: [{
                headerAttributes: { 'data-tooltip': 'Cash', },
                attributes: { 'class': 'text-right' },
                field: 'CASH_VALUE',
                title: 'Cash',
                format: '{0:N2}',
                width: 100,
            }, {
                headerAttributes: { 'data-tooltip': 'Treasury Bills', },
                attributes: { 'class': 'text-right' },
                field: 'TB_VALUE',
                title: 'TB',
                format: '{0:N2}',
                width: 100,
            }, {
                headerAttributes: { 'data-tooltip': 'Government Bond', },
                attributes: { 'class': 'text-right' },
                field: 'GOV_VALUE',
                title: 'Government',
                format: '{0:N2}',
                width: 100,
            }, {
                headerAttributes: { 'data-tooltip': 'Central Bank Bond', },
                attributes: { 'class': 'text-right' },
                field: 'CB_VALUE',
                title: 'CB',
                format: '{0:N2}',
                width: 100,
            }, {
                headerAttributes: { 'data-tooltip': 'Bond (MOF, FIDF)', },
                attributes: { 'class': 'text-right' },
                field: 'BOND_VALUE',
                title: 'MOF, FIDF',
                format: '{0:N2}',
                width: 100,
            }],
        }, {
            title: 'Liquidity %',
            columns: [{
                headerAttributes: { 'data-tooltip': 'Cash', },
                attributes: { 'class': 'text-right' },
                field: 'CASH_WEIGHT',
                title: 'Cash',
                format: '{0:N2}',
                width: 50,
            }, {
                headerAttributes: { 'data-tooltip': 'Treasury Bills', },
                attributes: { 'class': 'text-right' },
                field: 'TB_WEIGHT',
                title: 'TB',
                format: '{0:N2}',
                width: 50,
            }, {
                headerAttributes: { 'data-tooltip': 'Government Bond', },
                attributes: { 'class': 'text-right' },
                field: 'GOV_WEIGHT',
                title: 'Government',
                format: '{0:N2}',
                width: 50,
            }, {
                headerAttributes: { 'data-tooltip': 'Central Bank Bond', },
                attributes: { 'class': 'text-right' },
                field: 'CB_WEIGHT',
                title: 'CB',
                format: '{0:N2}',
                width: 50,
            }, {
                headerAttributes: { 'data-tooltip': 'Bond (MOF, FIDF)', },
                attributes: { 'class': 'text-right' },
                field: 'BOND_WEIGHT',
                title: 'MOF, FIDF',
                format: '{0:N2}',
                width: 50,
            }],
        }, {
            headerAttributes: { 'data-tooltip': 'Soft Limit', },
            attributes: { 'class': 'text-right' },
            field: 'SOFT_LIMIT',
            title: 'Soft Limit',
            format: '{0:N2}',
            width: 50,
        }, {
            headerAttributes: { 'data-tooltip': 'Hard Limit', },
            attributes: { 'class': 'text-right' },
            field: 'HARD_LIMIT',
            title: 'Hard Limit',
            format: '{0:N2}',
            width: 50,
        }, {
            attributes: { 'class': 'text-left col-remark' },
            field: 'REMARK',
            title: 'Remark',
            width: 150,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'ASOF',
            title: 'As of',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 75,
        }],
        dataBound: function (e) {
            kendoUtility.gridConfig.dataBound(e);
            var status = ['', 'req', 'soft', 'hard'];
            var dataItems = e.sender.dataSource.view();
            for (var j = 0; j < dataItems.length; j++) {
                var code = dataItems[j].get('STATUS_CODE');
                var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                if (code > 0) {
                    row.addClass('row-' + status[code] + '-limit');
                }
            }
        },
        change: function (e) {
        },
    })).data("kendoGrid");
}
function refreshData() {
    valid_asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof = valid_asof.format('YYYY-MM-DD');
    var fund_type = 'MF';
    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/liquidity/liquidity-sector',
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
        return e.GROUP_ORDER === fundID;
    });
    var ds = new kendo.data.DataSource({
        schema: {
            model: {
                fields: {
                    ASOF: { type: "date", },
                    REPORT_DATE: { type: 'date', },

                    TOTAL_NAV: { type: 'number', },
                    CASH_VALUE: { type: 'number', },
                    TB_VALUE: { type: 'number', },
                    GOV_VALUE: { type: 'number', },
                    CB_VALUE: { type: 'number', },
                    BOND_VALUE: { type: 'number', },

                    CASH_WEIGHT: { type: 'number', },
                    TB_WEIGHT: { type: 'number', },
                    GOV_WEIGHT: { type: 'number', },
                    CB_WEIGHT: { type: 'number', },
                    BOND_WEIGHT: { type: 'number', },

                    SOFT_LIMIT: { type: 'number', },
                    HARD_LIMIT: { type: 'number', },
                    STATUS_CODE: { type: 'number', },
                }
            }
        },
        sort: {
            field: 'FUND_CODE', dir: 'asc',
        },
        data: funds,
    });
    ds.read();

    if (funds.length > 0) {
        $grid.show();
        var grid = $grid.data("kendoGrid");
        if (grid) {
            grid.setDataSource(ds);
            grid.refresh();
        }
    } else {
        $grid.hide();
    }
}