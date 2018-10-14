var valid_asof = null;

$(function () {
    //var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, false));
    var dp_options = $.extend(true, {}, bsUtility.datePicker.monthConfig);
    $('#txtAsof').datetimepicker($.extend(true, dp_options, {
        date: moment().add(-1, 'month').endOf('month'),
    }));

    $('#btnView').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    })

    $('#btnGenerate').on('click', function (e) {
        e.preventDefault();
        genReport();
        return false;
    })

});

function genReport() {
    valid_asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
    var asof = valid_asof.format('YYYY-MM-DD');
    $.App.ui.dialog.confirm('Are you sure you want to generate \'Port Performance Report\' as of ' + valid_asof.format('MMMM YYYY') + ' ? ', function (result) {
        if (result) {
            kendoUtility.setProgress(true);
            $.ajax({
                type: "GET",
                data: {
                    asof: asof,
                    fund_type: $.App.getFundType(),
                },
                url: rootapi + '/api/perf/period/gen-report',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (data, status, xhr) {
                    if (data) {
                        $.App.ui.dialog.success('The  \'Port Performance Report\' was generated successfully.', function () {
                            setupGrid();
                            kendoUtility.setProgress(false);
                        });
                    }
                },
                error: function (xhr, status, error) {
                    $.App.ui.dialog.alert('Error. ' + error);
                    kendoUtility.setProgress(false);
                }
            });

        }
    });
}

function setupGrid() {
    valid_asof = moment($('#txtAsof').data('DateTimePicker').date()).endOf('month');
    var asof = valid_asof.format('YYYY-MM-DD');
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/perf/period/get',
                },
                parameterMap: function (data, type) {
                    return {
                        asof: asof,
                        fund_type: $.App.getFundType(),
                        fund_code: '',
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        REPORT_DATE: { type: "date", },
                        P_YTD: { type: 'number', },
                        P_1M: { type: 'number', },
                        P_3M: { type: 'number', },
                        P_6M: { type: 'number', },
                        P_1Y: { type: 'number', },
                        P_3Y: { type: 'number', },
                        P_5Y: { type: 'number', },
                        P_10Y: { type: 'number', },
                        P_INC: { type: 'number', },
                    }
                }
            },
            sort: [
                { field: 'PORT_CODE', dir: 'asc', },
                { field: 'SEQ', dir: 'asc', },
            ],
        },
        toolbar: [{
            name: 'excel',
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('port_performance', moment(valid_asof).format('YYYY-MMMM')),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        columns: [{
            attributes: { 'class': 'text-center' },
            field: 'REPORT_DATE',
            title: 'Date',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 100,
        }, {
            attributes: { 'class': 'bold' },
            field: 'PORT_CODE',
            title: 'Fund',
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'NAME',
            title: 'Type',
            filterable: { multi: true, },
            width: 150,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'P_YTD',
            title: 'YTD',
            template: '#= P_YTD != null ? P_YTD.toChangeColor("{0:N6}") : "" #',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'P_1M',
            title: '1-Month',
            template: '#= P_1M != null ? P_1M.toChangeColor("{0:N6}") : "" #',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'P_3M',
            title: '3-Month',
            template: '#= P_3M != null ? P_3M.toChangeColor("{0:N6}") : "" #',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'P_6M',
            title: '6-Month',
            template: '#= P_6M != null ? P_6M.toChangeColor("{0:N6}") : "" #',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'P_1Y',
            title: '1-Year',
            template: '#= P_1Y != null ? P_1Y.toChangeColor("{0:N6}") : "" #',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'P_3Y',
            title: '3-Year',
            template: '#= P_3Y != null ? P_3Y.toChangeColor("{0:N6}") : "" #',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'P_5Y',
            title: '5-Year',
            template: '#= P_5Y != null ? P_5Y.toChangeColor("{0:N6}") : "" #',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'P_10Y',
            title: '10-Year',
            template: '#= P_10Y != null ? P_10Y.toChangeColor("{0:N6}") : "" #',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'P_INC',
            title: 'Since Inception',
            template: '#= P_INC != null ? P_INC.toChangeColor("{0:N6}") : "" #',
            width: 100,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
