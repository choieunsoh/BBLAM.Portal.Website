var valid_asof = null;
var upload_files = 0;

$(function () {
    var prevDate = $.App.getPreviousWorkingDate();
    var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
    $('#txtAsof').datetimepicker($.extend(true, dp_options, {
        defaultDate: prevDate,
    }));

    setupAllFiles();

    $('#btnSubmit').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    })

    $('#btnUploadAll').on('click', function (e) {
        e.preventDefault();
        upload_files = countAllFiles();
        if (upload_files > 0) {
            $.App.ui.dialog.confirm('Are you sure you want to upload \'HIPORT Files\' and generate \'Reports\' ?', function (result) {
                if (result) {
                    uploadFile('#mf0_file');
                    uploadFile('#mf1_file');
                    uploadFile('#mf2_file');
                    uploadFile('#pvd_file');
                }
            });
        } else {
            $.App.ui.dialog.alert('Please select at least one file for upload.');
        }
        return false;
    })

    $('#btnReGenerateAll').on('click', function (e) {
        e.preventDefault();
        $.App.ui.dialog.confirm('Are you sure you want to re-generate \'All Reports\' ?', function (result) {
            if (result) {
                var date = moment($('#txtAsof').data('DateTimePicker').date());
                $.ajax({
                    type: "GET",
                    data: {
                        asof: date.format(DateFormats.moment.param),
                    },
                    url: rootapi + '/api/hiport/regen-report',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        setupGrid();
                        $.App.ui.dialog.success('All reports were re-generated successfully.');
                    },
                    error: function (xhr, status, error) {
                        $.App.ui.dialog.alert('Error. ' + error);
                    }
                });            }
        });
        return false;
    })

    setupGrid();
});

function setupAllFiles() {
    setupUploadFile('#mf0_file', 'MF', 0, ['.csv']);
    setupUploadFile('#mf1_file', 'MF', 1, ['.csv']);
    setupUploadFile('#mf2_file', 'MF', 2, ['.csv']);
    setupUploadFile('#pvd_file', 'PVD', 0, ['.txt']);
}
function setupUploadFile(fileid, fund_type, delay, exts) {
    // Upload Files
    var $file = $(fileid);
    $file.kendoUpload({
        theme: 'bootstrap',
        multiple: false,
        async: {
            chunkSize: 102400,// bytes 100KB
            saveUrl: rootapi + '/api/hiport/file-save',
            removeUrl: rootapi + '/api/hiport/file-remove',
            autoUpload: false,
        },
        //files: files,
        template: kendo.template($('#fileDownloadTemplate').html()),
        select: function (e) {
            /* Default:
                    allowedExtensions: ['.pdf', '.txt', '.jpg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.ppt', '.pptx'],
                    maxFileSize: 1024 * 1024 * 20, // 20MB
                    maxFiles: 10,
            */
            var validateOptions = $.extend(true, {}, kendoUtility.upload.validationConfig);
            validateOptions.allowedExtensions = [];
            validateOptions = $.extend(true, validateOptions, {
                fileselector: fileid + ' .k-upload-files .k-file-name',
                allowedExtensions: exts,
                accumulateSize: false,
                maxFiles: 1,
                maxFileSize: 1024 * 1024 * 4,
            });
            kendoUtility.upload.validate(e, validateOptions);
            for (var i = 0; i < e.files.length; i++) {
                e.files[i].remove = true;
            }
        },
        upload: function (e) {
            var date = moment($('#txtAsof').data('DateTimePicker').date());
            if (e.files && e.files.length > 0) {
                var file = e.files[0];
                e.data = {
                    subfolder: 'HIPORT',
                    fund_type: fund_type,
                    delay: delay,
                    asof: date.format(DateFormats.moment.param),
                };
            }
        },
        remove: function (e) {
            e.preventDefault();
            var uid = e.files[0].uid;
            var $li = $('li.k-file[data-uid="' + uid + '"]');
            $('li.k-file[data-uid="' + uid + '"]').remove();
        },
        success: function (e) {
            // upload OR remove
            if (e.operation == 'upload') {
                if (e.files[0]) {
                    var uid = e.files[0].uid;
                    $('li.k-file[data-uid="' + uid + '"]').remove();
                    upload_files--;
                    if (upload_files == 0) {
                        runSqlLoader(e.response);
                    }
                }
            }
        },
    });
}
function runSqlLoader(asof) {
    $.ajax({
        url: rootapi + '/api/hiport/run-sqlldr?asof=' + asof,
        global: false,
        type: 'GET',
        async: false,
        success: function (data) {
            if (data) {
                generateReport(asof);
            } else {
                $.App.ui.dialog.alert(data);
            }
        },
        error: function (jqXHR, exception) {
            $.App.ui.dialog.alert(jqXHR.responseText);
        },
    });
}
function generateReport(asof) {
    $.ajax({
        url: rootapi + '/api/hiport/gen-report?asof=' + asof,
        global: false,
        type: 'GET',
        async: false,
        success: function (data) {
            if (data) {
                setupGrid();
                $.App.ui.dialog.success('Report was generated successfully (' + asof + ').');
            } else {
                $.App.ui.dialog.alert(data);
            }
        },
        error: function (jqXHR, exception) {
            $.App.ui.dialog.alert(jqXHR.responseText);
        },
    });
}
function uploadFile(fileid) {
    var $files = $(fileid);
    var upload = $files.data("kendoUpload");
    if (upload) {
        var totalFiles = upload.element.context.files.length;
        if (totalFiles > 0) {
            $files.closest('.k-upload').find('.k-upload-selected').trigger('click');
        }

    }
}
function countAllFiles() {
    var count = countFile('#mf0_file');
    count += countFile('#mf1_file');
    count += countFile('#mf2_file');
    count += countFile('#pvd_file');
    return count;
}
function countFile(fileid) {
    var $files = $(fileid);
    var upload = $files.data("kendoUpload");
    return upload ? upload.element.context.files.length : 0;
}
function removeDocument(e) {
    var uid = e.files[0].uid;
    var $li = $('li.k-file[data-uid="' + uid + '"]');
    $('li.k-file[data-uid="' + uid + '"]').remove();
}

function setupGrid() {
    setupFileGrid();
    setupReportGrid();
}
function setupFileGrid() {
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#gridFile');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/hiport/file-log',
                },
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },
                        report_date: { type: "date", },

                        row_count: { type: 'number', },
                    }
                }
            },
        },
        toolbar: [{
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('hiport_file_log'),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        columns: [{
            attributes: { 'class': 'text-center' },
            field: 'report_date',
            title: 'Report Date',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'name',
            title: 'Fund Type',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'asof',
            title: 'As of',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'row_count',
            format: '{0:N0}',
            title: 'Row Count',
            width: 100,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
function setupReportGrid() {
    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#gridReport');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/hiport/report-log',
                },
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },
                        report_date: { type: "date", },

                        row_count: { type: 'number', },
                    }
                }
            },
        },
        toolbar: [{
            template: $("#template").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('report_log'),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        columns: [{
            attributes: { 'class': 'text-center' },
            field: 'report_date',
            title: 'Report Date',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'name',
            title: 'Fund Type',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'asof',
            title: 'As of',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'row_count',
            format: '{0:N0}',
            title: 'Fund Count',
            width: 100,
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}
