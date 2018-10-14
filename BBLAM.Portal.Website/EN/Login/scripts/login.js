var validuser = '';
$(function () {
    "use strict";

    $('.form-control').on('focus', function (e) {
        $(this).next().addClass('input-group-addon-focus');
    }).on('blur', function (e) {
        if ($(this).val().length == 0) {
            $(this).next().removeClass('input-group-addon-focus');
            $(this).removeClass('form-control-focus');
        } else {
            $(this).addClass('form-control-focus');
        }
    });

    $('#btnLogin2').on('click', function (e) {
    });

    var err = $.getUrlVar('err');
    if (err) bs_alert(decodeURIComponent(err));
    
});
function validateUser() {
    if ($('#txtUserName').val() !== "" && $('#txtPassword').val() !== "") {
        var o = {
            user_name: $('#txtUserName').val().trim(),
            password: $('#txtPassword').val().trim(),
        };
        $.ajax({
            async: false,
            cache: false,
            type: "POST",
            data: JSON.stringify(o),
            url: rootapi + '/api/security/authen',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data, status, xhr) {
                if (data) {
                    validuser = data.UserName;
                }
            },
            error: function (xhr, status, error) {
                bs_alert(xhr.responseText);
            }
        });
    }
}
