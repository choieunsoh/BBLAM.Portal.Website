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
                    defaultDate: moment(data[0]),
                    minDate: moment(data[0]),
                    maxDate: moment(data[1]),
                }));
                $('#txtAsof2').datetimepicker($.extend(true, dp_options, {
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

                sheets[0].title = 'Equity Limit (Period)';

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
                var asof = moment($('#txtAsof').data('DateTimePicker').date());
                var asof2 = moment($('#txtAsof2').data('DateTimePicker').date());
                kendo.saveAs({
                    dataURI: workbook.toDataURL(),
                    fileName: kendoUtility.excelExport.createFileName(fund_type + '_equity_limit', asof, asof2),
                })
            });

        return false;
    })

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
    var toolbar = download ? [{
        name: 'excel',
        template: $("#templateExcelAll").html(),
    }] : false;
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        toolbar: toolbar,
        excel: {
            fileName: kendoUtility.excelExport.createFileName('equity_limit', asof, asof2),
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
            attributes: { 'class': 'bold' },
            field: 'fund_code',
            title: $grid.data('fund'),
            template: function (e) {
                var fund_type = $('#ddlFundType').find('option:selected').val();
                return '<a href="EquityPeriodDetail.aspx?type=' + fund_type + '&fund=' + e.fund_code + '&from=' + asof.format('YYYY-MM-DD') + '&to=' + asof2.format('YYYY-MM-DD') + '" target="_blank">' + e.fund_code + '</a>';
            },
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'fund_name',
            title: 'Name',
            width: 150,
        }, {
            title: 'Period',
            columns: [{
                attributes: { 'class': 'text-center' },
                field: 'from_date',
                title: 'From',
                format: '{0:dd-MMM-yyyy}',
                parseFormats: [DateFormats.json],
                width: 60,
            }, {
                attributes: { 'class': 'text-center' },
                field: 'to_date',
                title: 'To',
                format: '{0:dd-MMM-yyyy}',
                parseFormats: [DateFormats.json],
                width: 60,
            }],
        }, {
            title: '% Equity Actual',
            columns: [{
                attributes: { 'class': 'text-right' },
                field: 'min_equity_weight',
                title: 'Min',
                format: '{0:N2}',
                width: 50,
            },{
                attributes: { 'class': 'text-right' },
                field: 'max_equity_weight',
                title: 'Max',
                format: '{0:N2}',
                width: 50,
            }],
        }, {
            title: 'Equity Limit (IC)',
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
            }],
        }, {
            attributes: { 'class': 'text-center' },
            field: 'breach_limit',
            title: 'Breach Limit (days)',
            width: 50,
        }],
        dataBound: function (e) {
            kendoUtility.gridConfig.dataBound(e);
            var dataItems = e.sender.dataSource.view();
            for (var j = 0; j < dataItems.length; j++) {
                var count = dataItems[j].get('breach_limit');
                if (count > 0) {
                    var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
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
    var fund_type= $('#ddlFundType').find('option:selected').val();
   var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/equity/period-sum',
            },
            parameterMap: function (data, type) {
                return {
                    from_date: asof,
                    to_date: asof2,
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
                    from_date: { type: "date", },
                    to_date: { type: 'date', },

                    min_equity_weight: { type: 'number', },
                    max_equity_weight: { type: 'number', },

                    limit_min: { type: 'number', },
                    limit_max: { type: 'number', },
                    breach_limit: { type: 'number', },
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