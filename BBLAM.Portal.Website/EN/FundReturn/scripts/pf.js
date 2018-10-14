$(function () {
    var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
    $('#txtAsof').datetimepicker($.extend(true, dp_options, {
        defaultDate: moment().startOf('year'),
    }));
    $('#txtAsofTo').datetimepicker($.extend(true, dp_options, {
        defaultDate: moment(),
    }));

    setupGrid();

    $(document).on('click', '.btn-upload', function (e) {
        e.preventDefault();

        var dialog = null;
        BootstrapDialog.show({
            title: 'Upload PF Return Excel File',
            cssClass: 'dialog-lg',
            closable: false,
            message: function (dialogRef) {
                var $message = $('#uploadDialog > div').clone();

                // Upload Files
                var $file = $message.find('#files');
                $file.kendoUpload({
                    theme: 'bootstrap',
                    multiple: false,
                    async: {
                        chunkSize: 102400,// bytes 100KB
                        saveUrl: rootapi + '/api/pf/return/file-save',
                        removeUrl: rootapi + '/api/pf/file-remove',
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
                            allowedExtensions: ['.xlsx'],
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
                                subfolder: 'return',
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
                                $.App.ui.dialog.success('PF Return was uploaded successfully.', function () {
                                    setupGrid();
                                    dialog.close();
                                });
                            } else {
                                $.App.ui.dialog.alert('Failed to upload PF Return, please revise file and try again.', function () {
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
                            $.App.ui.dialog.confirm('Are you sure you want to upload \'PF Return Excel File\' ?', function (result) {
                                if (result) {
                                    dialog = dialogRef;
                                    $files.closest('.k-upload').find('.k-upload-selected').trigger('click');
                                }
                            });
                        } else {
                            $.App.ui.dialog.alert('Please select at least one \'PF Return Excel File\' file before upload.');
                        }
                    }
                }
            }]
        });

        return false;
    })

    $(document).on('click', '.open-edit-dialog, .btn-add', function (e) {
        e.preventDefault();

        var $this = $(this);
        var obj = kendoUtility.grid.getRowData('#grid', $this);
        if (obj == null) {
            obj = {
                port_code: '',
                asof: moment(),
            };
        }

        BootstrapDialog.show({
            title: obj.port_code ? 'Update PF Return of ' + obj.port_code : 'Add new PF Return',
            closable: false,
            message: function (dialogRef) {
                var $message = $('#editDialog > div').clone();

                if (obj.port_code == '') {
                    $message.find('.dialog-asof > input').removeAttr('disabled');
                    $message.find('input[data-field=port_code]').removeAttr('disabled');
                }

                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
                $message.find('.dialog-asof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: obj.asof,
                }));

                $message.find('input[data-field=port_code]').inputmask({
                    regex: '^[A-Za-z0-9]+$',
                });

                $message.find('[data-field=total_nav]').inputmask({
                    alias: 'decimal',
                    digits: 2,
                    allowMinus: false,
                    groupSeparator: ',',
                    autoGroup: true,
                }).css({ 'text-align': 'left' });

                $message.find('.return').inputmask({
                    alias: 'decimal',
                    digits: 12,
                    groupSeparator: ',',
                    autoGroup: true,
                }).css({ 'text-align': 'left' });

                // bind data
                $.App.ui.bind(obj, $message, { nullValue: '' });

                // validation
                var $form = $message.find('#formMain');
                $form
                    // on('init.field.fv') must be declared
                    // before calling .formValidation(options)
                    .on('init.field.fv', function (e, data) {
                        // $(e.target)  --> The field element
                        // data.fv      --> The FormValidation instance
                        // data.field   --> The field name
                        // data.element --> The field element
                    })
                    .formValidation({
                        framework: 'bootstrap',
                        excluded: [':disabled'],
                        icon: {
                            valid: 'glyphicon glyphicon-ok',
                            invalid: 'glyphicon glyphicon-remove',
                            validating: 'glyphicon glyphicon-refresh'
                        },
                        button: {
                            selector: 'dialog-btn-save',
                        },
                        fields: {
                            dialogAsof: {
                                selector: '[data-field=asof]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please select as of from calendar.',
                                    },
                                },
                            },
                            dialogPortCode: {
                                selector: '[data-field=port_code]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter port code.',
                                    },
                                },
                            },
                            dialogTotalNav: {
                                selector: '[data-field=total_nav]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter total nav.',
                                    },
                                },
                            },
                            dialogDailyReturn: {
                                selector: '[data-field=daily_return]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter daily return.',
                                    },
                                },
                            },
                            dialogYTDReturn: {
                                selector: '[data-field=ytd_return]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter ytd return.',
                                    },
                                },
                            },
                        },
                    })
                    .on('success.form.fv', function (e) {
                        // Prevent default form submission
                        e.preventDefault();

                        var $form = $(e.target);
                        var msg = 'Are you sure you want to save this PF return ?';
                        $.App.ui.dialog.confirm(msg, function (result) {
                            if (result) {
                                var req = $.App.ui.read(null, $message);

                                $.ajax({
                                    type: "POST",
                                    data: JSON.stringify(req),
                                    url: rootapi + '/api/pf/return/save',
                                    contentType: 'application/json; charset=utf-8',
                                    dataType: 'json',
                                    success: function (data, status, xhr) {
                                        $.App.ui.dialog.success('The PF return was saved successfully.', function () {
                                            dialogRef.close();
                                            setupGrid();
                                        });
                                    },
                                    error: function (xhr, status, error) {
                                        $.App.ui.dialog.alert('Error. ' + error);
                                    }
                                });
                            }
                        });
                    });

                return $message;
            },
            buttons: [{
                label: 'Close',
                action: function (dialogRef) {
                    dialogRef.close();
                }
            }, {
                label: 'Save',
                cssClass: 'btn-primary dialog-btn-save',
                action: function (dialogRef) {
                    var $content = dialogRef.getModalContent();
                    $content.find('#formMain').formValidation('validate');
                }
            }]
        });

        return false;
    });

    $(document).on('click', '.delete-data', function (e) {
        e.preventDefault();

        var $this = $(this);

        var msg = 'Are you sure you want to delete this PF return ?';
        $.App.ui.dialog.confirm(msg, function (result) {
            if (result) {
                var req = kendoUtility.grid.getRowData('#grid', $this);

                $.ajax({
                    type: "POST",
                    data: JSON.stringify(req),
                    url: rootapi + '/api/pf/return/delete',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        $.App.ui.dialog.success('The PF return was deleted successfully.', function () {
                            setupGrid();
                        });
                    },
                    error: function (xhr, status, error) {
                        $.App.ui.dialog.alert('Error. ' + error);
                    }
                });
            }
        });
        return false;
    });

    $('#btnView').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    });
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
                    url: rootapi + '/api/pf/return/list',
                },
                parameterMap: function (data, type) {
                    return {
                        from: asof.format('YYYY-MM-DD'),
                        to: asof_to.format('YYYY-MM-DD'),
                        port_code: '',
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },
                        created_date: { type: "date", },
                        updated_date: { type: "date", },

                        total_nav: { type: 'number', },
                        daily_return: { type: 'number', },
                        ytd_return: { type: 'number', },
                    }
                }
            },
        },
        toolbar: [{
            template: $("#templateAdd").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('pf_return', asof),
        },
        pageable: { pageSize: 100, },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        columns: [{
            attributes: { 'class': 'text-center' },
            title: 'Del',
            template: function (e) {
                return '<a href="#" class="delete-data"><i class="fa fa-lg fa-times text-danger"></i></a>';
            },
            width: 30,
        }, {
            attributes: { 'class': 'text-center' },
            title: 'Edit',
            template: function (e) {
                return '<a href="#" class="open-edit-dialog"><i class="fa fa-lg fa-edit"></i></a>';
            },
            width: 30,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'asof',
            title: 'As of',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'bold' },
            field: 'port_code',
            title: 'Port Code',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'total_nav',
            format: '{0:N2}',
            title: 'Total NAV',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'daily_return',
            //format: '{0:N12}',
            title: 'Daily Return',
            template: '#= daily_return ? daily_return.toChangeColor("{0:N12}") : "" #',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'ytd_return',
            //format: '{0:N12}',
            title: 'YTD Return',
            template: '#= ytd_return ? ytd_return.toChangeColor("{0:N12}") : "" #',
            width: 100,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'created_date',
            title: 'Created Date',
            format: '{0:dd-MMM-yyyy HH:mm:ss}',
            parseFormats: [DateFormats.json],
            width: 150,
        }, {
            field: 'created_by',
            title: 'Created By',
            width: 100,
        }, {
            field: 'created_source',
            title: 'Created IP',
            width: 100,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'updated_date',
            title: 'Updated Date',
            format: '{0:dd-MMM-yyyy HH:mm:ss}',
            parseFormats: [DateFormats.json],
            width: 150,
        }, {
            field: 'updated_by',
            title: 'Updated By',
            width: 100,
        }, {
            field: 'updated_source',
            title: 'Updated IP',
            width: 100,
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
