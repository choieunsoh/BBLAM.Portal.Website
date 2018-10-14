var valid_asof = null;
var $logDialog = null;

$(function () {
    loadPeriod();

    $('#btnSubmit').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    })

    $(document).on('click', '.btn-upload', function (e) {
        e.preventDefault();

        var dialog = null;
        BootstrapDialog.show({
            title: 'Upload Counterparty Line CSV File',
            closable: false,
            cssClass: 'dialog-xlg',
            message: function (dialogRef) {
                var $message = $('#uploadDialog > div').clone();

                // Upload Files
                var $file = $message.find('#files');
                $file.kendoUpload({
                    theme: 'bootstrap',
                    multiple: false,
                    async: {
                        chunkSize: 102400,// bytes 100KB
                        saveUrl: rootapi + '/api/limit/counterparty/line-file-save',
                        removeUrl: rootapi + '/api/limit/equity/file-remove',
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
                            allowedExtensions: ['.csv'],
                            accumulateSize: false,
                            maxFiles: 1,
                            maxFileSize: 1024 * 1024 * 1,
                        });
                        kendoUtility.upload.validate(e, validateOptions);
                        for (var i = 0; i < e.files.length; i++) {
                            e.files[i].remove = true;
                        }
                    },
                    upload: function (e) {
                        if (e.files && e.files.length > 0) {
                            var file = e.files[0];
                            e.data = {
                                subfolder: 'limit',
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
                            if (e.response && e.files[0]) {
                                var uid = e.files[0].uid;
                                $('li.k-file[data-uid="' + uid + '"]').remove();
                                $.App.ui.dialog.success('Counterparty Line was uploaded successfully.', function () {
                                    loadPeriod();
                                    setupGrid();
                                    dialog.close();
                                });
                            } else {
                                $.App.ui.dialog.alert('Failed to upload Counterparty Line, please revise file and try again.', function () {
                                    dialog.close();
                                });
                            }
                        }
                    },
                });

                return $message;
            },
            buttons: [{
                label: 'Close',
                action: function (dialogRef) {
                    dialogRef.close();
                }
            }, {
                icon: 'fa fa-upload',
                label: 'Upload',
                cssClass: 'btn-warning dialog-btn-upload',
                action: function (dialogRef) {
                    dialog = null;
                    var $content = dialogRef.getModalContent();
                    var $files = $content.find("#files");
                    var upload = $files.data("kendoUpload");
                    if (upload) {
                        var totalFiles = upload.element.context.files.length;
                        if (totalFiles > 0) {
                            $.App.ui.dialog.confirm('Are you sure you want to upload \'Counterparty Line CSV File\' ?', function (result) {
                                if (result) {
                                    dialog = dialogRef;
                                    $files.closest('.k-upload').find('.k-upload-selected').trigger('click');
                                }
                            });
                        } else {
                            $.App.ui.dialog.alert('Please select at least one \'Counterparty Line CSV File\' file before upload.');
                        }
                    }
                }
            }]
        });

        return false;
    })

    setupGrid();

});

function loadPeriod() {
    $.ajax({
        url: rootapi + '/api/limit/counterparty/avail',
        global: false,
        type: 'GET',
        async: false,
        success: function (data) {
            var $ddl = $('#ddlPeriod');
            $ddl.html('');
            for (var i = 0; i < data.length; i++) {
                var $opt = $('<option></option>').val(data[i]).html(data[i]);
                $ddl.append($opt);
            }
            $ddl.selectpicker('refresh');
        },
    });

}

function setupGrid() {
    var period = $('#ddlPeriod').find('option:selected').val();

    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/limit/counterparty/line-matrix',
                    data: {
                        period: period,
                    },
                },
            },
            schema: {
                model: {
                    fields: {
                        PERIOD_CODE: { type: 'string', editable: false, },
                        TIER_LEVEL: { type: 'number', editable: false, },

                        MDB: { type: 'number', },
                        MDF: { type: 'number', },
                        MTB: { type: 'number', },
                        MTF: { type: 'number', },
                        MRB: { type: 'number', },
                        MRF: { type: 'number', },

                        PDB: { type: 'number', },
                        PDF: { type: 'number', },
                        PTB: { type: 'number', },
                        PTF: { type: 'number', },
                        PRB: { type: 'number', },
                        PRF: { type: 'number', },
                    }
                }
            },
            sort: [
                { field: 'PERIOD_CODE', dir: 'asc', },
                { field: 'TIER_LEVEL', dir: 'asc', },
            ],
        },
        toolbar: [{
            template: $("#templateAdd").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('counterparty_line_' + period),
        },
        editable: true,
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        columns: [{
            attributes: { 'class': 'bold text-center' },
            field: 'PERIOD_CODE',
            title: 'Period',
            width: 100,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'TIER_LEVEL',
            title: 'Tier',
            width: 100,
        }, {
            title: 'Mutual Fund (MB)',
            columns: [{
                title: 'Deposit',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'MDB',
                    title: 'Bank',
                    format: '{0:N0}',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'MDF',
                    title: 'Finance',
                    format: '{0:N0}',
                    width: 100,
                }],
            }, {
                title: 'Trade',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'MTB',
                    title: 'Bank',
                    format: '{0:N0}',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'MTF',
                    title: 'Finance',
                    format: '{0:N0}',
                    width: 100,
                }],
            }, {
                title: 'Repo',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'MRB',
                    title: 'Bank',
                    format: '{0:N0}',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'MRF',
                    title: 'Finance',
                    format: '{0:N0}',
                    width: 100,
                }],
            }],
        }, {
            title: 'PVD/PF Fund (MB)',
            columns: [{
                title: 'Deposit',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'PDB',
                    title: 'Bank',
                    format: '{0:N0}',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'PDF',
                    title: 'Finance',
                    format: '{0:N0}',
                    width: 100,
                }],
            }, {
                title: 'Trade',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'PTB',
                    title: 'Bank',
                    format: '{0:N0}',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'PTF',
                    title: 'Finance',
                    format: '{0:N0}',
                    width: 100,
                }],
            }, {
                title: 'Repo',
                columns: [{
                    attributes: { 'class': 'text-right' },
                    field: 'PRB',
                    title: 'Bank',
                    format: '{0:N0}',
                    width: 100,
                }, {
                    attributes: { 'class': 'text-right' },
                    field: 'PRF',
                    title: 'Finance',
                    format: '{0:N0}',
                    width: 100,
                }],
            }],
        }],
        change: function (e) {
        },
    })).data("kendoGrid");
}

function removeDocument(e) {
    var uid = e.files[0].uid;
    var $li = $('li.k-file[data-uid="' + uid + '"]');
    $('li.k-file[data-uid="' + uid + '"]').remove();
}
