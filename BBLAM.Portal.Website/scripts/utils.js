var debugMode = false;
var rootapi = '/' + window.location.pathname.split('/')[1];
rootapi = rootapi.toLowerCase().replace('/en', '');

//ignore added datasource properties
var ignore = ["_handlers", "_events", "idField", "_defaultId", "constructor", "init", "get",
    "_set", "wrap", "bind", "one", "first", "trigger",
    "unbind", "uid", "dirty", "id", "parent"];

var holidays = {
    "2000-02-21": "Makha Bucha Day",
    "2000-05-17": "Visakha Bucha Day",
    "2000-07-17": "Buddhist Lent Day",
    "2001-02-08": "Mid Year Day",
    "2001-05-07": "Visakha Bucha Day",
    "2001-07-06": "Buddhist Lent Day",
    "2002-02-26": "Makha Bucha Day",
    "2002-05-27": "Wisaka Bucha Day(Substitution Day)",
    "2002-07-25": "Buddhist Lent Day",
    "2003-02-17": "Makha Bucha Day (Substitution Day)",
    "2003-05-15": "Wisaka Bucha Day",
    "2003-07-14": "Buddhist Lent Day",
    "2004-03-05": "Makha Bucha Day",
    "2004-06-02": "Wisakha Bucha Day",
    "2004-08-02": "Buddhist Lent Day",
    "2005-02-23": "Makha Bucha Day",
    "2005-05-23": "Wisakha Bucha Day (Substitution Day for Sunday 22 May 2005)",
    "2005-07-22": "Buddhist Lent Day",
    "2006-02-13": "Makha Bucha Day",
    "2006-04-19": "Special Holiday",
    "2006-05-12": "Wisakha Bucha Day",
    "2006-06-12": "Special Holidays (Due to the auspicious occasion of the celebration of 60th Anniversary of His Majesty's Accession to the throne. For Bangkok, Samut Prakan, Nonthaburi, Pathumthani and Nakorn Pathum province)",
    "2006-06-13": "Special Holidays (Due to the auspicious occasion of the celebration of 60th Anniversary of His Majesty's Accession to the throne. For Bangkok, Samut Prakan, Nonthaburi, Pathumthani and Nakorn Pathum province)",
    "2006-07-11": "Buddhist Lent Day",
    "2006-09-20": "Special Holiday",
    "2007-03-05": "Makha Bucha Day (Substitution Day for Saturday 3 March)",
    "2007-05-31": "Wisakha Bucha Day",
    "2007-07-30": "Asarnha Bucha Day (Substitution Day for Sunday 29 July) Effective from B.E. 2550 onwards, the Asarnha Bucha Day is prescribed as a holiday, in replacement of the Buddhist Lent Day",
    "2007-12-24": "Election Day (Substitution for Sunday 23 December 2007",
    "2008-02-21": "Makha Bucha Day",
    "2008-05-19": "Visakabucha's day",
    "2008-07-17": "Asarnha Bucha Day",
    "2009-01-02": "Special Holiday",
    "2009-02-09": "Makha Bucha Day",
    "2009-05-08": "Wisakha Bucha Day",
    "2009-07-06": "Special Holiday",
    "2009-07-07": "Asarnha Bucha Day",
    "2010-03-01": "Substitution for Makha Bucha Day",
    "2010-05-20": "state of emergency",
    "2010-05-21": "state of emergency",
    "2010-05-28": "Wisakha Bucha Day",
    "2010-07-26": "Asarnha Bucha Day",
    "2010-08-13": "Special Holiday",
    "2011-02-18": "Makha Bucha Day",
    "2011-05-16": "Special Holiday",
    "2011-05-17": "Wisakha Bucha Day",
    "2011-07-15": "Asarnha Bucha Day",
    "2012-01-03": "Special Holiday",
    "2012-03-07": "Makha Bucha Day",
    "2012-04-09": "Special Holiday",
    "2012-06-04": "Wisakha Bucha Day",
    "2012-08-02": "Asarnha Bucha Day",
    "2013-02-25": "Makha Bucha Day",
    "2013-05-24": "Wisakha Bucha Day",
    "2013-07-22": "Asarnha Bucha Day",
    "2013-12-30": "Special Holiday",
    "2014-02-14": "Makha Bucha Day",
    "2014-05-13": "Wisakha Bucha Day",
    "2014-07-11": "Asarnha Bucha Day",
    "2014-08-11": "Holiday (Special)",
    "2015-01-02": "Holiday (Special)",
    "2015-03-04": "Makha Bucha Day",
    "2015-05-04": "Special Holiday",
    "2015-06-01": "Wisakha Bucha Day",
    "2015-07-30": "Asarnha Bucha Day",
    "2016-02-22": "Makha Bucha Day",
    "2016-05-06": "Special Holiday",
    "2016-05-20": "Wisakha Bucha Day",
    "2016-07-18": "Special Holiday",
    "2016-07-19": "Asarnha Bucha Day",
    "2017-02-13": "Substitution for Makha Bucha Day",
    "2017-05-10": "Wisakha Bucha Day",
    "2017-07-10": "Substitution for Asarnha Bucha Day",
    "2018-01-02": "Holiday (Special)",
    "2018-03-01": "Makha Bucha Day",
    "2018-05-29": "Wisakha Bucha Day",
    "2018-07-27": "Asarnha Bucha Day",
    "2019-02-19": "Makha Bucha Day",
    "2019-05-20": "Substitution for Wisakha Bucha Day",
    "2019-07-16": "Asarnha Bucha Day",
    "2020-02-10": "Substitution for Makha Bucha Day",
    "2020-05-06": "Wisakha Bucha Day",
    "2020-07-06": "Substitution for Asarnha Bucha Day",
    "2021-02-26": "Makha Bucha Day",
    "2021-05-26": "Wisakha Bucha Day",
    "2021-07-26": "Substitution for Asarnha Bucha Day",
    "2022-02-16": "Makha Bucha Day",
    "2022-05-16": "Substitution for Wisakha Bucha Day",
    "2022-07-13": "Asarnha Bucha Day",
    "2023-03-06": "Makha Bucha Day",
    "2023-06-05": "Substitution for Wisakha Bucha Day",
    "2023-08-01": "Asarnha Bucha Day",
    "2024-02-26": "Substitution for Makha Bucha Day",
    "2024-05-22": "Wisakha Bucha Day",
    "2024-07-22": "Substitution for Asarnha Bucha Day",
    "2025-02-12": "Makha Bucha Day",
    "2025-05-12": "Substitution for Wisakha Bucha Day",
    "2025-07-10": "Asarnha Bucha Day",
    "2026-03-03": "Makha Bucha Day",
    "2026-06-01": "Substitution for Wisakha Bucha Day",
    "2026-07-29": "Asarnha Bucha Day",
    "2027-02-22": "Substitution for Makha Bucha Day",
    "2027-05-20": "Wisakha Bucha Day",
    "2027-07-19": "Substitution for Asarnha Bucha Day",
    "2028-02-10": "Makha Bucha Day",
    "2028-05-08": "Wisakha Bucha Day",
    "2028-07-06": "Asarnha Bucha Day",
    "2029-02-27": "Makha Bucha Day",
    "2029-05-28": "Substitution for Wisakha Bucha Day",
    "2029-07-25": "Asarnha Bucha Day",
    "2030-02-18": "Substitution for Makha Bucha Day",
    "2030-05-16": "Wisakha Bucha Day",
    "2030-07-15": "Substitution for Asarnha Bucha Day",
    "2031-03-07": "Makha Bucha Day",
    "2031-06-04": "Wisakha Bucha Day",
    "2031-08-04": "Substitution for Asarnha Bucha Day",
    "2032-02-25": "Makha Bucha Day",
    "2032-05-24": "Substitution for Wisakha Bucha Day",
    "2032-07-22": "Asarnha Bucha Day",
    "2033-02-14": "Makha Bucha Day",
    "2033-05-13": "Wisakha Bucha Day",
    "2033-07-11": "Asarnha Bucha Day",
    "2034-03-06": "Substitution for Makha Bucha Day",
    "2034-06-01": "Wisakha Bucha Day",
    "2034-07-31": "Substitution for Asarnha Bucha Day",
    "2035-02-22": "Makha Bucha Day",
    "2035-05-21": "Wisakha Bucha Day",
    "2035-07-20": "Asarnha Bucha Day",
    "2036-02-12": "Makha Bucha Day",
    "2036-05-12": "Substitution for Wisakha Bucha Day",
    "2036-07-08": "Asarnha Bucha Day",
    "2037-03-02": "Substitution for Makha Bucha Day",
    "2037-05-29": "Wisakha Bucha Day",
    "2037-07-27": "Asarnha Bucha Day",
    "2038-02-19": "Makha Bucha Day",
    "2038-05-18": "Wisakha Bucha Day",
    "2038-07-16": "Asarnha Bucha Day",
    "2039-02-08": "Makha Bucha Day",
    "2039-05-09": "Substitution for Wisakha Bucha Day",
    "2039-07-05": "Asarnha Bucha Day",
    "2040-02-27": "Substitution for Makha Bucha Day",
    "2040-05-25": "Wisakha Bucha Day",
    "2040-07-23": "Asarnha Bucha Day",
    "2041-02-15": "Makha Bucha Day",
    "2041-05-14": "Wisakha Bucha Day",
    "2041-07-15": "Substitution for Asarnha Bucha Day"
};

