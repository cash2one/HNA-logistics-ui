app.factory('logisticsView', [function () {
    var logisticsView = {
        initCalander: function () {
            var maxDate = new Date();
            var defaultDate = new Date().format("yyyy-MM-dd hh:mm:ss");
            console.log("========================",defaultDate)
            $('#updateTime').datetimepicker({
                timeFormat: "HH:mm:ss",
                dateFormat: "yy-mm-dd",
                showSecond: true,
                changeYear: true,
                changeMonth: true,
                defaultDate: defaultDate,
                autoSize: false,
                maxDateTime: maxDate
            });
        },
        getOrderNumList: function () {
            var oTextarea = $("#content").val();
            oTextarea = oTextarea.replace(/\s+/g,' ').trim();
            var orderNumList = oTextarea.split(/[, ，]/);
            orderNumList = orderNumList.filter(function(item){
                return item != "";
            });
            return orderNumList;
        },
        switchLabel: function ($scope) {
            var invalidList = $scope.invalidList;
            var oTextarea = $("#content").val();
            oTextarea = oTextarea.replace(/\s+/g,' ').trim();
            var orderNumList = oTextarea.split(/[, ，]/);
            orderNumList = orderNumList.filter(function(item){
                return item != "";
            });
            var str = "";
            for (var s = 0, len = orderNumList.length; s < len; s++) {
                if (invalidList.indexOf(orderNumList[s]) > -1) {
                    str += "<span class='listSpan invalidNum'>" + orderNumList[s] + "</span> ";
                } else {
                    str += "<span class='listSpan'>" + orderNumList[s] + "</span>";
                }
            }
            $("#contentP").html(str);
            $scope.showTextarea = false;
        },
        delInvalid: function ($scope, e) {
            if (e.keyCode == 8 && false) {   //暂时屏蔽
                var oTextarea = $("#content").val();
                oTextarea = oTextarea.replace(/\s+/g,' ').trim();
                var orderNumList = oTextarea.split(/[, ，]/);
                orderNumList = orderNumList.filter(function(item){
                    return item != "";
                })
                var invalidList = $scope.invalidList;
                $scope.textValue = "";
                var str = "";
                for (var s = 0, len = orderNumList.length; s < len; s++) {
                    if (invalidList.indexOf(orderNumList[s]) == -1) {
                        str += "<span class='listSpan'>" + orderNumList[s] + "</span>";
                        $scope.textValue += orderNumList[s] + " ";
                    }
                }
                $("#contentP").html(str);
                $("#content").val($scope.textValue.trim());
            }else{

            }
        },
        reShowTextarea:function ($scope) {
            var oP = $("#contentP");
            console.log("op=",oP)
            $scope.showTextarea = true;
        },
        isValid:function($scope,e){
            var oTextarea = $("#content").val();
            oTextarea = oTextarea.replace(/\s+/g,' ').trim();
            var orderNumList = oTextarea.split(/[, ，]/);
            orderNumList = orderNumList.filter(function(item){
                return item != "";
            });
            if(orderNumList.length > 100){
                e.preventDefault;
                //$("#content").val(oTextarea.substring(0,oTextarea.length-2));
                //$scope.contentInvalidTips = Lang.getValByKey("logistics","logistics_textarea_100");
                $scope.showMsg(Lang.getValByKey("logistics","logistics_textarea_100"),'errer')
            }else{
                //$scope.contentInvalidTips = null;
            }
        }
    };
    return logisticsView;
}]);