/**
 * 交易记录详情
 */
app.controller("businessRecordCtr", ["$scope", "fundsAccountService", "eventServiceFactory", function ($scope, fundsAccountService, eventServiceFactory) {
    /**
     * 监听到事件之后执行init模块。
     * @param data
     */
    $scope.init = function (data) {
        //初始化页面值
        $scope.initData(data);

        $scope.getBussinessRecordDetail();
    };
    var eventHandler = eventServiceFactory.createEventService();
    eventHandler.on('businessRecordData', $scope.init);

    /**
     * 初始化数据
     * @param data
     */
    $scope.initData = function (data) {
        $scope.record = data.item || {};    //item.tranTypeCode == 0：充值, 1:提现, 2:支付
        $scope.recordTranAmount = fundsAccountService.dealNumber($scope.record.tranAmount);
        $scope.accountId = data.accountId || '';    //账户号
        $scope.currency = data.currency || '';
        $scope.currencyCode = data.currencyCode || '';
        $scope.info = {};
    };

    /**
     * 获取交易记录详情
     */
    $scope.getBussinessRecordDetail = function () {
        var config = {
            'seatParams': {
                'id': $scope.record.id
            }
        };
        fundsAccountService.getBussinessRecordDetail(config, function (res){
            if (res.errorCode === 0) {
                $scope.info = res.data;
            }else{
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: res.msg,
                    type: 'errer',
                    manualClose: true
                });
            }
        });
    };
}]);