// Global Settings
var isIE8lte = $("html").hasClass("lt-ie9");
var DateFormats = {
    json: "yyyy-MM-dd'T'HH:mm:ss.zz",
    json2: "yyyy-MM-dd'T'HH:mm:ss",

    moment: {
        time: {
            format: 'DD MMM YYYY HH:mm:ss',
            format2: 'DD-MMM-YYYY HH:mm:ss',
            long: 'DD MMMM YYYY HH:mm:ss',
            long_th: 'D MMMM พ.ศ. V HH:mm:ss',
            short: 'DD/MM/YYYY HH:mm',
            short2: 'DD/MM/YYYY HH:mm:ss',
            hhmmss: 'HH:mm:ss',
            hhmm: 'HH:mm',
        },
        short: 'DD/MM/YYYY',
        short2: 'DD/MM/YY',
        format: 'DD-MMM-YYYY',
        format2: 'DD-MMM-YY',
        format3: 'DD-MMM',
        long: 'DD MMMM YYYY',
        long_th: 'D MMMM พ.ศ. V',
        longwithtime: 'DD MMMM YYYY HH:mm',
        param: 'YYYY-MM-DD', // DateFormats.moment.param
        paramwithtime: 'YYYY-MM-DD HH:mm:ss',
        month: 'MMMM YYYY',
        month2: 'MMMM',
        month3: 'MMM-YYYY',
        year: 'YYYY',
        filetimestamp: 'YYYY-MM-DD-HHmmss',
        json: "YYYY-MM-DD'T'HH:mm:ssZZ",
        json2: "YYYY-MM-DD'T'HH:mm:ss",
    },

    format: 'dd-MMM-yyyy',
    short: 'dd-MMM-yy',
    long: 'dddd, MMMM d, yyyy',

    grid: {
        my: '{0:MMMM yyyy}',
        month: '{0:MMMM}',
        year: '{0:yyyy}',
        format: '{0:dd-MMM-yyyy}',
        datetime: '{0:dd-MMM-yyyy HH:mm:ss}',
        datetime2: '{0:dd-MMM-yyyy HH:mm}',
        short: '{0:dd-MMM-yy}',
        long: '{0:dddd, MMMM d, yyyy}'
    },

    chart: {
        format: 'D MMMM YYYY',
        long: 'dddd, MMMM D, YYYY'
}
};

