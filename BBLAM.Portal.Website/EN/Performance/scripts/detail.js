var valid_asof = null;
var param_from = $.getUrlVar('from');
var param_to = $.getUrlVar('to');
var param_port = $.getUrlVar('port');
var param_type = $.getUrlVar('type');

$(function () {
    $.ajax({
        async: false,
        type: 'GET',
        url: rootapi + '/api/perf/report/port-performance/avail',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { fund_type: param_type, },
        success: function (data, status, xhr) {
            if (data.length == 4) {
                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
                var from_date = param_from ? moment(param_from, DateFormats.moment.param) : moment(data[1]);
                $('#txtAsof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: from_date,
                    minDate: moment(data[0]),
                    maxDate: moment(data[1]),
                }));
                var to_date = param_to ? moment(param_to, DateFormats.moment.param) : moment(data[3]);
                $('#txtAsofTo').datetimepicker($.extend(true, dp_options, {
                    defaultDate: to_date,
                    minDate: moment(data[2]),
                    maxDate: moment(data[3]),
                }));
            }
            $.App.loadFunds(param_type);
            if (param_port) {
                $('#ddlFund').selectpicker('val', param_port);
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
    var fund_code = $('#ddlFund').find('option:selected').val();
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/perf/report/port-perf-detail',
                },
                parameterMap: function (data, type) {
                    return {
                        start_date: asof.format('YYYY-MM-DD'),
                        end_date: asof_to.format('YYYY-MM-DD'),
                        fund_type: param_type,
                        port_code: fund_code,
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },

                        nav_per_unit: { type: 'number', },
                        port_return: { type: 'number', },
                        port_nav: { type: 'number', },

                        bm0_return: { type: 'number', },
                        bm1_return: { type: 'number', },
                        bm2_return: { type: 'number', },
                        bm3_return: { type: 'number', },

                        bm0_alpha: { type: 'number', },
                        bm1_alpha: { type: 'number', },
                        bm2_alpha: { type: 'number', },
                        bm3_alpha: { type: 'number', },

                        bm0_nav: { type: 'number', },
                        bm1_nav: { type: 'number', },
                        bm2_nav: { type: 'number', },
                        bm3_nav: { type: 'number', },
                    }
                }
            },
            sort: [
                { field: 'asof', dir: 'asc', },
            ],
            change: function (e) {
                var data = this.data().toJSON();
                bindChart(data);
            },
        },
        toolbar: [{
            name: 'excel',
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName(param_port + '_portfolio_performance', asof, asof_to),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        columns: [{
            title: 'Portfolio Performance Report: ' + asof.format('D MMMM YYYY') + ' - ' + asof_to.format('D MMMM YYYY'),
            columns: [{
                attributes: { 'class': 'text-center' },
                field: 'asof',
                title: 'Asof',
                format: '{0:dd-MMM-yyyy}',
                parseFormats: [DateFormats.json],
                width: 100,
            }, {
                attributes: { 'class': 'bold' },
                field: 'port_code',
                title: 'Portfolio',
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'nav_per_unit',
                title: 'NAV/Unit',
                format: '{0:N4}',
                width: 100,
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
        }, {
            title: 'Simulated NAV',
            columns: [{
                attributes: { 'class': 'text-right' },
                field: 'port_nav',
                title: 'Portfolio',
                format: '{0:N4}',
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'bm1_nav',
                title: 'Benchmark',
                format: '{0:N4}',
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'bm2_nav',
                title: 'Benchmark2 (Optional)',
                format: '{0:N4}',
                width: 100,
            }],
        }, {
            attributes: { 'class': 'text-left text-remark' },
            field: 'remark',
            title: 'Remark',
            width: 200,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
function bindChart(data) {
    var series = [];
    series.push({ name: data.length > 0 ? data[0].port_code : param_port, field: 'port_nav', });
    if (data.length > 0) {
        if (data[0].bm0_nav != null) {
            series.push({ name: 'BM (Internal)', field: 'bm0_nav', });
        }
        if (data[0].bm1_nav != null) {
            series.push({ name: 'BM#1 (Prospectus)', field: 'bm1_nav', });
        }
        if (data[0].bm2_nav != null) {
            series.push({ name: 'BM#2 (Optional)', field: 'bm2_nav', });
        }
        if (data[0].bm3_nav != null) {
            series.push({ name: 'BM#3 (Optional)', field: 'bm3_nav', });
        }
    }

    var options = $.extend(true, {}, kendoUtility.chartConfig);
    var $chart = $('#chart');
    $chart.kendoChart($.extend(true, options, {
        dataSource: {
            data: data,
        },
        chartArea: {
            background: 'transparent',
            height: 500,
        },
        dataBound: function (e) {
            /*var result = e.sender.dataSource.data().toJSON();
            if (result.length > 0) {
                var asof = moment(result[0].asof);
                var title = result[0].fund_code + ": " + result[0].fund_name + "\nas of " + asof.format(DateFormats.chart.format) + '\nTotal NAV: ' + kendo.format('{0:N2}', result[0].total_nav) + ' THB';
                e.sender.options.title.text = title;
            }*/
        },
        title: {
            visible: true,
        },
        legend: {
            visible: true,
            labels: {
                template: '#= text #',
            },
        },
        seriesDefaults: {
            type: 'line',
            //style: "smooth",
            width: 3,
            size: 8,
            markers: { visible: false, },
            labels: { visible: false, },
            categoryField: 'asof',
        },
        series: series,
        categoryAxis: {
            majorGridLines: { visible: false, },
            minorTicks: { visible: false, },
            majorTicks: { visible: false, },
            labels: {
                visible: false,
                step: 7,
                format: '{0:dd/MM/yyyy}',
            },
        },
        valueAxis: {
            majorGridLines: { color: '#ccc', },
            title: {
                text: 'NAV (THB)',
            },
            labels: {
                format: '{0:N1}',
            },
        },
        tooltip: {
            visible: true,
            template: function (e) {
                var ret_text = 'N/A';
                var ret = e.dataItem[e.series.field.replace('_nav', '_return')];
                if (ret != null) {
                    var sign = ret >= 0 ? '+' : '';
                    ret_text = sign + kendo.toString(ret, 'N4');
                }
                return "<div class='text-left'><b>" + e.series.name + '</b><br/>As of: ' + kendo.format('{0:dd/MM/yyyy}', e.category) + "<br/>NAV: " + kendo.toString(e.value, 'N4') + " THB<br/>Return: " + ret_text + "</div > ";
            },
        }
    }));

}
