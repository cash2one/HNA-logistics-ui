easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'public/common/tableController.js',
    'widget/parseUrl',
    'public/common/calander.js',
    'widget/select'
], function(){
    app.controller('billDetailCtrl', [
        '$scope',
        'billDetailService',
        'billDetailView',
        'tableService',
        function ($scope, billDetailService, billDetailView, tableService) {
            // 日期控件
            Calander.init({
                ele: ['#begin-time', '#end-time'],
                isClear: true
            });

            $scope.parameter = window.parseUrl.getParams();

            $scope.module = $scope.parameter.module ? $scope.parameter.module : 'logistics';
            $scope.submodule = $scope.parameter.submodule;
            // 物流和贸易接口区分。
            $scope.interType = $scope.module == 'trade' ? 'trd' : '';
            // 贸易的有应收应付。物流的暂时没有。
            // $scope.subInterType = $scope.module == 'trade' ? $scope.submodule : '';
            if ($scope.module == 'trade') {
                $scope.subInterType = $scope.submodule;
            }
            if ($scope.module == 'logistics') {
                $scope.subInterType = $scope.submodule == 'pay' ? '1' : '2';
            }

            if ($scope.module == 'trade') {
                if ($scope.submodule == 'receive') {
                    $scope.tTheadCus = '客户（付款方）';
                    $scope.tTheadPla = '平台实体（收款方）';
                } else if ($scope.submodule == 'pay') {
                    $scope.tTheadCus = '客户（收款方）';
                    $scope.tTheadPla = '平台实体（付款方）';
                }
                $scope.tTheadGoo = '商品名';
                $scope.tTheadAcc = '';
                $scope.tableClass = true;
            } else {
                $scope.tTheadPro = Lang.getValByKey('billDetail', 'product_names');
                $scope.tTheadAcc = Lang.getValByKey('billDetail', 'account_name');
            }

            $scope.title = Lang.getValByKey('billDetail', 'account_detail');
            $scope.status = $scope.parameter.status;
            $scope.tableModel = {
                tableHeader: [
                    Lang.getValByKey('common', 'common_thead_number'),
                    Lang.getValByKey('billDetail', 'order_number'),
                    $scope.tTheadCus,
                    $scope.tTheadPla,
                    $scope.tTheadAcc,
                    $scope.tTheadGoo,
                    $scope.tTheadPro,
                    Lang.getValByKey('billDetail', 'billing_time'),
                    Lang.getValByKey('billDetail', 'price_detail') + '（' + $scope.parameter.currency + '）'
                ],
                tableBody: [],
                restURL: 'logistics.getBillsOrders',
                restData: {
                    billNo: $scope.parameter.billNo,
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    sort: 'code',
                    platformId: '',
                    bizCompanyId: '',
                    customerId: ''
                },
                selectNumber: 0,
                selectFlag: false
            };

            if ($scope.module == 'logistics') {
                if ($scope.submodule == 'receive') {
                    $scope.tableModel.tableHeader = [
                        Lang.getValByKey('common', 'common_thead_number'),
                        '运单号',
                        '账号名',
                        '产品名称',
                        Lang.getValByKey('billDetail', 'billing_time'),
                        '计费重',
                        '汇率',
                        '总价',
                        '支付状态'
                    ];
                }
                if ($scope.submodule == 'pay') {
                    $scope.tableModel.tableHeader = [
                        Lang.getValByKey('common', 'common_thead_number'),
                        '运单号',
                        '服务名称',
                        Lang.getValByKey('billDetail', 'billing_time'),
                        '计费重',
                        '汇率',
                        '总价'
                    ];
                }
            }

            $scope.getTable = function () {
                var config = {
                    urlParams: $scope.tableModel.restData,
                    seatParams: {
                        interType: $scope.interType,
                        subInterType: $scope.subInterType
                    }
                };

                tableService.getTable($scope.tableModel.restURL, config, function (data) {
                    if (data.errorCode === 0) {
                        $scope.tableModel = tableService.table($scope.tableModel, config, data);

                        var height = $('.m-content-box').height() - 200;
                        setTimeout(function () {
                            $('.table-container tbody').slimscroll({ height: height });
                            $(window).resize(function () {
                                height = $('.m-content-box').height() - 200;
                                $('.table-container tbody').slimscroll({ height: height });
                            });
                        }, 10);
                    }
                });
            };
            $scope.getTable();

            /**
             * 搜索
             */
            $scope.search = function () {
                $scope.tableModel.restData.pageIndex = 1;
                $scope.tableModel.restData.orderNo = $scope.orderNum; // 订单号
                $scope.tableModel.restData.waybillNo = $scope.orderNum; // 运单号

                $scope.tableModel.restData.startEffectTime = $scope.startTime; // 账单周期-起始时间
                $scope.tableModel.restData.endEffectTime = $scope.endTime; // 账单周期-截止时间

                if ($scope.module == 'trade') {
                    // 贸易
                    $scope.tableModel.restData.platformId = $scope.platformValue;
                    $scope.tableModel.restData.bizCompanyId = $scope.orderClientValue;
                    $scope.q = $scope.tableModel.restData.goodsName = $scope.goodName;
                }
                if ($scope.module == 'logistics') {
                    if ($scope.submodule == 'receive') {
                        $scope.tableModel.restData.productUid = $scope.productValue;
                        $scope.tableModel.restData.customerId = $scope.orderClientValue; // 账号名
                        $scope.tableModel.restData.payStatus = $scope.payStatus; // 支付状态
                    }
                    if ($scope.submodule == 'pay') {
                        $scope.tableModel.restData.serviceUid = $scope.serviceValue;
                    }
                }

                $scope.getTable();
            };

            /**
             * 清除搜索条件
             */
            $scope.clearCondition = function () {
                $scope.orderNum = '';
                $scope.orderClientName = $scope.orderClientValue = '';
                $scope.payStatus = '';
                $scope.payStatusName = '全部';
                $scope.productName = '';
                $scope.platform = $scope.platformValue = '';
                $scope.goodName = $scope.goodValue = '';
                $scope.productName = $scope.productValue = '';
                $scope.serviceName = $scope.serviceValue = '';
                $scope.startTime = '';
                $scope.endTime = '';
                $scope.search();
            };

            /**
             * 提交意见
             */
            $scope.audit = function(){
                $scope.auditSubmitStatus = true;
                if(!$scope.auditRemark){
                    $scope.auditForm.auditRemark.$setDirty();
                }
                if(!$scope.auditForm.$valid || !$scope.auditStatus){
                    return;
                }

                var config = {
                    'urlParams':{
                        'billNos':[$scope.parameter.billNo],
                        'type':$scope.auditStatus,
                        'msg':$scope.auditRemark
                    },
                    'seatParams':{
                        interType: $scope.interType,
                        subInterType: $scope.subInterType
                    }
                };
                billDetailService.audit(config, function(res){
                    if(res.errorCode === 0){
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'success'});

                        setTimeout(function(){$scope.goBack()}, 1000);
                    }else{
                        $(document).promptBox({isDelay:true,contentDelay:res.msg,type: 'errer',manualClose:true});
                    }
                });
            };

            $scope.goBack = function () {
                var from = $scope.parameter.from,
                    module = $scope.parameter.module,
                    submodule = $scope.parameter.submodule;

                if(from == 'fundsAccount'){
                    window.location.href = '#/' + from + '?thirdPayAccountId=' + $scope.parameter.thirdPayAccountId + '&custName=' + $scope.parameter.custName + '&currencyCode=' + $scope.parameter.currency;
                }else{
                    window.location.href = '#/' + from + '?from=' + from + '&module=' + module + '&submodule=' + submodule;
                }
            };

            /**
             * 获取客户下拉列表  子账号
             */
            $scope.getClientData = function (q, pageIndex) {
                var config = {
                    seatParams: {
                        costomerid: $scope.parameter.customerId
                    },
                    urlParams: {
                        q: q ? q.trim() : '',
                        pageIndex: pageIndex ? pageIndex : 1
                    }
                };
                return billDetailService.getClient(config);
            };

            $scope.getClient = function () {
                /* $scope.clientData = $scope.getClientData();

                 angular.forEach($scope.clientData.data, function (value, key) {
                 value.fullName += '(' + value.userName + ')';
                 }); */

                var clientEle = selectFactory({
                    data: [],
                    isSearch: true,
                    isUsePinyin: true,
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    searchPlaceHoder: '请输入姓名或用户名',
                    id: 'select-client',
                    showTextField: 'fullName',
                    attrTextField: {
                        'ng-value': 'id'
                    },
                    pagination: true,
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.clientData = $scope.getClientData(data, currentPage);

                        angular.forEach($scope.clientData.data, function (value, key) {
                            value.fullName += '(' + value.userName + ')';
                        });

                        attachEvent.setData($scope.clientData);
                        $scope.$apply();
                    },
                    attrTextId: function (id) {
                        $scope.orderClientValue = id;
                        $scope.$apply();
                    },
                    attrTextModel: function (fullName) {
                        $scope.orderClientName = fullName;
                        $scope.$apply();
                    }
                });
                // clientEle.setData($scope.clientData);
                clientEle.open();
                $('#select-client').val($scope.orderClientName);
            };

            /**
             * 获取产品下拉列表
             */
            $scope.getProductData = function (q, index) {
                q = q ? q : '';
                var config = {
                    urlParams: {
                        q: q,
                        pageIndex: index ? index : 1,
                        pageSize: 10,
                        status: 3,
                        includeAllAudit: true
                    }
                };
                var data = billDetailService.getProducts(config);
                angular.forEach(data.data, function (value, key) {
                    value.name += '(' + value.code + ')';
                });
                return data;
            };
            $scope.getProduct = function () {
                // $scope.productsData = $scope.getProductData();

                var productEle = selectFactory({
                    data: [],
                    isSearch: true,
                    isUsePinyin: true,
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    searchPlaceHoder: '请输入产品名称或编码',
                    id: 'select-product',
                    showTextField: 'name',
                    pagination: true,
                    attrTextField: {
                        'ng-value': 'uid'
                    },
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.productsData = $scope.getProductData(data, currentPage);
                        attachEvent.setData($scope.productsData);
                    },
                    attrTextId: function (uid) {
                        $scope.productValue = uid;
                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        $scope.productName = name;
                        $scope.$apply();
                    }
                });
                // productEle.setData($scope.productsData);
                productEle.open();
                $('#select-product').val($scope.productName);
            };

            /**
             * 获取服务下拉列表
             */
            $scope.getServiceData = function (q, index) {
                q = q ? q : '';
                var config = {
                    seatParams: {
                        serviceTypeCode: -1
                    },
                    urlParams: {
                        q: q,
                        pageIndex: index ? index : 1,
                        pageSize: 10,
                        status: 4,
                        includeAllAudit: true
                    }
                };
                var data = billDetailService.getServices(config);
                angular.forEach(data.data, function (value, key) {
                    value.name += '(' + value.code + ')';
                });
                return data;
            };
            $scope.getService = function () {
                // $scope.servicesData = $scope.getServiceData();

                var serviceEle = selectFactory({
                    data: [],
                    isSearch: true,
                    isUsePinyin: true,
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    searchPlaceHoder: '请输入服务名称或编码',
                    id: 'select-service',
                    showTextField: 'name',
                    pagination: true,
                    attrTextField: {
                        'ng-value': 'uid'
                    },
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.servicesData = $scope.getServiceData(data, currentPage);
                        attachEvent.setData($scope.servicesData);
                    },
                    attrTextId: function (uid) {
                        $scope.serviceValue = uid;
                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        $scope.serviceName = name;
                        $scope.$apply();
                    }
                });
                // serviceEle.setData($scope.servicesData);
                serviceEle.open();
                $('#select-service').val($scope.serviceName);
            };

            /**
             * 显示平台实体下拉框
             */
            var platformEle;
            $scope.getPlatform = function () {
                if (platformEle) {
                    return;
                }

                $scope.platformData = billDetailService.getPlatformData();

                platformEle = selectFactory({
                    data: $scope.platformData,
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    id: 'select-platform',
                    showTextField: 'name',
                    attrTextField: {
                        'ng-value': 'id'
                    },
                    attrTextId: function (id) {
                        $scope.platformValue = id;
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
             * 获取产品下拉列表
             */
            $scope.getGoodData = function (q) {
                q = q ? q : '';
                var config = {
                    urlParams: {
                        q: q,
                        pageIndex: 1,
                        pageSize: 10
                    }
                };
                var data = billDetailService.getGood(config);
                angular.forEach(data.data, function (value, key) {
                    value.goodsName += '(' + value.goodsCode + ')';
                });
                return data;
            };

            /**
             * 显示商品下拉框
             */
            var goodEle;
            $scope.getGood = function () {
                $scope.goodData = $scope.getGoodData();

                goodEle = selectFactory({
                    data: $scope.goodData,
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    id: 'select-good',
                    showTextField: 'goodsName',
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data) {
                        $scope.goodData = $scope.getGoodData(data);
                        attachEvent.setData($scope.goodData);
                    },
                    attrTextField: {
                        'ng-value': 'goodsCode'
                    },
                    attrTextId: function (goodsCode) {
                        $scope.goodValue = goodsCode;
                        $scope.$apply();
                    },
                    attrTextModel: function (goodsName) {
                        $scope.goodName = goodsName;
                        $scope.$apply();
                    }
                });
                goodEle.open();
                $('#select-good').val($scope.goodName);
            };

            $scope.getSupplierListData = function (q) {
                q = q ? q : '';
                var config = {
                    urlParams: {
                        q: q
                    },
                    seatParams: {
                        intertype: $scope.module
                    }
                };
                var data = billDetailService.getSupplierList(config);
                angular.forEach(data.data, function (value, key) {
                    value.name += '(' + value.code + ')';
                });
                return data;
            };
            $scope.getSupplier = function () {
                $scope.supplierData = $scope.getSupplierListData();

                var supplierEle = selectFactory({
                    data: $scope.supplierData,
                    isSearch: true,
                    isUsePinyin: true,
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    id: 'select-supplier',
                    showTextField: 'name',
                    attrTextField: {
                        'ng-value': 'code'
                    },
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data) {
                        $scope.supplierData = $scope.getSupplierListData(data);

                        attachEvent.setData($scope.supplierData);
                        $scope.$apply();
                    },
                    attrTextId: function (code) {
                        $scope.orderClientValue = code;

                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        $scope.orderClientName = name;
                        $scope.$apply();
                    }
                });

                supplierEle.setData($scope.supplierData);
                supplierEle.open();
                $('#select-supplier').val($scope.orderClientName);
            };

            var payStatusEle;
            $scope.getPayStatus = function () {
                if (payStatusEle) {
                    return;
                }

                $scope.payStatusData = billDetailService.getPayStatusData();

                payStatusEle = selectFactory({
                    data: $scope.payStatusData,
                    defaultText: Lang.getValByKey("common", 'common_all_tips'),
                    id: "pay-status",
                    showTextField: "name",
                    attrTextModel: function(name, data,currentData) {
                        if(!name){
                            $scope.payStatus ='';
                        }else{
                            $scope.payStatusName = name;
                            $scope.payStatus = currentData.code;
                        }

                        $scope.$apply();
                    }
                });
                payStatusEle.open();
            };

            $scope.getPriceDetail = function(data,currency){
                $scope.priceDetailShow = true;
                $scope.currencyDetail = currency;
                $scope.priceDetailData = data;
            }
        }
    ]);
});