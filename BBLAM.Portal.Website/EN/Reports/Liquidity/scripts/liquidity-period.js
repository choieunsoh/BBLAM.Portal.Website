var valid_asof = null;
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
            $.App.loadFunds('MF');
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

});

function setupGrid() {
    setupGridByFundType($('#gridEQ'), true);
    setupGridByFundType($('#gridMX'));
    setupGridByFundType($('#gridFI'));
    setupGridByFundType($('#gridFIF'));

    refreshData();
}
function setupGridByFundType($grid, download) {
    var toolbar = download ? [{
        name: 'excel',
        template: $("#template").html(),
    }] : false;
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        toolbar: toolbar,
        excel: {
            //fileName: kendoUtility.excelExport.createFileName('mf_liquidity_limit', valid_asof),
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
            width: 75,
        }, {
            attributes: { 'class': 'bold' },
            field: 'fund_code',
            title: $grid.data('fund'),
            width: 150,
        }, {
            attributes: { 'class': '' },
            field: 'fund_name',
            title: 'Name',
            width: 200,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'total_nav',
            title: 'Total NAV',
            format: '{0:N2}',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'liquidity_amount',
            title: 'Liquidity (Baht)',
            format: '{0:N2}',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'liquidity_weight',
            title: 'Liquidity %',
            format: '{0:N2}',
            width: 50,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'soft_limit',
            title: 'Soft Limit',
            format: '{0:N2}',
            width: 50,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'hard_limit',
            title: 'Hard Limit',
            format: '{0:N2}',
            width: 50,
        }, {
            attributes: { 'class': 'text-left col-remark' },
            field: 'remark',
            title: 'Remark',
            width: 150,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'asof',
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
                var code = dataItems[j].get('status_code');
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
    var asof = moment($('#txtAsof').data('DateTimePicker').date()).format('YYYY-MM-DD');
    var asof2 = moment($('#txtAsof2').data('DateTimePicker').date()).format('YYYY-MM-DD');
    var fund_type = 'MF';
    var fund_code = $('#ddlFund').find('option:selected').val();

    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/liquidity/period-limit',
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

                    total_nav: { type: 'number', },
                    liquidity_amount: { type: 'number', },
                    liquidity_weight: { type: 'number', },

                    soft_limit: { type: 'number', },
                    hard_limit: { type: 'number', },
                    status_code: { type: 'number', },
                }
            }
        },
        sort: {
            field: 'report_date', dir: 'asc',
        },
        data: funds,
    });
    ds.read();

    var grid = $grid.data("kendoGrid");
    if (grid) {
        var fund_code = $('#ddlFund').find('option:selected').val();
        var asof = moment($('#txtAsof').data('DateTimePicker').date());
        var asof2 = moment($('#txtAsof2').data('DateTimePicker').date());
        grid.options.excel.fileName = kendoUtility.excelExport.createFileName(fund_code + '_liquidity', asof, asof2);

        grid.setDataSource(ds);
        grid.refresh();
    }
    if (funds.length > 0) {
        $grid.show();
    } else {
        $grid.hide();
    }
}