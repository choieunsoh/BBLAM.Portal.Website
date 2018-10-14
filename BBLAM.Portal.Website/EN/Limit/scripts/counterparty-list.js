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
            title: 'Upload Counterparty List CSV File',
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
                        saveUrl: rootapi + '/api/limit/counterparty/list-file-save',
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
                                $.App.ui.dialog.success('Counterparty List was uploaded successfully.', function () {
                                    loadPeriod();
                                    setupGrid();
                                    dialog.close();
                                });
                            } else {
                                $.App.ui.dialog.alert('Failed to upload Counterparty List, please revise file and try again.', function () {
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
                            $.App.ui.dialog.confirm('Are you sure you want to upload \'Counterparty List CSV File\' ?', function (result) {
                                if (result) {
                                    dialog = dialogRef;
                                    $files.closest('.k-upload').find('.k-upload-selected').trigger('click');
                                }
                            });
                        } else {
                            $.App.ui.dialog.alert('Please select at least one \'Counterparty List CSV File\' file before upload.');
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
        if (obj != null) {
            obj.period_quarter = obj.period_code.substr(5, 1);
            obj.period_year = obj.period_code.substr(0, 4);
            obj.counterparty_type = obj.counterparty_type.substr(0, 1);
            obj.fund_type = obj.fund_type.substr(0, 1);
            obj.transaction_type = obj.transaction_type.substr(0, 1);
        }

        BootstrapDialog.show({
            title: obj ? 'Update Counterparty List' : 'Add new Counterparty List',
            closable: false,
            message: function (dialogRef) {
                var $message = $('#editDialog > div').clone();

                var year = moment().year();
                for (var y = year - 1; y <= year + 1; y++) {
                    $message.find('#ddlYear').append($('<option />').val(y).text(y));
                }

                if (obj == null) {
                    $message.find('#ddlQuarter').val(moment().quarter()).selectpicker('refresh');
                    $message.find('#ddlYear').val(year).selectpicker('refresh');
                    $message.find('.selectpicker2').val('').selectpicker();
                } else {
                    $message.find('.selectpicker2').selectpicker();
                }

                // bind data
                $.App.ui.bind(obj, $message, { nullValue: '' });
                $message.find('.selectpicker2').selectpicker('refresh');

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
                            dialogCounterParty: {
                                selector: '[data-field=counter_party]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter counter party.',
                                    },
                                },
                            },
                            dialogCounterpartyType: {
                                selector: '[data-field=counterparty_type]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter counterparty type.',
                                    },
                                },
                            },
                            dialogFundType: {
                                selector: '[data-field=fund_type]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter fund type.',
                                    },
                                },
                            },
                            dialogTransactionType: {
                                selector: '[data-field=transaction_type]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter transaction type.',
                                    },
                                },
                            },
                            dialogTierLevel: {
                                selector: '[data-field=tier_level]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter tier.',
                                    },
                                },
                            },
                        },
                    })
                    .on('success.form.fv', function (e) {
                        // Prevent default form submission
                        e.preventDefault();

                        var $form = $(e.target);
                        var msg = 'Are you sure you want to save this counterparty list ?';
                        $.App.ui.dialog.confirm(msg, function (result) {
                            if (result) {
                                var req = $.App.ui.read(null, $message);
                                req.period_code = $form.find('#ddlYear').val() + '0' + $form.find('#ddlQuarter').val();

                                $.ajax({
                                    type: "POST",
                                    data: JSON.stringify(req),
                                    url: rootapi + '/api/limit/counterparty/list-save',
                                    contentType: 'application/json; charset=utf-8',
                                    dataType: 'json',
                                    success: function (data, status, xhr) {
                                        $.App.ui.dialog.success('The counterparty list was saved successfully.', function () {
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

    $(document).on('click', '.delete-cmd', function (e) {
        e.preventDefault();

        var $this = $(this);

        var msg = 'Are you sure you want to delete this counterparty list ?';
        $.App.ui.dialog.confirm(msg, function (result) {
            if (result) {
                var req = kendoUtility.grid.getRowData('#grid', $this);

                $.ajax({
                    type: "POST",
                    data: JSON.stringify(req),
                    url: rootapi + '/api/limit/counterparty/list-delete',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        $.App.ui.dialog.success('The counterparty list was deleted successfully.', function () {
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
                    url: rootapi + '/api/limit/counterparty/list',
                    data: {
                        period: period,
                    },
                },
            },
            schema: {
                model: {
                    fields: {
                        period_code: { type: 'string', editable: false, },
                        counter_party: { type: 'string', editable: false, },
                        counterparty_type: { type: 'string', editable: false, },
                        fund_type: { type: 'string', editable: false, },
                        transaction_type: { type: 'string', editable: false, },

                        tier_level: { type: 'number', },

                        created_date: { type: 'date', editable: false, },
                        created_by: { type: 'string', editable: false, },
                        created_source: { type: 'string', editable: false, },

                        updated_date: { type: 'date', editable: false, },
                        updated_by: { type: 'string', editable: false, },
                        updated_source: { type: 'string', editable: false, },
                    }
                }
            },
            sort: [
                { field: 'period_code', dir: 'asc', },
                { field: 'counter_party', dir: 'asc', },
            ],
        },
        toolbar: [{
            template: $("#templateAdd").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('counterparty_list_' + period),
        },
        editable: true,
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: false,
        columns: [{
            attributes: { 'class': 'text-center' },
            title: 'Del',
            template: function (e) {
                return '<a href="#" class="delete-cmd"><i class="fa fa-lg fa-times text-danger"></i></a>';
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
            field: 'period_code',
            title: 'Period',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'bold' },
            field: 'counter_party',
            title: 'Counter Party',
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'counterparty_type',
            title: 'Counterparty Type',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'fund_type',
            title: 'Fund Type',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'transaction_type',
            title: 'Transaction Type',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'text-center' },
            field: 'tier_level',
            title: 'Tier',
            filterable: { multi: true, },
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
