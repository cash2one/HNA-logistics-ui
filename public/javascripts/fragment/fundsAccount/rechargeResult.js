/**
 * 充值-结果页面
 */
app.controller("rechargeResultCtr", ["$scope", "eventServiceFactory", "fundsAccountService", function ($scope, eventServiceFactory, fundsAccountService) {

    $scope.init = function (data) {
        //初始化页面值
        $scope.initData(data);
    };
    var eventHandler = eventServiceFactory.createEventService();
    eventHandler.on('rechargeResultData', $scope.init);

    /**
     * 初始化数据
     * @param data
     */
    $scope.initData = function (data) {
        //缓存主键值，默认页面共有。不再进行函数参数传递。
        $scope.thirdPayAccountId = data.thirdPayAccountId;
        $scope.accountInfo = data.accountInfo || {};
        $scope.reChargeResult = data.reChargeResult || {};
        $scope.isSuccess = data.isSuccess;
        $scope.rechargeData = data.rechargeData || {};
        $scope.rechargeDataTranAmount = fundsAccountService.dealNumber($scope.rechargeData.tranAmount);
        $scope.rechargeData.tranAmount = fundsAccountService.digital($scope.rechargeData.tranAmount);
        $scope.from = data.from;
        $scope.billInfo = data.billInfo;
    };

    /**
     * 重新提现
     */
    $scope.reCharge = function () {
        $scope.$parent.block = 'accountDetail';
        eventHandler.dispatch('accountDetailData', {
            'thirdPayAccountId': $scope.thirdPayAccountId
        });
    };

    /**
     * 返回
     */
    $scope.goBack = function () {
        if ($scope.from == 'payment') {    //支付页面
            eventHandler.dispatch('paymentData', {
                'thirdPayAccountId': $scope.thirdPayAccountId,
                'billInfo': $scope.billInfo
            });
        } else if($scope.from == 'accountDetail') { //返回账户详情页面
            eventHandler.dispatch('accountDetailData', {
                'thirdPayAccountId': $scope.thirdPayAccountId,
                'custName': $scope.accountInfo.custName,
                'currencyCode': $scope.accountInfo.currencyCode
            });
        }
        $scope.$parent.block = $scope.from;
    };
}]);