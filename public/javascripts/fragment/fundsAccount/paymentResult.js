/**
 * 付款-结果页面
 */
app.controller("paymentResultCtr", ["$scope", "eventServiceFactory", "billApprovalService", "fundsAccountService" ,
    function ($scope, eventServiceFactory, billApprovalService,fundsAccountService) {
        $scope.init = function (data) {
            //初始化页面值
            $scope.initData(data);
        };
        var eventHandler = eventServiceFactory.createEventService();
        eventHandler.on('paymentResultData', $scope.init);

        $scope.initData = function (data) {
            $scope.thirdPayAccountId = data.thirdPayAccountId;
            $scope.accountInfo = data.accountInfo || {};
            $scope.paymentResult = data.paymentResult || {};
            $scope.billInfo = data.billInfo || {};
            $scope.isSuccess = data.isSuccess;
            $scope.paymentData = data.paymentData || {};
            $scope.paymentDataTranAmount = fundsAccountService.dealNumber($scope.paymentData.tranAmount);
            $scope.paymentData.tranAmount = fundsAccountService.digital($scope.paymentData.tranAmount);
        };

        /**
         * 返回
         */
        $scope.goBack = function(){
            $scope.$parent.block = '';
            eventHandler.dispatch('billApprovalData', {})
        };

        $scope.isSuccess = true;

        /**
         * 重新支付
         */
        $scope.rePay = function(){
            $scope.$parent.block = 'payment';
        };
    }
]);