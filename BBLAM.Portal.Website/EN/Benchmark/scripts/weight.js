$(function () {
    loadIndex();

    $(document).on('click', '.btn-upload', function (e) {
        e.preventDefault();

        var dialog = null;
        BootstrapDialog.show({
            title: 'Upload Benchmark Component Setting CSV File',
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
                        saveUrl: rootapi + '/api/perf/bm-weight/file-save',
                        removeUrl: rootapi + '/api/perf/bm-weight/file-remove',
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
                                subfolder: 'bm',
                                fund_type: $.App.getFundType(),
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
                                $.App.ui.dialog.success('Benchmark Component Setting was uploaded successfully.', function () {
                                    setupGrid();
                                    dialog.close();
                                });
                            } else {
                                $.App.ui.dialog.alert('Failed to upload Benchmark Component Setting, please revise file and try again.', function () {
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
                            $.App.ui.dialog.confirm('Are you sure you want to upload \'Benchmark Component Setting CSV File\' ?', function (result) {
                                if (result) {
                                    dialog = dialogRef;
                                    $files.closest('.k-upload').find('.k-upload-selected').trigger('click');
                                }
                            });
                        } else {
                            $.App.ui.dialog.alert('Please select at least one \'Benchmark Component Setting CSV File\' file before upload.');
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
                bm_code: '',
            };
        } else {
            obj.weight *= 100.0;
        }

        BootstrapDialog.show({
            title: obj.bm_code ? 'Update Benchmark Component Setting of ' + obj.bm_code : 'Add new Benchmark Component Setting',
            closable: false,
            message: function (dialogRef) {
                var $message = $('#editDialog > div').clone();

                if (obj.bm_code == '') {
                    $message.find('input[data-field=bm_code]').removeAttr('disabled');
                }

                $message.find('.dialog-weight').inputmask('(100|1[9][.99]|9[9][.99])', {
                    alias: 'decimal',
                    groupSeparator: ',',
                    autoGroup: true,
                });

                if (obj == null) {
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
                            dialogBenchmark: {
                                selector: '[data-field=bm_code]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter benchmark code.',
                                    },
                                },
                            },
                            dialogIndex: {
                                selector: '[data-field=index_code]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please select index.',
                                    },
                                },
                            },
                        },
                    })
                    .on('success.form.fv', function (e) {
                        // Prevent default form submission
                        e.preventDefault();

                        var $form = $(e.target);
                        var msg = 'Are you sure you want to save this benchmark component setting ?';
                        $.App.ui.dialog.confirm(msg, function (result) {
                            if (result) {
                                var req = $.App.ui.read(null, $message);

                                $.ajax({
                                    type: "POST",
                                    data: JSON.stringify(req),
                                    url: rootapi + '/api/perf/bm-weight/save',
                                    contentType: 'application/json; charset=utf-8',
                                    dataType: 'json',
                                    success: function (data, status, xhr) {
                                        $.App.ui.dialog.success('The benchmark component setting was saved successfully.', function () {
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
        var msg = 'Are you sure you want to delete this benchmark component setting ?';
        $.App.ui.dialog.confirm(msg, function (result) {
            if (result) {
                var req = kendoUtility.grid.getRowData('#grid', $this);

                $.ajax({
                    type: "POST",
                    data: JSON.stringify(req),
                    url: rootapi + '/api/perf/bm-weight/delete',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        $.App.ui.dialog.success('The benchmark component setting was deleted successfully.', function () {
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

function loadIndex() {
    $.ajax({
        url: rootapi + '/api/perf/index/list',
        global: false,
        type: 'GET',
        success: function (data) {
            var $ddl = $('select[data-field=index_code]');
            $ddl.html('');
            var $group = null;
            var group = '';
            for (var i = 0; i < data.length; i++) {
                if (group != data[i].index_type) {
                    if ($group != null) {
                        $ddl.append($group);
                    }
                    var display_type = data[i].index_type != data[i].index_sub_type ? data[i].index_type + ' - ' + data[i].index_sub_type : data[i].index_type;
                    $group = $('<optgroup></optgroup>').attr('label', display_type);
                    group = data[i].index_type;
                }
                var $opt = $('<option></option>')
                    .attr('data-subtext', data[i].index_name_html)
                    .val(data[i].index_code)
                    .html(data[i].index_code);
                $group.append($opt);
            }
            $ddl.append($group);
        },
    });

}

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
                    url: rootapi + '/api/perf/bm-weight',
                },
            },
            schema: {
                model: {
                    fields: {
                        created_date: { type: "date", },
                        updated_date: { type: "date", },
                        weight: { type: "number", },
                    }
                }
            },
        },
        toolbar: [{
            template: $("#templateAdd").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('benchmark_weight'),
        },
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
            attributes: { 'class': 'bold' },
            field: 'bm_code',
            title: 'Benchmark',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'index_code',
            title: 'Index Code',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': '' },
            field: 'index_name',
            title: 'Index Name',
            width: 250,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'weight',
            format: '{0:P2}',
            title: 'Weight',
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