/* RegEx */
var acceptSymbol = /(BOTN|BAYCAP#1|TDBCAP#1|TDBCAP#2|GHB15D1|[A-Z]+[0-9]{2}[POND1-9]{1}[A-Z]+|[A-Z]+[0-9]{2}[POND1-9]{1}[0-9]{2}[A-Z]+)/i;

/* Global URL */
var URL = {
    bond: '/EN/BondInfo/BondFeature/Issue.aspx?symbol=',
    issuer: '/EN/Issuer/Detail.aspx?'
};

$.proccessTime = {
    start: function() {
        performanceStart = new Date().getTime();
    },
    finish: function() {
        var now = new Date().getTime();
        $('#procTime').text((now - performanceStart) / 1000.0);
    },
    pageLoad: function () {
        if (window.performance) {
            setTimeout(function () {
                var t = performance.timing;
                $('#procTime').text((t.loadEventEnd - t.responseEnd) / 1000.0);
            }, 0);
        } else { // Older Browser
            this.finish();
        }
    },
};

/* Global KendoGrid config */
var runningNo = 0;
var kendoUtility = (function () {
    var _toCells = function (text) {
        var token = text.split(',');
        var cells = [];
        for (var i = 0; i < token.length; i++) {
            cells.push({ value: token[i] });
        }
        return cells;
    }
    var _toFont = function (fontsize) {
        return fontsize + 'px Open Sans,tahoma';
    }
    var _colors2 = [
            '#000000',
            '#191919',
            '#323232',
            '#4c4c4c',
            '#666666',
            '#7f7f7f',
            '#999999',
            //'#b2b2b2',
            //'#cccccc',
            //'#e5e5e5',
            //'#ffffff',
    ];
    var _colors = [
            '#66CC33', // เขียว
            '#FF9933',	// ส้ม
            '#00CCFF',	// ฟ้า
            '#FC566A',	// แเดงอมชมพู
            '#0071BC',	// น้ำเงิน
            '#D6A477',	// น้ำตาลอ่อน
            '#006E3A',	// เขียวเข้ม
            '#5B57A6',	// ม่วง
            '#E585B7',	// ชมพูอ่อน
            '#971B1E',	// แดงเข้ม            
    ];
    var _fontColor = '#333';
    var pageSize = 20;
    var obj = {
        imageExport: {
            createFileName: function (prefix, start, end) {
                if (arguments.length > 0 && !prefix.endsWith('_')) {
                    prefix += '_';
                }
                if (arguments.length === 0) {
                    return "chart.png";
                } else if (arguments.length === 1) {
                    return prefix + '.png'
                } else if (arguments.length === 2) {
                    if (typeof start === 'string' || start instanceof String) {
                        return prefix + start + '.png';
                    } else {
                        return prefix + moment(start).format(DateFormats.moment.param) + '.png'
                    }
                } else {
                    return prefix + moment(start).format(DateFormats.moment.param) + '_' + moment(end).format(DateFormats.moment.param) + '.png'
                }
            },
        },
        excelExport: {
            createFileName: function (prefix, start, end) {
                if (arguments.length > 0 && !prefix.endsWith('_')) {
                    prefix += '_';
                }
                if (arguments.length === 0) {
                    return "export.xlsx";
                } else if (arguments.length === 1) {
                    return prefix + '.xlsx'
                } else if (arguments.length === 2) {
                    if (typeof start === 'string' || start instanceof String) {
                        return prefix + start + '.xlsx';
                    } else {
                        return prefix + start.format(DateFormats.moment.param) + '.xlsx'
                    }
                } else {
                    return prefix + start.format(DateFormats.moment.param) + '_' + end.format(DateFormats.moment.param) + '.xlsx'
                }
            },
            addHeader: function (sheet, headers) {
                if (arguments.length < 2) return;
                if (typeof headers === 'string') {
                    if (sheet instanceof Array) {
                        sheet.insert(0, { cells: _toCells(headers) });
                    } else {
                        sheet.rows.insert(0, { cells: _toCells(headers) });
                    }
                } else if (headers instanceof Array) {
                    $.each(headers.reverse(), function (i, o) {
                        if (sheet instanceof Array)
                            sheet.insert(0, { cells: [{ value: o }] });
                        else
                            sheet.rows.insert(0, { cells: [{ value: o }] });
                    });
                }
            },
            addRemark: function (sheet, remarks) {
                if (arguments.length === 0) return;
                if (arguments.length === 1) {
                    if (sheet instanceof Array)
                        sheet.push({ cells: [{ value: '' }] });
                    else
                        sheet.rows.push({ cells: [{ value: '' }] });
                } else if (typeof remarks === 'string') {
                    if (sheet instanceof Array)
                        sheet.push({ cells: [{ value: remarks }] });
                    else
                        sheet.rows.push({ cells: [{ value: remarks }] });
                } else if (remarks instanceof Array) {
                    $.each(remarks, function (i, o) {
                        if (sheet instanceof Array)
                            sheet.push({ cells: [{ value: o }] });
                        else
                            sheet.rows.push({ cells: [{ value: o }] });
                    });
                }
            },
            adjustColumnWidth: function (sheet, multipler) {
                if (arguments.length === 0) return;
                if (arguments.length === 1) {
                    multipler = 10;
                }
                sheet.columns.forEach(function (column) {
                    column.autoWidth = false;
                    column.width = column.width * multipler;
                });
            },
            fixedColumnWidth: function (sheet, width) {
                if (arguments.length === 0) return;
                if (arguments.length === 1) {
                    width = 100;
                }
                sheet.columns.forEach(function (column) {
                    column.autoWidth = false;
                    column.width = width;
                });
            },
            customColumnWidth: function (sheet, width, multipler) {
                if (arguments.length === 0) return;
                if (arguments.length > 1 && width instanceof Array) {
                    if (!multipler) {
                        multipler = 1;
                    }
                    if (width.length < sheet.columns.length) {
                        var diff = sheet.columns.length - width.length;
                        for (var i = 0; i < diff; i++) {
                            width.push(100 / multipler);
                        }
                    }
                    var index = 0;
                    sheet.columns.forEach(function (column) {
                        column.autoWidth = false;
                        column.width = width[index++] * multipler;
                    });
                }
            },
            autoColumnWidth: function (sheet) {
                if (arguments.length === 0) return;
                sheet.columns.forEach(function (column) {
                    column.width = null;
                    column.autoWidth = true;
                });
            },
        },
        genGridTitle: function (header, start, end, format) {
            if (!format) format = DateFormats.moment.long;
            if (header) {
                header = header.trim();
                if (start && !header.endsWith('as of')) header += ' as of';
                if (start) header += ' ' + moment(start).format(format);
                if (end) header += ' - ' + moment(end).format(format);
            }
            return header;
        },
        setGridTitle: function ($grid, header, start, end, format) {
            header = obj.genGridTitle(header, start, end);
            if ($grid && header) {
                $grid.find('#showGridTitle').text(header.trim());
            }
        },
        defaultPageSize: pageSize,
        gridPageSize: pageSize,
        grid: {
            refreshDataSource: function ($grid) {
                if ($grid.data('kendoGrid')) {
                    $grid.data('kendoGrid').dataSource.read();
                    $grid.data('kendoGrid').refresh();
                }
            }
        },
        gridConfig: {
            theme: 'bootstrap',
            dataSource: {
                /*requestStart: function () {
                    obj.setProgress(true);
                },
                requestEnd: function () {
                    obj.setProgress(false);
                },*/
            },
            toolbar: [{
                name: 'excel',
                template: $("#templateExportExcel").html()
            }],
            excel: {
                //filterable: true,
                allPages: true,
            },
            navigatable: true,
            filterable: {
                extra: false
            },
            groupable: false,
            //sortable: true,
            sortable: {
                mode: "multiple",
                allowUnsort: true
            },
            reorderable: false,
            resizable: true,
            selectable: 'multiple',
            scrollable: true,
            noRecords: true,
            showTooltip: false,
            messages: {
                noRecords: "No data found."
            },
            pageable: {
                messages: {
                    display: "{0:N0} - {1:N0} of {2:N0} items", //{0} is the index of the first record on the page, {1} - index of the last record on the page, {2} is the total amount of records
                    empty: "No data found.",
                    page: "Page",
                    of: "of {0:N0}", //{0} is total amount of pages
                    itemsPerPage: "items per page",
                    first: "Go to the first page",
                    previous: "Go to the previous page",
                    next: "Go to the next page",
                    last: "Go to the last page",
                    refresh: "Refresh"
                },
                refresh: true,
                pageSize: pageSize,
                pageSizes: ['All', 10, 20, 50, 100],
                buttonCount: 5
            },
            dataBinding: function () {
                runningNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            dataBound: function (e) {
                var grid = e.sender;
                var gridWrapper = e.sender.wrapper;
                var gridDataTable = e.sender.table;
                var gridDataArea = gridDataTable.closest(".k-grid-content");

                // Empty Row
                if (gridDataArea[0] && gridDataTable) {
                    gridWrapper.toggleClass("no-scrollbar", gridDataTable[0].offsetHeight <= gridDataArea[0].offsetHeight);
                }
                if (grid.dataSource.total() === 0) {
                    var gridFooter = $(gridWrapper).find(".k-grid-footer");
                    if (gridFooter) {
                        gridFooter.css({ 'display': 'none' });
                    }
                }

                // Tooltip
                if (grid.options.showTooltip) {
                    grid.thead.kendoTooltip({
                        filter: 'th[data-tooltip]',
                        beforeShow: function (e) {
                            var target = e.target;
                            if (target.data('tooltip')) {
                                
                            } else {
                                e.preventDefault();
                            }
                        },
                        content: function (e) {
                            var target = e.target;
                            var text = target.data('tooltip') ? target.data('tooltip') : target.data('title');
                            var width = target.data('tooltip-width') ? target.data('tooltip-width') + 'px' : 'auto';
                            return $('<div>').text(text).css({
                                'width': width,
                                'padding-left': '10px',
                                'padding-right': '10px',
                            });
                        }
                    });
                }

            },
        },
        setProgress: function (enabled) {
            if (typeof kendo !== 'undefined') {
                kendo.ui.progress($(document.body), enabled);
            }
        },
        dataSource: {
            requestStart: function () {
                obj.setProgress(true);
            },
            requestEnd: function () {
                obj.setProgress(false);
            },
            pageSize: pageSize,
        },
        chart: {
            setMinMaxValueAxis: function ($this, field, options) {
                obj.chart.setMinMaxAxis($this, $this.options.valueAxis, field, options);
            },
            setMinMaxXAxis: function ($this, field, options) {
                obj.chart.setMinMaxAxis($this, $this.options.xAxis, field, options);
            },
            setMinMaxYAxis: function ($this, field, options) {
                obj.chart.setMinMaxAxis($this, $this.options.yAxis, field, options);
            },
            setMinMaxAxis: function ($this, $axis, field, options) {
                var default_options = {
                    field: field,
                    min_field: field,
                    max_field: field,
                    adjust_percent: 10,
                    rounding: false,
                    unit: $axis.majorUnit,
                    min: null,
                    max: null,
                };
                options = $.extend(true, default_options, options);
                var data = $this.dataSource.data().toJSON();
                if (data.length > 0) {
                    var min_value = data.minOf(options.min_field);
                    var max_value = data.maxOf(options.max_field);
                    var step = (max_value - min_value) * options.adjust_percent / 100.0;
                    if (options.rounding) step = 0;
                    min_value = min_value - step;
                    max_value = max_value + step;
                    if (max_value - min_value < options.unit) {
                        options.unit /= 5;
                        $axis.majorUnit = options.unit;
                    }
                    if (options.rounding && options.unit) {
                        min_value = Math.floor(min_value / options.unit) * options.unit;
                        max_value = Math.ceil(max_value / options.unit) * options.unit;
                        var new_unit = (max_value - min_value) / options.unit;
                        if (new_unit < 3) {
                            $axis.majorUnit = options.unit / new_unit;
                        }
                    }
                    $axis.min = options.min != null ? options.min : min_value;
                    $axis.max = options.max != null ? options.max : max_value;
                }
            },
            exportPNG: function ($chart_selector, options) {
                var def_options = {
                    downloadIcon: '<i class="fa fa-download"></i> ',
                    downloadText: 'Download Chart',
                    fileName: 'chart.png',
                };
                options = $.extend(true, def_options, options);

                var $chart = $chart_selector.getKendoChart();
                $chart.exportImage().done(function (data) {
                    kendo.saveAs({
                        dataURI: data,
                        fileName: options.fileName,
                    });
                });
            },
        },
        chartConfig: {
            theme: 'Bootstrap',
            exportPNG: true,
            dataSource: {
                requestStart: function () {
                    obj.setProgress(true);
                },
                requestEnd: function () {
                    obj.setProgress(false);
                },
            },
            chartArea: { background: 'transparent' },
            legend: {
                visible: true,
                labels: { color: _fontColor },
                position: 'top',
                font: _toFont(18)
            },
            title: {
                color: _fontColor,
                font: _toFont(16),
            },
            tooltip: {
                visible: true,
                font: _toFont(15)
            },
            seriesDefaults: {
                width: 2,
                size: 5,
            },
            axisDefaults: {
                majorGridLines: { visible: true, step: 1, color: '#666', },
                minorTicks: { visible: false, size: 5 },
                majorTicks: { visible: true, size: 5 },
                crosshair: {
                    color: '#f99',
                    width: 2,
                    visible: true,
                    tooltip: {
                        border: { width: 0, },
                        padding: 0,
                        font: _toFont(10),
                        format: '{0:N2}',
                        visible: false,
                    },
                },
                labels: {
                    font: _toFont(12),
                    format: '{0}'
                },
                title: {
                    font: _toFont(14)
                },
            },
            valueAxis: {
                color: _fontColor,
            },
            categoryAxis: {
                color: _fontColor,
                labels: {
                    rotation: 'auto',
                },
            },
            xAxis: {
                color: _fontColor,
                majorUnit: 5,
            },
            yAxis: {
                color: _fontColor,
                labels: {
                    format: '{0:N2}'
                },
            },
            //pannable: true,
            /*zoomable: {
                selection: {
                    key: 'none',
                    lock: 'y',
                },
                mousewheel: {
                    lock: 'y',
                },
            },*/
            seriesColors: _colors,
            render: function (e) {
                var _this = this;
                if (_this.options.exportPNG) {
                    var def_options = {
                        downloadIcon: '<i class="fa fa-camera"></i> ',
                        downloadText: '',
                        buttonClass: 'export-png',
                        fileName: 'chart.png',
                    };
                    var options = $.extend(true, def_options, _this.options.exportPNG);

                    var chart = $(this.wrapper);
                    chart.find('div.export.png').remove();
                    chart.prepend('<div class="' + options.buttonClass + '"><button class="btn btn-default" title="Save chart as...">' + options.downloadIcon + options.downloadText + '</button></div>');
                    chart.off('click', '.' + options.buttonClass + ' button');
                    chart.on('click', '.' + options.buttonClass + ' button', function (e) {
                        e.preventDefault();
                        obj.chart.exportPNG(chart, options);
                        return false;
                    });
                }
            },
        },
        getMarkers: function (size) {
            if (!size) size = 5;
            return {
                size: size, visible: true,
                background: function (e) {
                    return e.series.color;
                },
            }
        },
        colors: _colors,
        autoComplete: {
            defaultConfig: {
                animation: {
                    close: {
                        effects: 'fadeOut zoom:out',
                        duration: 300
                    },
                    open: {
                        effects: 'fadeIn zoom:in',
                        duration: 300
                    }
                },
                virtual: false,
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                delay: 500,
                minLength: 1,
                filter: 'startswith',
                filtering: function (e) {
                    if (e.filter.value === '') {
                        e.preventDefault();
                        e.sender.dataSource.data([]);
                    }
                },
            },
            setupBusinessSector: function ($txt, selectCallback, width) {
                var options = $.extend(true, {}, obj.autoComplete.defaultConfig);
                var autoComplete = $txt.kendoAutoComplete($.extend(true, options, {
                    template:
                        '<table>' +
                            '<td>#= BusinessSectorCode #</td>' +
                            '<td>#= BusinessSectorNameEN #</td>' +
                        '</table>',
                    dataTextField: 'BusinessSectorCode',
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: '/api/issuer/businesssector/'
                            },
                            parameterMap: function (data, type) {
                                if (type === 'read') { return { searchData: data.filter.filters[0].value } }
                            }
                        },
                    },
                    select: selectCallback
                })).data("kendoAutoComplete");
                if (!width) {
                    width = 400;
                }
                autoComplete.list.width(width); //adjust width of the drop-down list
            },
            setupIssuer: function ($txt, selectCallback, width) {
                var options = $.extend(true, {}, obj.autoComplete.defaultConfig);
                var autoComplete2 = $txt.kendoAutoComplete($.extend(true, options, {
                    template:
                        '<table>' +
                            '<td>#= IssuerAbbrName #</td>' +
                            '<td>#= IssuerNameEN #</td>' +
                        '</table>',
                    dataTextField: 'IssuerAbbrName',
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: '/api/issuer/listissuer/'
                            },
                            parameterMap: function (data, type) {
                                if (type === 'read') { return { abbrName: data.filter.filters[0].value } }
                            }
                        },
                    },
                    select: selectCallback
                })).data("kendoAutoComplete");
                if (!width) {
                    width = 800;
                }
                autoComplete2.list.width(width); //adjust width of the drop-down list
            },
            setupSymbol: function ($txt, selectCallback, width) {
                var options = $.extend(true, {}, obj.autoComplete.defaultConfig);
                var autoComplete2 = $txt.kendoAutoComplete($.extend(true, options, {
                    dataTextField: 'Symbol',
                    dataValueField: 'Symbol',
                    dataSource: {
                        transport: {
                            read: {
                                dataType: "json",
                                url: "/api/issuesymbol/getsymbolAll"
                            },
                        },
                    },
                    select: selectCallback,
                    open: function (e) {
                        e.sender.list.parent().css({ left: '0px', top: '0px' });
                    }
                })).data("kendoAutoComplete");
                if (!width) {
                    width = autoComplete2.size().width;
                }
                if (width) {
                    autoComplete2.list.width(width);
                }
            },
        },
        multiSelect: {
            defaultConfig: {
                filter: 'startswith',
                minLength: 1,
                maxSelectedItems: 5,
            },
            setupSymbol: function($txt, opt) {
                var options = $.extend(true, {}, obj.multiSelect.defaultConfig);
                if (opt) {
                    options = $.extend(true, options, opt);
                }
                var $multi = $txt.kendoMultiSelect($.extend(true, options, {
                    placeholder: 'Enter symbol...',
                    dataTextField: 'Symbol',
                    dataValueField: 'Symbol',
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: {
                                dataType: "json",
                                url: "/api/issuesymbol/getsymbol"
                            },
                            parameterMap: function (data, type) {
                                if (data.filter && data.filter.filters && data.filter.filters.length > 0) {
                                    if (type === 'read') { return { Symbol: data.filter.filters[0].value } }
                                }
                            },
                        }
                    },
                })).data("kendoMultiSelect");
                return $multi;
            },
        },
        comparer: {
            getRatingValue: function(a) {
                var L = a.isLetter(a.length - 1);
                var o = L ? a.length : a.length - 1;
                var s = L ? 0 : (-1 * parseInt(a.substr(a.length - 1, 1) + '1') / 100.0);
                return a.charCodeAt(0) + 0.5 - o / 10.0 + s;
            },
            compareRating: function (a, b, prop) {
                return this.getRatingValue(a[prop]) - this.getRatingValue(b[prop]);
            },
        },
        sparkline: {
            changeBarConfig: {
                type: 'bar',
                renderAs: 'canvas',
                chartArea: {
                    background: '',
                },
                series: [{
                    color: '#3ac471',
                    negativeColor: "#f84254"
                }],
                categoryAxis: {
                    visible: false,
                    majorTicks: {
                        visible: false
                    }
                }
            },
        },
        upload: {
            validationConfig: {
                fileselector: '.k-upload-files .k-file-name',
                error: {
                    alert: true,
                    allowedExtensions: 'You can only upload {0} files.',
                    maxFileSize: 'Maximum allowed file size is {0}.',
                    maxFiles: 'Maximum allowed {0} files.',
                    duplicateFile: 'You can only upload \'{0}\' at once.',
                },
                allowedExtensions: ['.pdf', '.txt', '.jpg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.ppt', '.pptx'],
                maxFileSize: 1024 * 1024 * 1, // 1MB
                maxFiles: 5,
                accumulateSize: false,
            },
            validate: function (e, options) {
                if (arguments.length == 1) {
                    options = obj.upload.validationConfig;
                }
                var selected = e.files;
                var filesInList = $(options.fileselector);

                // Check No. of Files
                if (filesInList.length >= options.maxFiles) {
                    if (options.error.alert) {
                        $.App.ui.dialog.alert(kendo.format(options.error.maxFiles, options.maxFiles));
                    }
                    e.preventDefault();
                    return false;
                }

                // Check Accumulate Size
                var accSize = 0;
                filesInList.each(function () {
                    accSize += parseInt($(this).data('size'), 10);
                });
                if (options.accumulateSize && accSize > options.maxFileSize) {
                    if (options.error.alert) {
                        $.App.ui.dialog.alert(kendo.format(options.error.maxFileSize, options.maxFileSize));
                    }
                    e.preventDefault();
                    return false;
                }

                for (var i = 0; i < selected.length; i++) {
                    var filename = selected[i].name;
                    var ext = selected[i].extension;
                    var size = selected[i].size;

                    // Check File Extension
                    var valid = options.allowedExtensions.contains(ext);
                    if (!valid) {
                        if (options.error.alert) {
                            $.App.ui.dialog.alert(kendo.format(options.error.allowedExtensions, options.allowedExtensions.join(', ')));
                        }
                        e.preventDefault();
                        return false;
                    }

                    function getSizeText(size) {
                        var KB = 1024;
                        var MB = KB * KB;
                        var GB = MB * KB;
                        var TB = GB * KB;
                        if (size > TB) {
                            return kendo.format('{0:N2}TB', size / TB).replace('.00', '');
                        } else if (size >= GB) {
                            return kendo.format('{0:N2}GB', size / GB).replace('.00', '');
                        } else if (size >= MB) {
                            return kendo.format('{0:N2}MB', size / MB).replace('.00', '');
                        } else if (size >= KB) {
                            return kendo.format('{0:N2}KB', size / KB).replace('.00', '');
                        } else {
                            return kendo.format('{0:N2}byte', size);
                        }
                    }

                    // Check File Size
                    if (!options.accumulateSize && size > options.maxFileSize) {
                        if (options.error.alert) {
                            $.App.ui.dialog.alert(kendo.format(options.error.maxFileSize, getSizeText(options.maxFileSize)));
                        }
                        e.preventDefault();
                        return false;
                    }

                    // Check Duplicate
                    filesInList.each(function () {
                        if ($(this).data('name') === filename) {
                            if (options.error.alert) {
                                $.App.ui.dialog.alert(kendo.format(options.error.duplicateFile, filename));
                            }
                            e.preventDefault();
                            return false;
                        }
                    });
                }
            },
        },
        grid: {
            getRowData: function ($grid, $control) {
                if (typeof $grid === 'string' || $grid instanceof String) {
                    $grid = $($grid).data('kendoGrid');
                }
                if ($grid) {
                    return $grid.dataItem($control.closest("tr"));
                }
                return null;
            }
        },
    };
    return obj;
})();

