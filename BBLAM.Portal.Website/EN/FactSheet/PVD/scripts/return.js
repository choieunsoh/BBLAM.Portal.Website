var valid_asof = null;
$(function () {
    var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
    $('#txtAsof').datetimepicker($.extend(true, dp_options, {
        date: moment().add('month', -1).endOf('month'),
    }));

    $('#btnView').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    });

    setupGrid();

});

function setupGrid() {
    var asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/perf/report/pvd-ret/summary',
                },
                parameterMap: function (data, type) {
                    return {
                        asof: asof.format('YYYY-MM-DD'),
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },

                        total_nav: { type: 'number', },
                        nav_per_unit: { type: 'number', },
                        port_mtd: { type: 'number', },
                        port_ytd: { type: 'number', },
                        bm_mtd: { type: 'number', },
                        bm_ytd: { type: 'number', },
                    }
                }
            },
        },
        toolbar: [{
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('pvd_return_summay', asof.format('YYYY-MM-DD')),
        },
        selectable: false,
        scrollable: true,
        allowCopy: false,
        pageable: false,
        columns: [{
            attributes: { 'class': 'text-center' },
            field: 'asof',
            title: 'As of',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 80,
        }, {
            attributes: { 'class': 'bold' },
            field: 'port_code',
            title: 'Port Code',
            width: 75,
        }, {
            field: 'policy_group_name',
            title: 'Policy Group',
            filterable: { multi: true, },
            width: 125,
        }, {
            field: 'policy_code',
            title: 'Policy Code',
            filterable: { multi: true, },
            width: 75,
        }, {
            field: 'bm_code',
            title: 'BM Code',
            filterable: { multi: true, },
            width: 75,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'total_nav',
            title: 'Total NAV',
            format: '{0:N2}',
            width: 125,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'nav',
            title: 'NAV',
            format: '{0:N4}',
            width: 75,
        }, {
            title: 'Port Return',
            columns: [{
                attributes: { 'class': 'text-right' },
                field: 'port_mtd',
                title: 'MTD',
                template: function (e) {
                    return e.port_mtd ? e.port_mtd.toChangeColor('{0:P4}') : '';
                },
                width: 75,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'port_ytd',
                title: 'YTD',
                template: function (e) {
                    return e.port_ytd ? e.port_ytd.toChangeColor('{0:P4}') : '';
                },
                width: 75,
            }],
        }, {
            title: 'BM Return',
            columns: [{
                attributes: { 'class': 'text-right' },
                field: 'bm_mtd',
                title: 'MTD',
                template: function (e) {
                    return e.bm_mtd ? e.bm_mtd.toChangeColor('{0:P4}') : '';
                },
                width: 75,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'bm_ytd',
                title: 'YTD',
                template: function (e) {
                    return e.bm_ytd ? e.bm_ytd.toChangeColor('{0:P4}') : '';
                },
                width: 75,
            }],
        }],
        dataBound: function (e) {
            kendoUtility.gridConfig.dataBound(e);
        },
        change: function (e) {
        },
    })).data("kendoGrid");
}
