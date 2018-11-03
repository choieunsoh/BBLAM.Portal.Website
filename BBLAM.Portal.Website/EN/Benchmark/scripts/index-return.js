$(function () {
    refreshData();
    loadIndex();
    loadBenchmark();

    $(document).on('click', '.btn-upload', function (e) {
        e.preventDefault();

        var dialog = null;
        BootstrapDialog.show({
            title: 'Upload Index Return CSV File',
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
                        saveUrl: rootapi + '/api/perf/index-ret/file-save',
                        removeUrl: rootapi + '/api/perf/index-ret/file-remove',
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
                                $.App.ui.dialog.success('Index Return was uploaded successfully.', function () {
                                    refreshData();
                                    dialog.close();
                                });
                            } else {
                                $.App.ui.dialog.alert('Failed to upload Index Return, please revise file and try again.', function () {
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
                            $.App.ui.dialog.confirm('Are you sure you want to upload \'Index Return CSV File\' ?', function (result) {
                                if (result) {
                                    dialog = dialogRef;
                                    $files.closest('.k-upload').find('.k-upload-selected').trigger('click');
                                }
                            });
                        } else {
                            $.App.ui.dialog.alert('Please select at least one \'Index Return CSV File\' file before upload.');
                        }
                    }
                }
            }]
        });

        return false;
    });

    $(document).on('click', '.btn-calc', function (e) {
        e.preventDefault();

        var dialog = null;
        BootstrapDialog.show({
            title: 'Calculate Benchmark Return',
            closable: false,
            message: function (dialogRef) {
                var $message = $('#calcDialog > div').clone();

                var dates = getCalcDate();
                var $picker = $message.find('#txtCalcStart');
                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
                $picker.datetimepicker($.extend(true, dp_options, {
                    defaultDate: moment(dates[0]),
                }));

                $picker = $message.find('#txtCalcEnd');
                $picker.datetimepicker($.extend(true, dp_options, {
                    defaultDate: moment(dates[1]),
                }));

                $message.find('.selectpicker2').val('').selectpicker('refresh');

                return $message;
            },
            buttons: [{
                label: 'Close',
                action: function (dialogRef) {
                    dialogRef.close();
                }
            }, {
                icon: 'fa fa-refresh',
                label: 'Calc BM Return',
                cssClass: 'btn-danger dialog-btn-upload',
                action: function (dialogRef) {
                    dialog = null;
                    var $content = dialogRef.getModalContent();
                    var asof = moment($content.find("#txtCalcStart").data('DateTimePicker').date());
                    var asof_to = moment($content.find("#txtCalcEnd").data('DateTimePicker').date());
                    var bm_code = $content.find('select[data-field=bm_code]').val();
                    $.App.ui.dialog.confirm('Are you sure you want to calculate \'Benchmark Return\' ?', function (result) {
                        if (result) {
                            $.ajax({
                                async: false,
                                type: 'GET',
                                url: rootapi + '/api/perf/bm-ret/calc',
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                data: {
                                    start_date: asof.format('YYYY-MM-DD'),
                                    end_date: asof_to.format('YYYY-MM-DD'),
                                    bm_code: bm_code,
                                },
                                success: function (data, status, xhr) {
                                    $.App.ui.dialog.success('Benchmark Return was calculated successfully.', function (e) {
                                        dialogRef.close();
                                    });
                                },
                                error: function (xhr, status, error) {
                                    $.App.ui.dialog.alert('Error. ' + error);
                                }
                            });
                        }
                    });
                }
            }]
        });

        return false;
    });

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
            title: obj.index_code ? 'Update Return of ' + obj.index_code : 'Add new Index Return',
            closable: false,
            message: function (dialogRef) {
                var $message = $('#editDialog > div').clone();

                var dp_options = $.extend(true, {}, bsUtility.datePicker.getConfig(DateFormats.moment.long, true));
                $message.find('.dialog-asof').datetimepicker($.extend(true, dp_options, {
                    defaultDate: obj.asof,
                }));

                $message.find('.dialog-num').inputmask({
                    alias: 'numeric',
                    autoUnmask: true,
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
                            dialogAsof: {
                                selector: '[data-field=asof]',
                                validators: {
                                    notEmpty: {
                                        message: 'Please select as of from calendar.',
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
                    .on('blur', '[data-field=asof]', function (e) {
                        $form.formValidation('revalidateField', 'dialogAsof');
                    })
                    .on('success.form.fv', function (e) {
                        // Prevent default form submission
                        e.preventDefault();

                        var $form = $(e.target);
                        var msg = 'Are you sure you want to save this index return ?';
                        $.App.ui.dialog.confirm(msg, function (result) {
                            if (result) {
                                var req = $.App.ui.read(null, $message);

                                $.ajax({
                                    type: "POST",
                                    data: JSON.stringify(req),
                                    url: rootapi + '/api/perf/index-ret/save',
                                    contentType: 'application/json; charset=utf-8',
                                    dataType: 'json',
                                    success: function (data, status, xhr) {
                                        $.App.ui.dialog.success('The index return was saved successfully.', function () {
                                            dialogRef.close();
                                            refreshData();
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
        var msg = 'Are you sure you want to delete this benchmark weight ?';
        $.App.ui.dialog.confirm(msg, function (result) {
            if (result) {
                var req = kendoUtility.grid.getRowData('#grid', $this);

                $.ajax({
                    type: "POST",
                    data: JSON.stringify(req),
                    url: rootapi + '/api/perf/index-ret/delete',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        $.App.ui.dialog.success('The benchmark weight was deleted successfully.', function () {
                            refreshData();
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
    })

});

function loadBenchmark() {
    $.ajax({
        url: rootapi + '/api/perf/bm/all-code',
        global: false,
        type: 'GET',
        success: function (data) {
            var $ddl = $('select[data-field=bm_code]');
            $ddl.html('');
            for (var i = 0; i < data.length; i++) {
                var $opt = $('<option></option>').val(data[i]).html(data[i]);
                $ddl.append($opt);
            }
        },
    });

}

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

function loadIndex() {
    $.ajax({
        url: rootapi + '/api/perf/index/list',
        global: false,
        type: 'GET',
        success: function (data) {
            bindIndexList(data, $('#ddlIndexCode'), true);
            bindIndexList(data, $('select[data-field=index_code]'), false);
        },
    });
}
function bindIndexList(data, $ddl, autobind) {
    $ddl.html('');
    var $group = null;
    var group = '';
    for (var i = 0; i < data.length; i++) {
        var display_type = data[i].index_type != data[i].index_sub_type ? data[i].index_type + ' - ' + data[i].index_sub_type : data[i].index_type;
        if (group != display_type) {
            if ($group != null) {
                $ddl.append($group);
            }
            $group = $('<optgroup></optgroup>').attr('label', display_type);
            group = display_type;
        }
        var $opt = $('<option></option>')
            .attr('data-subtext', data[i].index_name_html)
            .val(data[i].index_code)
            .html(data[i].index_code);
        $group.append($opt);
    }
    $ddl.append($group);
    $ddl.val('');
    if (autobind) {
        $ddl.selectpicker('refresh');
        bsUtility.selectPicker.addDeselectEvent($ddl);
    }
}

function setupGrid() {
    var asof = moment($('#txtAsof').data('DateTimePicker').date());
    var asof_to = moment($('#txtAsofTo').data('DateTimePicker').date());
    var index_code = $('#ddlIndexCode').find('option:selected').val();

    var options = $.extend(true, {}, kendoUtility.gridConfig);
    var $grid = $('#grid');
    $grid.empty();
    $grid.kendoGrid($.extend(true, options, {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    contentType: 'application/json; charset=utf-8',
                    url: rootapi + '/api/perf/index-ret',
                },
                parameterMap: function (data, type) {
                    return {
                        start_date: asof.format('YYYY-MM-DD'),
                        end_date: asof_to.format('YYYY-MM-DD'),
                        index_code: index_code ? index_code : '',
                    };
                },
            },
            schema: {
                model: {
                    fields: {
                        asof: { type: "date", },
                        created_date: { type: "date", },
                        updated_date: { type: "date", },
                        
                        closed_price: { type: "number", },
                        index_return: { type: "number", },
                    }
                }
            },
        },
        toolbar: [{
            template: $("#templateAdd").html(),
        }],
        excel: {
            fileName: kendoUtility.excelExport.createFileName('index_return', asof, asof_to),
        },
        showTooltip: true,
        selectable: false,
        scrollable: true,
        allowCopy: true,
        pageable: {
            pageSizes: ['All', 10, 20, 50, 100, 200, 500],
            pageSize: 200,
        },
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
            field: 'asof',
            title: 'Asof',
            format: '{0:dd-MMM-yyyy}',
            parseFormats: [DateFormats.json],
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
            attributes: { 'class': '' },
            field: 'index_type',
            title: 'Index Type',
            filterable: { multi: true, },
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'closed_price',
            format: '{0:#,##0.##########}',
            title: 'Closed Price',
            width: 100,
        }, {
            attributes: { 'class': 'text-right' },
            field: 'index_return',
            template: '#= index_return != null ? index_return.toChangeColor("{0:P16}") : "" #',
            title: 'Return',
            width: 150,
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

function getCalcDate() {
    var result = [];
    $.ajax({
        url: rootapi + '/api/perf/bm-ret/calc-avail',
        async: false,
        type: 'GET',
        success: function (data) {
            result = data;
        },
    });
    if (result == null || result.length != 2) {
        result = [moment().startOf('day'), moment().startOf('day')];
    }
    return result;
}