var bsUtility = (function () {
    var _bindData = function ($select, data, setMax, valField, textField, callback) {
        $select.each(function () {
            $(this).selectpicker('refresh');
            $(this).find('option:not(:first)').remove();
            for (var i = 0; i < data.length; i++) {
                var $opt;
                if (valField && textField) {
                    $opt = $('<option></option>').val(data[i][valField]).html(data[i][textField]);
                } else {
                    $opt = $('<option></option>').val(data[i]).html(data[i]);
                }
                $(this).append($opt);
            }
            if (setMax) {
                if (valField && textField) {
                    $(this).val(data[data.length - 1][valField]);
                } else {
                    $(this).val(data[data.length - 1]);
                }
            }
            $(this).selectpicker('refresh');
            if (callback) callback();
        });
    }
    var obj = {
        tab: {
            getActive: function () {
                return $("ul.nav.nav-tabs li.active a").attr('id').replace('menu_', '');
            },
            getActiveText: function () {
                return $("ul.nav.nav-tabs li.active a").text();
            },
            getTabText: function (name, datakey) {
                if (datakey) {
                    return $("ul.nav.nav-tabs li a[id=menu_" + name + "]").data(datakey);
                } else {
                    return $("ul.nav.nav-tabs li a[id=menu_" + name + "]").text();
                }
            },
        },
        datePicker: {
            defaultConfig: {
                format: DateFormats.moment.short,
                debug: isIE8lte,
                useCurrent: false,
                allowInputToggle: true,
                showTodayButton: false,
                daysOfWeekDisabled: [0, 6],
                enabledHoliday: false,
                holidayDates: holidays,
            },
            holidayConfig: {
                format: DateFormats.moment.short,
                debug: isIE8lte,
                useCurrent: false,
                allowInputToggle: true,
                showTodayButton: false,
                enabledHoliday: true,
                holidayDates: holidays,
            },
            eomConfig: {
                format: DateFormats.moment.short,
                debug: isIE8lte,
                useCurrent: false,
                allowInputToggle: true,
                showTodayButton: false,
                daysOfWeekDisabled: [0, 6],
                enabledEndOfMonth: true,
                enabledHoliday: false,
                holidayDates: holidays,
            },
            monthConfig: {
                format: DateFormats.moment.month,
                debug: isIE8lte,
                useCurrent: false,
                allowInputToggle: true,
                showTodayButton: false,
                date: moment(),
                viewMode: 'months'
            },
            getConfig: function (format, enabledHoliday) {
                var dowDisabled = false;
                if (arguments.length === 0 || format === '') {
                    format = DateFormats.moment.short;
                }
                if (!enabledHoliday) {
                    dowDisabled = [0, 6];
                }
                return {
                    format: format,
                    debug: false,
                    useCurrent: false,
                    allowInputToggle: true,
                    showTodayButton: false,
                    daysOfWeekDisabled: dowDisabled,
                    enabledHoliday: enabledHoliday,
                    holidayDates: holidays,
                }
            },
            setMinMax: function ($cal, dateMin, dateMax, setMax) {
                $cal.each(function () {
                    $(this).data("DateTimePicker").minDate(dateMin);
                    $(this).data("DateTimePicker").maxDate(dateMax);
                    if (setMax) {
                        $(this).data("DateTimePicker").date(dateMax);
                    }
                });
            },
            setHoliday: function ($cal) {
                if (holidays) {
                    $cal.data("DateTimePicker").holidayDates(holidays);
                }
            },
        },
        dateRangePicker: {
            defaultConfig: {
                locale: {
                    format: DateFormats.moment.short,
                    applyLabel: 'Select',
                    cancelLabel: 'Reset'
                },
                buttonClasses: 'btn btn-xs',
            },
            next3MonthConfig: {
                locale: {
                    format: DateFormats.moment.short,
                    applyLabel: 'Select',
                    cancelLabel: 'Reset'
                },
                ranges: {
                    'Next 3 Months': [moment().add(1, 'month').startOf('month'), moment().add(3, 'month').endOf('month')],
                    'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'Last 6 Months': [moment().subtract(6, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'This Year': [moment().startOf('year'), moment().endOf('year')],
                    'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
                },
                buttonClasses: 'btn btn-xs',
                startDate: moment().startOf('month'),
                endDate: moment().endOf('month'),
            },
            historicalConfig: {
                locale: {
                    format: DateFormats.moment.short,
                    applyLabel: 'Select',
                    cancelLabel: 'Reset'
                },
                ranges: {
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'Last 6 Months': [moment().subtract(6, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'Year-to-Date': [moment().startOf('year'), moment()],
                    'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                    'Last 2 Years': [moment().subtract(2, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                    'Last 3 Years': [moment().subtract(3, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                    'Last 5 Years': [moment().subtract(5, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                    'Last 10 Years': [moment().subtract(10, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                },
                buttonClasses: 'btn btn-xs',
                startDate: moment().startOf('year'),
                endDate: moment(),
            },
        },
        selectPicker: {
            dataBind: function ($select, webapi, setMax, valField, textField, callback) {
                if (arguments.length === 4) {
                    textField = valField;
                }
                if (webapi instanceof Array) {
                    _bindData($select, webapi, setMax, valField, textField, callback);
                } else {
                    $.ajax({
                        type: 'GET',
                        url: webapi,
                        dataType: 'json',
                        async: false,
                        success: function (data) {
                            _bindData($select, data, setMax, valField, textField, callback);
                        },
                        error: function (xhr, textStatus, err) {
                            webapi_error(xhr);
                        },
                    });
                    /*$.getJSON(webapi, function (data) {
                        _bindData($select, data, setMax, valField, textField, callback);
                    }).fail(function (xhr, textStatus, err) {
                        webapi_error(xhr);
                    });*/
                }
            },
            addDeselectEvent: function ($select) {
                $select.each(function () {
                    var $this = $(this);
                    $this.on('hidden.bs.select', function (e) {
                        if ($(this).val() == $(this).data('selected')) {
                            $(this).val('').data('selected', '');
                            $(this).selectpicker('refresh');
                        }
                    });
                    $this.on('shown.bs.select', function (e) {
                        $(this).data('selected', $(this).val());
                    });
                });
            },
        },
        dialog: {
            success: function (message, size) {
                var dialogSize = BootstrapDialog.SIZE_NORMAL;
                switch (size.toLowerCase()) {
                    case 'small': dialogSize = BootstrapDialog.SIZE_SMALL; break;
                    case 'wide': dialogSize = BootstrapDialog.SIZE_WIDE; break;
                    case 'large': dialogSize = BootstrapDialog.SIZE_LARGE; break;
                    default: dialogSize = BootstrapDialog.SIZE_NORMAL; break;
                }
                BootstrapDialog.show({
                    size: dialogSize,
                    title: BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_INFO],
                    message: message,
                    type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                    closable: true, // <-- Default value is false
                    draggable: true, // <-- Default value is false
                    buttons: [{
                        label: 'Close',
                        cssClass: 'btn-success',
                        action: function (dialogRef) {
                            dialogRef.close();
                        }
                    }]
                });
            },
        },
        bootgrid: {
            defaultConfig: {
                formatters: {
                    'change': function (column, row) {
                        return row[column.id] ? row[column.id].toString().parseFloat().toChangeColor() + ' <span class="bar-change"></span>' : '';
                    },
                    'changeField': function (column, row) {
                        return row[column.id] ? row[column.id].toString().parseFloat().toChangeColor(6, true, row[column.id + 'Change'].toString().parseFloat()) : '';
                    }
                },
                converters: {
                    n2: {
                        from: function (value) { return parseFloat(value); },
                        to: function (value) { return value ? kendo.toString(value, 'n2') : ''; }
                    },
                    n6: {
                        from: function (value) { return parseFloat(value); },
                        to: function (value) { return value ? kendo.toString(value, 'n6') : ''; }
                    },
                    date: {
                        from: function (value) { return moment(value, DateFormats.moment.json); },
                        to: function (value) { return value ? moment(value).format(DateFormats.moment.format) : ''; }
                    },
                    datetime: {
                        from: function (value) { return moment(value, DateFormats.moment.json); },
                        to: function (value) { return value ? moment(value).format(DateFormats.moment.time.format) : ''; }
                    },
                },
                rowCount: -1,
            }
        },
    };
    return obj;
})();

/* Get Holiday */
function getDisabledDates(year) {
    var y = moment().year();
    return getDisabledDates(y - year, y + year);
}
function getDisabledDates(minyear, maxyear) {
    var dates = [];
    for (var year = minyear; year <= maxyear; year++) {
        dates.push(moment([year, 0, 1]));
        dates.push(moment([year, 3, 6]));
        dates.push(moment([year, 3, 13]));
        dates.push(moment([year, 3, 14]));
        dates.push(moment([year, 3, 15]));
        dates.push(moment([year, 4, 5]));
        dates.push(moment([year, 7, 12]));
        dates.push(moment([year, 9, 23]));
        dates.push(moment([year, 11, 5]));
        dates.push(moment([year, 11, 10]));
        dates.push(moment([year, 11, 31]));
    }
    for (var i = 0; i < dates.length; i++) {
        if (dates[i].day() == 0) { // Sun
            dates[i] = dates[i].add(1, 'days');
        } else if (dates[i].day() == 6) { // Sat
            dates[i] = dates[i].add(2, 'days');
        }
    }
    return dates;
}

/* Bootstrap Dialog Wrapper */
function bs_alert(message) {
    BootstrapDialog.show({
        title: BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_WARNING],
        message: message,
        type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        closable: true, // <-- Default value is false
        draggable: true, // <-- Default value is false
        buttons: [{
            label: 'Close',
            cssClass: 'btn-danger',
            action: function (dialogRef) {
                dialogRef.close();
            }
        }]
    });
}

function bs_success(message) {
    BootstrapDialog.show({
        title: BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_INFO],
        message: message,
        type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        closable: true, // <-- Default value is false
        draggable: true, // <-- Default value is false
        buttons: [{
            label: 'Close',
            cssClass: 'btn-success',
            action: function (dialogRef) {
                dialogRef.close();
            }
        }]
    });
}

