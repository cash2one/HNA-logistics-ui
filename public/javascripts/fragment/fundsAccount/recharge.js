/**
 * 充值
 */
app.controller("rechargeCtr", ["$scope", "eventServiceFactory", "fundsAccountService", function ($scope, eventServiceFactory, fundsAccountService) {

    /**
     * 监听到事件之后执行init模块。
     * @param data
     */
    $scope.init = function (data) {
        //初始化页面值
        $scope.initData(data);
    };
    var eventHandler = eventServiceFactory.createEventService();
    eventHandler.on('rechargeData', $scope.init);

    /**
     * 初始化数据
     * @param data
     */
    $scope.initData = function (data) {
        //缓存主键值，默认页面共有。不再进行函数参数传递。
        $scope.thirdPayAccountId = data.thirdPayAccountId;
        $scope.accountInfo = data.accountInfo || {};
        $scope.billInfo = data.billInfo;    //账单透传数据
        $scope.from = data.from;

        //清空数据
        $scope.money = '';
        $scope.availableBalance = fundsAccountService.digital($scope.accountInfo.availableBalance);  //充值后余额
        $scope.subbranch = '';
        $scope.bankName = '';
        $scope.bankNo = '';
        $scope.note = '';
        $scope.subbranchListData = '';
        if(Select.sharePool['select-subbranch-list']){
            Select.sharePool['select-subbranch-list'].clearData();
            Select.sharePool['select-subbranch-list'].destroy();
        }
        $scope.rechargeForm.$setPristine();
        $scope.rechargeForm.$setUntouched();
    };

    /**
     * 充值金额输入框change时调用
     */
    $scope.moneyChanged = function () {
        var money = fundsAccountService.digital($scope.money),
            availableBalance = fundsAccountService.digital($scope.accountInfo.availableBalance);

        money = money <= 0 ? 0 : money;

        $scope.availableBalance = availableBalance + money;
    };

    /**
     * 获取银行Card List
     */
    $scope.getSubbranchList = function () {
        if (!$scope.subbranchListData) {
            var config = {
                'seatParams': {
                    'thirdPayAccountId': $scope.thirdPayAccountId
                }
            };
            fundsAccountService.getBankVerdCardList(config, function (res) {
                $scope.subbranchListData = res.data;
                angular.forEach($scope.subbranchListData, function (item, index) {
                    if (item.cardNo) {
                        item.reName = item.bank + '（尾号' + (item.cardNo).slice(-4) + '）';
                    }
                });
            });
        }

        if ($scope.subbranchListData) {
            selectFactory({
                data: {
                    data: $scope.subbranchListData
                },
                defaultText: '请选择',
                id: 'select-subbranch-list',
                defaultCount: 10000,
                showTextField: 'reName',
                isCreateNewSelect: true,
                attrTextModel: function (reName, data, item) {
                    $scope.subbranch = item.reName || '';
                    $scope.bankName = item.bank || '';
                    $scope.bankNo = item.cardNo || '';
                    $scope.$apply();
                }
            }).open();
        }
    };

    /**
     * 提交申请
     */
    $scope.submitRecharge = function () {
        if (!$scope.money) {
            $scope.rechargeForm.money.$setDirty();
        }
        if (!$scope.subbranch) {
            $scope.rechargeForm.subbranch.$setDirty();
        }
        if (!$scope.note) {
            $scope.rechargeForm.note.$setDirty();
        }
        if (!$scope.rechargeForm.$valid) {
            return false;
        }

        var config = {
            'urlParams': {
                "ccyCode": $scope.accountInfo.currency,    //币种code
                "note": $scope.note,   //备注
                "thirdCustId": $scope.thirdPayAccountId,    //$scope.thirdPayAccountId
                "tranAmount": $scope.money,
                "bankNo": $scope.bankNo,
                "bankName": $scope.bankName
            }
        };
        fundsAccountService.submitRecharge(config, function (res) {
            //展示第三方消息
            res.thirdMsg = (res.data && res.data.rspMsg) ? res.data.rspMsg : res.msg;

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

            if (res.errorCode === 0) {
                $(document).promptBox({isDelay: true, contentDelay: res.thirdMsg, type: 'success'});

                //支付页面
                $scope.$parent.block = 'rechargeResult';

                eventHandler.dispatch('rechargeResultData', {
                    'thirdPayAccountId': $scope.thirdPayAccountId,
                    'accountInfo': $scope.accountInfo,
                    'isSuccess': true,
                    'rechargeData': config.urlParams,
                    'reChargeResult': res.data,
                    'from': $scope.from,    //from值为支付页面，或者资金账户详情页面。
                    'billInfo': $scope.billInfo    //账单附带信息，透传
                });
            } else {
                $scope.$parent.block = 'rechargeResult';

                eventHandler.dispatch('rechargeResultData', {
                    'thirdPayAccountId': $scope.thirdPayAccountId,
                    'accountInfo': $scope.accountInfo,
                    'isSuccess': false,
                    'rechargeData': config.urlParams,
                    'reChargeResult': res.data,
                    'from': $scope.from,    //from值为支付页面，或者资金账户详情页面。
                    'billInfo': $scope.billInfo    //账单附带信息，透传
                });
            }
        });
    };

    /**
     * 返回
     */
    $scope.goBack = function () {
        $scope.$parent.block = $scope.from;
    };
}]);