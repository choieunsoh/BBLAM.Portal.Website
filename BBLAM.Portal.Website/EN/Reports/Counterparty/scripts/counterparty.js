var valid_asof = null;
var exclude_fixterm = false;
var promises = [];
var resultAll = [];
var gridArray = {};

$(function () {
    $.ajax({
        async: false,
        type: 'GET',
        url: rootapi + '/api/report/counterparty/avail',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { fund_type: 'MF', },
        success: function (data, status, xhr) {
            if (data.length == 2) {
                var maxDate = moment(data[1]);
                var prevDate = $.App.getPreviousWorkingDate();
                if (maxDate.isBefore(prevDate)) {
                    maxDate = prevDate;
                }
                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, false));
                $('#txtAsof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: prevDate,
                    minDate: moment(data[0]),
                    maxDate: maxDate,
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
    });

    $('#btnTrade').on('click', function (e) {
        e.preventDefault();
        exportAll('Trade');
        return false;
    });
    $('#btnSettlement').on('click', function (e) {
        e.preventDefault();
        exportAll('Settlement');
        return false;
    });


    $('body').on('click', '.open-detail-dialog', function (e) {
        e.preventDefault();

        var $this = $(this);
        var $grid = $this.closest('.k-grid');
        var obj = kendoUtility.grid.getRowData('#' + $grid.attr('id'), $this);
        var asof = moment(obj.asof).format('YYYY-MM-DD');
        var title = obj.counter_party + ': ' + obj.trans_group + ' - ' + (obj.counterparty_type ? obj.counterparty_type + ' - ' : '') + obj.report_title;

        $logDialog = BootstrapDialog.show({
            title: title,
            cssClass: 'dialog-xlg',
            message: function (dialogRef) {
                var $message = $('<div class="row"><div class="col-xs-12"><div id="gridLog" class="grid-xs"></div></div></div>');

                var $grid = $message.find('#gridLog');
                var options = $.extend(true, {}, kendoUtility.gridConfig);
                $grid.empty();
                $grid.kendoGrid($.extend(true, options, {
                    dataSource: {
                        type: "json",
                        transport: {
                            read: {
                                contentType: 'application/json; charset=utf-8',
                                url: rootapi + '/api/report/counterparty/counterparty-line-detail',
                            },
                            parameterMap: function (data, type) {
                                return {
                                    fund_type: $.App.getFundType(),
                                    trade: obj.asof_type == 'Trade' ? asof : '',
                                    settlement: obj.asof_type == 'Settlement' ? asof : '',
                                    exclude_fixterm: exclude_fixterm,
                                    counterparty: obj.counter_party,
                                };
                            },
                        },
                        schema: {
                            model: {
                                fields: {
                                    trade_date: { type: 'date', },
                                    settlement_date: { type: 'date', },

                                    unit: { type: 'number', },
                                    total_amount: { type: 'number', },
                                }
                            }
                        },
                        sort: [
                            { field: 'fund_code', dir: 'asc', },
                            { field: 'symbol', dir: 'asc', },
                        ],
                    },
                    toolbar: [{
                        name: 'excel',
                        template: $("#template").html(),
                    }],
                    excel: {
                        fileName: kendoUtility.excelExport.createFileName(obj.counter_party, moment(obj.asof)),
                    },
                    showTooltip: true,
                    selectable: false,
                    scrollable: true,
                    allowCopy: true,
                    pageable: false,
                    columns: [{
                        attributes: { 'class': 'text-left' },
                        field: 'fund_code',
                        title: 'Fund',
                        filterable: { multi: true, },
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-center' },
                        field: 'trade_date',
                        title: 'Trade Date',
                        format: '{0:dd-MMM-yyyy}',
                        parseFormats: [DateFormats.json],
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-center' },
                        field: 'settlement_date',
                        title: 'Settlement Date',
                        format: '{0:dd-MMM-yyyy}',
                        parseFormats: [DateFormats.json],
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-center' },
                        field: 'trade_type',
                        title: 'Trade Type',
                        filterable: { multi: true, },
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'counter_party',
                        title: 'Counter Party',
                        filterable: { multi: true, },
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'short_name',
                        title: 'Short Name',
                        filterable: { multi: true, },
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'unit',
                        format: '{0:n0}',
                        title: 'Unit',
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'total_amount',
                        format: '{0:n2}',
                        title: 'Total Amount',
                        width: 150,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'trans_group',
                        title: 'Type',
                        filterable: { multi: true, },
                        width: 100,
                    }],
                    change: function (e) {
                    },
                })).data("kendoGrid");

                return $message;
            },
        });

        return false;
    });

});

function exportAll(asof_type) {
    var $container = $('.' + asof_type.toLowerCase() + '-container');
    var grids = $container.find('.grid-xs.k-grid');
    if (grids.length > 0) {
        gridArray = {};
        promises = [];
        resultAll = [];
        for (var i = 0; i < grids.length; i++) {
            var id = $(grids[i]).attr('id');
            var row = $('#' + id + ' thead tr:first-child');
            var trans = row.find('.th-trans').text();
            var cp = row.find('.th-cp').text();
            var title = row.find('.th-title').text();
            gridArray[id] = {
                index: i,
                title: cp ? trans + ' - ' + cp + ' - ' + title : trans + ' - ' + title,
            };
            promises.push($.Deferred());
        }

        for (var i = 0; i < grids.length; i++) {
            if ($(grids[i]).data('kendoGrid')) {
                $(grids[i]).data('kendoGrid').saveAsExcel();
            }
        }

        $.when.apply(null, promises).then(function () {
            var first = '';
            $.each(gridArray, function (k, v) {
                gridArray[k].workbook.sheets[0].rows[0].cells[0].value = gridArray[k].title;
                if (first == '') {
                    first = k;
                } else {
                    $.merge(gridArray[first].workbook.sheets[0].rows, gridArray[k].workbook.sheets[0].rows);
                }
            });
            var sheets = [
                gridArray[first].workbook.sheets[0],
            ];

            kendoUtility.excelExport.addHeader(sheets[0], [
                asof_type + ' Date: ' + valid_asof.format('DD/MM/YYYY'),
            ]);

            sheets[0].title = 'Counterparty';

            var workbook = new kendo.ooxml.Workbook({
                sheets: sheets
            });

            // save the new workbook,b
            var fund_type = $('#ddlFundType').find('option:selected').val().toLowerCase();
            kendo.saveAs({
                dataURI: workbook.toDataURL(),
                fileName: kendoUtility.excelExport.createFileName(fund_type + '_counterparty_' + asof_type.toLowerCase() + '_date', valid_asof),
            })
        });
    } else {
        $.App.ui.dialog.alert('There are no counterparty to export.');
    }

}
function setupGrid() {
    refreshData();
}
function setupCounterpartyGrid($grid, data, title) {
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },

                        sort_order: { type: 'number', },
                        buy_amount: { type: 'number', },
                        sell_amount: { type: 'number', },
                        total_amount: { type: 'number', },
                        net_amount: { type: 'number', },
                        line_amount: { type: 'number', },
                        tier_level: { type: 'number', },
                    }
                }
            },
            sort: {
                //field: 'sort_order', dir: 'asc',
            },
            data: data,
        },
        toolbar: false,
        excel: {
            fileName: kendoUtility.excelExport.createFileName('counterparty', valid_asof),
        },
        excelExport: function (e) {
            e.preventDefault();
            var id = $grid.attr('id');
            var index = gridArray[id].index;
            gridArray[id].workbook = e.workbook;
            promises[index].resolve(e.workbook);
            resultAll.push({
                id: id,
                index: index,
                workbook: e.workbook
            });
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        columns: [{
            headerTemplate: title,
            columns: [{
                attributes: { 'class': 'text-center' },
                field: 'sort_order',
                title: 'No',
                width: 25,
            }, {
                attributes: { 'class': 'bold' },
                field: 'counter_party',
                title: 'Counter Party',
                template: function (e) {
                    return '<a href="#" class="open-detail-dialog">' + e.counter_party + '</a > ';
                },
                width: 100,
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
                title: 'Net',
                template: '#= net_amount.toChangeColor() #',
                width: 75,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'total_amount',
                title: 'Sum',
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
        }],
        dataBound: function (e) {
            kendoUtility.gridConfig.dataBound(e);

        },
        change: function (e) {
        },
    })).data("kendoGrid");
}
function refreshData() {
    valid_asof = moment($('#txtAsof').data('DateTimePicker').date());
    exclude_fixterm = $('#ddlFixTerm').find('option:selected').val() == '1';
    var asof = valid_asof.format('YYYY-MM-DD');
    var fund_type = $('#ddlFundType').find('option:selected').val();
   var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/counterparty/counterparty-line',
            },
            parameterMap: function (data, type) {
                return {
                    asof: asof,
                    fund_type: fund_type,
                    exclude_fixterm: exclude_fixterm,
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

            $('.trade-container span.asof-title').text(valid_asof.format('DD/MM/YYYY'));
            $('.settlement-container span.asof-title').text(valid_asof.format('DD/MM/YYYY'));

            // No Counterparty Line
            refreshNoLineGrid(result, 'Trade', 'Fixed Income');
            refreshNoLineGrid(result, 'Trade', 'Deposit');
            refreshNoLineGrid(result, 'Trade', 'Repo');
            refreshNoLineGrid(result, 'Settlement', 'Fixed Income');
            refreshNoLineGrid(result, 'Settlement', 'Deposit');
            refreshNoLineGrid(result, 'Settlement', 'Repo');

            // Asof Type - Trans Type - Counterparty Type - Tier Level
            for (var i = 1; i <= 3; i++) {
                refreshGrid(result, 'Trade', 'Fixed Income', 'Bank', i);
                refreshGrid(result, 'Trade', 'Fixed Income', 'Finance', i);
                refreshGrid(result, 'Trade', 'Deposit', 'Bank', i);
                refreshGrid(result, 'Trade', 'Deposit', 'Finance', i);
                refreshGrid(result, 'Trade', 'Repo', 'Bank', i);
                refreshGrid(result, 'Trade', 'Repo', 'Finance', i);

                refreshGrid(result, 'Settlement', 'Fixed Income', 'Bank', i);
                refreshGrid(result, 'Settlement', 'Fixed Income', 'Finance', i);
                refreshGrid(result, 'Settlement', 'Deposit', 'Bank', i);
                refreshGrid(result, 'Settlement', 'Deposit', 'Finance', i);
                refreshGrid(result, 'Settlement', 'Repo', 'Bank', i);
                refreshGrid(result, 'Settlement', 'Repo', 'Finance', i);
            }
        },
    });
    dataSource.read();
}
function refreshGrid(result, asof_type, trans_type, counterparty_type, tier_level) {
    var data = $.grep(result, function (e, i) {
        return e.tier_level === tier_level
            && e.asof_type == asof_type
            && e.trans_group == trans_type
            && e.counterparty_type == counterparty_type;
    });

    var $grid = $('.' + asof_type.toLowerCase() + '-container > div[data-trans="' + trans_type[0] + '"] div[data-cp="' + counterparty_type[0] + '"] > div[data-tier="' + tier_level + '"]');
    if (data.length > 0) {
        $grid.show();
        var title = '<div class="th-trans">' + trans_type + '</div><div class="th-cp">' + counterparty_type + '</div><div class="th-title">' + data[0].report_title + '</div>';
        setupCounterpartyGrid($grid, data, title); 
    } else {
        if ($grid.data("kendoGrid")) {
            $grid.data("kendoGrid").destroy();
        }
        $grid.removeClass('k-grid k - widget no- scrollbar');
        $grid.removeAttr('data-role');
        $grid.empty();
        $grid.hide();
    }
}
function refreshNoLineGrid(result, asof_type, trans_type) {
    var data = $.grep(result, function (e, i) {
        return e.tier_level === null
            && e.asof_type == asof_type
            && e.trans_group == trans_type;
    });

    var $grid = $('.' + asof_type.toLowerCase() + '-container > div[data-cp="N"] > div[data-trans="' + trans_type[0] + '"] > div[data-tier="0"]');
    if (data.length > 0) {
        $grid.show();
        var title = '<div class="th-trans">' + trans_type + '</div><div class="th-title">' + data[0].report_title + '</div>';
        setupCounterpartyGrid($grid, data, title);
    } else {
        if ($grid.data("kendoGrid")) {
            $grid.data("kendoGrid").destroy();
        }
        $grid.removeClass('k-grid k - widget no- scrollbar');
        $grid.removeAttr('data-role');
        $grid.empty();
        $grid.hide();
    }
}