function bs_confirm(message, callback) {
    BootstrapDialog.confirm({
        title: 'CONFIRM',
        message: message,
        type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        closable: true, // <-- Default value is false
        draggable: true, // <-- Default value is false
        //btnCancelLabel: 'Cancel!', // <-- Default value is 'Cancel',
        btnOKLabel: 'Yes', // <-- Default value is 'OK',
        //btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
        callback: callback
    });
}

function bs_confirmDelete(message, callback) {
    BootstrapDialog.confirm({
        title: 'CONFIRM',
        message: message,
        type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        closable: true, // <-- Default value is false
        draggable: true, // <-- Default value is false
        //btnCancelLabel: 'Cancel!', // <-- Default value is 'Cancel',
        btnOKLabel: 'Yes', // <-- Default value is 'OK',
        btnOKClass: 'btn-danger', // <-- If you didn't specify it, dialog type will be used,
        callback: callback
    });
}

$.bsDialog = {
    confirmDelete: function (message, title, callback) {
        if (!title) title = 'CONFIRM';
        BootstrapDialog.confirm({
            title: title,
            message: message,
            type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: true, // <-- Default value is false
            draggable: true, // <-- Default value is false
            //btnCancelLabel: 'Cancel!', // <-- Default value is 'Cancel',
            btnOKLabel: 'Yes', // <-- Default value is 'OK',
            btnOKClass: 'btn-danger', // <-- If you didn't specify it, dialog type will be used,
            callback: callback,
        });
    },
    warning: function (message, title) {
        if (!title) title = BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_WARNING];
        BootstrapDialog.show({
            title: title,
            message: message,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: true, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttons: [{
                label: 'Close',
                cssClass: 'btn-warning',
                action: function (dialogRef) {
                    dialogRef.close();
                }
            }]
        });
    },
};
/* End: Bootstrap Dialog Wrapper */

