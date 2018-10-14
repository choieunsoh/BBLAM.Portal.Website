$(function () {
    "use strict";

    if ($('#myObject').val() !== '') {
        var $my = $.parseJSON($('#myObject').val());
        if ($my) {
            $('#welcome_user').text($my.UserName + ' (' + $my.FullNameEn + ')');
        }
    }

    $('#div-debug').html('' + $(window).width() + 'px of ');
    $(window).on('resize', function () {
        $('#div-debug').html('' + $(window).width() + 'px of ');
    });

    $(window).load(function () {
        $.proccessTime.pageLoad();
    })

    $(window).on('resize', function () {
        if ($('.chart').length > 0) {
            kendo.resize($('#chart'));
            kendo.resize($('.chart'));
        }
    });

});
/* Accordion */
$(function () {

    $(".accordion33").each(function () {
        $(this).find(".acc-tab").each(function () {
            var _loc = $(this),
                _t = _loc.find(".acc-title"),
                _desc = _loc.find(".acc-content");
            _t.click(function (e) {
                e.preventDefault();
                if (_loc.hasClass("show")) {
                    _desc.stop().animate({
                        'height': 0
                    }, 450, "easeInOutSine");
                } else {
                    var _h = _desc.stop().css('height', '100%').height();
                    _desc.css('height', 0).animate({
                        'height': _h
                    }, 480, "easeInOutSine", function () {
                        $(this).css('height', 'auto');
                    });
                }
                _loc.toggleClass("show");
            });
        });
    });
});

function beginProcTime() {
    performanceStart = new Date().getTime();
}
function endProcTime() {
    var now = new Date().getTime();
    $('#procTime').text((now - performanceStart) / 1000.0);
}
function setProcTime() {
    if (window.performance) {
        setTimeout(function () {
            var t = performance.timing;
            $('#procTime').text((t.loadEventEnd - t.responseEnd) / 1000.0);
        }, 0);
    } else { // Older Browser
        endProcTime();
    }
}