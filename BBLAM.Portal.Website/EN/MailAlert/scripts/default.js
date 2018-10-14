var valid_asof = null;
$(function () {
    var prevDate = $.App.getPreviousWorkingDate();
    var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
    $('#txtAsof').datetimepicker($.extend(true, dp_options, {
        defaultDate: prevDate,
    }));

    $('#btnSubmit').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    })

    //setupGrid();
});

function setupGrid() {
    valid_asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof = valid_asof.format('YYYY-MM-DD');
    var fund_type = $('#ddlFundType').find('option:selected').val();
    var limit_type = parseInt($('#ddlLimitType').find('option:selected').val(), 10);

    switch (limit_type) {
        case 1: // Beta
        case 2: // Duration
        case 3: // VaR
            break;
        case 4: // Counterparty
            $('#grid').parent().removeClass('col-lg-6');
            setupCounterpartyGrid(asof, fund_type);
            break;
        case 5: // Equity
            $('#grid').parent().removeClass('col-lg-6').addClass('col-lg-6');
            setupEquityGrid(asof, fund_type);
            break;
        case 6: // Liquidity
            $('#grid').parent().removeClass('col-lg-6');
            setupLiquidityGrid(asof, fund_type);
            break;
        case 7: // Total Deposit
            break;
        case 8: // Total Liabilities
            break;
    }
}
function setupEquityGrid(asof, fund_type) {
    $('#grid2').empty();
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/report/equity/mail-alert',
                },
                parameterMap: function (data, type) {
                    return {
                        asof: asof,
                        fund_type: fund_type,
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },
                        report_date: { type: 'date', },
                        equity_weight: { type: 'number', },
                        limit_min: { type: 'number', },
                        limit_max: { type: 'number', },
                    }
                }
            },
            sort: {
                field: 'fund_code', dir: 'asc',
            },
        },
        toolbar: [{
            name: 'excel',
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('equity_limit', valid_asof),
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
            title: 'Fund',
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'fund_name',
            title: 'Fund Name',
            width: 150,
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
function setupLiquidityGrid(asof, fund_type) {
    $('#grid2').empty();
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/report/liquidity/mail-alert',
                },
                parameterMap: function (data, type) {
                    return {
                        asof: asof,
                        fund_type: fund_type,
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },
                        report_date: { type: 'date', },
                        total_nav: { type: 'number', },
                        liquidity_value: { type: 'number', },
                        liquidity_weight: { type: 'number', },
                        liquidity_limit: { type: 'number', },
                    }
                }
            },
            sort: {
                field: 'fund_code', dir: 'asc',
            },
        },
        toolbar: [{
            name: 'excel',
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('liquidity_limit', valid_asof),
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
            title: 'Fund',
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'fund_name',
            title: 'Fund Name',
            width: 150,
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
            width: 60,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
function setupCounterpartyGrid(asof, fund_type) {
    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/counterparty/mail-alert',
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

            //$('.trade-container span.asof-title').text(valid_asof.format('DD/MM/YYYY'));
            //$('.settlement-container span.asof-title').text(valid_asof.format('DD/MM/YYYY'));

            bindCounterpartGrid($('#grid'), result, 'Trade');
            bindCounterpartGrid($('#grid2'), result, 'Settlement');
        },
    });
    dataSource.read();
}
function bindCounterpartGrid($grid, result, asof_type) {
    var data = $.grep(result, function (e, i) {
        return e.asof_type == asof_type;
    });

    var options = $.extend(true, {}, kendoUtility.gridConfig);
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            data: data,
            schema: {
                model: {
                    fields: {
                        asof: { type: 'date', },
                        tier_level: { type: 'number', },
                        line_amount: { type: 'number', },
                        buy_amount: { type: 'number', },
                        sell_amount: { type: 'number', },
                        net_amount: { type: 'number', },
                        total_amount: { type: 'number', },
                    }
                }
            },
            sort: {
                field: 'fund_code', dir: 'asc',
            },
        },
        toolbar: [{
            name: 'excel',
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('counterparty_line', valid_asof),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        columns: [{
            attributes: { 'class': 'text-center' },
            field: 'asof',
            title: asof_type + ' Date',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 100,
        }, {
            attributes: { 'class': 'text-left' },
            field: 'trans_group',
            title: 'Type',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'tier_level',
            title: 'Tier',
            filterable: { multi: true, },
            width: 50,
        }, {
            attributes: { 'class': 'bold' },
            field: 'counter_party',
            title: 'Counter Party',
            filterable: { multi: true, },
            template: function (e) {
                return '<a href="#" class="open-detail-dialog">' + e.counter_party + '</a > ';
            },
            width: 100,
        }, {
            attributes: { 'class': 'text-left' },
            field: 'counterparty_type',
            title: 'Counterparty Type',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'line_amount',
            title: 'Tier Amount (MB)',
            format: '{0:N2}',
            width: 75,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'buy_amount',
            title: 'Buy',
            format: '{0:N2}',
            width: 75,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'sell_amount',
            title: 'Sell',
            format: '{0:N2}',
            width: 75,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'net_amount',
            title: 'Net Amount (MB)',
            template: '#= net_amount.toChangeColor() #',
            width: 75,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'total_amount',
            title: 'Sum Amount (MB)',
            format: '{0:N2}',
            width: 75,
        }, {
            attributes: { 'class': 'text-left col-remark' },
            title: 'Alert',
            template: function (e) {
                if (e.total_breach_limit && e.net_breach_limit) {
                    return 'Alert Net and Sum Amount';
                } else if (e.total_breach_limit) {
                    return 'Alert Sum Amount';
                } else if (e.net_breach_limit) {
                    return 'Alert Net Amount';
                } else {
                    return '';
                }
            },
            width: 150,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
