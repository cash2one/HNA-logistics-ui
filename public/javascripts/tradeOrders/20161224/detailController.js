easySpa.require([
    'widget/select'
], function(){
    app.controller('detail', ['$scope', '$route', 'tradeOrdersService', 'tradeOrdersView', function($scope, $route, tradeOrdersService, tradeOrdersView){
        ['projectId2', 'purchaserId', 'orderGood'].forEach(function (item) {
            delete Select.sharePool[item];
        });
        $scope.data = {
            orderGoods: [],
            orderType: $scope.orderType
        };

        var customerType = '';
        if ($scope.orderType === 'SALE') {
            customerType = 1;
        } else {
            customerType = 2;
        }

        $scope.orderGoodStatus = true;
        $scope.projectIdStatus = true;

        if ($scope.orderNo) {
            tradeOrdersService.getOneOrder($scope.orderNo, customerType).then(function (res) {
                if (res.errorCode == 0) {
                    initData(res.data);
                    $scope.isInit = true;
                }
            });
        } else {
            initOrderTypes();
        }

        function initOrderTypes() {
            if ($scope.data.orderType === 'SALE') {
                $scope.firstSelectName = '销售方';
                $scope.secondSelectName = '采购方';
            } else if ($scope.data.orderType === 'PURCHASE') {
                $scope.firstSelectName = '采购方';
                $scope.secondSelectName = '销售方';
            }
        }

        function initData(data) {
            $scope.data.orderNo = data.orderNo;
            $scope.data.purchaserId = data.purchaserId;
            $scope.purchaserId = data.purchaserName + '(' + data.purchaserUserName + ')';
            $scope.purchaserCustomerId = data.purchaserCustomerId;

            $scope.data.projectId = data.projectId;
            $scope.projectId = data.projectName + '(' + data.projectCode + ')';
            $scope.data.orderStatusCode = data.orderStatusCode;
            $scope.data.orderStatus = data.orderStatus;

            $scope.orderChannel = data.orderChannel;

            if ($scope.data.projectId) {
                $scope.orderGoodStatus = false;
                $scope.projectIdStatus = false;
            }

            $scope.businessNo = data.businessNo;
            $scope.data.orderType = data.orderType;
            initOrderTypes();

            $scope.data.sellerId = data.sellerId;
            $scope.sellerId = data.sellerName;

            if ($scope.data.orderType === 'PURCHASE') {
                $scope.data.purchaserId = data.sellerId;
                $scope.purchaserId = data.sellerName + '(' + data.sellerCode + ')';
                $scope.data.sellerId = data.purchaserId;
                $scope.sellerId = data.purchaserName;
            }

            $scope.data.customerNote = data.customerNote;

            data.orderGoods.forEach(function (item) {
                item.name = 'goodsNum_' + item.goodsId;
            });

            $scope.data.orderGoods = data.orderGoods;
        }

        function scrollToElement(elem) {
            $('#orderDetail').animate({ scrollTop: $('#' + elem).offset().top }, 200);
        }

        function checkValue() {
            var form1key = ['sellerId', 'purchaserId', 'projectId'],
                canSubmit = false;

            form1key.forEach(function (key) {
                if (!$scope.data[key]) {
                    $scope.form1[key].$setDirty();
                    canSubmit = true;
                }
            });

            if (canSubmit) {
                scrollToElement('baseInfo');
                return true;
            }

            $scope.data.orderGoods.forEach(function (item) {
                if(item.showError){
                    canSubmit = true;
                    return;
                }
                var min = Number(item.minLimit),
                    max = Number(item.maxLimit);

                if(!min && !max){    //两个数据都不存在
                    item.showError = '请输入起止范围 或 终止范围';
                    canSubmit = true;
                    return;
                }else if(min && !max){
                    if(
                        isNaN(min) ||
                        min <= 0 ||
                        !/^\d+(?:\.\d{1,4})?$/.test(item.minLimit)
                    ){
                        $scope.form3['goodsNum_' + item.goodsId + 'minLimit'].$setDirty();
                        canSubmit = true;
                    }
                }else if(!min && max){
                    if(
                        isNaN(max) ||
                        max <= 0 ||
                        !/^\d+(?:\.\d{1,4})?$/.test(item.maxLimit)
                    ){
                        $scope.form3['goodsNum_' + item.goodsId + 'maxLimit'].$setDirty();
                        canSubmit = true;
                    }
                }else if(min && max){
                    if(min >= max){ canSubmit = true; }
                }

                var price = Number(item.goodsPrice);
                if(
                    isNaN(price) ||
                    price === 0 ||
                    !/^\d+(?:\.\d{1,2})?$/.test(item.goodsPrice)
                ){
                    $scope.form3[item.name + '_price'].$setDirty();
                    item.showPriceError = '请输入数字，小数点后保留两位';
                    canSubmit = true;
                }
            });

            if (canSubmit) {
                scrollToElement('goodsInfo');
                return true;
            }
            if ($scope.data.orderGoods.length === 0) {
                tradeOrdersView.promptBox({ msg: '请添加商品!' });
                canSubmit = true;
            }

            return canSubmit;
        }

        function round(v, e) {
            var t = 1;
            for (; e > 0; t *= 10, e--) {}
            for (; e < 0; t /= 10, e++) {}
            return Math.round(v * t) / t;
        }

        $scope.amountDue = function (item) {
            var amount = round(Number(item.goodsPrice * item.goodsNum), 3);
            if (isNaN(amount)) {
                return 0;
            }
            return item.amountDue = amount;
        };

        $scope.goComfirmBack = function () {
            if($route.current.params.from === 'cockpit'){
                window.location.href = '#/cockpit?from=tradeOrder'
            }else{
                if ($scope.orderNo) {
                    var titleTip = Lang.getValByKey('common', 'common_prompt_title'),
                        msgTip = Lang.getValByKey('common', 'common_back_confirm'),
                        btnText = Lang.getValByKey('common', 'common_back_yes'),
                        cancelDes = Lang.getValByKey('common', 'common_back_no');
                    tradeOrdersView.promptMidBox(
                        titleTip,
                        { msg: msgTip },
                        btnText,
                        function () {
                            $scope.goBack();
                            $(document).promptBox('closePrompt');
                        },
                        'warning',
                        'delete',
                        cancelDes
                    );
                } else {
                    $scope.goBack();
                }
            }
        };

        $scope.validateGoodnum = function (item, type) {
            item.showError = '';

            var beginResult = $scope.verOneGoodNum(item.minLimit),
                endResult = $scope.verOneGoodNum(item.maxLimit);

            if(!beginResult.result || !endResult.result){
                item.showError = beginResult.msg || endResult.msg;
            }

            if(type == 'min'){
                if(item.minLimit && item.maxLimit && Number(item.minLimit) >= Number(item.maxLimit)){
                    item.showError = '采购数量起始不能大于或等于终止';
                }
            }else if(type == 'max'){
                if(item.minLimit && item.maxLimit && Number(item.maxLimit) <= Number(item.minLimit)){
                    item.showError = '采购数量起始不能大于或等于终止';
                }
            }
        };

        $scope.verOneGoodNum = function(val){
            if(!$.trim(val)){
                return {'result':true};
            }

            var value = Number(val);
            if (!isNaN(value) && value <= 0) {
                return {'result':false, 'msg':'必须大于零'};
            }

            var numArr = val.toString().split('.');
            if (!numArr[0] || !numArr[numArr.length - 1]) {
                return {'result':false, 'msg':'请输入数字，小数点后保留四位'};
            }

            if (!/^(?:[-+]?(?:\d+))?(?:\.\d{1,4})?$/.test(value) || isNaN(val)) {
                return {'result':false, 'msg':'请输入数字，小数点后保留四位'};
            }

            return {'result':true};
        };

        $scope.validateGoodPrice = function (item) {
            item.showPriceError = '';

            if (item.goodsPrice === '') {
                item.showPriceError = '不能为空';
                return;
            }
            var val = Number(item.goodsPrice);
            if (!isNaN(val) && val <= 0) {
                item.showPriceError = '必须大于零';
                return;
            }

            if (!/^(?:[-+]?(?:\d+))?(?:\.\d{1,2})?$/.test(item.goodsPrice) || isNaN(val)) {
                item.showPriceError = '请输入数字，小数点后保留两位';
                return;
            }
        };

        $scope.cancel = function(){
            $scope.goBack('fresh');
        };

        // 保存订单
        $scope.save = function (type) {
            if (checkValue()) {
                return;
            }

            var data = angular.copy($scope.data);
            if (type) {
                data.orderStatus = type;
            }
            var orderGoods = [];

            data.orderGoods.forEach(function (item) {
                orderGoods.push({
                    amountDue: item.amountDue,
                    goodsId: item.goodsId,
                    minLimit: item.minLimit,
                    maxLimit: item.maxLimit,
                    goodsPrice: item.goodsPrice
                });
            });
            data.orderGoods = orderGoods;

            var isRepeat = false;

            for (var i = 0; i < orderGoods.length - 1; i++) {
                if (orderGoods[i].goodsCurrencyType != orderGoods[i + 1].goodsCurrencyType) {
                    isRepeat = true;
                    break;
                }
            }

            if (isRepeat) {
                tradeOrdersView.promptBox({ msg: '所选商品币种不一致！' });
                return;
            }

            var middle;
            if ($scope.firstSelectName === '采购方') {
                middle = data.purchaserId;
                data.purchaserId = data.sellerId;
                data.sellerId = middle;
            }

            data.businessNo = $scope.businessNo;
            data.trdOrderFileRels = $scope.result;

            if($scope.data.orderStatusCode && $scope.data.orderStatusCode != '1'){
                var msg = '确定保存修改？';
            }else{
                var msg = '确定保存草稿？';
                if (type) { msg = '确定提交订单?'; }
            }

            tradeOrdersView.promptMidBox('', { msg: msg }, '', function () {
                if (!$scope.orderNo) {
                    tradeOrdersService.saveOrder(data).then(function (res) {
                        tradeOrdersView.promptBox(res);
                        if (res.errorCode == 0) {
                            setTimeout(function () {
                                $scope.goBack('fresh');
                            }, 500);
                        }
                    });
                } else {
                    tradeOrdersService.updateOrder(data).then(function (res) {
                        tradeOrdersView.promptBox(res);
                        if (res.errorCode == 0) {
                            setTimeout(function () {
                                $scope.goBack('fresh');
                            }, 500);
                        }
                    });
                }
            });
        };

        $scope.addGoods = function () {
            if (!$scope.data.orderGood) {
                tradeOrdersView.promptBox({ msg: '请先选择商品!' });
                return;
            }

            tradeOrdersService
                .getGoodsOrderById($scope.data.orderGood)
                .then(function (res) {
                    if (res.errorCode == 0) {
                        transKeys(res.data);
                    }
                });

            function transKeys(data) {
                var good = {
                    goodsName: data.goodsName,
                    goodsType: data.goodsType,
                    goodsHSCode: data.hsCode,
                    goodsUnit: data.unit,
                    goodsPrice: data.price,
                    goodsId: $scope.data.orderGood,
                    name: 'goodsNum_' + $scope.data.orderGood,
                    goodsCurrencyType: data.currencyType,
                };
                $scope.data.orderGoods.push(good);
            }
        };

        $scope.deleteGoods = function () {
            var orderGoods = $scope.data.orderGoods;
            orderGoods.forEach(function (item, index) {
                if (item.checked) {
                    orderGoods.splice(index, 1);
                    $scope.deleteGoods();
                }
            });
            if ($scope.isAllchecked) {
                $scope.isAllchecked = false;
            }
        };

        // 项目下拉菜单
        $scope.getProjectShortData = function (q, currentPage) {
            q = q ? q : '';
            var config = {
                project: q ? q.trim() : '',
                pageIndex: currentPage || 1,
                pageSize: 10,
                isAsc: false,
                sortName: '',
                sellerId: $scope.data.sellerId, // 商品类型
                purchaserId: $scope.purchaserCustomerId, // 采购方id
                orderType: $scope.data.orderType,
            };

            if ($scope.data.orderType === 'PURCHASE') {
                config.sellerId = $scope.purchaserCustomerId;
                config.purchaserId = $scope.data.sellerId;
            }

            return tradeOrdersService.trdProjectsShort(config);
        };
        $scope.initProjectShort2 = function () {
            var select = selectFactory({
                data: [],
                isSearch: true,
                isUsePinyin: true,
                id: 'projectId2',
                showTextField: 'userName',
                defaultText: '请选择',
                attrTextField: {
                    'ng-value': 'id',
                },
                closeLocalSearch: true,
                pagination:true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.customerData = $scope.getProjectShortData(data, currentPage);
                    angular.forEach($scope.customerData.data, function (value, key) {
                        value.userName = value.name + '(' + value.code + ')';
                    });
                    attachEvent.setData($scope.customerData);
                    $scope.$apply();
                },
                attrTextId: function (id) {
                    if ($scope.data.projectId != id) {
                        if (!id) {
                            $scope.data.projectId = '';
                        } else {
                            $scope.data.projectId = id;
                        }
                        enabledGoods();
                        $scope.$apply();
                    }
                },
                attrTextModel: function (userName) {
                    $scope.projectId = userName;
                    $scope.$apply();
                }
            });
            select.open();
        };

        // 初始化销售方下拉菜单
        initSaleId = function () {
            tradeOrdersService.platcompanys().then(function (data) {
                tradeOrdersView.initNgSelect($scope, '#sellerId', data, function (item) {
                    if ($scope.data.sellerId != item.id) {
                        $scope.sellerId = item.name;
                        $scope.data.sellerId = item.id;
                        // 清空项目
                        clearProject();
                    }
                });
            });
        };

        initSaleId();

        // 初始化订单类型
        initOrderType = function () {
            tradeOrdersService.orderType().then(function (data) {
                tradeOrdersView.initNgSelect($scope, '#ngOrderType', data, function (item) {
                    $scope.orderType = item.name;
                    $scope.data.orderType = item.code;
                    $scope.purchaserId = '';
                    $scope.data.purchaserId = '';
                    if ($scope.data.orderType === 'SALE') {
                        $scope.firstSelectName = '销售方';
                        $scope.secondSelectName = '采购方';
                    } else if ($scope.data.orderType === 'PURCHASE') {
                        $scope.firstSelectName = '采购方';
                        $scope.secondSelectName = '销售方';
                    }
                });
            });
            if (!$scope.data.orderType) {
                $scope.data.orderType = 'SALE';
                $scope.orderType = '销售订单';
                $scope.firstSelectName = '销售方';
                $scope.secondSelectName = '采购方';
            }
        };

        $scope.getOrderGoodsData = function (q, currentPage) {
            q = q ? q : '';
            var config = {
                q: q ? q.trim() : '',
                pageIndex: currentPage ? currentPage : 1,
                pageSize: 10,
                isAsc: false,
                sortName: '',
                orderType: $scope.orderType,
                businessType: '2', // 业务类
                // ,'sellId' : $scope.data.sellerId// 销售方id
                //  ,'purchaserId' : $scope.purchaserCustomerId//采购商id
            };
            if ($scope.data.projectId) {
                config.projectId = $scope.data.projectId;
            } else {
                // 项目id , 可选
                delete config.projectId;
            }
            if ($scope.orderType == 'PURCHASE') {
                config.purchaserId = $scope.data.sellerId;
                config.sellId = $scope.data.purchaserId;
            } else {
                config.purchaserId = $scope.purchaserCustomerId;
                config.sellId = $scope.data.sellerId;
            }

            return tradeOrdersService.getTrdGoodsShortList(config);
        };
        $scope.initOrderGood = function () {
            $scope.goodsData = $scope.getOrderGoodsData();

            $scope.goodsData.data.forEach(function (item) {
                item.showName = item.goodsTypeName + ': ' + item.name + '(' + item.code + ')';
            });

            var select = selectFactory({
                data: $scope.goodsData,
                isSearch: true,
                isUsePinyin: true,
                id: 'orderGood',
                pagination: true,
                defaultText: '请选择',
                searchPlaceHoder: '请输入名称或编码',
                showTextField: 'showName',
                attrTextField: {
                    'ng-value': 'id',
                },
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.customerData = $scope.getOrderGoodsData(data, currentPage);
                    $scope.customerData.data.forEach(function (item) {
                        item.showName = item.goodsTypeName + ': ' + item.name + '(' + item.code + ')';
                    });
                    attachEvent.setData($scope.customerData);
                    $scope.$apply();
                },
                attrTextId: function (id) {
                    if (!id) {
                        $scope.data.orderGood = '';
                    } else {
                        $scope.data.orderGood = id;
                    }
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.orderGood = name;
                    $scope.$apply();
                },
            });
            select.setData($scope.goodsData);
            select.open();
            $('#purchaseCustomerIds').val($scope.orderGood);
        };

        // 采购方下拉菜单
        $scope.getPurchaserIdData = function (q, currentPage) {
            q = q ? q : '';
            var config = {
                q: q ? q.trim() : '',
                pageIndex: currentPage ? currentPage : 1,
                pageSize: 10,
                isAsc: false,
                sortName: '',
                userType: '2',
            };
            if ($scope.data.orderType === 'PURCHASE') {
                return tradeOrdersService.getEnterpriseNameTradeSupplier(config);
            } else if ($scope.data.orderType === 'SALE') {
                return tradeOrdersService.getTradeCustomerUsernamelist(config);
            }
        };

        // 是否启用丧品
        function enabledGoods() {
            if ($scope.data.projectId) {
                $scope.orderGoodStatus = false;
            } else {
                $scope.orderGoodStatus = true;
            }
            // 清空商品
            $scope.orderGood = '';
            $scope.data.orderGood = '';
            $scope.data.orderGoods.length = 0;
        }

        // 清空项目
        function clearProject() {
            // 设置项目可选
            if ($scope.data.sellerId && $scope.data.purchaserId) {
                $scope.projectIdStatus = false;
            } else {
                $scope.projectIdStatus = true;
            }
            $scope.projectId = '';
            $scope.data.projectId = '';
            // 是否启用商品
            enabledGoods();
        }
        $scope.initPurchaserId = function () {
            var searchPlaceHoder = '';
            if ($scope.data.orderType === 'PURCHASE') {
                // 采购订单
                searchPlaceHoder = '请输入名称或编码';
            } else if ($scope.data.orderType === 'SALE') {
                // 销售订单
                searchPlaceHoder = '请输入姓名或用户名';
            }

            var select = selectFactory({
                data: [],
                isSearch: true,
                id: 'purchaserId',
                showTextField: 'uiName',
                searchPlaceHoder: searchPlaceHoder,
                defaultText: '请选择',
                pagination: true,
                attrTextField: {
                    'ng-value': 'id',
                },
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.customerData = $scope.getPurchaserIdData(data, currentPage);
                    $scope.customerData.data.forEach(function (item) {
                        if (item.name) {
                            item.uiName = item.name + '(' + item.code + ')';
                        } else {
                            item.uiName = item.fullName + '(' + item.userName + ')';
                        }
                    });
                    attachEvent.setData($scope.customerData);
                    $scope.$apply();
                },
                attrTextId: function (id) {
                    if ($scope.data.purchaserId != id) {
                        if (!id) {
                            $scope.data.purchaserId = '';
                        } else {
                            $scope.data.purchaserId = id;
                        }
                        // 清空项目
                        clearProject();
                        $scope.$apply();
                    }
                },
                attrTextModel: function (name, present, item) {
                    $scope.purchaserId = name;
                    $scope.purchaserCustomerId = item.customerId || item.id;
                    $scope.$apply();
                }
            });
            select.open();
        };

        $scope.checkOne = function (item, data) {
            item.checked = !item.checked;
            var isAll = true;
            data.forEach(function (item) {
                if (!item.checked) {
                    isAll = false;
                }
            });
            $scope.isAllchecked = isAll;
        };
        $scope.isAllchecked = false;
        $scope.checkAll = function (data) {
            $scope.isAllchecked = !$scope.isAllchecked;
            data.forEach(function (item) {
                item.checked = $scope.isAllchecked;
            });
        };
    }]);
});