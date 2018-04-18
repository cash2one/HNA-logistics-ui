app.factory('historyRateView', [function() {
    var historyRateView = {};
    var classPool = ["begin-time-canlander", "finish-time-canlander", "start-time-canlander", "end-time-canlander"];
    var inputPool = ["#begin-time", "#finish-time", "#start-time", "#end-time"];
    var endTime = "";
    var beginTime = "";
    var finishTime = "";
    var defaultTime = "2100-01-01 00:00:00";
    function clearOtherClass(currentClass) {
        for(var index = 0; index < classPool.length; index++) {
            if(currentClass != classPool[index]) {
                $(".ui-datepicker").removeClass(classPool[index]);
            }
        }
    }
    function getCurrentInputEle() {
        for(var index = 0; index < classPool.length; index++) {
            if($(".ui-datepicker").hasClass(classPool[index])) {
                return $(inputPool[index]);
            }
        }
        return null;
    }
    historyRateView.initCalander = function($scope) {
        $('#begin-time').datetimepicker({
            timeFormat: "HH:mm:ss",
            dateFormat: "yy-mm-dd",
            showSecond: true,
            changeYear: true,
            changeMonth: true,
            maxDate: defaultTime,
            showOtherMonths: true,
            beforeShow: function() {
                beginTime = $("#begin-time").val();
                if($('#finish-time').val()) {
                    $("#begin-time").datetimepicker("option", "maxDate", $('#finish-time').val());
                    $("#begin-time").val(beginTime);
                }
                $(".ui-datepicker").css("visibility", "visible");
                $(".ui-datepicker").removeClass("canlander2");
                $(".ui-datepicker").addClass("canlander");
                clearOtherClass("begin-time-canlander");
                $(".ui-datepicker").addClass("begin-time-canlander");
            }, onSelect: function(date) {
                var beginTimeData = new Date(date).getTime();
                var finishTimeData = new Date($("#finish-time").val()).getTime();
                if(finishTimeData < beginTimeData) {
                    $("#begin-time").val(new Date(finishTimeData).format("yyyy-MM-dd hh:mm:ss"));
                    $("#begin-time").datetimepicker("refresh");
                    beginTime = $("#begin-time").val();
                } else {
                    beginTime = date;
                }
            },
            onClose: function() {
                $("#begin-time").val(beginTime);
            }
        });
        $('#finish-time').datetimepicker({
            timeFormat: "HH:mm:ss",
            dateFormat: "yy-mm-dd",
            showSecond: true,
            changeYear: true,
            changeMonth: true,
            maxDate: defaultTime,
            beforeShow: function() {
                finishTime = $("#finish-time").val();
                if($('#begin-time').val()) {
                    $("#finish-time").datetimepicker("option", "minDate", $('#begin-time').val());
                }
                $(".ui-datepicker").css("visibility", "visible");
                $(".ui-datepicker").removeClass("canlander2");
                $(".ui-datepicker").addClass("canlander");
                clearOtherClass("finish-time-canlander");
                $(".ui-datepicker").addClass("finish-time-canlander");
            },
            onSelect: function(date) {
                var beginTimeData = new Date($("#begin-time").val()).getTime();
                var finishTimeData = new Date(date).getTime();
                if(finishTimeData < beginTimeData) {
                    $("#finish-time").val(new Date(beginTimeData).format("yyyy-MM-dd hh:mm:ss"));
                    $("#finish-time").datetimepicker("refresh");
                    finishTime = $("#finish-time").val();
                } else {
                    finishTime = date;
                }
            },
            onClose: function() {
                $("#finish-time").val(finishTime);
            }
        });
        $('#start-time').datetimepicker({
            timeFormat: "HH:mm:ss",
            dateFormat: "yy-mm-dd",
            showSecond: true,
            changeYear: true,
            changeMonth: true,
            maxDate: defaultTime,
            beforeShow: function() {
                startTime = $("#start-time").val();
                if($('#end-time').val()) {
                    $("#start-time").datetimepicker("option", "maxDate", $('#end-time').val());
                    $("#start-time").val(startTime);
                }
                $(".ui-datepicker").css("visibility", "visible");
                $(".ui-datepicker").removeClass("canlander");
                $(".ui-datepicker").addClass("canlander2");
                clearOtherClass("start-time-canlander");
                $(".ui-datepicker").addClass("start-time-canlander");
            },
            onSelect: function(date) {
                var startTimeData = new Date(date).getTime();
                var endTimeData = new Date($("#end-time").val()).getTime();
                if(endTimeData < startTimeData) {
                    $("#start-time").val(new Date(endTimeData).format("yyyy-MM-dd hh:mm:ss"));
                    $("#start-time").datetimepicker("refresh");
                    startTime = $("#start-time").val();
                } else {
                    startTime = date;
                }
            },
            onClose: function() {
                $("#start-time").val(startTime);
            }
        });
        $('#end-time').datetimepicker({
            timeFormat: "HH:mm:ss",
            dateFormat: "yy-mm-dd",
            showSecond: true,
            changeYear: true,
            changeMonth: true,
            maxDate: defaultTime,
            beforeShow: function(date) {
                endTime = $("#end-time").val();
                if($('#start-time').val()) {
                    $("#end-time").datetimepicker("option", "minDate", $('#start-time').val());
                }
                if($("#end-time").val() == defaultTime && $scope.isEdit) {
                    $(".ui-datepicker").css("visibility", "hidden");
                    return;
                } else {
                    $(".ui-datepicker").css("visibility", "visible");
                }
                $("#end-time").val("");
                $(".ui-datepicker").removeClass("canlander");
                $(".ui-datepicker").addClass("canlander2");
                clearOtherClass("end-time-canlander");
                $(".ui-datepicker").addClass("end-time-canlander");
            },
            onSelect: function(date) {
                var startTimeData = new Date($("#start-time").val()).getTime();
                var endTimeData = new Date(date).getTime();
                if(endTimeData < startTimeData) {
                    $("#end-time").val(new Date(startTimeData).format("yyyy-MM-dd hh:mm:ss"));
                    $("#end-time").datetimepicker("refresh");
                    endTime = $("#end-time").val();
                } else {
                    endTime = date;
                }
            },
            onClose: function() {
                $("#end-time").val(endTime);
            }
        });
        $(window).resize(function() {//保证在拉缩窗口的时候更新日历位置
            var currentInputEle = getCurrentInputEle();
            if(currentInputEle && currentInputEle.length > 0) {
                var calanderEle = $(".ui-datepicker");
                calanderEle.offset({
                    left: currentInputEle.offset().left
                });
            }
        });
    }
    return historyRateView;
}]);