var valid_asof = null;

$(function () {
    $.ajax({
        async: false,
        type: 'GET',
        url: rootapi + '/api/perf/report/port-performance/avail',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { fund_type: $('#ddlFundType').find('option:selected').val(), },
        success: function (data, status, xhr) {
            if (data.length == 4) {
                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
                $('#txtAsof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: moment(data[1]),
                    minDate: moment(data[0]),
                    maxDate: moment(data[1]),
                }));
                $('#txtAsofTo').datetimepicker($.extend(true, dp_options, {
                    defaultDate: moment(data[3]),
                    minDate: moment(data[2]),
                    maxDate: moment(data[3]),
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
        setupGrid();
        return false;
    })

});

function setupGrid() {
    var asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof_to = moment($('#txtAsofTo').data('DateTimePicker').date());
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/perf/report/port-perf',
                },
                parameterMap: function (data, type) {
                    return {
                        start_date: asof.format('YYYY-MM-DD'),
                        end_date: asof_to.format('YYYY-MM-DD'),
                        fund_type: $.App.getFundType(),
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        start_date: { type: "date", },
                        end_date: { type: "date", },

                        nav_per_unit: { type: 'number', },
                        port_return: { type: 'number', },

                        bm0_return: { type: 'number', },
                        bm1_return: { type: 'number', },
                        bm2_return: { type: 'number', },
                        bm3_return: { type: 'number', },

                        bm0_alpha: { type: 'number', },
                        bm1_alpha: { type: 'number', },
                        bm2_alpha: { type: 'number', },
                        bm3_alpha: { type: 'number', },
                    }
                }
            },
            sort: [
                { field: 'group_order', dir: 'asc', },
                { field: 'port_code', dir: 'asc', },
            ],
            group: {
                field: 'group_order',
                dir: 'asc',
                aggregates: [
                    { field: 'fund_type', aggregate: 'min', },
                ],
            },
        },
        toolbar: [{
            name: 'excel',
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('portfolio_performance', asof, asof_to),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        columns: [{
            title: 'Portfolio Performance Report: ' + asof.format('D MMMM YYYY') + ' - ' + asof_to.format('D MMMM YYYY'),
            columns: [{
                hidden: true,
                attributes: { 'class': 'bold' },
                groupHeaderTemplate: '#= aggregates.fund_type.min #',
                field: 'group_order',
                title: '#',
                width: 100,
            }, {
                attributes: { 'class': 'bold' },
                field: 'port_code',
                title: 'Portfolio',
                template: function (e) {
                    var fund_type = $('#ddlFundType').find('option:selected').val();
                    return '<a href="Detail.aspx?type=' + fund_type + '&port=' + e.port_code + '&from=' + asof.format('YYYY-MM-DD') + '&to=' + asof_to.format('YYYY-MM-DD') + '" target="_blank">' + e.port_code + '</a>';
                },
                width: 100,
            }, {
                title: 'Period',
                columns: [{
                    attributes: { 'class': 'text-center' },
                    field: 'start_date',
                    title: 'From',
                    format: '{0:dd-MMM-yyyy}',
                    parseFormats: [DateFormats.json],
                    width: 80,
                }, {
                    attributes: { 'class': 'text-center' },
                    field: 'end_date',
                    title: 'To',
                    format: '{0:dd-MMM-yyyy}',
                    parseFormats: [DateFormats.json],
                    width: 80,
                }]
            }, {
                title: 'Portfolio Return (After Fee)',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'port_return',
                    title: 'R(p)',
                    template: '#= port_return != null ? port_return.toChangeColor("{0:P4}") : "" #',
                    width: 100,
                }],
            }, {
                title: 'Benchmark Return',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'bm1_return',
                    title: 'Benchmark',
                    template: '#= bm1_return != null ? bm1_return.toChangeColor("{0:P4}") : "" #',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm2_return',
                    title: 'Benchmark2 (Optional)',
                    template: '#= bm2_return != null ? bm2_return.toChangeColor("{0:P4}") : "" #',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm0_return',
                    title: 'Internal',
                    template: '#= bm0_return != null ? bm0_return.toChangeColor("{0:P4}") : "" #',
                    width: 100,
                }],
            }, {
                title: 'Portfolio Alpha',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'bm1_alpha',
                    title: 'Benchmark',
                    template: '#= bm1_alpha != null ? bm1_alpha.toChangeColor("{0:P4}") : "" #',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm2_alpha',
                    title: 'Benchmark2 (Optional)',
                    template: '#= bm2_alpha != null ? bm2_alpha.toChangeColor("{0:P4}") : "" #',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'bm0_alpha',
                    title: 'Internal',
                    template: '#= bm0_alpha != null ? bm0_alpha.toChangeColor("{0:P4}") : "" #',
                    width: 100,
                }],
            }],
        },{
            attributes: { 'class': 'text-left text-remark' },
            field: 'remark',
            title: 'Remark',
            width: 200,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
