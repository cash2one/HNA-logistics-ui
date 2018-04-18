var userInfoCtrl
easySpa.require(['widget/starRating'], function() {
     userInfoCtrl = {
        $scope: null,
        service: null,
        userInfo: null,
        getAccountData: function (q,currentPage) {
            q = q ? q : '';
            var config = {
                'q': q ? q.trim() : "",
                'pageIndex': currentPage ? currentPage : 1,
                'pageSize': 10
            };
            var type = this.service.getAccount(config);
            return type;
        },
        getCurrencyList:function(q,currentPage) {
            q = q ? q : '';
            var config = {
                'q': q ? q.trim() : "",
                'pageIndex': currentPage ? currentPage : 1,
                'pageSize': 10
            };
            var currencyList = this.service.getCurrencyList(config);
            return currencyList;

        },
        rebuildData: function (currencyList) {
            var data = currencyList.data;
            for (var index = 0; index < data.length; index++) {
                data[index].fullname = data[index].name + ' (' + data[index].code + ')';
            }
            return currencyList;
        },
        initSelect: function () {
            var self = this;
            $scope = this.$scope;

            selectFactory({
                isSearch: true,
                data: [],
                id: 'account-type',
                closeLocalSearch: true,
                pagination: true,
                offset: -300,
                defaultText:'请选择',
                showTextField:'fullname',
                searchPlaceHoder:"请输入名称或编码",
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    var type =  self.getAccountData(data, currentPage);
                    type = self.rebuildData(type);
                    attachEvent.setData(type)
                    $scope.$apply();
                },
                attrTextModel: function (name, data, currentData) {
                    if(name) {
                        $scope.refSettlementName = name;
                        $scope.refSettlementNameCode = currentData.code;
                        $scope.refSettlementId = currentData.id;
                    }else{
                        $scope.refSettlementName = '';
                        $scope.refSettlementNameCode = '';
                        $scope.refSettlementId = '';
                    }

                    $scope.$apply();
                },
            });

            selectFactory({
                data: [],
                id: 'trading-currency',
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                isSearch: true,
                searchPlaceHoder:"请输入货币名称或三字码",
                closeLocalSearch: true,
                pagination: true,
                offset: -300,
                showTextField:'fullname',
                defaultText:'请选择',
                onSearchValueChange: function(attachEvent, data, currentPage) {
                    var currency =  self.getCurrencyList(data, currentPage)
                    if (currency.data && currency.data.length) {
                        currency = self.rebuildData(currency);
                        attachEvent.setData(currency);
                    } else {
                        attachEvent.setData({ data: [] });
                    }
                    $scope.$apply();
                },
                attrTextModel: function (name, data, currentData) {
                    if (currentData.code) {
                        $scope.tradingCurrency = name;
                        $scope.tradingCurrencyId = currentData.code;
                    } else {
                        $scope.tradingCurrency = '';
                        $scope.tradingCurrencyId = '';
                    }
                    $scope.$apply();
                },
            });
            // 价格套餐
            var combosData = this.service.getCombos();

            var map = [];
            angular.forEach(combosData.data, function (value) {
                map.push({
                    code: value.code,
                    preName:value.name,
                    name: value.name + '(' + value.code + ')',
                });
            });
            combosData.data = map;
            selectFactory({
                data: combosData,
                id: 'price-combos',
                isSearch: true,
                defaultCount:100,
                defaultText: '请选择',
                offset: -300,
                attrTextModel: function (name, data, currentData) {

                    $scope.refCombos = currentData.preName;
                    $scope.refCombosId = currentData.code;
                    if (!name) {
                        $scope.refCombosId = 0;
                    }
                    $scope.$apply();
                },
            });

        },
        bindEvent: function () {
            var self = this;
            var $scope = this.$scope;
            // $scope.clearBusinessData = function () {
            //     if (!$('#business-type').val()) {
            //         $scope.businessTypeInfo = '';
            //     }
            // };
            $scope.cancelCustomer = function () {
                if (self.userInfo) {
                    self.showUserInfo();
                } else {
                    self.resetData();
                }

                $scope.setSingleCustomerAuditBtn()
                // $('#stars').rating('update', parseInt($scope.rankInfo));
                // self.changeRateStat(true);
            };
            $scope.saveCustomer = function () {

                var userType = $scope.cusUserTypeLogs && $scope.cusUserTypeTrd ? 3 : $scope.cusUserTypeTrd ? 2 : $scope.cusUserTypeLogs ? 1 : '';

                if($scope.cusUserTypeSupplier){
                    userType = 256;
                }
                if (!$scope.userNameInfo) {
                    $scope.customerForm.userNameInfo.$setDirty();
                }
                if (!$scope.codeInfo) {
                    $scope.customerForm.codeInfo.$setDirty();
                }
                if (!userType) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: '至少保留一个业务类型',
                        type: 'errer',
                        manualClose: true,
                    });
                    return;
                }
                if (!$scope.email) {
                    $scope.customerForm.email.$setDirty();
                }
                if (!$scope.refSettlementName) {
                    $scope.customerForm.refSettlementName.$setDirty();
                }
                if (!$scope.tradingCurrency) {
                    $scope.customerForm.tradingCurrency.$setDirty();
                }
                if (!$scope.customerForm.$valid || $scope.validateRankError == true) {
                    scrollToErrorView($(".tab-content"));
                    return;
                }
                var errorEles = $('.errors');
                for (var index = 0; index < errorEles.length; index++) {
                    if (!$(errorEles[index]).hasClass('ng-hide')) {
                        scrollToErrorView($(".tab-content"));
                        return;
                    }
                }
                if ($scope.isAdd) {
                    // 新增用户
                    self.service.addCustomer(
                        {
                            userName: $scope.userNameInfo,
                            code: $scope.codeInfo,
                            refSettlementId: $scope.refSettlementId,
                            tradingCurrency: $scope.tradingCurrencyId,
                            refCombos: $scope.refCombosId,
                            description: $scope.descriptionInfo,
                            email: $scope.email,
                            evaluateLeval: $scope.rankInfo,
                            userType: userType,
                            shipBooking:$scope.shipBooking,
                        },
                        function (data) {
                            if (data.errorCode != 0) {
                                // 服务器异常
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: data.msg,
                                    type: 'errer',
                                    manualClose: true,
                                });
                            } else {
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: data.msg,
                                    type: 'success',
                                    time: 3000,
                                });
                                $scope.setCustomerId(data.data.id);
                                $scope.creator = data.data.creator;
                                $scope.createDate = data.data.createTime;
                                self.userInfo = {};
                                self.userInfo.id = data.data.id;
                                $scope.tab.enableAll();
                                $scope.disableUserInfo();
                                self.changeRateStat(true);
                            }
                        }
                    );
                } else {
                    // 编辑用户
                    self.service.updateCustomer(
                        {
                            userName: $scope.userNameInfo,
                            code: $scope.codeInfo,
                            refSettlementId: $scope.refSettlementId,
                            tradingCurrency: $scope.tradingCurrencyId,
                            refCombos: $scope.refCombosId,
                            description: $scope.descriptionInfo,
                            email: $scope.email,
                            id: $scope.customerId,
                            evaluateLeval: $scope.rankInfo,
                            userType: userType,
                            shipBooking:$scope.shipBooking,
                        },
                        function (data) {
                            if (data.errorCode != 0) {
                                // 服务器异常
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: data.msg,
                                    type: 'errer',
                                    manualClose: true,
                                });
                            } else {
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: data.msg,
                                    type: 'success',
                                    time: 3000,
                                });
                                if ($scope.userType === userType || userType === 3) {
                                    $scope.disableUserInfo();
                                    self.changeRateStat(true);
                                } else {
                                    location.reload();
                                }
                            }
                        }
                    );
                }

                $scope.setSingleCustomerAuditBtn()
            };
            $scope.editUser = function () {
                $scope.isEdit = false;
                $scope.isCanEdit = false;
                $scope.isAdd = false;
                $('#email .errors').html('');
                $('#stars').rating('update', parseInt($scope.rankInfo));
                self.changeRateStat(false);

                $("#singleCustomerAudit").attr("disabled", "true");
                $("#singleCustomerAudit").addClass("disabled");
                //编辑的时候，不允许提交
            };
            $scope.disableUserInfo = function () {
                $scope.isEdit = true;
                $scope.isCanEdit = true;
                $scope.isAdd = true;
            };
            $scope.checkCode = function () {
                self.service.checkCustomerCode(
                    {
                        code: $scope.codeInfo,
                    },
                    function (data) {
                        if (data.data) {
                            $('#code-error-box .errors').removeClass('ng-hide');
                            $('#code-error-box .errors').html(Lang.getValByKey('customer', 'customer_code_exsist_tips'));
                            $(".check-codes").css("borderColor","#FA787E")
                        } else {
                            $('#code-error-box .errors').addClass('ng-hide');
                            $('#code-error-box .errors').html('');
                            $(".check-codes").removeAttr("style");
                        }
                    }
                );
            };

            $scope.clearEmailErrorMsg = function () {
                $("#email .errors").addClass("ng-hide");
                $("#email .errors").html("");
            }
            $scope.checkEmail = function() {
                if(!$scope.isEdit && $scope.oldEmail == $scope.email) {
                    return;
                }
                self.service.checkUserInfoEmail({ email: $scope.email }, function (data) {
                    if (data.data) {
                        $('#email .errors').removeClass('ng-hide');
                        $('#email .errors').html(Lang.getValByKey('customer', 'customer_email_exsist'));
                        $(".check-emails").css("borderColor","#FA787E")
                    } else {
                        $('#email .errors').addClass('ng-hide');
                        $('#email .errors').html('');
                        $(".check-emails").removeAttr("style");
                    }
                });
            };
        },
        resetData: function () {
            var $scope = this.$scope;
            $scope.userNameInfo = '';
            $scope.codeInfo = '';
            $scope.businessTypeInfo = '';
            $scope.businessCodeInfo = '';
            $scope.refSettlementName = Lang.getValByKey('customer', 'customer_refSettlementName') + '(SYS-MONTH)';
            $scope.refSettlementNameCode = "SYS-MONTH";
            $scope.refSettlementId = 1;
            $scope.tradingCurrencyId = 'CNY';
            $scope.tradingCurrency = Lang.getValByKey('customer', 'customer_tradingCurrency') + '(CNY)';
            $scope.refCombos = '';
            $scope.refCombosId = '';
            $scope.descriptionInfo = '';
            $scope.oldEmail = '';
            $scope.email = '';
            $scope.cusUserTypeTrd = false;
            $scope.cusUserTypeLogs = false;
            $scope.cusUserTypeSupplier = false;
            $scope.typeAll = false;
            // $('.ng-dirty').removeClass('ng-dirty');
            if ($scope.paramter.module == 'trade') {
                $scope.cusUserTypeTrd = true;
                $scope.cusUserTypeName = '贸易';
            } else {
                $scope.cusUserTypeLogs = true;
                $scope.cusUserTypeName = '物流';
            }
            $scope.customerForm.$setPristine();
            $scope.customerForm.$setUntouched();

            $('.tip-box').remove();
            $('.errors').addClass('ng-hide');
        },
        showUserInfo: function () {
            var $scope = this.$scope;
            var self = this;
            $scope.tab.enableAll();
            this.service.getCustomerInfo(
                {
                    id: this.userInfo.id,
                },
                function (data) {
                    var data = data.data;
                    $scope.creator = data.creator;
                    $scope.createDate = data.createTime;
                    $scope.userNameInfo = data.userName;
                    $scope.codeInfo = data.code;
                    $scope.cusUserTypeLogs = data.userType === 1;
                    $scope.cusUserTypeTrd = data.userType === 2;
                    if (data.userType === 1) {
                        $scope.cusUserTypeLogs = true;
                        $scope.cusUserTypeName = '物流';
                    }
                    if (data.userType === 2) {
                        $scope.cusUserTypeTrd = true;
                        $scope.cusUserTypeName = '贸易';
                    }
                    if (data.userType === 3) {
                        $scope.cusUserTypeLogs = true;
                        $scope.cusUserTypeTrd = true;
                        $scope.typeAll = true;
                        $scope.cusUserTypeName = '物流/贸易';
                    }
                    if(data.userType == 256){
                        $scope.cusUserTypeTrd = true;
                        $scope.cusUserTypeName = '贸易';
                        $scope.cusUserTypeSupplier = true;
                    }
                    $scope.email = data.email;
                    $scope.oldEmail = data.email;

                    $scope.refSettlementName = data.settlementCode ? data.settlementName +'('+ data.settlementCode +')' : '';
                    $scope.refSettlementNameCode = data.settlementCode;
                    $scope.refSettlementId = data.refSettlementId;
                    $scope.refCombos = data.combosName;
                    $scope.refCombosId = data.refCombos;
                    $scope.descriptionInfo = data.description;
                    $scope.tradingCurrencyId = data.tradingCurrency;
                    $scope.tradingCurrency = data.tradingCurrency ? data.currencyName + '('+data.tradingCurrency+')' : '';
                    $scope.rankInfo = data.evaluateLeval;
                    setTimeout(function () {
                        $scope.isEdit = true;
                        $scope.isCanEdit = true;
                        $scope.isAdd = true;
                        $scope.$apply();
                        $('#userInfo').css({ display: 'block' });
                    }, 10);
                    $('#stars').rating('update', parseInt($scope.rankInfo));
                    $scope.shipBooking = data.shipBooking;

                    $scope.auidtMessage = data.auidtMessage;
                    $scope.authStatus = data.authStatus
                    if($scope.auidtMessage){ //只要有就显示
                        $(".from-box").css("top","234px");
                    }else{
                        $(".from-box").css("top","116px");
                    }

                    $scope.isShowAudit = (data.authStatus == 2) && (window.location.href.indexOf("customerApproval") > -1)
                    self.changeRateStat(true);
                }
            );
        },
        initStar: function () {

            /** 初始加载星级评价 */
            $('#stars').rating('update', 0);
            $('#stars').rating('refresh', {
                min: 0,
                max: 5,
                step: 1,
                size: 'xs',
                animate: true,
                displayOnly: false,
                showClear: false,
                showCaption: false,
            });

            /** 获取星级评价 */
        },
        changeRateStat: function (state) {
            var $scope = this.$scope;
            $('#stars').rating('refresh', {
                min: 0,
                max: 5,
                step: 1,
                size: 'xs',
                animate: true,
                displayOnly: state,
                showClear: false,
                showCaption: false,
            });

            /** 获取星级评价 */
            $('#stars').on('rating.change', function (event, value, caption) {
                $scope.rankInfo = $(event.target).val();
                if (!$scope.rankInfo) {
                    $scope.validateRankError = true;
                } else {
                    $scope.validateRankError = false;
                }
                $scope.$apply();
            });
        },
        clearError: function () {
            var errorEles = $('.errors');
            for (var index = 0; index < errorEles.length; index++) {
                $(errorEles[index]).addClass('ng-hide');
            }
        },
        init: function ($scope, service, userInfo) {
            this.userInfo = userInfo;
            this.$scope = $scope;
            this.service = service;
            this.$scope.resetStyle(3);
            this.resetData();
            this.initSelect();
            this.bindEvent();
            this.initStar();
            this.clearError();
            if (this.userInfo) {
                this.showUserInfo();
            } else {
                $scope.isCanEdit = true;
                $scope.rankInfo = 1;
                $('#stars').rating('update', 1);
                this.changeRateStat(false);
            }

            $scope.getCombosData = function () {
                var combosData = service.getCombos();

                var map = [];
                angular.forEach(combosData.data, function (value) {
                    map.push({
                        code: value.code,
                        preName:value.name,
                        name: value.name + '(' + value.code + ')',
                    });
                });
                combosData.data = map;
                selectFactory({
                    data: combosData,
                    id: 'price-combos',
                    isSearch: true,
                    defaultCount:100,
                    defaultText: '请选择',
                    offset: -300,
                    isCreateNewSelect:true,
                    attrTextModel: function (name, data, currentData) {

                        $scope.refCombos = currentData.preName;
                        $scope.refCombosId = currentData.code;
                        if (!name) {
                            $scope.refCombosId = 0;
                        }
                        $scope.$apply();
                    },
                });

            }
        },
    };
});