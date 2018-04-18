easySpa.require([
    'widget/prompt',
    'public/javascripts/fragment/ordersStatus/ordersStatus.js'
], function () {
    app.controller('ordersStatusCtrl', ['$scope', '$route', 'ordersStatusService', 'ordersStatusView', function ($scope, $route, ordersStatusService, ordersStatusView) {

        $scope.orderStatus = easySpa.queryUrlValByKey("orderStatus");
        $scope.from = easySpa.queryUrlValByKey("from");

        var callback = function (res) {
            if (res.errorCode != 0) {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: res.msg,
                    type: 'errer',
                    time: 3000,
                    manualClose: true
                });
            } else {
                $scope.processList = ordersStatusDataHandle.setStatus(res.data, $scope.orderStatus);
            }
        };
        ordersStatusService.getOrderStatus("", callback);


        var waybillNo = easySpa.queryUrlValByKey("orderNum");
        if (!waybillNo) {
            return;
        }
        var params = {
            seatParams: {
                "waybillNo": waybillNo
            }
        };

        var callback = function (res) {
            if (res.errorCode != 0) {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: res.msg,
                    type: 'errer',
                    time: 3000,
                    manualClose: true
                });
            } else {
                $scope.orderInfo = {
                    "packageNum": ordersStatusDataHandle.countObjLength(res.data),
                    "orderLogistics": ordersStatusDataHandle.setTransInfo(res.data)
                };
            }
        };

        ordersStatusService.getOrderInfoByorderNo(params, callback);

        $scope.goBack = function () {

            if ($scope.from === 'orderSearch') {
                window.location.href = "#/orderSearch?from=ordersStatus";
            } else {
                window.location.href = "#/orders?&orderStatus=" + $route.current.params.orderStatus
            }
        };

        //設置toggle
        $('.label-text').on("click", function () {
            var menu = {
                "none": "block",
                "block": "none"
            };
            var flag = $(this).siblings().css("display");
            $(this).siblings().css("display", menu[flag]);
            if (menu[flag] == "block") {
                $(this).find("i").css("transform", 'rotate(-90deg)');
            } else {
                $(this).find("i").css("transform", 'rotate(90deg)');
            }
        });

        $scope.toggleList = function (index) {
            $scope.orderInfo.orderLogistics[index].isShow = !($scope.orderInfo.orderLogistics[index].isShow);

            if ($scope.orderInfo.orderLogistics[index].isShow) {
                $("#icon" + index).removeClass("icon_open").addClass("icon_close");
            } else {
                $("#icon" + index).removeClass("icon_close").addClass("icon_open");
            }
        };
    }]);
});