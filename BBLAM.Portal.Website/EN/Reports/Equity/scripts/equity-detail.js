var valid_report_date = null;
var valid_asof = null;
var valid_fund = null;
var param_date = $.getUrlVar('date');
var param_fund = $.getUrlVar('fund');
var param_type = $.getUrlVar('type');
// used to sync the exports
var promiseEQ = $.Deferred();
var promiseFI = $.Deferred();
var promiseFIF = $.Deferred();
var promises = [
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
                var date = param_date ? moment(param_date, DateFormats.moment.param) : moment(data[1]);
                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, false));
                $('#txtAsof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: date,
                    minDate: moment(data[0]),
                    maxDate: moment(data[1]),
                }));
            }
            if (!param_type) {
                param_type = 'MF';
            }
            $('#ddlFundType').val(param_type);
            $('#ddlFundType').selectpicker('refresh');
            $.App.loadFunds(param_type);
            if (param_fund) {
                $('#ddlFund').val(param_fund);
                $('#ddlFund').selectpicker('refresh');
            }
            setupGrid();
        },
        error: function (xhr, status, error) {
            $.App.ui.dialog.alert('Error. ' + error);
        }
    });

    $('#btnView').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    })

    $('#ddlFundType').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var fund_type = $(e.currentTarget).val();
        $.App.loadFunds(fund_type);
    });

    $('body').on('click', '.open-sector-dialog,.open-nosector-dialog', function (e) {
        e.preventDefault();

        var $this = $(this);
        var obj = kendoUtility.grid.getRowData('#gridEQ', $this);
        var asof = valid_report_date.format('YYYY-MM-DD');
        var sector_code = obj.SECTOR_ORDER == 99 ? 'NOSECTOR' : obj.SECTOR_CODE;

        $logDialog = BootstrapDialog.show({
            title: obj.FUND_CODE + ' (' + obj.SECTOR_CODE + ')',
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
                                url: rootapi + '/api/report/equity/equity-sector',
                            },
                            parameterMap: function (data, type) {
                                return {
                                    asof: asof,
                                    fund_type: $.App.getFundType(),
                                    fund_code: obj.FUND_CODE,
                                    sector_code: obj.SECTOR_ORDER == 99 ? '' : obj.SECTOR_CODE,
                                };
                            },
                        },
                        schema: {
                            model: {
                                fields: {
                                    report_date: { type: 'date', },
                                    asof: { type: 'date', },
                                    total_nav: { type: 'number', },
                                    weight: { type: 'number', },
                                    total_value: { type: 'number', },
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
                        fileName: kendoUtility.excelExport.createFileName(obj.FUND_CODE + '_' + sector_code, moment(obj.ASOF)),
                    },
                    showTooltip: true,
                    selectable: false,
                    scrollable: true,
                    allowCopy: true,
                    pageable: false,
                    columns: [{
                        attributes: { 'class': 'text-center' },
                        field: 'asof',
                        title: 'As of',
                        format: '{0:dd-MMM-yyyy}',
                        parseFormats: [DateFormats.json],
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'fund_code',
                        title: 'Fund',
                        width: 100,
                    }, {
                        attributes: { 'class': 'bold' },
                        field: 'security',
                        title: 'Security',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'sector_code',
                        title: 'Sector',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'total_value',
                        format: '{0:n2}',
                        title: 'Amount',
                        width: 150,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'weight',
                        format: '{0:n2}',
                        title: '% of Total NAV',
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'currency',
                        title: 'Currency',
                        width: 75,
                    }],
                    change: function (e) {
                    },
                })).data("kendoGrid");

                return $message;
            },
        });

        return false;
    });

    $('body').on('click', '.open-fixed-income-dialog', function (e) {
        e.preventDefault();

        var $this = $(this);
        var obj = kendoUtility.grid.getRowData('#gridFI', $this);
        var asof = valid_report_date.format('YYYY-MM-DD');

        $logDialog = BootstrapDialog.show({
            title: obj.FUND_CODE + ' (' + obj.SEC_TYPE + ')',
            cssClass: 'dialog-xlg',
            message: function (dialogRef) {
                var $message = $('<div class="row"><div class="col-xs-12"><div id="gridLogFI" class="grid-xs"></div></div></div>');

                var $grid = $message.find('#gridLogFI');
                var options = $.extend(true, {}, kendoUtility.gridConfig);
                $grid.empty();
                $grid.kendoGrid($.extend(true, options, {
                    dataSource: {
                        type: "json",
                        transport: {
                            read: {
                                contentType: 'application/json; charset=utf-8',
                                url: rootapi + '/api/report/equity/fixed-income-sector',
                            },
                            parameterMap: function (data, type) {
                                return {
                                    asof: asof,
                                    fund_type: $.App.getFundType(),
                                    fund_code: obj.FUND_CODE,
                                    sector_code: obj.SEC_TYPE,
                                };
                            },
                        },
                        schema: {
                            model: {
                                fields: {
                                    report_date: { type: 'date', },
                                    asof: { type: 'date', },
                                    total_nav: { type: 'number', },
                                    weight: { type: 'number', },
                                    total_value: { type: 'number', },
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
                        fileName: kendoUtility.excelExport.createFileName(obj.FUND_CODE + '_' + obj.SEC_TYPE, moment(obj.ASOF)),
                    },
                    showTooltip: true,
                    selectable: false,
                    scrollable: true,
                    allowCopy: true,
                    pageable: false,
                    columns: [{
                        attributes: { 'class': 'text-center' },
                        field: 'asof',
                        title: 'As of',
                        format: '{0:dd-MMM-yyyy}',
                        parseFormats: [DateFormats.json],
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'fund_code',
                        title: 'Fund',
                        width: 100,
                    }, {
                        attributes: { 'class': 'bold' },
                        field: 'security',
                        title: 'Security',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'sector_code',
                        title: 'Type',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'total_value',
                        format: '{0:n2}',
                        title: 'Amount',
                        width: 150,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'weight',
                        format: '{0:n2}',
                        title: '% of Total NAV',
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'currency',
                        title: 'Currency',
                        width: 75,
                    }],
                    change: function (e) {
                    },
                })).data("kendoGrid");

                return $message;
            },
        });

        return false;
    });

    $('body').on('click', '.open-unit-trust-dialog', function (e) {
        e.preventDefault();

        var $this = $(this);
        var obj = kendoUtility.grid.getRowData('#gridFIF', $this);
        var asof = valid_report_date.format('YYYY-MM-DD');

        $logDialog = BootstrapDialog.show({
            title: obj.FUND_CODE + ' (' + obj.SEC_TYPE + ')',
            cssClass: 'dialog-xlg',
            message: function (dialogRef) {
                var $message = $('<div class="row"><div class="col-xs-12"><div id="gridLogFIF" class="grid-xs"></div></div></div>');

                var $grid = $message.find('#gridLogFIF');
                var options = $.extend(true, {}, kendoUtility.gridConfig);
                $grid.empty();
                $grid.kendoGrid($.extend(true, options, {
                    dataSource: {
                        type: "json",
                        transport: {
                            read: {
                                contentType: 'application/json; charset=utf-8',
                                url: rootapi + '/api/report/equity/unit-trust-sector',
                            },
                            parameterMap: function (data, type) {
                                return {
                                    asof: asof,
                                    fund_type: $.App.getFundType(),
                                    fund_code: obj.FUND_CODE,
                                    sector_code: obj.SEC_TYPE,
                                };
                            },
                        },
                        schema: {
                            model: {
                                fields: {
                                    report_date: { type: 'date', },
                                    asof: { type: 'date', },
                                    total_nav: { type: 'number', },
                                    weight: { type: 'number', },
                                    total_value: { type: 'number', },
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
                        fileName: kendoUtility.excelExport.createFileName(obj.FUND_CODE + '_' + obj.SEC_TYPE, moment(obj.ASOF)),
                    },
                    showTooltip: true,
                    selectable: false,
                    scrollable: true,
                    allowCopy: true,
                    pageable: false,
                    columns: [{
                        attributes: { 'class': 'text-center' },
                        field: 'asof',
                        title: 'As of',
                        format: '{0:dd-MMM-yyyy}',
                        parseFormats: [DateFormats.json],
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'fund_code',
                        title: 'Fund',
                        width: 100,
                    }, {
                        attributes: { 'class': 'bold' },
                        field: 'security',
                        title: 'Security',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'sector_code',
                        title: 'Type',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'total_value',
                        format: '{0:n2}',
                        title: 'Amount',
                        width: 150,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'weight',
                        format: '{0:n2}',
                        title: '% of Total NAV',
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'currency',
                        title: 'Currency',
                        width: 75,
                    }],
                    change: function (e) {
                    },
                })).data("kendoGrid");

                return $message;
            },
        });

        return false;
    });

    $('body').on('click', '.k-grid-excel-all', function (e) {
        e.preventDefault();

        promises = [];

        if ($('#gridEQ').data('kendoGrid')) {
            promises.push(promiseEQ);
            $('#gridEQ').data('kendoGrid').saveAsExcel();
        }
        if ($('#gridFI').data('kendoGrid')) {
            promises.push(promiseFI);
            $('#gridFI').data('kendoGrid').saveAsExcel();
        }
        if ($('#gridFIF').data('kendoGrid')) {
            promises.push(promiseFIF);
            $('#gridFIF').data('kendoGrid').saveAsExcel();
        }
        // wait for both exports to finish
        $.when.apply(null, promises)
            .then(function (wbEQ, wbFI, wbFIF) {

                // create a new workbook using the sheets of the products and orders workbooks
                var sheets = [];
                if (wbEQ) {
                    buildFooterRow(wbEQ);
                    sheets.push(wbEQ.sheets[0]);
                }
                if (wbFI) {
                    buildFooterRow(wbFI);
                    sheets.push(wbFI.sheets[0]);
                }
                if (wbFIF) {
                    buildFooterRow(wbFIF);
                    sheets.push(wbFIF.sheets[0]);
                }

                var workbook = new kendo.ooxml.Workbook({
                    sheets: sheets
                });

                promiseEQ = $.Deferred();
                promiseFI = $.Deferred();
                promiseFIF = $.Deferred();

                // save the new workbook,b
                var fund_code = $('#ddlFund').find('option:selected').val();
                kendo.saveAs({
                    dataURI: workbook.toDataURL(),
                    fileName: kendoUtility.excelExport.createFileName(fund_code, valid_asof),
                })
            });

        return false;
    })

    $('body').on('click', '.open-currency-dialog', function (e) {
        e.preventDefault();

        var $this = $(this);
        var asset = $this.data('asset');
        var asof = valid_report_date.format('YYYY-MM-DD');
        var currency = $this.data('currency');
        var sector = asset == 'equity' ? 'Sector' : 'Type';

        $logDialog = BootstrapDialog.show({
            title: valid_fund + ' (' + currency + ')',
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
                                url: rootapi + '/api/report/equity/' + asset + '-currency',
                            },
                            parameterMap: function (data, type) {
                                return {
                                    asof: asof,
                                    fund_type: $.App.getFundType(),
                                    fund_code: valid_fund,
                                    currency: currency,
                                };
                            },
                        },
                        schema: {
                            model: {
                                fields: {
                                    report_date: { type: 'date', },
                                    asof: { type: 'date', },
                                    total_nav: { type: 'number', },
                                    weight: { type: 'number', },
                                    total_value: { type: 'number', },
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
                        fileName: kendoUtility.excelExport.createFileName(valid_fund + '_' + currency, moment(valid_asof)),
                    },
                    showTooltip: true,
                    selectable: false,
                    scrollable: true,
                    allowCopy: true,
                    pageable: false,
                    columns: [{
                        attributes: { 'class': 'text-center' },
                        field: 'asof',
                        title: 'As of',
                        format: '{0:dd-MMM-yyyy}',
                        parseFormats: [DateFormats.json],
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'fund_code',
                        title: 'Fund',
                        width: 100,
                    }, {
                        attributes: { 'class': 'bold' },
                        field: 'security',
                        title: 'Security',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'sector_code',
                        title: sector,
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'total_value',
                        format: '{0:n2}',
                        title: 'Amount',
                        width: 150,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'weight',
                        format: '{0:n2}',
                        title: '% of Total NAV',
                        width: 75,
                    }, {
                        attributes: { 'class': 'text-left' },
                        field: 'currency',
                        title: 'Currency',
                        width: 75,
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

function buildFooterRow(workbook) {
    var row = workbook.sheets[0].rows[workbook.sheets[0].rows.length - 1];
    for (var i = 0; i < row.cells.length; i++) {
        row.cells[i].background = '';
        row.cells[i].color = '';
        if (row.cells[i].value) {
            row.cells[i].value = parseFloat(row.cells[i].value.replace(/,/g, ""));
        }
    }
    row.cells[2].value = 'TOTAL';
}

function setupGrid() {
    valid_asof = null;

    refreshData_EQ();
    refreshData_FI();
    refreshData_FIF();

    bindChart($('#chartAC'), false);
    bindChart($('#chartSUB'), true);
}
function refreshData_EQ() {
    valid_report_date = moment($('#txtAsof').data('DateTimePicker').date());
    var asof = valid_report_date.format('YYYY-MM-DD');
    var fund_type = $('#ddlFundType').find('option:selected').val();
    var fund_code = $('#ddlFund').find('option:selected').val();

    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/equity/equity-detail',
            },
            parameterMap: function (data, type) {
                return {
                    asof: asof,
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
            if (result.length > 0) {
                valid_asof = moment(result[0].ASOF);
                valid_fund = result[0].FUND_CODE;
                var cw = 100, ww = 100;
                var schema = getSchema(result[0]);
                var amount_cols = getCurrencyColumns(result[0], 'C_', cw, 'equity');
                var weight_cols = getCurrencyColumns(result[0], 'W_', ww, 'equity');
                if (amount_cols.length === 1) {
                    cw *= 2;
                    ww *= 2;
                }
                var width = amount_cols.length * cw + weight_cols.length * ww + 300;
                var columns = [{
                    attributes: { 'class': 'text-center' },
                    field: 'ASOF',
                    title: 'As of',
                    format: '{0:dd-MMM-yyyy}',
                    parseFormats: [DateFormats.json],
                    width: 90,
                }, {
                    attributes: { 'class': 'bold' },
                    field: 'FUND_CODE',
                    title: 'Fund',
                    width: 100,
                }, {
                    attributes: { 'class': '' },
                    field: 'SECTOR_CODE',
                    title: 'Sector',
                    //template: '<span class="#= SECTOR_ORDER == 99 ? "error-data" : "" #">#= SECTOR_CODE #</span>',
                    template: function (e) {
                        if (e.SECTOR_ORDER == 99)
                            return '<a href="#" class="open-nosector-dialog">No sector</a>'; // <i class="fa fa-search"></i>
                        else
                            return '<a href="#" class="open-sector-dialog">' + e.SECTOR_CODE + '</a > ';
                    },
                    width: 100,
                }, {
                    title: 'Amount (THB)',
                    columns: amount_cols,
                }, {
                    title: '% of Total NAV',
                    columns: weight_cols,
                }];
                if (width < $(window).width()) {
                    $('#gridEQ').css({ width: width, });
                }
                $('#gridEQ').data('width', width);
                bindGrid($('#gridEQ'), true, columns, result, schema, { field: 'SECTOR_ORDER', dir: 'asc', });
            } else {
                if ($("#gridEQ").data("kendoGrid")) {
                    $("#gridEQ").data("kendoGrid").destroy();
                }
                $("#gridEQ").empty();
            }
        },
    });
    dataSource.read();
}
function refreshData_FI() {
    valid_report_date = moment($('#txtAsof').data('DateTimePicker').date());
    var asof = valid_report_date.format('YYYY-MM-DD');
    var fund_type = $('#ddlFundType').find('option:selected').val();
    var fund_code = $('#ddlFund').find('option:selected').val();

    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/equity/fixed-income-detail',
            },
            parameterMap: function (data, type) {
                return {
                    asof: asof,
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
            if (result.length > 0) {
                valid_asof = moment(result[0].ASOF);
                valid_fund = result[0].FUND_CODE;
                var cw = 125, ww = 100;
                var schema = getSchema(result[0]);
                var amount_cols = getCurrencyColumns(result[0], 'C_', cw, 'fixed-income');
                var weight_cols = getCurrencyColumns(result[0], 'W_', ww, 'fixed-income');
                if (amount_cols.length === 1) {
                    cw *= 2;
                    ww *= 2;
                }
                var width = amount_cols.length * cw + weight_cols.length * ww + 400;
                var columns = [{
                    attributes: { 'class': 'text-center' },
                    field: 'ASOF',
                    title: 'As of',
                    format: '{0:dd-MMM-yyyy}',
                    parseFormats: [DateFormats.json],
                    width: 90,
                }, {
                    attributes: { 'class': 'bold' },
                    field: 'FUND_CODE',
                    title: 'Fund',
                    width: 100,
                }, {
                    attributes: { 'class': '' },
                    field: 'SEC_TYPE',
                    title: 'Type',
                    //template: '<span class="#= ASSET_ORDER == 0 ? "type-header" : "type-data" #">#= SEC_TYPE #</span>',
                    template: function (e) {
                        if (e.ASSET_ORDER == 0) {
                            return '<span class="type-header">' + e.SEC_TYPE + '</span>';
                        } else {
                            return '<a href="#" class="open-fixed-income-dialog type-data">' + e.SEC_TYPE + '</a > ';
                        }
                    },
                    width: 200,
                }, {
                    title: 'Amount (THB)',
                    columns: amount_cols,
                }, {
                    title: '% of Total NAV',
                    columns: weight_cols,
                }];
                $('#gridFI').css({ width: width, });
                bindGrid($('#gridFI'), true, columns, result, schema,
                    [
                        { field: 'SUB_ASSET_CLASS', dir: 'desc', },
                        { field: 'ASSET_ORDER', dir: 'asc', }
                    ]
                );
            } else {
                if ($("#gridFI").data("kendoGrid")) {
                    $("#gridFI").data("kendoGrid").destroy();
                }
                $("#gridFI").empty();
            }
        },
    });
    dataSource.read();
}
function refreshData_FIF() {
    valid_report_date = moment($('#txtAsof').data('DateTimePicker').date());
    var asof = valid_report_date.format('YYYY-MM-DD');
    var fund_type = $('#ddlFundType').find('option:selected').val();
    var fund_code = $('#ddlFund').find('option:selected').val();

    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/report/equity/unit-trust-detail',
            },
            parameterMap: function (data, type) {
                return {
                    asof: asof,
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
            if (result.length > 0) {
                valid_asof = moment(result[0].ASOF);
                valid_fund = result[0].FUND_CODE;
                var cw = 125, ww = 100;
                var schema = getSchema(result[0]);
                var amount_cols = getCurrencyColumns(result[0], 'C_', cw, 'unit-trust');
                var weight_cols = getCurrencyColumns(result[0], 'W_', ww, 'unit-trust');
                if (amount_cols.length === 1) {
                    cw *= 2;
                    ww *= 2;
                }
                var width = amount_cols.length * cw + weight_cols.length * ww + 400;
                var columns = [{
                    attributes: { 'class': 'text-center' },
                    field: 'ASOF',
                    title: 'As of',
                    format: '{0:dd-MMM-yyyy}',
                    parseFormats: [DateFormats.json],
                    width: 90,
                }, {
                    attributes: { 'class': 'bold' },
                    field: 'FUND_CODE',
                    title: 'Fund',
                    width: 100,
                }, {
                    attributes: { 'class': '' },
                    field: 'SEC_TYPE',
                    title: 'Type',
                    template: function (e) {
                        return '<a href="#" class="open-unit-trust-dialog">' + e.SEC_TYPE + '</a > ';
                    },
                    width: 200,
                }, {
                    title: 'Amount (THB)',
                    columns: amount_cols,
                }, {
                    title: '% of Total NAV',
                    columns: weight_cols,
                }];
                $('#gridFIF').css({ width: width, });
                bindGrid($('#gridFIF'), true, columns, result, schema, { field: 'ASSET_ORDER', dir: 'asc', });
            } else {
                if ($("#gridFIF").data("kendoGrid")) {
                    $("#gridFIF").data("kendoGrid").destroy();
                }
                $("#gridFIF").empty();
            }
        },
    });
    dataSource.read();
}
function bindGrid($grid, download, cols, data, schema, sorting) {
    var toolbar = download ? [{
        name: 'excel',
        template: $("#template2").html(),
    }] : false;
    var agg = getAggregate(data[0]);
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            schema: schema,
            data: data,
            sort: sorting,
            aggregate: agg,
        },
        toolbar: toolbar,
        excel: {
            fileName: kendoUtility.excelExport.createFileName(data[0].FUND_CODE, valid_report_date),
        },
        excelExport: function (e) {
            e.preventDefault();
            var index = parseInt($grid.data('index'), 10);
            if (index == 0) {
                e.workbook.sheets[0].title = 'Equity';
                promiseEQ.resolve(e.workbook);
            } else if (index == 1) {
                e.workbook.sheets[0].title = 'Fixed Income';
                promiseFI.resolve(e.workbook);
            } else {
                e.workbook.sheets[0].title = 'FIF';
                promiseFIF.resolve(e.workbook);
            }
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        columns: cols,
        change: function (e) {
        },
    })).data("kendoGrid");
    $grid.find('#showGridTitle').text($grid.data('fund'));
}
function getCurrencyColumns(data, prefix, width, asset) {
    return $.map($.grep(Object.keys(data), function (e, i) {
        return e.startsWith(prefix);
    }), function (o) {
        return {
            headerAttributes: { 'data-tooltip': o.substring(2), },
            attributes: { 'class': 'text-right' },
            field: o,
            title: o.substring(2),
            headerTemplate: '<a href="#" class="open-currency-dialog" data-currency="' + o.substring(2) + '" data-asset="' + asset + '">' + o.substring(2) + '</a>',
            format: '{0:N2}',
            footerAttributes: { 'class': 'text-right' },
            footerTemplate: '#= kendo.toString(sum, "n2") #',
            width: width,
        };
    });

}
function getSchema(data) {
    var fields = new Object();
   var keys = Object.keys(data);
   for (var i = 0; i < keys.length; i++) {
       if (keys[i].startsWith('C_') || keys[i].startsWith('W_')) {
           fields[keys[i]] = { type: 'number' };
       }
   }
   fields['ASOF'] = { type: 'date', };
   fields['REPORT_DATE'] = { type: 'date', };
    return {
        model: {
            fields: fields,
        }
    };
}
function getAggregate(data) {
    var aggregate = [];
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].startsWith('C_') || keys[i].startsWith('W_')) {
            aggregate.push({
                field: keys[i],
                aggregate: 'sum',
            });
        }
    }
    return aggregate;
}
function bindChart($chart, subasset) {
    valid_report_date = moment($('#txtAsof').data('DateTimePicker').date());
    var asof = valid_report_date.format('YYYY-MM-DD');
    var fund_type = $('#ddlFundType').find('option:selected').val();
    var fund_code = $('#ddlFund').find('option:selected').val();

    var method = subasset ? 'subasset-class' : 'asset-class';
    var options = $.extend(true, {}, kendoUtility.chartConfig);
    $chart.kendoChart($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/report/equity/' + method,
                },
                parameterMap: function (data, type) {
                    return {
                        asof: asof,
                        fund_type: fund_type,
                        fund_code: fund_code,
                    };
                },
            },
            requestStart: function () {
                kendoUtility.setProgress(true);
            },
        },
        chartArea: {
            background: 'transparent',
            height: 500,
        },
        dataBound: function (e) {
            var result = e.sender.dataSource.data().toJSON();
            if (result.length > 0) {
                var asof = moment(result[0].asof);
                var title = result[0].fund_code + ": " + result[0].fund_name + "\nas of " + asof.format(DateFormats.chart.format) + '\nTotal NAV: ' + kendo.format('{0:N2}', result[0].total_nav) + ' THB';
                e.sender.options.title.text = title;
            }
        },
        title: {
            visible: true,
        },
        legend: {
            labels: {
                template: '#= text #',
            },
        },
        seriesDefaults: {
            type: 'pie',
            labels: {
                visible: true,
                //font: '9px Open Sans,tahoma',
                template: "#= category #: #= kendo.format('{0:N2}', value)# THB. (#= kendo.format('{0:N2}', dataItem.weight)#%)",
            }
        },
        series: [{
            overlay: {
                gradient: "none"
            },
            categoryField: 'asset_class',
            field: 'total_value',
        }],
        tooltip: {
            visible: true,
            template: function (e) {
                return "<div class='text-left'><b>" + e.category + "</b>: " + kendo.toString(e.dataItem.weight, 'N2') + "%<br/>" + kendo.toString(e.value, 'N2') + " THB.</div>";
            },
        }
    }));

}
