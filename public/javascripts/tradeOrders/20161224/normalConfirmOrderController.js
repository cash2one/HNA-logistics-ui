easySpa.require([
    "service/templateService"
], function(){
    app.controller("normalConfirmOrderController",['$scope','tradeOrdersService','tradeOrdersView', 'templateService', normalConfirmOrderController]);

// orderStatusCode
// 2 是待发货
// 3 是待收货

    function normalConfirmOrderController($scope, tradeOrdersService,tradeOrdersView, templateService) {

        $scope.template = {};
        $scope.IsEdit = true;

        function initCalander() {

            setTimeout(function () {
                Calander.init({
                    ele: "#createTime",
                    isClear: true,
                    showHour: false,
                    showMinute: false,
                    showSecond: false,
                    showTime: false

                });
                Calander.init({
                    ele: "#reachTime",
                    isClear: true,
                    showHour: false,
                    showMinute: false,
                    showSecond: false,
                    showTime: false
                });

            }, 0);
        }


        function init() {
            $scope.pageSize = 1;
            initCalander();
            getOrderInfo()
        }

        init();


        function getOrderInfo() {
            tradeOrdersService.getOrderConfrmByOrderNo($scope.orderNo, function (res) {

                if (res.errorCode == 0) {

                    $scope.template = JSON.parse(res.data.jsonData) || {};//自己手动输入的部分来自于jsonData，有交互的还是来自外层
                    // $scope.template.purchaserCustomerName = res.data.purchaserCustomerName;
                    $scope.template.businessNo = res.data.businessNo;
                    $scope.template.orderGoods = res.data.orderGoods;
                    $scope.template.orderNo = res.data.orderNo;
                    // $scope.template.purchaserCompanyName = res.data.purchaserCompanyName || res.data.purchaserCustomerName;//有可能客户注册的时候不填写

                    angular.forEach($scope.template.orderGoods, function (item) {
                        item.goodsName = tradeOrdersView.StringInsertByInterval(item.goodsName, '\n', 30);

                    })

                } else {
                    tradeOrdersView.promptBox({msg: res.msg});
                }
            });
        }


        function canSubmit() {


            var transportTimeOK = true;
            var sailAndReachTimeOK = true;


            var formCheckField = ['businessNo', 'dealTime', 'buyerCompanyName', 'buyerCompanyAddress', 'buyerCompanyTel',
                'buyerCompanyContacter', 'buyerCompanyContacterTel', 'salerCompanyName', 'salerCompanyAddress', 'salerCompanyTel', 'salerCompanyContacter',
                'salerCompanyContacterTel', 'reachTime'];

            formCheckField.forEach(function (checkField) {
                if (!$scope.template[checkField]) {
                    $scope.normalTemplate[checkField].$setDirty();
                }

            })

            var errorEles = $(".errors");
            for (var index = 0; index < errorEles.length; index++) {
                if (!$(errorEles[index]).hasClass("ng-hide")) {
                    return false;
                }
            }

            return $scope.normalTemplate.$valid;
        }


    }
});