/**
 * 银行账户管理
 */
app.controller("bankManagerCtr", ["$scope", "fundsAccountService", "eventServiceFactory", function ($scope, fundsAccountService, eventServiceFactory) {

    /**
     * 监听到事件之后执行init模块。
     * @param data
     */
    $scope.init = function (data) {
        //初始化页面值
        $scope.initData(data);

        //所有银行卡List
        $scope.getBankCardList();
    };
    var eventHandler = eventServiceFactory.createEventService();
    eventHandler.on('bankManagerData', $scope.init);

    /**
     * 初始化数据
     * @param data
     */
    $scope.initData = function (data) {
        //缓存主键值，默认页面共有。不再进行函数参数传递。
        $scope.thirdPayAccountId = data.thirdPayAccountId;

        $scope.list = [];
    };

    /**
     * 所有银行卡List
     */
    $scope.getBankCardList = function () {
        var config = {
            'seatParams': {
                'thirdPayAccountId': $scope.thirdPayAccountId
            }
        };
        fundsAccountService.getBankCardList(config, function (res) {
            if (res.errorCode === 0) {
                $scope.list = res.data || [];
            }
        });
    };

    /**
     * 解绑银行卡
     */
    $scope.unbundled = function (item) {
        var opt = {
            title: '确定解绑下列银行账户？',
            type: 'success',
            content: {
                tip: '<p>账户号：' + item.cardNo + '</p><p>开户行：' + item.subbranch + '</p>'
            },
            operation: [
                {
                    type: 'submit',
                    description: '确定',
                    operationEvent: function () {
                        var config = {
                            'seatParams': {
                                'bankCardId': item.id || ''
                            }
                        };
                        fundsAccountService.unbundledBankCard(config, function (res) {
                            //展示第三方消息
                            res.thirdMsg = (res.data && res.data.rspMsg) ? res.data.rspMsg : res.msg;

                            if (res.errorCode === 0) {
                                $(document).promptBox('closePrompt');
                                $(document).promptBox({isDelay: true, contentDelay: res.thirdMsg, type: 'success'});
                                //解绑成功后刷新列表
                                $scope.getBankCardList();
                                $scope.$apply();
                            } else {
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: res.thirdMsg,
                                    type: 'errer',
                                    manualClose: true
                                });
                            }
                        });
                    }
                }
            ]
        };
        $(document).promptBox(opt);
    };

    /**
     * 点击添加银行卡
     */
    $scope.addBankCard = function () {
        //清除angular表单脏值检测
        $scope.addBankCardFrom.$setPristine();
        $scope.addBankCardFrom.$setUntouched();

        //重置数据
        $scope.cardNo = '';
        $scope.bank = '';
        $scope.subbranch = '';
        $scope.mobile = '';
        $scope.verCode = '';
        $scope.getVerCodeBtnText = '获取验证码';
        $scope.lockVerCodeBtn = false;
        $scope.timerHandler && clearInterval($scope.timerHandler);

        $scope.showAddCard = true;
    };

    /**
     * 确定添加银行卡
     */
    $scope.saveBankCard = function () {
        if (!$scope.cardNo) {
            $scope.addBankCardFrom.cardNo.$setDirty();
        }
        if (!$scope.bank) {
            $scope.addBankCardFrom.bank.$setDirty();
        }
        if (!$scope.subbranch) {
            $scope.addBankCardFrom.subbranch.$setDirty();
        }
        if (!$scope.mobile) {
            $scope.addBankCardFrom.mobile.$setDirty();
        }
        if (!$scope.verCode) {
            $scope.addBankCardFrom.verCode.$setDirty();
        }
        if (!$scope.addBankCardFrom.$valid ||
            $("#remote-verCode-error").hasClass('remote-invalid') ||
            $("#remote-cardNo-error").hasClass('remote-invalid')
        ) {
            return;
        }

        var config = {
            'urlParams': {
                'cardNo': $scope.cardNo,    //银行账户号
                'bank': $scope.bank,    //所属银行名称
                'bankClsCode': $scope.bankCode,    //所属银行Code
                'subbranch': $scope.subbranch,    //开户行名称
                'bankNo': $scope.subbranchValue,    //开户行Code
                'mobile': $scope.mobile,    //手机号
                'validateCode': $scope.verCode,    //验证码
                'thirdPayAccountId': $scope.thirdPayAccountId    //第三方支付账户ID
            }
        };
        fundsAccountService.saveBankCard(config, function (res) {
            //展示第三方消息
            res.thirdMsg = (res.data && res.data.rspMsg) ? res.data.rspMsg : res.msg;

            if (res.errorCode === 0) {
                $scope.showAddCard = false;
                $scope.getBankCardList();
                $(document).promptBox({isDelay: true, contentDelay: res.thirdMsg, type: 'success'});
            } else {
                $(document).promptBox({isDelay: true, contentDelay: res.thirdMsg, type: 'errer', manualClose: true});
            }
        });
    };

    /**
     * 获取动态验证码
     */
    $scope.sendSms = function () {
        if (!$scope.mobile || $scope.lockVerCodeBtn) {
            return;
        }

        var config = {
            'urlParams': {
                'mobilePhone': $scope.mobile
            }
        };
        fundsAccountService.sendSms(config, function (res) {
            if (res.errorCode === 0) {
                //发送请求成功后锁定btn
                $scope.lockVerCodeBtn = true;

                //执行定时任务
                $scope.count = 60;
                $scope.getVerCodeBtnText = $scope.count + 's';
                $scope.timerHandler = setInterval(function () {
                    --$scope.count;
                    if ($scope.count) {
                        $scope.getVerCodeBtnText = $scope.count + 's';
                    } else {
                        $scope.lockVerCodeBtn = false;
                        $scope.getVerCodeBtnText = '获取验证码';
                        $scope.timerHandler && clearInterval($scope.timerHandler);
                    }
                    $scope.$apply();
                }, 1000);
            } else {
                $(document).promptBox({isDelay: true, contentDelay: res.data, type: 'errer', manualClose: true});
            }
        });
    };

    /**
     * 异步校验验证码
     */
    $scope.ansycVerCode = function () {
        if (!$scope.verCode || !$scope.mobile) {
            return;
        }
        var config = {
            'urlParams': {
                'phoneNo': $scope.mobile,
                'validateCode': $scope.verCode
            }
        };
        fundsAccountService.ansycVerCode(config, function (res) {
            if (res.errorCode === 0) {
                $scope.addBankCardFrom.verCode.errorTips = '';
                $("#remote-verCode-error").addClass("ng-hide").removeClass('remote-invalid');
            } else {    //校验失败
                $scope.addBankCardFrom.verCode.errorTips = res.msg;
                $("#remote-verCode-error").removeClass("ng-hide").addClass('remote-invalid');
            }
        });
    };

    /**
     * 异步校验银行卡号
     */
    $scope.ansycCardNo = function () {
        if (!$scope.cardNo) {
            return;
        }
        var config = {
            'urlParams': {
                "cardNo": $scope.cardNo
            }
        };
        fundsAccountService.ansycCardNo(config, function (res) {
            if (res.errorCode === 0) {
                $scope.addBankCardFrom.cardNo.errorTips = '';
                $("#remote-cardNo-error").addClass("ng-hide").removeClass('remote-invalid');
            } else {
                $scope.addBankCardFrom.cardNo.errorTips = res.msg;
                $("#remote-cardNo-error").removeClass("ng-hide").addClass('remote-invalid');
            }
        });
    };

    /**
     * 获取银行下拉列表
     */
    $scope.getBankList = function () {
        if (!$scope.bankData) {
            fundsAccountService.getBankList(function (res) {
                $scope.bankData = res;
            });
        }

        if ($scope.bankData) {
            selectFactory({
                data: {
                    data: $scope.bankData
                },
                defaultText: '请选择',
                id: 'select-bank',
                defaultCount: 10000,
                showTextField: 'name',
                attrTextModel: function (name, data, item) {
                    $scope.bank = name;
                    $scope.bankCode = item.code || '';

                    //支行数据清空
                    $scope.subbranch = $scope.subbranchValue = '';
                    subbranchElm && subbranchElm.clearData();
                    Select.sharePool['select-subbranch'] = null;

                    $scope.$apply();
                }
            }).open();
        }
    };

    /**
     * 获取支行List
     */
    var subbranchElm;
    $scope.getSubbranchList = function () {
        if (subbranchElm) {
            return;
        }
        subbranchElm = selectFactory({
            data: [],
            isSearch: true,
            defaultText: '请选择',
            id: 'select-subbranch',
            showTextField: 'bankName',
            closeLocalSearch: true,
            pagination: true,
            searchPlaceHoder: Lang.getValByKey('common', 'common_select_search_tips'),
            onSearchValueChange: function (attachEvent, data, currentPage) {
                if (!$scope.bankCode) {
                    return;
                }
                var config = {
                    'urlParams': {
                        'q': data || '',
                        'pageIndex': currentPage || 1,
                        'pageSize': 10,
                        'bankClsCode': $scope.bankCode
                    }
                };
                fundsAccountService.getSubbranchList(config, function (res) {
                    if (res.errorCode === 0) {
                        attachEvent.setData(res);
                    }
                });
            },
            attrTextModel: function (bankName, data, item) {
                $scope.subbranch = item.bankName || '';
                $scope.subbranchValue = item.bankNo || '';

                $scope.$apply();
            }
        });
        subbranchElm.open();
    };

    /**
     * 验证账户
     * @param item
     */
    $scope.verifyAccount = function (item) {
        $scope.tranAmount = '';
        //清除angular表单脏值检测
        $scope.verifyAccountForm.$setPristine();
        $scope.verifyAccountForm.$setUntouched();

        $scope.currentVerifyAccount = item;    //缓存当前需要验证账户的信息
        $scope.showVerifyAccount = true;
    };

    /**
     * 确定验证账户
     */
    $scope.confirmVerifyAccount = function () {
        if (!$scope.tranAmount) {
            $scope.verifyAccountForm.tranAmount.$setDirty();
        }
        if (!$scope.verifyAccountForm.$valid) {
            return;
        }

        var config = {
            'urlParams': {
                'cardNo': $scope.currentVerifyAccount.cardNo,
                "thirdPayAccountId": $scope.thirdPayAccountId,
                "amount": $scope.tranAmount
            }
        };
        fundsAccountService.confirmVerifyAccount(config, function (res) {
            //展示第三方消息
            res.thirdMsg = (res.data && res.data.rspMsg) ? res.data.rspMsg : res.msg;

            if (res.errorCode === 0) {
                $scope.showVerifyAccount = false;
                //验证成功后刷新列表
                $scope.getBankCardList();
                $(document).promptBox({isDelay: true, contentDelay: res.thirdMsg, type: 'success'});
            } else {
                $(document).promptBox({isDelay: true, contentDelay: res.thirdMsg, type: 'errer', manualClose: true});
            }
        });
    };

    $scope.goBack = function () {
        $scope.$parent.block = 'accountDetail';

        //事件委派。
        eventHandler.dispatch('accountDetailData', {
            'thirdPayAccountId': $scope.thirdPayAccountId
        });
    };
}]);