/**
 * 资金账户详情
 */
app.controller("accountDetailCtr", ["$scope", "fundsAccountService", "fundsAccountView", "tableService", "eventServiceFactory", function ($scope, fundsAccountService, fundsAccountView, tableService, eventServiceFactory) {
    //初始化时间控件
    fundsAccountView.initCalander();

    /**
     * 初始化值
     */
    $scope.initData = function (data) {
        //缓存主键值，默认页面共有。不再进行函数参数传递。
        $scope.thirdPayAccountId = data.thirdPayAccountId;

        //账户信息
        $scope.accountInfo = {
            'custName': data.custName,
            'currencyCode': data.currencyCode
        };
        $scope.accountBank = {};

        //数字签名
        $scope.signatureData = {};

        $scope.advanced = false;
        $scope.advancedText = '高级筛选';

        $scope.tableModel = {
            'tableHeader': [
                '交易单号',
                '交易时间',
                '对方账户持有人',
                '账单号',
                '交易金额' + '(' + data.currencyCode + ')',
                '交易类型'
            ],
            'tableBody': [],
            'restURL': 'logistics.getAccountRecord',
            'restData': {
                'q': '',
                'beginDate': '',
                'endDate': '',
                'tranType': '',
                'pageIndex': 1,
                'pageSize': 10
            },
            'selectNumber': 0,
            'selectFlag': false
        };
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
                $scope.accountInfoTotalAmount = fundsAccountService.dealNumber(res.data.totalAmount);
                $scope.accountInfoTotalBalance = fundsAccountService.dealNumber(res.data.totalBalance);
                $scope.accountInfo = $.extend({}, $scope.accountInfo, res.data) || {};
            }
        });
    };

    $scope.getCustomerId = function () {
        fundsAccountService.getCustomerId(function (res) {
            if (res.errorCode === 0) {
                $scope.hrefPay = res.data.dsptUrl;
                $scope.hrefBasic = res.data.qywyUrl
            } else {
                setTimeout(function () {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: res.msg,
                        type: 'errer',
                        manualClose: true
                    });
                }, 0)
            }
        });
    };

    /**
     * 银行账户信息-最新添加
     */
    $scope.getAccountBank = function () {
        var config = {
            'seatParams': {
                'thirdPayAccountId': $scope.thirdPayAccountId
            }
        };
        fundsAccountService.getAccountBank(config, function (res) {
            if (res.errorCode === 0) {
                $scope.accountBank = res.data || {};
            }
        });
    };

    /**
     * 交易记录
     */
    $scope.getAccountRecord = function () {
        var config = {
            'urlParams': $scope.tableModel.restData,
            'seatParams': {
                'custAcctId': $scope.accountInfo.custAcctId
            }
        };
        tableService.getTable($scope.tableModel.restURL, config, function (data) {
            if (data.errorCode === 0) {
                $scope.tableModel = tableService.table($scope.tableModel, config, data);
            }
        });
    };


    /** ========================================  交易记录  ==================================== **/

    /**
     * 普通、高级筛选
     */
    $scope.filters = function () {
        $scope.tableModel.restData.beginDate = getBeforeDate(6);
        $scope.tableModel.restData.endDate = new Date().format("yyyy-MM-dd");

        if ($scope.advanced) {    //当前为高级筛选，切换至普通筛选。隐藏高级筛选项
            $scope.advancedText = '高级筛选';
            //清除数据
            $scope.statusName = $scope.statusValue = '';

            $scope.searchRecord();
        } else {
            $scope.advancedText = '普通筛选';
        }
        $scope.advanced = !$scope.advanced;
    };

    /**
     * 搜索
     */
    $scope.searchRecord = function () {
        $scope.q = $scope.tableModel.restData.q;
        $scope.tableModel.restData.tranType = $scope.statusValue || '';

        $scope.getAccountRecord();
    };

    /**
     * 交易类型下拉框
     */
    $scope.getStatus = function () {
        selectFactory({
            data: {
                data: [
                    {'id': '0', 'name': '充值'},
                    {'id': '1', 'name': '提现'},
                    {'id': '2', 'name': '付款'},
                    {'id': '3', 'name': '收款'}
                ]
            },
            defaultText: '全部',
            id: "select-status",
            showTextField: "name",
            attrTextModel: function (name, data, item) {
                $scope.statusValue = item.id || '';
                $scope.statusName = item.name || '';
                $scope.$apply();
            }
        }).open();
    };

    /** ========================================  交易记录End  ==================================== **/


    /** ========================================  页面跳转-事件数据传递  ==================================== **/

    /**
     * 银行账户管理
     */
    $scope.bankManager = function (block) {
        //事件委派。
        eventHandler.dispatch('bankManagerData', {'thirdPayAccountId': $scope.thirdPayAccountId});

        $scope.$parent.block = block;
    };

    /**
     * 交易详情
     * @param billNo
     */
    $scope.getRecordDetail = function (item) {
        $scope.$parent.block = 'businessRecord';

        //事件委派。
        eventHandler.dispatch('businessRecordData', {
            'thirdPayAccountId': $scope.thirdPayAccountId,
            'item': item,
            'accountId': $scope.accountInfo.accountId,
            'currency': $scope.accountInfo.currency,
            'currencyCode': $scope.accountInfo.currencyCode
        });
    };

    /**
     * 账单详情
     * @param item
     */
    $scope.getBillDetail = function (item) {
        if (item.tranTypeCode == 2) {    //付款-应付
            var submodule = 'pay';
        } else if (item.tranTypeCode == 3) {    //收款-应收
            var submodule = 'receive';
        } else {
            return;
        }
        window.location.href = '#/billDetail?billNo=' + item.billNo + '&from=fundsAccount' + '&module=trade' + '&submodule=' + submodule + '&thirdPayAccountId=' + $scope.thirdPayAccountId + '&custName=' + $scope.accountInfo.custName + '&currency=' + $scope.accountInfo.currencyCode + '&customerId='+item.outCustomerId;
    };

    /**
     * 提现
     */
    $scope.withdraw = function (block) {
        //事件委派。
        eventHandler.dispatch('withdrawApplyData', {
            'thirdPayAccountId': $scope.thirdPayAccountId,
            'accountBank': $scope.accountBank,
            'accountInfo': $scope.accountInfo    //账户信息
        });

        $scope.$parent.block = block;
    };

    /**
     * 充值
     * @param block
     */
    $scope.reCharge = function (block) {
        fundsAccountService.getRechargeInfo(function (res) {
            if (res.errorCode === 0) {
                $scope.showRecharge = true;
                $scope.bankCode = res.data.account;
                $scope.bankName = res.data.name;
                $scope.$apply();
            } else {
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
     * 返回
     */
    $scope.goBack = function () {
        $scope.$parent.block = 'accountManager';

        //事件委派。
        eventHandler.dispatch('accountManagerData', {});
    };

    /** ========================================  页面跳转-事件数据传递End  ==================================== **/


    /**
     * 交易密码
     * @param type
     */
    $scope.transPassword = function (type) {
        var signatureData = $scope.getTransPassSignature();
        signatureData.type = type;    //重置type类型为对应的type值。

        var preventFlag = false;

        var arr = [
            {'key': 'name', 'require': true},
            {'key': 'orderid', 'require': true},
            {'key': 'type', 'require': true},
            {'key': 'p2PCode', 'require': true},
            {'key': 'p2PType', 'require': true},
            {'key': 'thirdCustId', 'require': true},
            {'key': 'custAccId', 'require': true},
            {'key': 'mobile', 'require': true},
            {'key': 'orig', 'require': false},
            {'key': 'returnurl', 'require': false},
            {'key': 'notifyUrl', 'require': true},
            {'key': 'channelType', 'require': false},
            {'key': 'idType', 'require': true},
            {'key': 'idNo', 'require': true},
            {'key': 'accNo', 'require': true},
            {'key': 'accName', 'require': true}
        ];

        for (var i = 0, l = arr.length; i < l; i++) {
            $('#' + arr[i].key + '-pass').val(signatureData[arr[i].key]);    //隐藏表单域赋值。如：$('#type').val(signatureData.type);
            if (arr[i].require && !$.trim(signatureData[arr[i].key])) {    //必填字段为空
                preventFlag = true;
            }
        }

        $('#returnurl-pass').val('https://www.baidu.com/');

        if (!preventFlag) {    //跳转到第三方
            $('#passwordForm').submit();
        }
    };

    /**
     * 获取设置、修改、重置密码的数字签名
     */
    $scope.getTransPassSignature = function () {
        var config = {
            'seatParams': {
                'thirdCustId': $scope.thirdPayAccountId
            }
        };

        fundsAccountService.getTransPassSignature(config, function (res) {
            $scope.signatureData = res.data || {};
        });

        return $scope.signatureData;
    };

    /**
     * 监听到事件之后执行init模块。
     * @param data
     */
    $scope.init = function (data) {
        //初始化页面值
        $scope.initData(data);
        $scope.showRecharge = false;
        //调用方法
        $scope.getAccountInfo();    //账户信息
        $scope.getAccountBank();    //银行账户信息
        $scope.getAccountRecord();    //交易记录
        $scope.getCustomerId();
    };
    var eventHandler = eventServiceFactory.createEventService();
    eventHandler.on('accountDetailData', $scope.init);
}]);