/* WebAPI Wrapper */
function webapi_error(xhr) {
    try {
        if (!debugMode)
            bs_alert(xhr.responseJSON.Message);
        else
            bs_alert(kendo.format('<dl><dt>Error</dt><dd>{0}</dd><dt>Detail</dt><dd>{1}</dd></dl>', xhr.responseJSON.Message, xhr.responseJSON.MessageDetail));
    } catch (err) {
        bs_alert(kendo.stringify(xhr));
    }
}
function webapi_delete(webapiurl, id, callback) {
    $.ajax({
        url: webapiurl + id,
        cache: false,
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: {},
        success: callback
    }).fail(function (xhr, textStatus, err) {
        webapi_error(xhr);
    });
}
/* End: WebAPI Wrapper */

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}
if (!String.prototype.parseFloat) {
    String.prototype.parseFloat = function (decimal) {
        var floatVal = parseFloat(this.replace(',', ''));
        if (decimal) {
            return Math.floor((Math.pow(10, decimal) * floatVal)) / Math.pow(10, decimal);
        }
        return floatVal;
    };
}
if (!String.prototype.isLetter) {
    String.prototype.isLetter = function (pos) {
        if (arguments.length == 0) {
            pos = 0;
        }
        return this.charAt(pos).toLowerCase() !== this.charAt(pos).toUpperCase();
    };
}
if (!String.prototype.toCamelCase) {
    String.prototype.toCamelCase = function () {
        return this.replace(/(\-[a-z])/g, function ($1) { return $1.toUpperCase().replace('-', ''); });
    };
}
if (!String.prototype.toPascalCase) {
    String.prototype.toPascalCase = function () {
        return this.replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase();
        });
    };
}
if (!String.prototype.isNumeric) {
    String.prototype.isNumeric = function () {
        return !isNaN(this);
    };
}
if (!String.prototype.isGuid) {
    String.prototype.isGuid = function () {
        if (this) {
            var pattern = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
            return pattern.test(this);
        } else {
            alert(this);
            return false;
        }
    };
}
if (!String.toFriendlyName) {
    String.prototype.toFriendlyName = function () {
        var str = this.replace(/(?:_| |\b)(\w)/g, function (str, p1) { return ' ' + p1.toUpperCase() });
        if (this.endsWith('_th')) str = str.replace(/ Th$/, ' (Thai)');
        if (this.endsWith('_en')) str = str.replace(/ En$/, ' (Eng)');
        if (this.endsWith('_id')) str = str.replace(/ Id$/, ' ID');
        return str;
    };
}

(function ($) {
    // usage: $('textarea').pressEnter(function () { alert('here') })
    $.fn.pressEnter = function (fn) {
        return this.each(function () {
            $(this).bind('enterPress', fn);
            $(this).keyup(function (e) {
                if (e.keyCode == 13) {
                    $(this).trigger("enterPress");
                }
            })
        });
    };
    // usage: $("input").onEnter( function() { alert('555'); });
    $.fn.onEnter = function (func) {
        return $(this).each(function () {
            $(this).bind('keypress', function (e) {
                if (e.keyCode == 13) func.apply(this, [e]);
            });
        });
    };
    // usage: $('.symbol').setSymbolBox();
    $.fn.setSymbolBox = function (auto) {
        return $(this).each(function () {
            if (auto) {
                kendoUtility.autoComplete.setupSymbol($(this), null);
            }
            $(this).on('keydown', function (e) {
                // Visually Friendly Auto-Uppercase
                var $this = $(this);
                // 1. Length of 1, hitting backspace, remove class.
                if ($this.val().length == 1 && e.which == 8) {
                    $this.removeClass('text-uppercase');
                }
                // 2. Length of 0, hitting character, add class.
                if ($this.val().length == 0 && e.which >= 65 && e.which <= 90) {
                    $this.addClass('text-uppercase');
                }
            }).on('keyup', function(e) {
                var $this = $(this);
                if ($this.val().length == 1 && e.which >= 65 && e.which <= 90) {
                    $this.addClass('text-uppercase');
                }
            }).on('blur', function (e) {
                var $this = $(this);
                if ($this.val().length == 0) {
                    $this.removeClass('text-uppercase');
                } else {
                    $this.addClass('text-uppercase');
                }
            }).val(function () {
                var $this = $(this);
                if ($this.val().length == 0) {
                    $this.removeClass('text-uppercase');
                }
            });
        });
        //return this;
    };

})(jQuery);

