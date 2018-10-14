$(function () {
    bindChart1();
    bindChart2();
    bindChart3($('#chart3'), 'BP');
    bindChart3($('#chart4'), 'BR');
    bindChart3($('#chart5'), 'SV');
    bindChart3($('#chart6'), 'RR');
    bindChart3($('#chart7'), 'RI');
    bindChart3($('#chart8'), 'AF');
    bindChart3($('#chart9'), 'AM');
    bindChart4($('#chart10'), 'Achara');
    bindChart4($('#chart11'), 'Kiattipong');
    bindChart4($('#chart12'), 'Mayuree');
    bindChart4($('#chart13'), 'Yatawee');
    bindChart4($('#chart14'), 'Napat');
    bindChart4($('#chart15'), 'IT5');
    bindChart5($('#chart16'));
});
function bindChart1() {
    var $chart = $('#chart1');

    var total = $projects.reduce(function (acc, val) { return acc + val.man_day; }, 0);
    var dataSource = new kendo.data.DataSource({
        data: $projects,
        group: {
            field: 'dept',
            aggregates: [
                { field: 'man_day', aggregate: 'sum', },
            ],
        },
    });
    dataSource.read();

    var options = $.extend(true, {}, kendoUtility.chartConfig);
    $chart.kendoChart($.extend(true, options, {
        dataSource: getChartData(),
        chartArea: {
            background: 'transparent',
        },
        dataBound: function (e) {
        },
        title: {
            visible: true,
            text: 'Man-Day by Department (' + kendo.toString(total,'N0') + ' วัน)\nAll IT Resources',
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
                font: '14px Open Sans,tahoma',
                template: "#= category # (#= dataItem.count # งาน): #= kendo.format('{0:N0}', value)# วัน. (#= kendo.format('{0:P2}', percentage)#)",
            }
        },
        series: [{
            overlay: {
                gradient: "none"
            },
            categoryField: 'dept',
            field: 'man_day',
            aggregate: 'sum',
        }],
        tooltip: {
            visible: true,
            template: function (e) {
                return "<div class='text-left'><b>" + e.category + " (" + e.dataItem.count + " งาน)</b>: " + kendo.toString(e.percentage, 'P2') + "<br/>" + kendo.toString(e.value, 'N0') + " วัน.</div>";
            },
        }
    }));

    function getChartData() {
        var chartData = [];
        var view = dataSource.view();
        for (var idx = 0; idx < view.length; idx++) {
            var count = view[idx].items.length;
            if (view[idx].value == 'BR') count -= 2;
            if (view[idx].value == 'RR') count -= 1;
            chartData.push({
                dept: view[idx].value,
                man_day: view[idx].aggregates.man_day.sum,
                count: count,
            });
        }
        return chartData;
    }
}
function bindChart2() {
    var $chart = $('#chart2');

    var devs = ['Jantira', 'Phornphimol', 'Thanawat'];
    var result = $.grep($projects, function (o) {
        return devs.indexOf(o.dev) === -1;
    });
    var total = result.reduce(function (acc, val) { return acc + val.man_day; }, 0);
    var dataSource = new kendo.data.DataSource({
        data: result,
        group: {
            field: 'dept',
            aggregates: [
                { field: 'man_day', aggregate: 'sum', },
            ],
        },
    });
    dataSource.read();

    var options = $.extend(true, {}, kendoUtility.chartConfig);
    $chart.kendoChart($.extend(true, options, {
        dataSource: getChartData(),
        chartArea: {
            background: 'transparent',
        },
        dataBound: function (e) {
        },
        title: {
            visible: true,
            text: 'Man-Day by Department (' + kendo.toString(total, 'N0') + ' วัน)\nExclude Jantira, Phornphimol, Thanawat',
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
                font: '14px Open Sans,tahoma',
                template: "#= category # (#= dataItem.count # งาน): #= kendo.format('{0:N0}', value)# วัน. (#= kendo.format('{0:P2}', percentage)#)",
            }
        },
        series: [{
            overlay: {
                gradient: "none"
            },
            categoryField: 'dept',
            field: 'man_day',
            aggregate: 'sum',
        }],
        tooltip: {
            visible: true,
            template: function (e) {
                return "<div class='text-left'><b>" + e.category + " (" + e.dataItem.count + " งาน)</b>: " + kendo.toString(e.percentage, 'P2') + "<br/>" + kendo.toString(e.value, 'N0') + " วัน.</div>";
            },
        }
    }));

    function getChartData() {
        var chartData = [];
        var view = dataSource.view();
        for (var idx = 0; idx < view.length; idx++) {
            var count = view[idx].items.length;
            if (view[idx].value == 'BR') count -= 2;
            chartData.push({
                dept: view[idx].value,
                man_day: view[idx].aggregates.man_day.sum,
                count: count,
            });
        }
        return chartData;
    }
}
function bindChart3($chart, dept) {
    var devs = ['Jantira', 'Phornphimol', 'Thanawat'];
    var result = $.grep($projects, function (o) {
        return devs.indexOf(o.dev) === -1 && o.dept == dept;
    });
    var total = result.reduce(function (acc, val) { return acc + val.man_day; }, 0);
    var dataSource = new kendo.data.DataSource({
        data: result,
        group: {
            field: 'dev',
            aggregates: [
                { field: 'man_day', aggregate: 'sum', },
            ],
        },
    });
    dataSource.read();

    var options = $.extend(true, {}, kendoUtility.chartConfig);
    $chart.kendoChart($.extend(true, options, {
        dataSource: getChartData(),
        chartArea: {
            background: 'transparent',
        },
        dataBound: function (e) {
        },
        title: {
            visible: true,
            text: dept + ' Man-Day by Developer (' + kendo.toString(total, 'N0') + ' วัน)\nExclude Jantira, Phornphimol, Thanawat',
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
                font: '14px Open Sans,tahoma',
                template: "#= category #: #= dataItem.count # งาน #= kendo.format('{0:N0}', value)# วัน. (#= kendo.format('{0:P2}', percentage)#)",
            }
        },
        series: [{
            overlay: {
                gradient: "none"
            },
            categoryField: 'dev',
            field: 'man_day',
            aggregate: 'sum',
        }],
        tooltip: {
            visible: true,
            template: function (e) {
                return "<div class='text-left'><b>" + e.category + " (" + e.dataItem.count + " งาน)</b>: " + kendo.toString(e.percentage, 'P2') + "<br/>" + kendo.toString(e.value, 'N0') + " วัน.</div>";
            },
        }
    }));

    function getChartData() {
        var chartData = [];
        var view = dataSource.view();
        for (var idx = 0; idx < view.length; idx++) {
            chartData.push({
                dev: view[idx].value,
                man_day: view[idx].aggregates.man_day.sum,
                count: view[idx].items.length,
            });
        }
        return chartData;
    }
}
function bindChart4($chart, dev) {
    var result = $.grep($projects, function (o) {
        return o.dev == dev;
    });
    var total = result.reduce(function (acc, val) { return acc + val.man_day; }, 0);
    var dataSource = new kendo.data.DataSource({
        data: result,
        group: {
            field: 'dept',
            aggregates: [
                { field: 'man_day', aggregate: 'sum', },
            ],
        },
    });
    dataSource.read();

    var options = $.extend(true, {}, kendoUtility.chartConfig);
    $chart.kendoChart($.extend(true, options, {
        dataSource: getChartData(),
        chartArea: {
            background: 'transparent',
        },
        dataBound: function (e) {
        },
        title: {
            visible: true,
            text: dev + '\'s Man-Day (' + kendo.toString(total, 'N0') + ' วัน)',
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
                font: '14px Open Sans,tahoma',
                template: "#= category #: #= dataItem.count # งาน #= kendo.format('{0:N0}', value)# วัน. (#= kendo.format('{0:P2}', percentage)#)",
            }
        },
        series: [{
            overlay: {
                gradient: "none"
            },
            categoryField: 'dept',
            field: 'man_day',
            aggregate: 'sum',
        }],
        tooltip: {
            visible: true,
            template: function (e) {
                return "<div class='text-left'><b>" + e.category + " (" + e.dataItem.count + " งาน)</b>: " + kendo.toString(e.percentage, 'P2') + "<br/>" + kendo.toString(e.value, 'N0') + " วัน.</div>";
            },
        }
    }));

    function getChartData() {
        var chartData = [];
        var view = dataSource.view();
        for (var idx = 0; idx < view.length; idx++) {
            chartData.push({
                dept: view[idx].value,
                man_day: view[idx].aggregates.man_day.sum,
                count: view[idx].items.length,
            });
        }
        return chartData;
    }
}
function bindChart5($chart) {
    var result = $projects.sort(function (a, b) {
        return a.man_day > b.man_day ? -1 : (b.man_day > a.man_day ? 1 : 0);
    }).slice(0, 8);
    var total = result.reduce(function (acc, val) { return acc + val.man_day; }, 0);
    var dataSource = new kendo.data.DataSource({
        data: result,
        group: {
            field: 'name',
            aggregates: [
                { field: 'man_day', aggregate: 'sum', },
            ],
        },
    });
    dataSource.read();

    var options = $.extend(true, {}, kendoUtility.chartConfig);
    $chart.kendoChart($.extend(true, options, {
        dataSource: getChartData(),
        chartArea: {
            background: 'transparent',
        },
        dataBound: function (e) {
        },
        title: {
            visible: true,
            text: 'Top 5 Project (' + kendo.toString(total, 'N0') + ' วัน)',
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
                font: '14px Open Sans,tahoma',
                template: "#= category #: #= dataItem.count # คน #= kendo.format('{0:N0}', value)# วัน. (#= kendo.format('{0:P2}', percentage)#)",
            }
        },
        series: [{
            overlay: {
                gradient: "none"
            },
            categoryField: 'name',
            field: 'man_day',
            aggregate: 'sum',
        }],
        tooltip: {
            visible: true,
            template: function (e) {
                return "<div class='text-left'><b>" + e.category + " (" + e.dataItem.count + " คน)</b>: " + kendo.toString(e.percentage, 'P2') + "<br/>" + kendo.toString(e.value, 'N0') + " วัน.</div>";
            },
        }
    }));

    function getChartData() {
        var chartData = [];
        var view = dataSource.view();
        for (var idx = 0; idx < view.length; idx++) {
            chartData.push({
                name: view[idx].value,
                man_day: view[idx].aggregates.man_day.sum,
                count: view[idx].items.length,
            });
        }
        return chartData;
    }
}
