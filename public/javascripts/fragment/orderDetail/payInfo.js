app.controller('payInfoCtrl', ['$scope', 'confirmOrderService', function ($scope, confirmOrderService) {
    $scope.getPayInfo = function (e, orderNo, orderStatus) {
        if(orderStatus == 'DRAFT'){return;}
        var config = {
            'seatParams': {
                'orderNo': orderNo
            }
        };

        confirmOrderService.getPayInfo(config, function (res) {
            if(res.errorCode === 0){
                $scope.payStatusName = res.data.payStatusName;    //支付状态
                $scope.estimateFee = res.data.estimateFee;    //预估费用
                $scope.estimateCurrencyCode = res.data.estimateCurrencyCode;
                $scope.actualFee = res.data.actualFee;    //实际费用
                $scope.actualCurrencyCode = res.data.actualCurrencyCode;
                $scope.cashCustormer = res.data.cashCustormer;    //客户是否是现结客户
            }
        });
    };

    $scope.$on('payInfoEvent', $scope.getPayInfo);
}]);