$.extend({
    getUrlVars: function () {
        var vars = [],
        hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name, defvalue) {
        var theArray = $.getUrlVars();
        if ($.inArray(name, theArray) > -1) {
            return decodeURIComponent(theArray[name]);
        } else {
            return (defvalue) ? defvalue : '';
        }
    },
    padZero: function (num) {
        var s = '0' + num;
        return s.substring(s.length - 2)
    },
    urlExists2: function(url) {
        var exists = false;
        $.ajaxSetup({ async: false });
        $.ajax({
            url: url,
            type: 'HEAD',
            error: function () {
            },
            success: function () {
                exists = true;
            }
        });
        $.ajaxSetup({ async: true });
        return exists;
    },
    urlExists: function(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404;
    },
});

(function ($) {
    $.extend({
        // Case insensative $.inArray (http://api.jquery.com/jquery.inarray/)
        // $.inArrayIn(value, array [, fromIndex])
        //  value (type: String)
        //    The value to search for
        //  array (type: Array)
        //    An array through which to search.
        //  fromIndex (type: Number)
        //    The index of the array at which to begin the search.
        //    The default is 0, which will search the whole array.
        inArrayIn: function (elem, arr, i) {
            // not looking for a string anyways, use default method
            if (typeof elem !== 'string') {
                return $.inArray.apply(this, arguments);
            }
            // confirm array is populated
            if (arr) {
                var len = arr.length;
                i = i ? (i < 0 ? Math.max(0, len + i) : i) : 0;
                elem = elem.toLowerCase();
                for (; i < len; i++) {
                    if (i in arr && arr[i].toLowerCase() == elem) {
                        return i;
                    }
                }
            }
            // stick with inArray/indexOf and return -1 on no match
            return -1;
        }
    });
})(jQuery);

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

if (!String.symbolify) {
    String.prototype.symbolify = function (id, css) {
        var replacedText, replacePattern1;

        //All Accept Symbols
        var replacePattern1 = /(BOTN|BAYCAP#1|TDBCAP#1|TDBCAP#2|GHB15D1|[A-Z]+[0-9]{2}[POND1-9]{1}[A-Z]+|[A-Z]+[0-9]{2}[POND1-9]{1}[0-9]{2}[A-Z]+)/gi;
        var p = id ? id : '$1';
        //var p = id ? 'id=' + id : 'symbol=$1';
        css = 'symbol ' + (css ? css : '');

        return this
            .replace(replacePattern1, '<a class="' + css.trim() + '" href="' + URL.bond + p + '" target="_blank">$1</a>');
    };
}
if (!String.issuerify) {
    String.prototype.issuerify = function (id, css) {
        var p = id ? 'id=' + id : 'issuer=$1';
        css = 'issuer-code ' + (css ? css : '');
        return this.replace(/([\w\s\-]+)/, '<a class="' + css.trim() + '" href="' + URL.issuer + p + '" target="_issuer">$1</a>');
    };
}
if (!String.linkify) {
    String.prototype.linkify = function () {

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses *** here I've changed the expression ***
        var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_\-\.]+[\w-]{2,4})/gim;

        return this
            .replace(urlPattern, '<a target="_blank" href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a target="_blank" href="mailto:$1">$1</a>');
    };
}
if (!String.telify) {
    String.prototype.telify = function (css) {
        css = 'tel-num ' + (css ? css : '');
        return '<a class="' + css.trim() + '" href="tel:' + this + '" target="_tel">' + this + '</a>';
    };
}

if (!Number.toChangeColor) {
    Number.prototype.toChangeColor = function (format, icon, checkValue) {
        var _format = '{0:N2}';
        if (arguments.length == 0) {
            format = _format;
        }
        if (arguments.length > 0 && typeof format == 'number') {
            format = '{0:N' + format + '}';
        }
        var token = format.split(':')[1];
        token = token.substring(1, token.length - 1);
        var round = parseInt(token, 10);
        if (format.toLowerCase().indexOf('p') != -1) round += 2;
        var value = parseFloat(this).toFixed(round);
        if (!checkValue) checkValue = value;
        checkValue = parseFloat(checkValue).toFixed(round);
        if (checkValue > 0) {
            var sign = icon ? '<i class="fa fa-arrow-up fa-sm" aria-hidden="true"></i> ' : '+';
            return '<span class="text-success text-green">' + sign + kendo.format(format, Math.abs(value)) + '</span>';
        } else if (checkValue == 0) {
            return '<span class="text-primary text-blue">' + kendo.format(format, Math.abs(value)) + '</span>';
        } else if (checkValue < 0) {
            var sign = icon ? '<i class="fa fa-arrow-down fa-sm" aria-hidden="true"></i> ' : '-';
            return '<span class="text-danger text-red">' + sign + kendo.format(format, Math.abs(value)) + '</span>';
        } else {
            return kendo.format(format, this);
        }
    };
}
setChangeColor = function (value, format) {
    if (value > 0) {
        return '<span class="text-success text-green">' + kendo.format(format, value) + '</span>';
    } else if (value == 0) {
        return '<span class="text-primary text-blue">' + kendo.format(format, value) + '</span>';
    } else if (value < 0) {
        return '<span class="text-danger text-red">' + kendo.format(format, value) + '</span>';
    } else {
        return kendo.format(format, value);
    }
}
if (!Number.formatChangeColor) {
    Number.prototype.formatChangeColor = function (format) {
        if (this > 0) {
            return '<span class="text-success change-pos">' + kendo.format(format, this) + '</span>';
        } else if (this < 0) {
            return '<span class="text-danger change-neg">' + kendo.format(format, this) + '</span>';
        } else {
            return kendo.format(format, this);
        }
    };
}
if (!Number.toInt32) {
    Number.prototype.toInt32 = function () {
        return parseInt(parseFloat(this).toFixed(0), 10);
    };
}

if (!Boolean.formatValue) {
    Boolean.prototype.formatValue = function (truetext, falsetext, autocss, truecss, falsecss, reverse) {
        var value = this == true ? true : false;
        if (!truetext) truetext = 'Yes';
        if (!falsetext) falsetext = 'No';
        if (autocss) {
            if (!truecss) truecss = 'text-success text-green';
            if (!falsecss) falsecss = 'text-danger text-red';
            if (reverse) {
                var tempcss = truecss;
                truecss = falsecss;
                falsecss = tempcss;
            }
            if (value) {
                return '<span class="' + truecss + '">' + truetext.trim() + '</span>';
            } else {
                return '<span class="' + falsecss + '">' + falsetext.trim() + '</span>';
            }
        } else {
            return value ? truetext.trim() : falsetext.trim();
        }
    };
}


Array.transpose = function (data, name, newcol) {
    var columns = [], values = [], result = [];
    for (var k in data[0]) {
        columns.push(k);
    }
    for (var i = 0; i < data.length; i++) {
        var val = data[i][name].replace(/\+/g, 'p').replace(/\-/g, 'm');
        values.push(val);
    }
    for (var i = 1; i < columns.length; i++) {
        var o = {};
        o[newcol] = columns[i];
        for (var j = 0; j < values.length; j++) {
            o[values[j]] = data[j][columns[i]];
        }
        result.push(o);
    }
    return result;
};
Array.transpose2 = function (data) {
    var obj = {},
        i, k, l = data.length;

    //Iterate through first first object's keys and create an array for each value
    for (k in data[0]) {
        obj[k] = [];
    }

    //Go through all data, putting values into the transposed object's value
    for (i = 0; i < l; i++) {
        for (k in data[i]) {
            obj[k].push(data[i][k]);
        }
    }

    return obj;
};
Array.untranspose2 = function (data) {
    var array = [],
        keys = Object.keys(data),
        obj = {},
        i, k, key, l;

    for (i = 0, l = data[keys[0]].length; i < l; i++) {
        obj = {};

        for (k in keys) {
            key = keys[k];
            obj[key] = data[key][i];
        }

        array.push(obj);
    }

    return array;
};

