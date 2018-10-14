var param_from = $.getUrlVar('from');
var param_to = $.getUrlVar('to');
var param_code = $.getUrlVar('code');

$(function () {
    refreshData();
    loadIndex();

    $('#btnView').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    })

});

function refreshData() {
    $.ajax({
        async: false,
        type: 'GET',
        url: rootapi + '/api/perf/index-ret/avail',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { fund_type: $('#ddlFundType').find('option:selected').val(), },
        success: function (data, status, xhr) {
            if (data.length == 2) {
                setDatePicker($('#txtAsof'), data, moment(data[1]).startOf('year'));
                setDatePicker($('#txtAsofTo'), data);
            }
            if (param_from) {
                $('#txtAsof').data("DateTimePicker").date(moment(param_from));
            }
            if (param_to) {
                $('#txtAsofTo').data("DateTimePicker").date(moment(param_to));
            }
        },
        error: function (xhr, status, error) {
            $.App.ui.dialog.alert('Error. ' + error);
        }
    });
}
function setDatePicker($picker, data, current) {
    var $asof = $picker.data("DateTimePicker");
   if (!$asof) {
       var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
        $picker.datetimepicker($.extend(true, dp_options, {
            minDate: moment(data[0]),
            maxDate: moment(data[1]),
            defaultDate: (current !== undefined ? current : moment(data[1])),
        }));
    } else {
       $asof.minDate(moment(data[0]));
       $asof.maxDate(moment(data[1]));
       $asof.date(moment(data[1]));
    }

}

function loadIndex() {
    $.ajax({
        url: rootapi + '/api/perf/index/list',
        global: false,
        type: 'GET',
        success: function (data) {
            bindIndexList(data, $('#ddlIndexCode'), true);
        },
    });
}
function bindIndexList(data, $ddl, autobind) {
    $ddl.html('');
    var $group = null;
    var group = '';
    for (var i = 0; i < data.length; i++) {
        var display_type = data[i].index_type != data[i].index_sub_type ? data[i].index_type + ' - ' + data[i].index_sub_type : data[i].index_type;
        if (group != display_type) {
            if ($group != null) {
                $ddl.append($group);
            }
            $group = $('<optgroup></optgroup>').attr('label', display_type);
            group = display_type;
        }
        var $opt = $('<option></option>')
            .attr('data-subtext', data[i].index_name_html)
            .val(data[i].index_code)
            .html(data[i].index_code);
        $group.append($opt);
    }
    $ddl.append($group);
    $ddl.val('');
    if (param_code) {
        $ddl.val(param_code);
    }
    if (autobind) {
        $ddl.selectpicker('refresh');
        bsUtility.selectPicker.addDeselectEvent($ddl);
    }
    if (param_code) {
        setupGrid();
    }
}
function setupGrid() {
    var asof = param_from ? moment(param_from) : moment($('#txtAsof').data('DateTimePicker').date());
    var asof_to = param_to ? moment(param_to) : moment($('#txtAsofTo').data('DateTimePicker').date());
    var index_code = $('#ddlIndexCode').find('option:selected').val();
    var index_name = $('#ddlIndexCode').find('option:selected').data('subtext');

    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/perf/index-ret-sim',
                },
                parameterMap: function (data, type) {
                    return {
                        start_date: asof.format('YYYY-MM-DD'),
                        end_date: asof_to.format('YYYY-MM-DD'),
                        index_code: index_code ? index_code : '',
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },

                        closed_price: { type: "number", },
                        index_return: { type: "number", },
                        sim_nav: { type: "number", },
                    }
                }
            },
            change: function (e) {
                var data = this.data().toJSON();
                bindChart(data, {
                    index_code: index_code,
                    index_name: index_name,
                    start_date: asof,
                    end_date: asof_to,
                });
            },
        },
        toolbar: [{
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName(index_code, asof, asof_to),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: {
            pageSizes: ['All', 10, 20, 50, 100, 200, 500],
            pageSize: 200,
        },
        columns: [{
            attributes: { 'class': 'text-center' },
            field: 'asof',
            title: 'Asof',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'index_code',
            title: 'Index Code',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'index_name',
            title: 'Index Name',
            width: 250,
        }, {
            attributes: { 'class': '' },
            field: 'index_type',
            title: 'Index Type',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'closed_price',
            format: '{0:#,##0.##########}',
            title: 'Closed Price',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'index_return',
            template: '#= index_return != null ? index_return.toChangeColor("{0:P8}") : "" #',
            title: 'Return',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'sim_nav',
            format: '{0:N6}',
            title: 'Simulated NAV',
            width: 100,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
function bindChart(data, p) {
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

        },
        title: {
            text: p.index_name + ' (' + p.index_code + ')\n' + p.start_date.format('D MMMM YYYY') + ' - ' + p.end_date.format('D MMMM YYYY'),
        },
        legend: {
            visible: false,
            labels: {
                template: '#= text #',
            },
        },
        seriesDefaults: {
            type: 'line',
            width: 3,
            size: 8,
            markers: { visible: false, },
            labels: { visible: false, },
            categoryField: 'asof',
        },
        series: [{
            name: 'Closed Price',
            field: 'closed_price',
        }],
        categoryAxis: {
            majorGridLines: { visible: false, },
            minorTicks: { visible: false, },
            majorTicks: { visible: false, },
            labels: {
                step: 7,
                format: '{0:dd/MM/yyyy}',
            },
        },
        valueAxis: {
            majorGridLines: { color: '#ccc', },
            title: {
                text: 'Closed Price',
            },
            labels: {
                format: '{0:N2}',
            },
        },
        tooltip: {
            visible: true,
            template: function (e) {
                var ret_text = 'N/A';
                var ret = e.dataItem.index_return;
                if (ret != null) {
                    var sign = ret >= 0 ? '+' : '';
                    ret_text = sign + kendo.toString(ret, 'N4');
                }
                return "<div class='text-left'><b>" + e.series.name + '</b><br/>As of: ' + kendo.format('{0:dd/MM/yyyy}', e.category) + "<br/>Closed Price: " + kendo.toString(e.dataItem.closed_price, 'N4') + "<br/>Return: " + ret_text + "<br/>Simulated NAV: " + kendo.toString(e.dataItem.sim_nav, 'N4') + "</div > ";
            },
        }
    }));

}
