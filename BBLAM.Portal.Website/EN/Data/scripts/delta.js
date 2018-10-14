$(function () {

    setupGrid();

    $(document).on('click', '.btn-upload', function (e) {
        e.preventDefault();

        var dialog = null;
        BootstrapDialog.show({
            title: 'Upload Equity Delta CSV File',
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
                        saveUrl: rootapi + '/api/delta/equity/file-save',
                        removeUrl: rootapi + '/api/delta/equity/file-remove',
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
                                subfolder: 'delta',
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
                                $.App.ui.dialog.success('Equity Delta was uploaded successfully.', function () {
                                    setupGrid();
                                    dialog.close();
                                });
                            } else {
                                $.App.ui.dialog.alert('Failed to upload Equity Delta, please revise file and try again.', function () {
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
                            $.App.ui.dialog.confirm('Are you sure you want to upload \'Equity Delta CSV File\' ?', function (result) {
                                if (result) {
                                    dialog = dialogRef;
                                    $files.closest('.k-upload').find('.k-upload-selected').trigger('click');
                                }
                            });
                        } else {
                            $.App.ui.dialog.alert('Please select at least one \'Equity Delta CSV File\' file before upload.');
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
                stock_name: '',
                asof: moment(),
            };
        }

        BootstrapDialog.show({
            title: obj.stock_name ? 'Update Equity Delta of ' + obj.stock_name : 'Add new Equity Delta',
            closable: false,
            message: function (dialogRef) {
                var $message = $('#editDialog > div').clone();

                if (obj.stock_name == '') {
                    $message.find('.dialog-asof > input').removeAttr('disabled');
                    $message.find('input[data-field=stock_name]').removeAttr('disabled');
                    $message.find('input[data-field=master_stock]').removeAttr('disabled');
                }

                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
                $message.find('.dialog-asof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: obj.asof,
                }));

                $message.find('input[data-field=stock_name]').inputmask({
                    regex: '^[A-Za-z0-9]+-[Ww][0-9]{1,2}$',
                });
                $message.find('input[data-field=master_stock]').inputmask({
                    regex: '^[A-Za-z0-9]+$',
                });

                $message.find('.dialog-delta').inputmask('9[9][9][.999999]', {
                    alias: 'decimal',
                    groupSeparator: ',',
                    autoGroup: true,
                });

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
                                        message: 'Please select effective date from calendar.',
                                    },
                                },
                            },
                            dialogStockName: {
                                selector: '[data-field=stock_name]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter stock name.',
                                    },
                                },
                            },
                            dialogMasterStock: {
                                selector: '[data-field=master_stock]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter master stock.',
                                    },
                                },
                            },
                            dialogDelta: {
                                selector: '[data-field=delta]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter equity delta.',
                                    },
                                },
                            },
                        },
                    })
                    .on('success.form.fv', function (e) {
                        // Prevent default form submission
                        e.preventDefault();

                        var $form = $(e.target);
                        var msg = 'Are you sure you want to save this equity delta ?';
                        $.App.ui.dialog.confirm(msg, function (result) {
                            if (result) {
                                var req = $.App.ui.read(null, $message);

                                $.ajax({
                                    type: "POST",
                                    data: JSON.stringify(req),
                                    url: rootapi + '/api/delta/equity/save',
                                    contentType: 'application/json; charset=utf-8',
                                    dataType: 'json',
                                    success: function (data, status, xhr) {
                                        $.App.ui.dialog.success('The equity delta was saved successfully.', function () {
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

    $(document).on('click', '.delete-delta', function (e) {
        e.preventDefault();

        var $this = $(this);

        var msg = 'Are you sure you want to delete this equity delta ?';
        $.App.ui.dialog.confirm(msg, function (result) {
            if (result) {
                var req = kendoUtility.grid.getRowData('#grid', $this);

                $.ajax({
                    type: "POST",
                    data: JSON.stringify(req),
                    url: rootapi + '/api/delta/equity/delete',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        $.App.ui.dialog.success('The equity delta was deleted successfully.', function () {
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
                    url: rootapi + '/api/delta/equity/list',
                },
                /*parameterMap: function (data, type) {
                    return {
                        asof: asof,
                    };
                },*/
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },
                        created_date: { type: "date", },
                        updated_date: { type: "date", },

                        delta: { type: 'number', },
                    }
                }
            },
        },
        toolbar: [{
            template: $("#templateAdd").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('equity_delta', moment()),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        columns: [{
            attributes: { 'class': 'text-center' },
            title: 'Del',
            template: function (e) {
                return '<a href="#" class="delete-delta"><i class="fa fa-lg fa-times text-danger"></i></a>';
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
            title: 'Effective Date',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 100,
        }, {
            attributes: { 'class': 'bold' },
            field: 'stock_name',
            title: 'Stock Name',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'text-left' },
            field: 'master_stock',
            title: 'Master Stock',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'delta',
            title: 'Delta',
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
