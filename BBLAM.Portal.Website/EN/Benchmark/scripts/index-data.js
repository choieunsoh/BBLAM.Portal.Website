$(function () {
    refreshData();

    $('#btnView').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    })

    $('body').on('click', '.open-sim', function (e) {
        e.preventDefault();
        var asof = moment($('#txtAsof').data('DateTimePicker').date()).format('YYYY-MM-DD');
        var asof_to = moment($('#txtAsofTo').data('DateTimePicker').date()).format('YYYY-MM-DD');
        window.location = 'IndexSim.aspx?code=' + $(this).text() + '&from=' + asof + '&to=' + asof_to;
        return false;
    });
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
                setDatePicker($('#txtAsof'), data);
                setDatePicker($('#txtAsofTo'), data);
            }
            setupGrid();
        },
        error: function (xhr, status, error) {
            $.App.ui.dialog.alert('Error. ' + error);
        }
    });
}
function setDatePicker($picker, data) {
    var $asof = $picker.data("DateTimePicker");
   if (!$asof) {
       var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
        $picker.datetimepicker($.extend(true, dp_options, {
            minDate: moment(data[0]),
            maxDate: moment(data[1]),
            defaultDate: moment(data[1]),
        }));
    } else {
       $asof.minDate(moment(data[0]));
       $asof.maxDate(moment(data[1]));
       $asof.date(moment(data[1]));
    }

}

function bindGrid(data, schema, columns) {
    var asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof_to = moment($('#txtAsofTo').data('DateTimePicker').date());
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            data: data,
            schema: schema,
        },
        toolbar: [{
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('index_return', asof, asof_to),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        sortable: false,
        pageable: {
            pageSizes: ['All', 10, 20, 50, 100, 200, 500],
            pageSize: 200,
        },
        columns: columns,
        change: function (e) {
        },
    })).data("kendoGrid");
}
function setupGrid() {
    var asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof_to = moment($('#txtAsofTo').data('DateTimePicker').date());
    var data_type = $('#ddlDataType').find('option:selected').val();

    var dataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                contentType: 'application/json; charset=utf-8',
                url: rootapi + '/api/perf/index-ret-matrix',
            },
            parameterMap: function (data, type) {
                return {
                    start_date: asof.format('YYYY-MM-DD'),
                    end_date: asof_to.format('YYYY-MM-DD'),
                    data_type: data_type,
                    index_code: '',
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
                var cw = 100;
                var schema = getSchema(result[0]);
                var columns = getCurrencyColumns(result[0], 'C_', cw, 'equity');
                var width = columns.length * cw + 100;
                if (width < $(window).width()) {
                    $('#grid').css({ width: width, });
                }
                $('#grid').data('width', width);
                bindGrid(result, schema, columns);
            }
        },
    });
    dataSource.read();
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
    return {
        model: {
            fields: fields,
        }
    };
}
function getCurrencyColumns(data, prefix, width, asset) {
    var asof_col = [{
        attributes: { 'class': 'text-center' },
        field: 'ASOF',
        title: 'As of',
        format: '{0:dd-MMM-yyyy}',
        parseFormats: [DateFormats.json],
        width: 100,
    }];
    var cols = $.map($.grep(Object.keys(data), function (e, i) {
        return e.startsWith(prefix);
    }), function (o) {
        var code = o.substring(2).replace(/__/g, '+').replace(/_/g, '-');
        return {
            attributes: { 'class': 'text-right' },
            field: o,
            //title: o.substring(2).replace(/__/g,'+').replace(/_/g, '-'),
            headerTemplate: '<a href="#" class="open-sim" data-code="' + code + '">' + code + '</a>',
            format: '{0:#,##0.######}',
            width: width,
        };
        });
    if (cols != null && cols.length > 0) {
        return asof_col.concat(cols);
    } else {
        return asof_col;
    }
}
