var param_from = $.getUrlVar('from');
var param_to = $.getUrlVar('to');
var param_code = $.getUrlVar('code');

$(function () {
    $.ajax({
        async: false,
        type: 'GET',
        url: rootapi + '/api/calc/avail',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: { data_type: 'MF_PORT_RETURN', },
        success: function (data, status, xhr) {
            if (data.length == 2) {
                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
                $('#txtAsof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: moment(data[0]),
                }));
                $('#txtAsofTo').datetimepicker($.extend(true, dp_options, {
                    defaultDate: moment(data[1]),
                }));
            }
        },
        error: function (xhr, status, error) {
            $.App.ui.dialog.alert('Error. ' + error);
        }
    });

    $('#btnView').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    });

    setupGrid();

});

function setupGrid() {
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/calc/perf/mf-port/comp',
                },
            },
            schema: {
                model: {
                    fields: {
                        match: { type: "boolean", },

                        ora_asof: { type: "date", },
                        asof: { type: "date", },
                        updated_date: { type: "date", },

                        ora_total_nav: { type: "number", },
                        total_nav: { type: "number", },
                        ora_nav: { type: "number", },
                        nav: { type: "number", },
                    }
                }
            },
        },
        toolbar: [{
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('compare_mf_port_return'),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        filterable: true,
        filterMenuInit2: function (e) {
            if (e.field === 'match') {
                var filterMultiCheck = this.thead.find("[data-field=" + e.field + "]").data("kendoFilterMultiCheck");
                var json = filterMultiCheck.checkSource.view().toJSON();
                alert(JSON.stringify(json));
                filterMultiCheck.container.empty();
                //filterMultiCheck.checkSource.sort({ field: 'TermInYears', dir: 'asc' });
                filterMultiCheck.checkSource.data(filterMultiCheck.checkSource.view().toJSON());
                filterMultiCheck.createCheckBoxes();
            }
        },
        columns: [{
            attributes: { 'class': 'bold' },
            field: 'port_code',
            title: 'Portfolio',
            width: 100,
        }, {
            title: 'Oracle',
            columns: [{
                attributes: { 'class': 'text-center' },
                field: 'ora_asof',
                title: 'As of',
                format: '{0:dd-MMM-yyyy}',
                parseFormats: [DateFormats.json],
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'ora_total_nav',
                format: '{0:N2}',
                title: 'Total NAV',
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'ora_nav',
                format: '{0:N2}',
                title: 'NAV/Unit',
                width: 100,
            }],
        }, {
            title: 'Risk System',
            columns: [{
                attributes: { 'class': 'text-center' },
                field: 'asof',
                title: 'As of',
                format: '{0:dd-MMM-yyyy}',
                parseFormats: [DateFormats.json],
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'total_nav',
                format: '{0:N2}',
                title: 'Total NAV',
                width: 100,
            }, {
                attributes: { 'class': 'text-right' },
                field: 'nav',
                format: '{0:N2}',
                title: 'NAV/Unit',
                width: 100,
            }],
        }, {
            attributes: { 'class': 'text-center' },
            field: 'match',
            title: 'Status',
            filterable: {
                multi: true,
                itemTemplate: function (e) {
                    if (e.field == "all") {
                        //handle the check-all checkbox template
                        return "<div><label><input type='checkbox' /><span>All</span></label></div>";
                    } else {
                        //handle the other checkboxes
                        return "<div><label><input type='checkbox' name='" + e.field + "' value='#= match #'/><span>#= match ? 'Up to date' : 'Out of date' #</span></label></div>"
                    }
                },
            },
            template: '#= match.formatValue("Up to date", "Out of date", true) #',
            width: 100,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'updated_date',
            title: 'Updated Date',
            format: '{0:dd-MMM-yyyy HH:mm:ss}',
            parseFormats: [DateFormats.json],
            width: 150,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
