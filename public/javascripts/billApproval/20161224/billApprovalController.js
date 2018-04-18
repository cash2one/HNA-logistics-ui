easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'public/common/tableController.js',
    'widget/select',
    'widget/parseUrl',
    'public/common/calander.js',
    'public/common/eventService.js',
    'public/javascripts/fundsAccount/20161224/fundsAccountService.js',
    'public/javascripts/fragment/fundsAccount/payment.js',
    'public/javascripts/fragment/fundsAccount/paymentResult.js',
    'public/javascripts/fragment/fundsAccount/recharge.js',
    'public/javascripts/fragment/fundsAccount/rechargeResult.js'
], function () {
    app.controller('billApprovalCtrl', ['$scope', 'billApprovalService', 'billApprovalView', 'tableService', 'eventServiceFactory', function ($scope, billApprovalService, billApprovalView, tableService, eventServiceFactory) {
        //初始化事件容器
        var eventHandler = eventServiceFactory.createEventService();

        //日期控件
        Calander.init({
            ele: ["#begin-time", "#end-time"]
        });

        var getLastMonth = billApprovalView.getLastMonth();
        $scope.startTime = getLastMonth.start;
        $scope.endTime = getLastMonth.end;

        $scope.paramter = window.parseUrl.getParams();

        $scope.module = $scope.paramter.module ? $scope.paramter.module : 'logistics';
        $scope.submodule = $scope.paramter.submodule;
        //物流和贸易接口区分。
        $scope.interType = $scope.module == 'trade' ? 'trd' : '';
        //贸易的有应收应付。物流的暂时没有。
        // $scope.subInterType = $scope.module == 'trade' ? $scope.submodule : '';
        if ($scope.module == 'trade') {
            $scope.subInterType = $scope.submodule;
        }
        if ($scope.module == 'logistics') {
            $scope.subInterType = $scope.submodule == 'pay' ? '1' : '2';
        }
        $scope.tableModel = {
            'tableBody': [],
            'restURL': 'logistics.getBillingList',
            'restData': {
                'billNo': '',
                'waybillNo': '',
                'orderNo': '',
                'status': 'AUDITING',
                'includeAllAudit': false,
                'platformIds': '',
                'bizCompanyIds': '',
                'customerId': '',
                'settlement': '',
                'startEffectTime': getLastMonth.start,
                'endEffectTime': getLastMonth.end,
                'q': '',
                'pageIndex': 1,
                'pageSize': 10
            },
            'selectNumber': 0,
            'selectFlag': false
        };

        $scope.status = Lang.getValByKey('billApproval', 'pending_review');
        $scope.statusValue = 'AUDITING';

        /**
         * 获取账单列表
         */
        $scope.getBillList = function () {
            var config = {
                'urlParams': $scope.tableModel.restData,
                'seatParams': {
                    'interType': $scope.interType,
                    'subInterType': $scope.subInterType
                }
            };
            tableService.getTable($scope.tableModel.restURL, config, function (data) {
                if (data.errorCode === 0) {
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                }
            });
        };
        $scope.getBillList();
        eventHandler.on('billApprovalData', $scope.getBillList);

        /**
         * 搜索
         */
        $scope.search = function () {
            $scope.tableModel.restData.pageIndex = 1;
            $scope.tableModel.restData.billNo = $scope.billNum;    //账单号
            $scope.tableModel.restData.orderNo = $scope.orderNum;    //运单号
            $scope.tableModel.restData.waybillNo = $scope.orderNum;    //运单号
            $scope.tableModel.restData.status = $scope.statusValue;    //订单编号
            $scope.tableModel.restData.startEffectTime = $scope.startTime;    //账单周期-起始时间
            $scope.tableModel.restData.endEffectTime = $scope.endTime;    //账单周期-截止时间

            if ($scope.module == 'trade') {    //贸易
                $scope.tableModel.restData.platformIds = $scope.platformValue;
                $scope.tableModel.restData.bizCompanyIds = $scope.customerValue;
            } else {
                if ($scope.customerValue) {
                    $scope.customerValue = removeDuplicatedItem($scope.customerValue.split(','));
                    $scope.customerValue = $scope.customerValue.join(',');
                }
                $scope.tableModel.restData.customerId = $scope.customerValue;
                $scope.tableModel.restData.settlement = $scope.payWay;
            }
            $scope.getBillList();
        };

        /**
         * watch tableModel的变化。
         */
        $scope.$watch('tableModel', function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            tableReData();
        }, true);

        function tableReData() {
            $scope.draftDisabled = false;
            $scope.passedDisabled = false;
            $scope.paidDisabled = false;
            $scope.exportDisabled = false;
            angular.forEach($scope.tableModel.tableBody, function (value, key) {
                if (value.checkbox && value.status == 'AUDITING') {    //待审核状态
                    $scope.paidDisabled = true;
                    $scope.exportDisabled = true;
                }
                if (value.checkbox && value.status == 'CHARGEOFF') {    //已出账
                    $scope.draftDisabled = true;
                    $scope.passedDisabled = true;
                }
                if (value.checkbox && value.status == 'PAID') {
                    $scope.draftDisabled = true;
                    $scope.passedDisabled = true;
                    $scope.paidDisabled = true;
                }
            });
        }

        /**
         * 清空查询条件
         */
        $scope.clearCondition = function () {
            $scope.billNum = '';
            $scope.orderNum = '';
            $scope.status = Lang.getValByKey('billApproval', 'pending_review');
            $scope.statusValue = 'AUDITING';
            $scope.tableModel.restData.includeAllAudit = false;
            $scope.customerName = $scope.customerValue = '';
            $scope.platform = $scope.platformValue = '';
            $scope.payWay = '';
            $scope.startTime = getLastMonth.start;
            $scope.endTime = getLastMonth.end;

            $scope.search();
        };

        /**
         * 打回草稿
         */
        $scope.draft = function () {
            //清除angular表单脏值检测
            $scope.submitForm.$setPristine();
            $scope.submitForm.$setUntouched();

            var selData = tableService.getSelectTable($scope.tableModel.tableBody);
            if (!selData.length) {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey("common", 'common_code_noSelected'),
                    type: 'errer',
                    manualClose: true
                });
                return false;
            }
            $scope.popTitle = Lang.getValByKey('billApproval', 'to_draft');
            $scope.popType = 'DRAFT';
            $scope.remark = '';
            $scope.popBox = true;
            $('#pop-box').css('display', 'table');
        };

        /**
         * 审核通过
         */
        $scope.passed = function () {
            //清除angular表单脏值检测
            $scope.submitForm.$setPristine();
            $scope.submitForm.$setUntouched();

            var selData = tableService.getSelectTable($scope.tableModel.tableBody);
            if (!selData.length) {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey("common", 'common_code_noSelected'),
                    type: 'errer',
                    manualClose: true
                });
                return false;
            }

            $scope.popTitle = Lang.getValByKey('billApproval', 'aduit_passed');
            $scope.popType = 'CHARGEOFF';
            $scope.remark = '';
            $scope.popBox = true;
            $('#pop-box').css('display', 'table');
        };

        /**
         * 已付款
         */
        $scope.paid = function () {
            //清除angular表单脏值检测
            $scope.submitForm.$setPristine();
            $scope.submitForm.$setUntouched();

            var selData = tableService.getSelectTable($scope.tableModel.tableBody);
            if (!selData.length) {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey("common", 'common_code_noSelected'),
                    type: 'errer',
                    manualClose: true
                });
                return false;
            }

            var param = [];
            angular.forEach(selData, function (val) {
                param.push(val.billNo);
            });

            var config = {
                'urlParams': param,
                'seatParams': {
                    'type': 2
                }
            };

            billApprovalService.checkPopType(config, function (res) {
                if (res.errorCode === 0) {
                    $scope.popTitle = Lang.getValByKey('billApproval', 'payed');
                    $scope.popType = 'PAID';
                    $scope.remark = '';
                    $scope.popBox = true;
                    $('#pop-box').css('display', 'table');
                } else {
                    $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                }
            });


        };

        /**
         * 导出
         */
        $scope.exportExcel = function () {
            var selData = tableService.getSelectTable($scope.tableModel.tableBody);
            if (!selData.length) {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey("common", 'common_code_noSelected'),
                    type: 'errer',
                    manualClose: true
                });
                return false;
            }

            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'success',
                content: {
                    tip: '确定导出已选账单？'
                },
                operation: [
                    {
                        type: 'submit',
                        description: '确定',
                        application: '',
                        operationEvent: function () {
                            //组织数据
                            var param = [];
                            angular.forEach(selData, function (val) {
                                param.push(val.billNo);
                            });

                            var config = {
                                'urlParams': param,
                                'seatParams': {
                                    'interType': $scope.interType,
                                    'subInterType': $scope.subInterType
                                }
                            };
                            billApprovalService.exportExcel(config, function (res) {
                                if (res.errorCode === 0) {
                                    $(document).promptBox('closePrompt');

                                    //多文件下载
                                    $('.download-file-box').html('');
                                    for (var i = 0, l = res.data.length; i < l; i++) {
                                        $('.download-file-box').append('<a target="download-iframe" href="' + res.data[i].url + '" class="download-file" >点击下载</a>');
                                    }
                                    $('.download-file').each(function (index) {
                                        var _this = $(this);
                                        setTimeout(function () {
                                            _this[0].click();
                                        }, 1000 * index);
                                    });
                                } else {
                                    $(document).promptBox({
                                        isDelay: true,
                                        contentDelay: res.msg,
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
         * 打回草稿、审核通过、已付款、价格调整
         */
        $scope.submit = function () {
            if (!$.trim($scope.remark)) {
                $scope.submitForm.remark.$setDirty();
                return;
            }
            if ($scope.popType == 'ADJUST') {    //价格调整
                if ($scope.adjustVal == undefined || $scope.adjustValError) {
                    return;
                }

                var config = {
                    'urlParams': {
                        'billNo': $scope.billNos,
                        'adjustmentTypeCode': $scope.adjustTypeValue,
                        'adjustmentValue': $scope.adjustVal,
                        'adjustmentUnit': $scope.adjustUnitValue,
                        'adjustmentRemark': $scope.remark
                    },
                    'seatParams': {
                        'interType': $scope.interType,
                        'subInterType': $scope.subInterType
                    }
                };
                billApprovalService.adjust(config, function (res) {
                    if (res.errorCode === 0) {
                        $scope.popBox = false;
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                        //更新table表数据
                        $scope.getBillList();
                    } else {
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                    }
                });
            } else {
                //组织数据
                var selData = tableService.getSelectTable($scope.tableModel.tableBody);
                var param = [];
                angular.forEach(selData, function (val) {
                    param.push(val.billNo);
                });

                var config = {
                    'urlParams': {
                        'billNos': param,
                        'type': $scope.popType,
                        'msg': $scope.remark
                    },
                    'seatParams': {
                        'interType': $scope.interType,
                        'subInterType': $scope.subInterType
                    }
                };
                billApprovalService.audit(config, function (res) {
                    if (res.errorCode === 0) {
                        $scope.popBox = false;
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                        //更新table表数据
                        $scope.getBillList();
                    } else {
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                    }
                });
            }
        };

        /**
         * 价格调整
         */
        $scope.adjust = function (billNo, adjustmentTypeCode, adjustmentValue, adjustmentUnit, adjustmentRemark,adjustTotal,adjustCurrencyType) {
            //清除angular表单脏值检测
            $scope.submitForm.$setPristine();
            $scope.submitForm.$setUntouched();

            $scope.billNos = billNo;    //缓存账单ID
            $scope.popTitle = Lang.getValByKey('billApproval', 'price_change');
            $scope.popType = 'ADJUST';
            $scope.adjustValError = false;
            $scope.adjustInfoShow = false;

            if (adjustmentTypeCode == 'UPPER') {
                $scope.adjustType = Lang.getValByKey('billApproval', 'to_up');
                $scope.adjustTypeValue = 'UPPER';
            } else {
                $scope.adjustType = Lang.getValByKey('billApproval', 'to_down');
                $scope.adjustTypeValue = 'DOWN';
            }

            if(adjustTotal){
                $scope.adjustTotal = adjustTotal;
                $scope.adjustInfoShow = true;
            }
            if(adjustCurrencyType){
                $scope.adjustCurrencyType = adjustCurrencyType;
                $scope.adjustInfoShow = true;
            }

            if (adjustmentValue) {
                $scope.adjustVal = adjustmentValue;
            } else {
                $scope.adjustVal = 0;
            }

            if (adjustmentUnit == '2') {
                $scope.adjustUnit = Lang.getValByKey('billApproval', 'money');
                $scope.adjustUnitValue = '2';
            } else {
                $scope.adjustUnit = Lang.getValByKey('billApproval', 'percent');
                $scope.adjustUnitValue = '1';
            }

            if (adjustmentRemark) {
                $scope.remark = adjustmentRemark;
            } else {
                $scope.remark = '';
            }

            Select.sharePool['adjust-type'] = '';
            Select.sharePool['adjust-unit'] = '';
            $scope.popBox = true;
            $('#pop-box').css('display', 'table');
        };

        /**
         * 点击账单号查看详情
         */
        $scope.billsDetail = function (billNo, customerId, status, currency) {
            window.location.href = '#/billDetail?billNo=' + billNo + '&customerId=' + customerId + '&from=billApproval' + '&status=' + status + '&currency=' + currency + '&module=' + $scope.module + '&submodule=' + $scope.submodule;
        };

        /**
         * 查看流转
         */
        $scope.flowProcess = function (billNo) {
            window.location.href = '#/billStream?billNo=' + billNo + '&from=billApproval' + '&module=' + $scope.module + '&submodule=' + $scope.submodule;
        };


        /**
         * 显示订单状态下拉框
         */
        var statusEle;
        $scope.showStatus = function () {
            if (statusEle) {
                return;
            }
            var config = {
                'urlParams': {'isAudit': 1},
                'seatParams': {
                    'interType': $scope.interType,
                    'subInterType': $scope.subInterType
                }
            }
            $scope.statusData = billApprovalService.getStatus(config);

            statusEle = selectFactory({
                data: $scope.statusData,
                defaultText: Lang.getValByKey("common", 'common_all_tips'),
                id: "select-status",
                showTextField: "name",
                attrTextField: {
                    "ng-value": "code"
                },
                attrTextId: function (code) {
                    if (!code) {    //全部
                        $scope.tableModel.restData.includeAllAudit = true;
                        $scope.statusValue = 'AUDITING';
                    } else {
                        $scope.tableModel.restData.includeAllAudit = false;
                        $scope.statusValue = code;
                    }
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.status = name;
                    $scope.$apply();
                }
            });
            statusEle.setData($scope.statusData);
            statusEle.open();
            $('#select-status').val($scope.status);
        };

        /*客户下拉列表*/
        $scope.getCustomerData = function (q, currentPage) {
            $scope.userType = $scope.userType ? $scope.userType : ($scope.paramter.module == 'trade' ? 2 : 1);
            if (!currentPage) {
                currentPage = 1;
            }
            q = q ? q : '';
            var config = {
                'urlParams': {
                    'q': q ? q.trim() : "",
                    'pageIndex': currentPage,
                    'pageSize': 10,
                    'isAsc': false,
                    'sortName': '',
                    'userType': $scope.userType
                }
            };
            return billApprovalService.getCustomer(config);
        };
        $scope.getCustomer = function () {
            $scope.customerData = $scope.getCustomerData();

            angular.forEach($scope.customerData.data, function (value, key) {
                value.userName += "(" + value.code + ")";
            });

            var customerEle = selectFactory({
                data: $scope.customerData,
                isSearch: true,
                isUsePinyin: true,
                multipleSign: ",",
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: "select-customer",
                pagination: true,
                searchPlaceHoder: Lang.getValByKey("common", 'common_select_search_account_tips'),
                showTextField: "userName",
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.customerData = $scope.getCustomerData(data, currentPage);

                    angular.forEach($scope.customerData.data, function (value, key) {
                        value.userName += "(" + value.code + ")";
                    });

                    attachEvent.setData($scope.customerData);
                    $scope.$apply();
                },
                attrTextId: function (id) {
                    $scope.customerValue = $scope.customerValue ? ($scope.customerValue + ',' + id) : id;

                    $scope.$apply();
                },
                attrTextModel: function (userName) {
                    $scope.customerName = userName;
                    $scope.$apply();
                }
            });

            customerEle.setData($scope.customerData);
            customerEle.open();
            $('#select-customer').val($scope.customerName);
        };

        $scope.$watch('customerName', function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            if (!newValue) {
                $scope.customerValue = '';
            }
        }, true);

        $scope.getSupplierListData = function (q, currentPage) {
            q = q ? q : '';
            var config = {
                'urlParams': {
                    'q': q,
                    'pageIndex': currentPage || 1,
                    'pageSize': 10
                },
                'seatParams': {
                    'intertype': $scope.module
                }
            };
            var data = billApprovalService.getSupplierList(config);
            angular.forEach(data.data, function (value, key) {
                value.name += "(" + value.code + ")";
            });
            return data;
        };
        $scope.getSupplier = function () {
            $scope.supplierData = $scope.getSupplierListData();

            var supplierEle = selectFactory({
                data: [],
                isSearch: true,
                isUsePinyin: true,
                multipleSign: ",",
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                id: "select-supplier",
                showTextField: "name",
                searchPlaceHoder: '请输入供应商名称或编码',
                pagination: true,
                attrTextField: {
                    "ng-value": "id"
                },
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.supplierData = $scope.getSupplierListData(data, currentPage);

                    attachEvent.setData($scope.supplierData);
                    $scope.$apply();
                },
                attrTextId: function (id) {
                    $scope.customerValue = $scope.customerValue ? ($scope.customerValue + ',' + id) : id;

                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.customerName = name;
                    $scope.$apply();
                }
            });

            //supplierEle.setData($scope.supplierData);
            supplierEle.open();
            //$('#select-supplier').val($scope.customerName);
        };

        /**
         * 显示平台实体下拉框
         */
        var platformEle;
        $scope.getPlatform = function () {
            if (platformEle) {
                return;
            }

            $scope.platformData = billApprovalService.getPlatformData();

            platformEle = selectFactory({
                data: $scope.platformData,
                defaultText: '全部',
                id: "select-platform",
                multipleSign: ",",
                showTextField: "name",
                attrTextField: {
                    "ng-value": "id"
                },
                attrTextId: function (id) {
                    if (id) {
                        $scope.platformValue = $scope.platformValue ? ($scope.platformValue + ',' + id) : id;
                    } else {
                        $scope.platformValue = '';
                    }
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.platform = name;
                    $scope.$apply();
                }
            });
            platformEle.open();
            $('#select-platform').val($scope.platform);
        };

        /**
         * 显示价格调整 类型下拉列表
         */
        $scope.showAdjustType = function () {
            $scope.adjustTypeData = {
                data: [{
                    name: Lang.getValByKey('billApproval', 'to_up'),
                    code: 'UPPER'
                }, {
                    name: Lang.getValByKey('billApproval', 'to_down'),
                    code: 'DOWN'
                }]
            };

            var adjustTypeEle = selectFactory({
                data: $scope.adjustTypeData,
                id: "adjust-type",
                defaultText: '',
                showTextField: "name",
                attrTextField: {
                    "ng-value": "code"
                },
                attrTextId: function (code) {
                    $scope.adjustTypeValue = code;
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.adjustType = name;
                    $scope.$apply();
                }
            });
            adjustTypeEle.setData($scope.adjustTypeData);
            adjustTypeEle.open();
            $('#adjust-type').val($scope.adjustType);
        };

        /**
         * 显示价格调整 单位下拉列表
         */
        $scope.showAdjustUnit = function () {
            $scope.adjustUnitData = {
                data: [{
                    name: Lang.getValByKey('billApproval', 'percent'),
                    code: '1'
                }, {
                    name: Lang.getValByKey('billApproval', 'money'),
                    code: '2'
                }]
            };

            var adjustUnitEle = selectFactory({
                data: $scope.adjustUnitData,
                id: "adjust-unit",
                showTextField: "name",
                defaultText: '',
                attrTextField: {
                    "ng-value": "code"
                },
                attrTextId: function (code) {
                    if ($scope.adjustUnitValue != code) {
                        $scope.adjustVal = 0;
                        $scope.adjustValError = false;
                    }
                    $scope.adjustUnitValue = code;
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.adjustUnit = name;
                    $scope.$apply();
                }
            });
            adjustUnitEle.setData($scope.adjustUnitData);
            adjustUnitEle.open();
            $('#adjust-unit').val($scope.adjustUnit);
        };

        $scope.ngChange = function () {
            if (!$scope.adjustVal) {
                return;
            }
            var reg = /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,3}$/;
            if (!reg.test($scope.adjustVal)) {
                $scope.adjustValError = true;
            } else {
                $scope.adjustValError = false;
            }
        };

        function removeDuplicatedItem(arr) {
            var tmp = {},
                ret = [];

            for (var i = 0, j = arr.length; i < j; i++) {
                if (!tmp[arr[i]]) {
                    tmp[arr[i]] = 1;
                    ret.push(arr[i]);
                }
            }

            return ret;
        }

        /**
         * 贸易-应付-审核账单-付款
         * @param block
         */
        $scope.payment = function (item) {
            var config = {
                'urlParams': {
                    'outCustomerId': item.platformId,    //付款客户id
                    'inCustomerId': item.bizCompanyId    //收款客户id
                }
            };
            billApprovalService.getThirdPayAccountId(config, function (res) {
                if(res.errorCode === 0 && res.data) {
                    $scope.block = 'payment';
                    eventHandler.dispatch('paymentData', {
                        'billInfo': {
                            'billNo': item.billNo,
                            'platformName': item.platformName,
                            'platformCode': item.platformCode,
                            'platformId': item.platformId,
                            'startEffectTime': item.startEffectTime,
                            'endEffectTime': item.endEffectTime,
                            'bizCompanyName': item.bizCompanyName,    //收款方
                            'total': item.total,    //应收总计
                            'actualTotal': item.actualTotal,    //实收总计
                            'currencyType': item.currencyType,    //货币类型
                            'bizCompanyId': item.bizCompanyId,   //收款客户id
                            'outCustAcctId': '',    //付款账户id
                            'outThirdCustId': '',    //付款客户ID
                            'outThirdPayName': '',
                            'inCustAcctId':'',    //收款方
                            'inThirdCustId': '',
                            'inThirdPayName': ''
                        },
                        'thirdPayAccountId':res.data.Id || ''
                    });
                }else {    //账户未开通，弹出提示。
                    $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                }
            });
        };

        var payWayEle;
        $scope.showPayWay = function () {
            if (payWayEle) {
                return;
            }

            var config = {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 100
                }
            };
            $scope.payWayData = billApprovalService.getPayWayData(config);

            payWayEle = selectFactory({
                data: $scope.payWayData,
                defaultText: Lang.getValByKey("common", 'common_all_tips'),
                id: "select-payWay",
                attrTextModel: function(name, data,currentData) {
                    if(!name){
                        $scope.payWay ='';
                    }else{
                        $scope.payWay = name;
                    }

                    $scope.$apply();
                }
            });
            payWayEle.open();
        };
    }]);
});