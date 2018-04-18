easySpa.require([
    'public/common/tableController.js',
    'widget/select',
    'widget/prompt',
    'public/common/calander.js',
    'public/javascripts/tradeOrders/20161224/tradeOrdersService.js',
    'public/javascripts/tradeOrders/20161224/tradeOrdersView.js',
    'public/javascripts/tradeOrders/20161224/detailController.js',
    'public/javascripts/tradeOrders/20161224/sdetailController.js'
], function() {
    app.controller('tradeOrderSearchCtrl', [
        '$scope',
        '$route',
        'tradeOrdersService',
        'tradeOrdersView',
        'tradeOrderSearchService',
        'tradeOrderSearchView',
        'tableService',
        '$compile',
        function ($scope,$route,tradeOrdersService,tradeOrdersView, tradeOrderSearchService, tradeOrderSearchView, tableService, $compile) {
            if($route.current.params.orderFrom === 'cockpit'){
                $scope.fromCockpit = true;
            }

            $scope.search = {};

            $scope.orderType = 'SALE';

            tradeOrderSearchView.initCalander($scope);

            var Goods = null;

            $scope.tableModel = {
                tableHeader: ['序号', '订单号','业务单号', '商品信息', '销售方', '采购方', '创建时间','订单状态'],
                tableHeaderSize: ['5%', '15%', '15%', '20%', '10%', '10%','15%','10%'],
                tableBody: [],
                restURL: 'logistics.getTrdOrderList',
                restData: {
                    q: '',
                    refCombos: '',
                    isAsc: false,
                    pageIndex: 1,
                    pageSize: 10,
                    customerId: $scope.search.customerId,
                    goodsId: $scope.goodsId,
                    orderType: $scope.orderType,
                    startTime:$scope.search.startTime,
                    endTime:$scope.search.endTime
                    //orderStatus: $scope.activeTab
                },
                selectNumber: 0,
                selectFlag: false
            };

            $scope.orderGoodsMsg = function (data) {
                var msg = [];
                data.forEach(function (item) {
                    msg.push(item.goodsName);
                });
                return msg.join(',');
            };

            $scope.loadListData = function () {

                if($scope.search.orderNo !== undefined && $scope.search.orderNo !== ""){
                    var temOrderNo = $scope.search.orderNo;
                    for (var i in $scope.search) {
                        $scope.search[i] = '';
                        $scope[i] = '';
                    }
                    $scope.isEnabled = '全部';
                    $scope.purchaserLimit = '全部';
                    $scope.projectLimit = '全部';
                    $scope.goods = '';
                    $('#goods').val('');
                    $('#supplierName').val('');
                    $('#likedusernamelist').val('');
                    $scope.search.orderStatus =undefined;
                    $scope.ordersStatusName = '';
                    $scope.tableModel.restData.pageIndex = 1;
                    $("#startTime").val('');
                    $("#endTime").val('');
                    $scope.search.orderNo = temOrderNo;
                }

                var param = angular.copy($scope.tableModel.restData);
                tradeOrderSearchView.resetKeys(param, $scope.search);

                $.extend(param, $scope.search);
                param.startTime = $("#startTime").val()
                param.endTime = $("#endTime").val()

                param.orderType = $scope.orderType;
                for (var i in param) {
                    if (param[i] === '') {
                        delete param[i];
                    }

                }
                //param.orderStatus = $scope.activeTab;
                param = { urlParams: param };
                tableService.getTable($scope.tableModel.restURL, param, function (data) {
                    //console.log($scope.tableModel.restData, 'restData');
                    $scope.tableModel = tableService.table($scope.tableModel, param, data);
                    $scope.$apply();
                });
            };

            setTimeout(function () {
                $scope.loadListData();
            }, 0);
            $scope.searchBtn = function () {
                $scope.tableModel.restData.pageIndex = 1;
                $scope.loadListData();
            };

            $scope.clearSearch = function () {
                for (var i in $scope.search) {
                    $scope.search[i] = '';
                    $scope[i] = '';
                }
                $scope.isEnabled = '全部';
                $scope.purchaserLimit = '全部';
                $scope.projectLimit = '全部';
                $scope.goods = '';
                $('#goods').val('');
                $('#supplierName').val('');
                $('#likedusernamelist').val('');
                $scope.search.orderStatus =undefined;
                $scope.ordersStatusName = '';
                $scope.tableModel.restData.pageIndex = 1;

                tradeOrderSearchView.initCalander($scope);

                $scope.loadListData();
            };

            $scope.getDetail = function (page, orderNo) {
                tradeOrderSearchView.getTpl(page).then(function (tpl) {
                    $scope.child = $scope.$new();
                    $scope.child.orderNo = orderNo;
                    $scope.presentOrderNo = orderNo;
                    $('#detail').html($compile(tpl)($scope.child));
                });
            };

            if($route.current.params.orderFrom === 'cockpit'){
                var pages = $route.current.params.cockpitPage;
                var orderNos = $route.current.params.orderNo;
                $scope.getDetail(pages,orderNos);
            }

            $scope.goBack = function (fresh) {
                if($route.current.params.orderFrom === 'cockpit'){
                    if($route.current.params.cockpitType === 'sale'){
                        window.location.href = '#/cockpit?from=saleOrder';
                    }else{
                        window.location.href = '#/cockpit?from=purchaseOrder';
                    }
                }else{
                    $scope.child.$destroy();
                    $('#detail').html('');
                    if (fresh) {
                        $scope.loadListData();
                    }
                }
            };

            // 商品下列菜单
            $scope.getSalesGoods = function (q,currentPage) {
                q = q ? q : '';
                var config = {
                    'q': q? q.trim():"",
                    'pageIndex': currentPage? currentPage:1,
                    'pageSize': 10,
                    'isAsc':false,
                    'orderType':$scope.orderType,
                    'sellId':$scope.orderType === 'SALE'? undefined: $scope.search.customerId //供应商Id
                };
                return tradeOrdersService.getTrdGoodsShortList(config);
            };

            $scope.initGoods = function () {

                Goods = selectFactory({
                    data: [],
                    isSearch: true,
                    isSaveInputVal: true,
                    pagination: true,
                    isUsePinyin: true,
                    id: 'goods',
                    showTextField: 'userName',
                    defaultText: '请选择',
                    searchPlaceHoder: '请输入名称或编码',
                    attrTextField: {
                        'ng-value': 'id'
                    },
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.Goods = $scope.getSalesGoods(data, currentPage);
                        angular.forEach($scope.Goods.data, function (value, key) {
                            value.userName = value.name + '(' + value.code + ')';
                        });
                        attachEvent.setData($scope.Goods);
                        $scope.$apply();
                    },
                    attrTextId: function (id) {
                        if (!id) {
                            $scope.search.goodsId = '';
                        } else {
                            $scope.search.goodsId = id;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (userName) {
                        $scope.goods = userName;
                        $scope.$apply();
                    }
                });

                Goods.open();
                $('#goods').val($scope.goods);
            };

            $scope.clearGoods = function () {
                if (!Goods.allData) {
                    return;
                }
                Goods.setData({});
                $('#goods').val('');
                $scope.goods = '';
            };

            $scope.getProjectShortData = function (q, currentPage) {
                q = q ? q : '';
                var config = {
                    project: q ? q.trim() : '',
                    pageIndex: currentPage ? currentPage : 1,
                    pageSize: 10,
                    isAsc: false,
                    includeClosed: true
                };
                return tradeOrderSearchService.trdProjectsShort(config);
            };

            // 项目及编号下拉菜单
            $scope.initProjectShort = function () {
                $scope.projectData = $scope.getProjectShortData();

                angular.forEach($scope.projectData.data, function (value, key) {
                    value.userName = value.name + '(' + value.code + ')';
                });

                var select = selectFactory({
                    data: [],
                    isSearch: true,
                    isSaveInputVal: true,
                    pagination: true,
                    isUsePinyin: true,
                    id: 'projectId',
                    showTextField: 'userName',
                    defaultText: '请选择',
                    searchPlaceHoder: '请输入名称或编码',
                    attrTextField: {
                        'ng-value': 'id'
                    },
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.customerData = $scope.getProjectShortData(data, currentPage);
                        angular.forEach($scope.customerData.data, function (value, key) {
                            value.userName = value.name + '(' + value.code + ')';
                        });
                        attachEvent.setData($scope.customerData);
                        $scope.$apply();
                    },
                    attrTextId: function (id) {
                        if (!id) {
                            $scope.search.projectId = '';
                        } else {
                            $scope.search.projectId = id;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (userName) {
                        $scope.projectId = userName;
                        $scope.$apply();
                    }
                });
                select.open();
                $('#projectId').val($scope.projectId);
            };

            $scope.getCustomerIdData = function (q, currentPage) {
                q = q ? q : '';
                var config = {
                    q: q ? q.trim() : '',
                    pageIndex: currentPage ? currentPage : 1,
                    pageSize: 10,
                    isAsc: false,
                    sortName: '',
                    userType: '2'
                };
                return tradeOrderSearchService.getEnterpriseNameTradeCustomer(config);
            };

            $scope.initCustomerId = function () {
                var select = selectFactory({
                    data: [],
                    isSearch: true,
                    isUsePinyin: true,
                    pagination: true,
                    id: 'customerId',
                    showTextField: 'userName',
                    defaultText: '请选择',
                    searchPlaceHoder: '请输入账户名或编码',
                    attrTextField: {
                        'ng-value': 'id'
                    },
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.customerData = $scope.getCustomerIdData(data, currentPage);
                        angular.forEach($scope.customerData.data, function (value, key) {
                            value.userName = value.name + '(' + value.code + ')';
                        });
                        attachEvent.setData($scope.customerData);
                        $scope.$apply();
                    },
                    attrTextId: function (id) {
                        if (!id) {
                            $scope.search.customerId = '';
                        } else {
                            $scope.search.customerId = id;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        if ($scope.customerId !== name) {
                            $('#likedusernamelist').val('');
                            $scope.likedusernamelist = '';
                        }
                        $scope.customerId = name;
                        $scope.$apply();
                    }
                });

                select.open();
                $('#customerId').val($scope.customerId);

                // setTimeout(function(){
                //     select.setData($scope.customerIdData);
                //     select.open();
                //     $('#customerId').val($scope.customerId);
                // },100);
            };

            // 商品类别列表下拉
            var goodsTypeSelect;
            $scope.initBusinessType = function () {
                if (goodsTypeSelect) {
                    return;
                }
                $scope.goodsTypeData = tradeOrderSearchService.trdGoodTypeList();

                goodsTypeSelect = selectFactory({
                    data: $scope.goodsTypeData,
                    id: 'goodsType',
                    showTextField: 'name',
                    attrTextField: {
                        'ng-value': 'code'
                    },
                    attrTextId: function (code) {
                        if (!code) {
                            // 全部
                            $scope.statusValue = 'AUDITING';
                        } else {
                            $scope.statusValue = code;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        $scope.status = name;
                        $scope.$apply();
                    }
                });
                // goodsTypeSelect.setData($scope.goodsTypeData);
            };

            // 供应商列表下拉菜单
            $scope.getSuppelierData = function (q, currentPage) {
                q = q ? q : '';
                var config = {
                    q: q ? q.trim() : '',
                    pageIndex: currentPage ? currentPage : 1,
                    pageSize: 10,
                    isAsc: false,
                    sortName: ''
                };
                return tradeOrderSearchService.trdSuppelyList(config);
            };

            $scope.initSupplier = function () {
                var select = selectFactory({
                    data: [],
                    isSearch: true,
                    isUsePinyin: true,
                    defaultText: '请选择',
                    pagination: true,
                    id: 'supplierName',
                    showTextField: 'userName',
                    attrTextField: {
                        'ng-value': 'id'
                    },
                    searchPlaceHoder: '请输入名称或编码',
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.suppelierData = $scope.getSuppelierData(data, currentPage);
                        angular.forEach($scope.suppelierData.data, function (value, key) {
                            value.userName = value.name + ' (' + value.code + ')';
                        });
                        attachEvent.setData($scope.suppelierData);
                        $scope.$apply();
                    },
                    attrTextId: function (id) {
                        if (!id) {
                            $scope.search.customerId = '';
                        } else {
                            $scope.search.customerId = id;
                        }
                        // 清空商品信息
                        $scope.clearGoods();
                        $scope.$apply();
                    },
                    attrTextModel: function (userName, list, present) {
                        $scope.supplierName = userName;
                        $scope.$apply();
                    }
                });

                // select.show();
                // select.setData($scope.suppelierData);
                select.open();
                $('#supplierName').val($scope.supplierName);
            };

            $scope.getLikedusernamelistData = function (q, currentPage) {
                q = q ? q : '';
                var config = {
                    q: q ? q.trim() : '',
                    pageIndex: currentPage ? currentPage : 1,
                    pageSize: 10,
                    isAsc: false,
                    sortName: '',
                    userType: 2,
                    refCustomerId: $scope.search.customerId
                };
                return tradeOrderSearchService.trdLikedusernamelist(config);
            };

            $scope.initLikedusernamelist = function () {

                var select = selectFactory({
                    data: [],
                    isSearch: true,
                    isUsePinyin: true,
                    pagination: true,
                    defaultText: '请选择',
                    searchPlaceHoder: '请输入姓名或用户名',
                    id: 'likedusernamelist',
                    showTextField: 'name',
                    attrTextField: {
                        'ng-value': 'id'
                    },
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.suppelierData = $scope.getLikedusernamelistData(data, currentPage);
                        angular.forEach($scope.suppelierData.data, function (value, key) {
                            value.name = value.fullName + ' (' + value.userName + ')';
                        });
                        attachEvent.setData($scope.suppelierData);
                        $scope.$apply();
                    },
                    attrTextId: function (id) {
                        if (!id) {
                            $scope.search.cusUserId = '';
                        } else {
                            $scope.search.cusUserId = id;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (name, list, present) {
                        $scope.likedusernamelist = name;
                        $scope.$apply();
                    }
                });

                select.open();
                $('#likedusernamelist').val($scope.likedusernamelist);
            };

            $scope.showOrderStatus = function () {
                if($scope.orderStatusData){ return; }

                $scope.orderStatusData = tradeOrderSearchService.getTradeOrderStatus();

                var orderStatusEle = selectFactory({
                    data: $scope.orderStatusData,
                    defaultText: Lang.getValByKey("common", 'common_all_tips'),
                    id: "select-orders-status",
                    showTextField: "name",
                    isSaveInputVal: true,
                    attrTextField: {
                        "ng-value": "code"
                    },
                    attrTextId: function(code){
                        $scope.search.orderStatus = code;
                        $scope.$apply();
                    },
                    attrTextModel: function(name){
                        $scope.ordersStatusName = name;
                        $scope.$apply();
                    }
                });
                orderStatusEle.setData($scope.orderStatusData);
                orderStatusEle.open();

            }


        }
    ]);
});