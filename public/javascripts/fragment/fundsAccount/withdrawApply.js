/**
 * 提现申请
 */
app.controller("withdrawApplyCtr", ["$scope", "eventServiceFactory", "fundsAccountService", function ($scope, eventServiceFactory, fundsAccountService) {
    /**
     * 监听到事件之后执行init模块。
     * @param data
     */
    $scope.init = function (data) {
        //初始化页面值
        $scope.initData(data);
    };
    var eventHandler = eventServiceFactory.createEventService();
    eventHandler.on('withdrawApplyData', $scope.init);

    /**
     * 初始化数据
     * @param data
     */
    $scope.initData = function (data) {
        //缓存主键值，默认页面共有。不再进行函数参数传递。
        $scope.thirdPayAccountId = data.thirdPayAccountId;
        $scope.accountBank = data.accountBank;
        $scope.accountInfoTotalBalance = fundsAccountService.dealNumber(data.accountInfo.totalBalance);
        $scope.accountInfo = data.accountInfo || {};
        //初始化页面值
        $scope.withdrawAmount = ''; //提现金额
        $scope.note = '';
        $scope.feeMoney = '0.00';    //手续费
        $scope.arrivedMoney = '0.00'; //到账金额
        $scope.withdrawAmountError = false;
        $scope.withdrawAmountErrorTips = "";
        $scope.withdrawForm.$setPristine();
        $scope.withdrawForm.$setUntouched();
    };

    /**
     * 全部提现
     */
    $scope.takeAll = function () {
        $scope.withdrawAmount = fundsAccountService.digital($scope.accountInfo.totalBalance);

        $scope.getFeeCheck();
    };

    $scope.checkWithdrawAmount = function (){
        var withdrawAmount = fundsAccountService.digital($scope.withdrawAmount),
            totalBalance = fundsAccountService.digital($scope.accountInfo.totalBalance);

        if (withdrawAmount > totalBalance) {
            $scope.withdrawAmountError = true;
            $scope.withdrawAmountErrorTips = '提现金额不能超过可用余额!';
        }else{
            $scope.withdrawAmountError = false;
            $scope.withdrawAmountErrorTips = "";
        }
    };
    /**
     * 获取手续费
     */
    $scope.getFeeCheck = function () {
        //校验数据正确性。是否超过了可提现余额
        var withdrawAmount = fundsAccountService.digital($scope.withdrawAmount),
            totalBalance = fundsAccountService.digital($scope.accountInfo.totalBalance);

        if (!withdrawAmount) {
            $scope.feeMoney = '0.00';
            $scope.arrivedMoney = '0.00';
            $scope.withdrawAmount = withdrawAmount.toFixed(2);    //页面显示0.00
            return;
        }
        if (withdrawAmount > totalBalance) {
            $scope.withdrawAmountError = true;
            $scope.withdrawAmountErrorTips = '提现金额不能超过可用余额!';
            return;
        }else{
            $scope.withdrawAmountError = false;
            $scope.withdrawAmountErrorTips = "";
        }

        var config = {
            'urlParams': {
                "custAcctId": $scope.accountInfo.custAcctId,
                "thirdCustId": $scope.accountInfo.thirdCustId,
                "custName": $scope.accountInfo.custName,
                "outAcctId": $scope.accountBank.cardNo,
                "outAcctIdName": $scope.accountBank.bank,
                "ccyCode": $scope.accountInfo.currency,
                "tranAmount": withdrawAmount
            }
        };
        fundsAccountService.getFeeCheck(config,function(res){
            if(res.errorCode === 0){
                var resData = fundsAccountService.digital(res.data);
                var arrivedMoney = withdrawAmount - resData;
                $scope.feeMoney = fundsAccountService.dealNumber(res.data);
                $scope.arrivedMoney = fundsAccountService.dealNumber(arrivedMoney);
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

    /**
     * 提现申请
     */
    $scope.submitWithdraw = function (event) {
        event.preventDefault();  //阻止跳转到第三方

        if($scope.withdrawAmount == '0.00' || $scope.withdrawAmount == '0'){
            $scope.withdrawAmount = '';
            return false;
        }

        if (!$scope.withdrawAmount) {
            $scope.withdrawForm.withdrawAmount.$setDirty();
        }
        if (!$scope.note) {
            $scope.withdrawForm.note.$setDirty();
        }
        if($scope.withdrawAmountError){
            return false;
        }
        if (!$scope.withdrawForm.$valid) {
            return false;
        }

        var config = {
            'urlParams': {
                'custAcctId': $scope.accountInfo.custAcctId,
                'thirdCustId': $scope.accountInfo.thirdCustId,
                'custName': $scope.accountInfo.custName,
                'outAcctId': $scope.accountBank.cardNo,
                'outAcctIdName': $scope.accountBank.bank,
                'ccyCode': $scope.accountInfo.currency,
                'tranAmount': $scope.withdrawAmount,
                'handFee': $scope.feeMoney,
                'note': $scope.note
            }
        };
        fundsAccountService.withdrawCallback(config, function (res) {
            if (res.data) {
                switch (res.data.status) {
                    case 0 :
                        res.data.statusValue = '成功';
                        break;
                    case 1:
                        res.data.statusValue = '失败';
                        break;
                    case 2:
                        res.data.statusValue = '待确认';
                        break;
                    case 3:
                        res.data.statusValue = '处理中';
                        break;
                    default :
                        res.data.statusValue = '异常';
                }
            }
            if (res.errorCode == 0) {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: '提现成功!',
                    type: 'success'
                });
                //支付页面
                $scope.$parent.block = 'rechargeResult';
                eventHandler.dispatch('rechargeResultData', {
                    'thirdPayAccountId': $scope.thirdPayAccountId,
                    'accountInfo': $scope.accountInfo,
                    'isSuccess': true,
                    'rechargeData': config.urlParams,
                    'reChargeResult': res.data,
                    'from':'accountDetail'
                });
            } else {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: '提现失败!' + res.msg,
                    type: 'errer',
                    manualClose: true
                });
            }
        });
    };

    /**
     * 提现结果
     * @param type
     */
    $scope.withdrawResult = function (type) {
        $scope.withdrawPrompt = false;

        //检测是否成功或者失败。

        if (type == 'failure') {    //点击失败。

        } else if (type == 'success') {    //点击成功。

        }
    };

    $scope.goBack = function(){
        $scope.$parent.block = 'accountDetail';
        //事件委派。
        eventHandler.dispatch('accountDetailData', {
            'thirdPayAccountId': $scope.thirdPayAccountId,
            'custName': $scope.accountInfo.custName,
            'currencyCode': $scope.accountInfo.currencyCode
        });
    };
}]);