if (!Array.insert) {
    Array.prototype.insert = function (index) {
        if (this instanceof Array) {
            this.splice.apply(this, [index, 0].concat(
            Array.prototype.slice.call(arguments, 1)));
        }
        return this;
    };
}
if (!Array.maxOf) {
    Array.prototype.maxOf = function (prop, abs) {
        if (this instanceof Array) {
            return Math.max.apply(Math, $.map(this, function (o) { return prop ? (abs ? Math.abs(o[prop]) : o[prop]) : (abs ? Math.abs(o) : o); }));
        } else {
            return null;
        }
    };    
}
if (!Array.minOf) {
    Array.prototype.minOf = function (prop) {
        if (this instanceof Array) {
            return Math.min.apply(Math, $.map(this, function (o) { return prop ? o[prop] : o; }));
        } else {
            return null;
        }
    };
}
if (!Array.remove) {
    Array.prototype.remove = function () {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
}
if (!Array.removeAt) {
    Array.prototype.removeAt = function (index) {
        if (this instanceof Array) {
            this.splice(index, 1);
        }
        return this;
    };
}
// Array Remove - By John Resig (MIT Licensed)
if (!Array.remove2) {
    Array.prototype.remove2 = function (from, to) {
        if (this instanceof Array) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        } else {
            return this;
        }
    };
}
if (!Array.swap) {
    Array.prototype.swap = function (indexA, indexB) {
        swapArrayElements(this, indexA, indexB);
    };
    var swapArrayElements = function (arr, indexA, indexB) {
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
    };
}
if (!Array.unique) {
    Array.prototype.unique = function () {
        return uniqueFunc(this);
    };
    var uniqueFunc = function (array) {
        return $.grep(array, function (el, index) {
            return index === $.inArray(el, array);
        });
    }
}
// var symbols = result.distinct(function (item) { return item.Symbol });
if (!Array.distinct) {
    Array.prototype.distinct = function (fn) {
        //if (typeof _ !== 'undefined')
        if ($.isFunction(fn)) {
            return _.chain(this).map(fn).uniq().value();
        } else if (typeof fn === 'string' || fn instanceof String) {
            return _.chain(this).map(function (item) { return item[fn]; }).uniq().value();
        }
    };
}
if (!Array.contains) {
    Array.prototype.contains = function (target, casesensitive) {
        if (casesensitive) {
            return ($.inArray(target, this) > -1);
        } else {
            return ($.inArrayIn(target, this) > -1);
        }
    };
}
if (!Array.appendJsonData) {
    Array.prototype.appendJsonData = function (jsonprop) {
        var cols = [];
        var result = this;
        if (result && result.length > 0) {
            var json = JSON.parse(result[0][jsonprop]);
            for (var key in json) {
                var value = json[key];
                if (!key.endsWith('id') || !value.isGuid()) {
                    var type = typeof value;
                    var column = {
                        align: 'left',
                        field: key,
                        title: key.toFriendlyName(),
                        format: '{0}',
                        width: 100,
                    };

                    if (type === 'number') {
                        column.format = '{0:N2}';
                    }  else if (type == 'object') {
                        var arr = $.grep(result, function (o, i) {
                            var jsonx = JSON.parse(o[jsonprop]);
                            return (jsonx[key] !== '' && jsonx[key] != null);
                        });
                        if (arr.length > 0) {
                            var json2 = JSON.parse(arr[0][jsonprop]);
                            value = json2[key];
                            type = typeof value;

                            if (type == 'number') {
                                column.format = '{0:N2}';
                            } else if (moment(value).isValid()) {
                                column.type = 'date';
                                column.format = DateFormats.grid.format;
                                if (moment(value).format('hh:mm:ss') !== '12:00:00') {
                                    column.format = DateFormats.grid.datetime;
                                }
                            }
                        }
                    }

                    switch (type) {
                        case 'number': column.align = 'right'; break;
                        case 'date':
                        case 'boolean': column.align = 'center'; break;
                    }

                    if (type === 'boolean') {
                        column.filterable = { multi: true, };
                        column.template = "#= " + key + " != null ? " + key + ".formatValue('Yes', 'No', true) : '' #";
                    } else if (type === 'number') {

                    } else if (type === 'date') {

                    } else {

                    }

                    column.attributes = { 'class': 'text-' + column.align };

                    cols.push(column);
                    /*cols.push({
                        attributes: { 'class': 'text-' + align },
                        field: key,
                        title: key.toFriendlyName(),
                        type: type,
                        filterable: filterable,
                        format: format,
                        width: 100,
                    });*/
                }
            }

            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < cols.length; j++) {
                    var json = JSON.parse(result[i][jsonprop]);
                    result[i][cols[j].field] = json[cols[j].field];
                }
            }
        }
        return {
            data: result,
            columns: cols
        };
    };
}

var resetForm = function () {
    $(':text:not("[readonly],[disabled]"), :password:not("[readonly],[disabled]")').val('');
}



$(function () {
    // Upper Case
    $('input[type=text].text-uppercase').on('keydown', function (e) {
        // Visually Friendly Auto-Uppercase
        var $this = $(this);
        // 1. Length of 1, hitting backspace, remove class.
        if ($this.val().length == 1 && e.which == 8) {
            $this.removeClass('text-uppercase');
        }
        // 2. Length of 0, hitting character, add class.
        if ($this.val().length == 0 && e.which >= 65 && e.which <= 90) {
            $this.addClass('text-uppercase');
        }
    }).on('blur', function (e) {
        var $this = $(this);
        if ($this.val().length == 0) {
            $this.removeClass('text-uppercase');
        }
    });

});


/* jQuery OVERWRITES */
$.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

// =========
// = humps =
// =========
// Underscore-to-camelCase converter (and vice versa)
// for strings and object keys

// humps is copyright © 2012+ Dom Christie
// Released under the MIT license.
; (function (global) {

    var _processKeys = function (convert, obj, options) {
        if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj) || _isFunction(obj)) {
            return obj;
        }

        var output,
            i = 0,
            l = 0;

        if (_isArray(obj)) {
            output = [];
            for (l = obj.length; i < l; i++) {
                output.push(_processKeys(convert, obj[i], options));
            }
        }
        else {
            output = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    output[convert(key, options)] = _processKeys(convert, obj[key], options);
                }
            }
        }
        return output;
    };

    // String conversion methods

    var separateWords = function (string, options) {
        options = options || {};
        var separator = options.separator || '_';
        var split = options.split || /(?=[A-Z])/;

        return string.split(split).join(separator);
    };

    var camelize = function (string) {
        if (_isNumerical(string)) {
            return string;
        }
        string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
        // Ensure 1st char is always lowercase
        return string.substr(0, 1).toLowerCase() + string.substr(1);
    };

    var pascalize = function (string) {
        var camelized = camelize(string);
        // Ensure 1st char is always uppercase
        return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
    };

    var decamelize = function (string, options) {
        return separateWords(string, options).toLowerCase();
    };

    // Utilities
    // Taken from Underscore.js

    var toString = Object.prototype.toString;

    var _isFunction = function (obj) {
        return typeof (obj) === 'function';
    };
    var _isObject = function (obj) {
        return obj === Object(obj);
    };
    var _isArray = function (obj) {
        return toString.call(obj) == '[object Array]';
    };
    var _isDate = function (obj) {
        return toString.call(obj) == '[object Date]';
    };
    var _isRegExp = function (obj) {
        return toString.call(obj) == '[object RegExp]';
    };
    var _isBoolean = function (obj) {
        return toString.call(obj) == '[object Boolean]';
    };

    // Performant way to determine if obj coerces to a number
    var _isNumerical = function (obj) {
        obj = obj - 0;
        return obj === obj;
    };

    // Sets up function which handles processing keys
    // allowing the convert function to be modified by a callback
    var _processor = function (convert, options) {
        var callback = options && 'process' in options ? options.process : options;

        if (typeof (callback) !== 'function') {
            return convert;
        }

        return function (string, options) {
            return callback(string, convert, options);
        }
    };

    var humps = {
        camelize: camelize,
        decamelize: decamelize,
        pascalize: pascalize,
        depascalize: decamelize,
        camelizeKeys: function (object, options) {
            return _processKeys(_processor(camelize, options), object);
        },
        decamelizeKeys: function (object, options) {
            return _processKeys(_processor(decamelize, options), object, options);
        },
        pascalizeKeys: function (object, options) {
            return _processKeys(_processor(pascalize, options), object);
        },
        depascalizeKeys: function () {
            return this.decamelizeKeys.apply(this, arguments);
        }
    };

    if (typeof define === 'function' && define.amd) {
        define(humps);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = humps;
    } else {
        global.humps = humps;
    }

})(this);


// Custom Kendo UI
// customize the _show method to call options.beforeShow 
// to allow preventing the tooltip from being shown..
if (typeof kendo !== 'undefined') {
    kendo.ui.Tooltip.fn._show = function (show) {
        return function (target) {
            var e = {
                sender: this,
                target: target,
                preventDefault: function () {
                    this.isDefaultPrevented = true;
                }
            };

            if (typeof this.options.beforeShow === "function") {
                this.options.beforeShow.call(this, e);
            }
            if (!e.isDefaultPrevented) {
                // only show the tooltip if preventDefault() wasn't called..
                show.call(this, target);
            }
        };
    }(kendo.ui.Tooltip.fn._show);
}

$.expr[':'].textEquals = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().match("^" + arg + "$");
    };
});