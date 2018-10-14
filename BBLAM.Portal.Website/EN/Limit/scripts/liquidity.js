var valid_asof = null;
var $logDialog = null;

$(function () {
    var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
    $('#txtAsof').datetimepicker($.extend(true, dp_options, {
        defaultDate: moment(),
    }));

    $('#btnSubmit').on('click', function (e) {
        e.preventDefault();
        setupGrid();
        return false;
    })

    $(document).on('click', '.btn-upload', function (e) {
        e.preventDefault();

        var dialog = null;
        BootstrapDialog.show({
            title: 'Upload Liquidity Limit CSV File',
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
                        saveUrl: rootapi + '/api/limit/liquidity/file-save',
                        removeUrl: rootapi + '/api/limit/liquidity/file-remove',
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
                                fund_type: 'MF',
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
                                $.App.ui.dialog.success('Liquidity Limit was uploaded successfully.', function () {
                                    setupGrid();
                                    dialog.close();
                                });
                            } else {
                                $.App.ui.dialog.alert('Failed to upload Liquidity Limit, please revise file and try again.', function () {
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
                            $.App.ui.dialog.confirm('Are you sure you want to upload \'Liquidity Limit CSV File\' ?', function (result) {
                                if (result) {
                                    dialog = dialogRef;
                                    $files.closest('.k-upload').find('.k-upload-selected').trigger('click');
                                }
                            });
                        } else {
                            $.App.ui.dialog.alert('Please select at least one \'Liquidity Limit CSV File\' file before upload.');
                        }
                    }
                }
            }]
        });

        return false;
    })

    setupGrid();

    $(document).on('click', '.open-edit-dialog, .btn-add', function (e) {
        e.preventDefault();

        var $this = $(this);
        var obj = kendoUtility.grid.getRowData('#grid', $this);
        if (obj == null) {
            obj = {
                fund_code: '',
                asof: moment(),
            };
        }

        BootstrapDialog.show({
            title: obj.fund_code ? 'Update Liquidity Limit of ' + obj.fund_code : 'Add new Liquidity Limit',
            closable: false,
            message: function (dialogRef) {
                var $message = $('#editDialog > div').clone();

                if (obj.fund_code == '') {
                    $message.find('input[data-field=fund_code]').removeAttr('disabled');
                }

                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
                $message.find('.dialog-asof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: obj.asof,
                }));

                $message.find('.dialog-limit').inputmask('9[9][9][.999999]', {
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
                            dialogFund: {
                                selector: '[data-field=fund_code]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter fund code.',
                                    },
                                },
                            },
                            dialogAsof: {
                                selector: '[data-field=asof]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please select effective date from calendar.',
                                    },
                                },
                            },
                            dialogSoftLimit: {
                                selector: '[data-field=soft_limit]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter liquidity soft limit.',
                                    },
                                    between: {
                                        min: 0,
                                        max: 1,
                                        message: 'The liquidity soft limit must be between %s and %s.',
                                    },
                                },
                            },
                            dialogHardLimit: {
                                selector: '[data-field=hard_limit]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter liquidity hard limit.',
                                    },
                                    between: {
                                        min: 0,
                                        max: 'dialogSoftLimit',
                                        message: 'The liquidity hard limit must be between %s and %s.',
                                    },
                                },
                            },
                        },
                    })
                    // Revalidate
                    .on('keyup', '[data-field=soft_limit]', function (e) {
                        $form.formValidation('revalidateField', 'dialogHardLimit');
                    })
                    .on('success.form.fv', function (e) {
                        // Prevent default form submission
                        e.preventDefault();

                        var $form = $(e.target);
                        var msg = 'Are you sure you want to save this liquidity limit ?';
                        $.App.ui.dialog.confirm(msg, function (result) {
                            if (result) {
                                // $.App.ui.read(#object_pk_name#, #read under this selector#)
                                var req = $.App.ui.read(null, $message);
                                req.fund_type = $.App.getFundType();

                                $.ajax({
                                    type: "POST",
                                    data: JSON.stringify(req),
                                    url: rootapi + '/api/limit/liquidity/save',
                                    contentType: 'application/json; charset=utf-8',
                                    dataType: 'json',
                                    success: function (data, status, xhr) {
                                        $.App.ui.dialog.success('The liquidity limit was saved successfully.', function () {
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

    $(document).on('click', '.open-log-dialog', function (e) {
        e.preventDefault();

        var $this = $(this);
        var obj = kendoUtility.grid.getRowData('#grid', $this);

        $logDialog = BootstrapDialog.show({
            title: 'Liquidity Limit of ' + obj.fund_code,
            size: BootstrapDialog.SIZE_WIDE,
            cssClass: 'dialog-wide',
            message: function (dialogRef) {
                var $message = $('<div class="row"><div class="col-xs-12"><div id="gridLog" class="k-grid-xs"></div></div></div>');

                var $grid = $message.find('#gridLog');
                var options = $.extend(true, {}, kendoUtility.gridConfig);
                $grid.empty();
                $grid.kendoGrid($.extend(true, options, {
                    dataSource: {
                        type: "json",
                        transport: {
                            read: {
                                contentType: 'application/json; charset=utf-8',
                                url: rootapi + '/api/limit/liquidity/list',
                            },
                            parameterMap: function (data, type) {
                                return {
                                    fund_type: 'MF',
                                    fund_code: obj.fund_code,
                                };
                            },
                        },
                        schema: {
                            model: {
                                fields: {
                                    asof: { type: "date", },
                                    updated_date: { type: "date", },
                                    soft_limit: { type: 'number', },
                                    hard_limit: { type: 'number', },
                                }
                            }
                        },
                        sort: {
                            field: 'asof', dir: 'desc',
                        },
                    },
                    toolbar: [{
                        name: 'excel',
                        template: $("#template").html(),
                    }],
                    excel: {
                        fileName: kendoUtility.excelExport.createFileName(obj.fund_code + '_liquidity_limit', moment()),
                    },
                    showTooltip: true,
                    selectable: false,
                    scrollable: true,
                    allowCopy: true,
                    columns: [{
                        attributes: { 'class': 'text-center' },
                        title: 'Del',
                        template: function (e) {
                            return '<a href="#" class="delete-limit"><i class="fa fa-lg fa-times text-danger"></i></a>';
                        },
                        width: 30,
                    }, {
                        attributes: { 'class': 'bold' },
                        field: 'fund_code',
                        title: 'Fund',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-center' },
                        field: 'asof',
                        title: 'Effective Date',
                        format: '{0:dd-MMM-yyyy}',
                        parseFormats: [DateFormats.json],
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'soft_limit',
                        title: 'Soft Limit',
                        width: 100,
                    }, {
                        attributes: { 'class': 'text-right' },
                        field: 'hard_limit',
                        title: 'Hard Limit',
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

                return $message;
            },
        });

        return false;
    });

    $(document).on('click', '.delete-limit', function (e) {
        e.preventDefault();

        var $this = $(this);

        var msg = 'Are you sure you want to delete this liquidity limit ?';
        $.App.ui.dialog.confirm(msg, function (result) {
            if (result) {
                var req = kendoUtility.grid.getRowData('#gridLog', $this);
                req.fund_type = $.App.getFundType();

                $.ajax({
                    type: "POST",
                    data: JSON.stringify(req),
                    url: rootapi + '/api/limit/liquidity/delete',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        if ($logDialog) {
                            $.App.ui.dialog.success('The liquidity limit was deleted successfully.', function () {
                                $logDialog.close();
                                setupGrid();
                            });
                        }
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
    valid_asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof = valid_asof.format('YYYY-MM-DD');
    var fund_type = 'MF';

    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/limit/liquidity/latest',
                },
                parameterMap: function (data, type) {
                    return {
                        asof: asof,
                        fund_type: fund_type,
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },
                        created_date: { type: "date", },
                        updated_date: { type: "date", },

                        soft_limit: { type: 'number', },
                        hard_limit: { type: 'number', },
                    }
                }
            },
            sort: {
                field: 'fund_code', dir: 'asc',
            },
        },
        toolbar: [{
            template: $("#templateAdd").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('liquidity_limit', valid_asof),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        columns: [{
            attributes: { 'class': 'text-center' },
            title: 'Edit',
            template: function (e) {
                return '<a href="#" class="open-edit-dialog"><i class="fa fa-lg fa-edit"></i></a>';
            },
            width: 30,
        }, {
            attributes: { 'class': 'text-center' },
            title: 'Log',
            template: function (e) {
                return '<a href="#" class="open-log-dialog"><i class="fa fa-lg fa-history"></i></a>';
            },
            width: 30,
        }, {
            attributes: { 'class': 'bold' },
            field: 'fund_code',
            title: 'Fund',
            width: 100,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'asof',
            title: 'Effective Date',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'soft_limit',
            title: 'Soft Limit',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'hard_limit',
            title: 'Hard Limit',
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
