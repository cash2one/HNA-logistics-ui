/**
 * 付款-供账单调用
 */
app.controller("paymentCtr", ["$scope", "eventServiceFactory", "fundsAccountService", function ($scope, eventServiceFactory, fundsAccountService) {

    /**
     * 监听到事件之后执行init模块。
     * @param data
     */
    $scope.init = function (data) {
        //初始化页面值
        $scope.initData(data);
    };
    var eventHandler = eventServiceFactory.createEventService();
    eventHandler.on('paymentData', $scope.init);

    /**
     * 初始化数据
     * @param data
     */
    $scope.initData = function (data) {
        $scope.payMethod = 1;

        $scope.thirdPayAccountId = data.thirdPayAccountId;

        $scope.billInfo = data.billInfo || {};    //账单详情。
        $scope.billInfo.total = fundsAccountService.digital(data.billInfo.total);
        $scope.billInfo.actualTotal = fundsAccountService.digital(data.billInfo.actualTotal);

        $scope.billInfoTotal = fundsAccountService.dealNumber(data.billInfo.total);
        $scope.billInfoActualTotal = fundsAccountService.dealNumber(data.billInfo.actualTotal);

        $scope.accountInfo = {};
        $scope.availableBalance = 0;

        $scope.getAccountInfo();
    };

    /**
     * 账户信息
     */
    $scope.getAccountInfo = function () {
        var config = {
            'seatParams': {
                'thirdPayAccountId': $scope.thirdPayAccountId
            }
        };
        fundsAccountService.getAccountInfo(config, function (res) {
            if (res.errorCode === 0) {
                $scope.accountInfo = res.data || {};
                $scope.availableBalance = fundsAccountService.dealNumber($scope.accountInfo.totalBalance);
            }
        });
    };

    /**
     * 确认付款
     */
    $scope.confirmPayment = function (event) {
        if (!$scope.payMethod) {    //未选择支付方式
            return;
        }
        if ($scope.payMethod == '1') {    //余额支付
            var availableBalance = fundsAccountService.digital($scope.accountInfo.totalBalance),    //可用余额
                actualTotal = fundsAccountService.digital($scope.billInfo.actualTotal);    //支付金额
            if (actualTotal > availableBalance) { //判断付款金额是否 > 余额
                event.preventDefault();
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: '余额不足！',
                    type: 'errer',
                    manualClose: true
                });
                return;
            }
        }

        var config = {
            'urlParams':  {
                "ccyCode": $scope.billInfo.currencyType,
                "funcFlag": "1",
                "handFee": "0",
                "inCustomerId": $scope.billInfo.bizCompanyId,
                "note": "",
                "outCustomerId": $scope.billInfo.platformId,
                "thirdHtId": $scope.billInfo.billNo,
                "tranAmount": $scope.billInfo.actualTotal.toFixed(2)
            }
        };

        fundsAccountService.paymentCallback(config, function (res) {
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
                        res.data.statusValue = '成功';
                }
            }
            if (res.errorCode === 0) {
                $(document).promptBox({isDelay: true, contentDelay: '支付成功!', type: 'success',time: 3000});
                $scope.$parent.block = 'paymentResult';
                eventHandler.dispatch('paymentResultData', {
                    'thirdPayAccountId': $scope.thirdPayAccountId,
                    'accountInfo': $scope.accountInfo,
                    'billInfo': $scope.billInfo,
                    'isSuccess': true,
                    'paymentData': config.urlParams,
                    'paymentResult': res.data
                });
            } else {
                $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
            }
        });
        event.preventDefault(); return;
    };

    /**
     * 获取数字签名
     */
    $scope.getSignature = function () {
        var config = {
            'urlParams': {
                'ccyCode': $scope.accountInfo.currency,
                'funcFlag': 6,
                'inCustAcctId': $scope.billInfo.inCustAcctId,
                'inCustName': $scope.billInfo.inThirdPayName,
                'inThirdCustId': $scope.billInfo.inThirdCustId,
                'note': $scope.note,
                'outCustAcctId': $scope.billInfo.outCustAcctId,
                'outCustName': $scope.billInfo.outThirdPayName,
                'outThirdCustId': $scope.billInfo.outThirdCustId,
                'thirdHtId': $scope.billInfo.billNo,
                'id': $scope.thirdPayAccountId,
                'tranAmount': $scope.billInfo.actualTotal,
                'tranFee': 0
            }
        };
        fundsAccountService.getPaymentSignature(config, function (res) {
            $scope.signatureData = res.data || {};
        });

        return $scope.signatureData;
    };

    /**
     * 银行支付下拉组件
     */
    $scope.getBankList = function () {
        var config = {
            'seatParams': {
                'thirdPayAccountId': $scope.thirdPayAccountId
            }
        };
        fundsAccountService.getBankVerdCardList(config, function (res) {
            $scope.bankListData = res.data;
            angular.forEach($scope.bankListData, function (item, index) {
                if (item.cardNo) {
                    item.name = item.bank + '（尾号' + (item.cardNo).slice(-4) + '）';
                }
            });
        });
        if ($scope.bankListData) {
            selectFactory({
                data: {
                    data: $scope.bankListData
                },
                defaultText: '请选择',
                id: 'select-payment-bank',
                defaultCount: 10000,
                showTextField: 'name',
                attrTextModel: function (name, data, item) {
                    $scope.subbranch = item.name || '';
                    $scope.subbranchId = item.id || '';
                    $scope.$apply();
                }
            }).open();
        }
    };

    $scope.goBack = function () {
        $scope.$parent.block = '';    //回到主页
    };

    /**
     * 去充值
     */
    $scope.goRechargePage = function () {
        $scope.$parent.block = 'recharge';
        $scope.overagePrompt = false;    //隐藏余额不足弹出层。

        //事件委派。
        eventHandler.dispatch('rechargeData', {
            'thirdPayAccountId': $scope.thirdPayAccountId,
            'accountInfo': $scope.accountInfo,    //账户信息
            'billInfo': $scope.billInfo,
            'from': 'payment'    //充值页面返回到支付页面，进行完成支付动作。
        });
    };

    /**
     * 付款结果
     * @param type
     */
    $scope.paymentResult = function (type) {
        $scope.paymentPrompt = false;    //弹出层消失。

        //检测是否成功或者失败。

        if (type == 'failure') {    //点击失败。

        } else if (type == 'success') {    //点击成功。

        }
    };
}]);