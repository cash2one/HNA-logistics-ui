app.factory('rateView', [function() {
    var rateView = {};
    var endTime = "";
    var startTime = "";
    var endTime = "";
    var beginTime = "";
    var finishTime = "";
    var classPool = ["begin-time-canlander", "finish-time-canlander", "start-time-canlander", "end-time-canlander"];
    var inputPool = ["#begin-time", "#finish-time", "#start-time", "#end-time"];
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
    function limitStartDate($scope) {
        if($scope.isEdit) {
            if(new Date($("#start-time").val()).getTime() > new Date(standardEndTime).getTime()) {
                $("#start-time").val(new Date(standardEndTime).format("yyyy-MM-dd hh:mm:ss"));
                $("#start-time").datetimepicker("refresh");
            }
        }
    }
    function limitEndDate($scope) {
        if($scope.isEdit) {
            if(new Date($("#end-time").val()).getTime() < new Date(standardStartTime).getTime()) {
                $("#end-time").val(new Date(standardStartTime).format("yyyy-MM-dd hh:mm:ss"));
                $("#end-time").datetimepicker("refresh");
            }
        }
    }
    rateView.initCalander = function($scope) {
        $('#start-time').datetimepicker({
            timeFormat: "HH:mm:ss",
            dateFormat: "yy-mm-dd",
            showSecond: true,
            changeYear: true,
            changeMonth: true,
            maxDate: defaultTime,
            beforeShow: function() {
                startTime = $("#start-time").val();
                $("#start-time").datetimepicker("setDate", startTime);
                //$("#start-time").datetimepicker("option", "defaultDate", startTime);
                if($('#end-time').val()) {
                    $("#start-time").datetimepicker("option", "maxDate", $('#end-time').val());
                    $("#start-time").val(startTime);
                }
                if(!$scope.isEdit) {
                    $("#start-time").datetimepicker("option", "minDate", $("#start-time").val());
                } else {
                    $("#start-time").datetimepicker("option", "minDate", "");
                }
                if(new Date($("#end-time").val()).getTime() > new Date(standardEndTime).getTime()) {
                    $("#start-time").datetimepicker("option", "maxDate", standardEndTime);
                } else {
                    $("#start-time").datetimepicker("option", "maxDate", $("#end-time").val());
                }
                limitStartDate($scope);
                $(".ui-datepicker").css("visibility", "visible");
                $(".ui-datepicker").removeClass("canlander");
                $(".ui-datepicker").addClass("canlander2");
                clearOtherClass("start-time-canlander");
                $(".ui-datepicker").addClass("start-time-canlander");
            },
            onChangeMonthYear: function() {
                startTime = $("#start-time").val();
                limitStartDate($scope);
            },
            onSelect: function(date) {
                var startTimeData = new Date(date).getTime();
                var endTimeData = new Date($("#end-time").val()).getTime();
                if(!$scope.isEdit && startTimeData < new Date(startTime).getTime()) {
                    $("#start-time").val(new Date(startTime).format("yyyy-MM-dd hh:mm:ss"));
                    $("#start-time").datetimepicker("refresh");
                    return;
                }
                if(endTimeData < startTimeData) {
                    $("#start-time").val(new Date(endTimeData).format("yyyy-MM-dd hh:mm:ss"));
                    $("#start-time").datetimepicker("refresh");
                    startTime = $("#start-time").val();
                } else {
                    startTime = date;
                }
                limitStartDate($scope);
            },
            onClose: function() {
                $("#start-time").datetimepicker("setDate", startTime);
                endTime = $("#end-time").val();
                if(new Date(endTime).getTime() < new Date(startTime).getTime()) {
                    $("#start-time").datetimepicker("setDate", endTime);
                    $("#start-time").val(endTime);
                } else {
                    $("#start-time").datetimepicker("setDate", startTime);
                    $("#start-time").val(startTime);
                }
                limitStartDate($scope);
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
                $("#end-time").datetimepicker("setDate", endTime);
                if($('#start-time').val()) {
                    $("#end-time").datetimepicker("option", "minDate", $('#start-time').val());
                }
                if(new Date($("#start-time").val()).getTime() < new Date(standardStartTime).getTime()) {
                    $("#end-time").datetimepicker("option", "minDate", standardStartTime);
                } else {
                    $("#end-time").datetimepicker("option", "minDate", $("#start-time").val());
                }
                limitEndDate($scope);
                if(!$scope.isEdit) {//添加
                    $("#end-time").val(defaultTime);
                    $(".ui-datepicker").css("visibility", "hidden");
                    return;
                } else {//编辑
                    if($("#end-time").val().indexOf(defaultTime.split(" ")[0]) > -1) {
                        $(".ui-datepicker").css("visibility", "hidden");
                    } else {
                        //$("#end-time").val("");
                        $(".ui-datepicker").css("visibility", "visible");
                    }
                }
                $(".ui-datepicker").removeClass("canlander");
                $(".ui-datepicker").addClass("canlander2");
                clearOtherClass("end-time-canlander");
                $(".ui-datepicker").addClass("end-time-canlander");
            },
            onChangeMonthYear: function() {
                endTime = $("#end-time").val();
                if(new Date(endTime).getTime() > new Date(defaultTime).getTime()) {
                    endTime = defaultTime;
                    $("#end-time").val(defaultTime);
                    $("#end-time").datetimepicker("refresh");
                }
                limitEndDate($scope);
            },
            onSelect: function(date) {
                var startTimeData = new Date($("#start-time").val()).getTime();
                var endTimeData = new Date(date).getTime();
                if(endTimeData < startTimeData) {
                    $("#end-time").val(new Date(startTimeData).format("yyyy-MM-dd hh:mm:ss"));
                    $("#end-time").datetimepicker("refresh");
                    endTime = $("#end-time").val();
                } else if(endTimeData > new Date(defaultTime).getTime()) {
                    $("#end-time").val(new Date(defaultTime).format("yyyy-MM-dd hh:mm:ss"));
                    $("#end-time").datetimepicker("refresh");
                    endTime = $("#end-time").val(defaultTime);
                } else {
                    endTime = date;
                }
                limitEndDate($scope);
            },
            onClose: function() {
                if(new Date(endTime).getTime() < new Date($("#start-time").val()).getTime()) {
                    $("#end-time").datetimepicker("setDate", $("#start-time").val());
                    $("#end-time").val($("#start-time").val());
                } else {
                    $("#end-time").datetimepicker("setDate", endTime);
                    $("#end-time").val(endTime);
                }
                limitEndDate($scope);
            }
        });
        /*$('#start-time').datetimepicker({
            timeFormat: "HH:mm:ss",
            dateFormat: "yy-mm-dd",
            showSecond: true,
            changeYear: true,
            changeMonth: true,
            maxDate: "2100-01-01 00:00:00",
            beforeShow: function() {
                $(".ui-datepicker").addClass("canlander");
                $(".ui-datepicker").addClass("start-time-canlander");
            }
        });
        $('#end-time').datetimepicker({
                timeFormat: "HH:mm:ss",
                dateFormat: "yy-mm-dd",
                showSecond: true,
                changeYear: true,
                changeMonth: true,
                maxDate: "2100-01-01 00:00:00",
                beforeShow: function() {
                    endTime = $("#end-time").val();
                    $('#end-time').val("");
                    $(".ui-datepicker").addClass("canlander");
                    $(".ui-datepicker").addClass("end-time-canlander");
                },
                onSelect: function(date) {
                    endTime = date;
                },
                onClose: function() {
                    if(!$('#end-time').val()) {
                        $("#end-time").val(endTime);
                    }
                }
        });*/
        $('#begin-time').on("keyup", function() {
            if(!$.trim($("#begin-time").val())) {
                beginTime = "";
            }
        });
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
                $("#begin-time").datetimepicker("option", "defaultDate", beginTime);
                $("#begin-time").datetimepicker("setDate", beginTime);
                if($.trim($('#finish-time').val())) {
                    $("#begin-time").datetimepicker("option", "maxDate", $('#finish-time').val());
                    $("#begin-time").val(beginTime);
                } else {
                    $("#begin-time").datetimepicker("option", "maxDate", "");
                    $("#begin-time").val(beginTime);
                }
                $(".ui-datepicker").css("visibility", "visible");
                $(".ui-datepicker").removeClass("canlander2");
                $(".ui-datepicker").addClass("canlander");
                clearOtherClass("begin-time-canlander");
                $(".ui-datepicker").addClass("begin-time-canlander");
            },
            onChangeMonthYear: function() {
                beginTime = $("#begin-time").val();
            },
            onSelect: function(date) {
                var beginTimeData = new Date(date).getTime();
                var finishTimeData = new Date($("#finish-time").val()).getTime();
                if(finishTimeData < beginTimeData && $.trim($('#finish-time').val())) {
                    $("#begin-time").val(new Date(finishTimeData).format("yyyy-MM-dd hh:mm:ss"));
                    $("#begin-time").datetimepicker("refresh");
                    beginTime = $("#begin-time").val();
                } else {
                    beginTime = date;
                }
            },
            onClose: function() {
                $("#begin-time").datetimepicker("setDate", beginTime);
                $("#begin-time").val(beginTime);
            }
        });
        $('#finish-time').on("keyup", function() {
            if(!$.trim($("#finish-time").val())) {
                finishTime = "";
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
                $("#finish-time").datetimepicker("option", "defaultDate", finishTime);
                $("#finish-time").datetimepicker("setDate", finishTime);
                if($.trim($('#begin-time').val())) {
                    $("#finish-time").datetimepicker("option", "minDate", $('#begin-time').val());
                } else {
                    $("#finish-time").datetimepicker("option", "minDate", "");
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
                if(finishTimeData < beginTimeData && $.trim($('#begin-time').val())) {
                    $("#finish-time").val(new Date(beginTimeData).format("yyyy-MM-dd hh:mm:ss"));
                    $("#finish-time").datetimepicker("refresh");
                    finishTime = $("#finish-time").val();
                } else {
                    finishTime = date;
                }
            },
            onChangeMonthYear: function() {
                finishTime = $("#finish-time").val();
            },
            onClose: function() {
                $("#finish-time").datetimepicker("setDate", finishTime);
                $("#finish-time").val(finishTime);
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
    return rateView;
}]);