$(function () {
    var dp_options = $.extend(true, {}, bsUtility.datePicker.monthConfig);
    $('#txtAsof').datetimepicker($.extend(true, dp_options, {
        date: moment().add('month', -1).endOf('month'),
    }));

    $('#btnView').on('click', function (e) {
        e.preventDefault();
        setupGrid(false);
        return false;
    });

});

function setupGrid(regen) {
    _setupGrid($('#grid'), '');
    refreshData(regen);
}
function _setupGrid($grid, type) {
    var asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        toolbar: [{
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('pvd_factsheet_summay', asof.format('YYYY-MM')),
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
                hidden: true,
                attributes: { 'class': 'text-center' },
                field: 'report_date',
                title: 'Report Date',
                format: '{0:dd-MMM-yyyy}',
                parseFormats: [DateFormats.json],
                width: 80,
            }, {
                hidden: true,
                field: 'group1',
                groupHeaderTemplate: '#= value.split("_")[1] #',
            }, {
                hidden: true,
                field: 'group2',
                groupHeaderTemplate: '#= value.split("_")[1] #',
            }, {
                attributes: { 'class': 'text-center' },
                field: 'row_no',
                title: 'No.',
                width: 50,
            }, {
                attributes: { 'class': 'bold' },
                field: 'port_code',
                title: 'Port Code',
                width: 75,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'total_nav',
                title: 'Total NAV',
                format: '{0:N2}',
                groupFooterTemplate: function (e) {
                    var value = e.total_nav.sum ? e.total_nav.sum : 0.00;
                    return kendo.format('{0:N2}', value);
                },
                footerTemplate: function (e) {
                    var value = e.total_nav ? e.total_nav.sum : 0.00;
                    return kendo.format('{0:N2}', value);
                },
                width: 125,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'nav',
                title: 'NAV',
                format: '{0:N4}',
                width: 75,
            }, {
                title: 'ย้อนหลัง 1 เดือน',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'port_ret_1m',
                    title: 'Port',
                    template: function (e) {
                        return formatValue(e, 'port_ret_1m');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm_ret_1m',
                    title: 'BM',
                    template: function (e) {
                        return formatValue(e, 'bm_ret_1m');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'alpha_1m',
                    title: 'Alpha',
                    template: function (e) {
                        return formatValue(e, 'alpha_1m');
                    },
                    width: 75,
                }],
            }, {
                title: 'ย้อนหลัง 3 เดือน',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'port_ret_3m',
                    title: 'Port',
                    template: function (e) {
                        return formatValue(e, 'port_ret_3m');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm_ret_3m',
                    title: 'BM',
                    template: function (e) {
                        return formatValue(e, 'bm_ret_3m');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'alpha_3m',
                    title: 'Alpha',
                    template: function (e) {
                        return formatValue(e, 'alpha_3m');
                    },
                    width: 75,
                }],
            }, {
                title: 'ย้อนหลัง 6 เดือน',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'port_ret_6m',
                    title: 'Port',
                    template: function (e) {
                        return formatValue(e, 'port_ret_6m');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm_ret_6m',
                    title: 'BM',
                    template: function (e) {
                        return formatValue(e, 'bm_ret_6m');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'alpha_6m',
                    title: 'Alpha',
                    template: function (e) {
                        return formatValue(e, 'alpha_6m');
                    },
                    width: 75,
                }],
            }, {
                title: 'ย้อนหลัง 1 ปี',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'port_ret_1y',
                    title: 'Port',
                    template: function (e) {
                        return formatValue(e, 'port_ret_1y');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm_ret_1y',
                    title: 'BM',
                    template: function (e) {
                        return formatValue(e, 'bm_ret_1y');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'alpha_1y',
                    title: 'Alpha',
                    template: function (e) {
                        return formatValue(e, 'alpha_1y');
                    },
                    width: 75,
                }],
            }, {
                title: 'ย้อนหลัง 3 ปี',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'port_ret_3y',
                    title: 'Port',
                    template: function (e) {
                        return formatValue(e, 'port_ret_3y');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm_ret_3y',
                    title: 'BM',
                    template: function (e) {
                        return formatValue(e, 'bm_ret_3y');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'alpha_3y',
                    title: 'Alpha',
                    template: function (e) {
                        return formatValue(e, 'alpha_3y');
                    },
                    width: 75,
                }],
            }, {
                title: 'ย้อนหลัง 5 ปี',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'port_ret_5y',
                    title: 'Port',
                    template: function (e) {
                        return formatValue(e, 'port_ret_5y');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm_ret_5y',
                    title: 'BM',
                    template: function (e) {
                        return formatValue(e, 'bm_ret_5y');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'alpha_5y',
                    title: 'Alpha',
                    template: function (e) {
                        return formatValue(e, 'alpha_5y');
                    },
                    width: 75,
                }],
            }, {
                title: 'ย้อนหลัง 10 ปี',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'port_ret_10y',
                    title: 'Port',
                    template: function (e) {
                        return formatValue(e, 'port_ret_10y');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm_ret_10y',
                    title: 'BM',
                    template: function (e) {
                        return formatValue(e, 'bm_ret_10y');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'alpha_10y',
                    title: 'Alpha',
                    template: function (e) {
                        return formatValue(e, 'alpha_10y');
                    },
                    width: 75,
                }],
            }, {
                title: 'ตั้งแต่จัดตั้งกองทุน',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'port_ret_si',
                    title: 'Port',
                    template: function (e) {
                        return formatValue(e, 'port_ret_si');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm_ret_si',
                    title: 'BM',
                    template: function (e) {
                        return formatValue(e, 'bm_ret_si');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'alpha_si',
                    title: 'Alpha',
                    template: function (e) {
                        return formatValue(e, 'alpha_si');
                    },
                    width: 75,
                }],
            }, {
                title: 'YTD',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'port_ret_ytd',
                    title: 'Port',
                    template: function (e) {
                        return formatValue(e, 'port_ret_ytd');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm_ret_ytd',
                    title: 'BM',
                    template: function (e) {
                        return formatValue(e, 'bm_ret_ytd');
                    },
                    width: 75,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'alpha_ytd',
                    title: 'Alpha',
                    template: function (e) {
                        return formatValue(e, 'alpha_ytd');
                    },
                    width: 75,
                }],
            }],
        }],
        dataBound: function (e) {
            kendoUtility.gridConfig.dataBound(e);
        },
        change: function (e) {
        },
    })).data("kendoGrid");
}
function refreshData(regen) {
    var asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/perf/report/monthly-factsheet/summary',
            },
            parameterMap: function (data, type) {
                return {
                    report_date: asof.format('YYYY-MM-DD'),
                    fund_type: 'PVD',
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

            refreshGrid($('#grid'), result);
        },
    });
    dataSource.read();
}
function refreshGrid($grid, result) {
    $.each(result, function (i, o) {
        o.group1 = o.policy_group + '_' + o.policy_group_name;
        o.group2 = o.policy_order + '_' + o.policy_code;
    });
    var ds = new kendo.data.DataSource({
        schema: {
            model: {
                fields: {
                    report_date: { type: "date", },
                    row_no: { type: 'number', },
                    total_nav: { type: 'number', },
                    nav: { type: 'number', },

                    port_ret_1m: { type: 'number', },
                    port_ret_3m: { type: 'number', },
                    port_ret_6m: { type: 'number', },
                    port_ret_1y: { type: 'number', },
                    port_ret_3y: { type: 'number', },
                    port_ret_5y: { type: 'number', },
                    port_ret_10y: { type: 'number', },
                    port_ret_si: { type: 'number', },
                    port_ret_ytd: { type: 'number', },

                    bm_ret_1m: { type: 'number', },
                    bm_ret_3m: { type: 'number', },
                    bm_ret_6m: { type: 'number', },
                    bm_ret_1y: { type: 'number', },
                    bm_ret_3y: { type: 'number', },
                    bm_ret_5y: { type: 'number', },
                    bm_ret_10y: { type: 'number', },
                    bm_ret_si: { type: 'number', },
                    bm_ret_ytd: { type: 'number', },

                    alpha_1m: { type: 'number', },
                    alpha_3m: { type: 'number', },
                    alpha_6m: { type: 'number', },
                    alpha_1y: { type: 'number', },
                    alpha_3y: { type: 'number', },
                    alpha_5y: { type: 'number', },
                    alpha_10y: { type: 'number', },
                    alpha_si: { type: 'number', },
                    alpha_ytd: { type: 'number', },
                }
            }
        },
        group: [
            {
                field: 'group1',
                aggregates: [
                    { field: 'total_nav', aggregate: 'sum', },
                ],
            },
            {
                field: 'group2',
                aggregates: [
                    { field: 'total_nav', aggregate: 'sum', },
                ],
            }
        ],
        aggregate: [
            { field: 'total_nav', aggregate: 'sum', },
        ],
        data: result,
    });
    ds.read();

    var grid = $grid.data("kendoGrid");
    if (grid) {
        grid.setDataSource(ds);
        grid.refresh();
    }
}
function formatValue(e, field) {
    var type = e.policy_group;
    switch (type) {
        case 0:
            return e[field] != null ? moment(e[field].toString(), 'YYYYMMDD').format('DD/MM/YYYY') : '';
        default:
            return e[field] ? e[field].toChangeColor('{0:P4}') : '';
    }
}
