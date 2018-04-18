easySpa.require(['public/common/tableController.js', 'widget/select', 'widget/prompt', 'public/javascripts/commodity/20161224/detailController.js'], function () {
    var isdone = false;
    app.controller('commodityCtrl', [
        '$scope',
        'commodityService',
        'commodityView',
        'tableService',
        '$compile',
        function ($scope, commodityService, commodityView, tableService, $compile) {
            if (isdone) {
                return;
            }
            isdone = true;

            $scope.search = {
                name: '',
                enabled: '',
                goodsTypeId: '',
                projectIds: '',
                projectLimit: '',
                purchaserCustomerCodes: '',
                purchaserLimit: '',
                supplierId: '',
            };

            $scope.tableModel = {
                tableHeader: ['序号', '商品名称', '商品类别', '商品代码', '项目', '采购企业', '供应商', '启用状态'],
                tableHeaderSize: ['5%', '5%', '8%', '8%', '8%', '8%', '8%', '8%', '8%', '13%', '13%', '8%'],
                tableBody: [],
                restURL: 'logistics.trdGoodList',
                restData: {
                    q: '',
                    refCombos: '',
                    isAsc: false,
                    pageIndex: 1,
                    pageSize: 10,
                },
                selectNumber: 0,
                selectFlag: false,
            };

            $scope.loadListData = function () {
                var param = angular.copy($scope.tableModel.restData);
                commodityView.resetKeys(param, $scope.search);
                $.extend(param, $scope.search);
                $scope.searchName = $scope.search.name;
                for (var i in param) {
                    if (param[i] === '') {
                        delete param[i];
                    }
                }
                if (!param.purchaserLimit || param.purchaserLimit === '0') {
                    delete param.purchaserCustomerCodes;
                }
                if (!param.projectLimit || param.projectLimit === '0') {
                    delete param.projectIds;
                }
                param = { urlParams: param };
                tableService.getTable($scope.tableModel.restURL, param, function (data) {
                    $scope.tableModel = tableService.table($scope.tableModel, param, data);
                });
            };

            $scope.goodsTypeIdSelect = function () {
                commodityService.trdGoodTypeList().then(function (data) {
                    commodityView.goodsTypes(
                        data,
                        $scope,
                        {
                            name: $scope.goodsTypeId,
                            id: $scope.search.goodsTypeId,
                        },
                        function (name, id) {
                            $scope.goodsTypeId = name;
                            $scope.search.goodsTypeId = id;
                        }
                    );
                });
            };

            $scope.loadListData();

            $scope.searchList = function () {
                $scope.tableModel.restData.pageIndex = 1;
                $scope.loadListData();
            };

            $scope.clearSearch = function () {
                for (var i in $scope.search) {
                    if ($scope.search.hasOwnProperty(i)) {
                        $scope.search[i] = '';
                        $scope[i] = '';
                    }
                }
                $scope.searchName = '';
                $scope.isEnabled = '全部';
                $scope.purchaserLimit = '全部';
                $scope.projectLimit = '全部';
                $scope.tableModel.restData.pageIndex = 1;
                $scope.loadListData();
            };

            $scope.enabledGoods = function (type) {
                var ids = getSelectIds();
                var msg = '确定启用该商品?';
                if (!ids.length) {
                    commodityView.promptBox({ msg: '请先选择数据!' });
                    return;
                }
                if (!type) {
                    msg = '确定停用该商品?';
                }
                commodityView.promptMidBox('', { msg: msg }, '', function () {
                    commodityService.enabledGoods({ ids: ids, isEnabled: type }).then(function (res) {
                        commodityView.promptBox(res);
                        if (res.errorCode === 0) {
                            $scope.loadListData();
                        }
                    });
                });
            };

            $scope.showMore = function (data, key) {
                if (!data) {
                    return;
                }
                var html = [];
                data.forEach(function (item) {
                    html.push(item[key]);
                });
                return html.join(',');
            };

            commodityView.setTableHeight();

            $scope.getDetail = function (id) {
                commodityView.getTpl('detail').then(function (tpl) {
                    $scope.child = $scope.$new();
                    $scope.child.id = id;
                    $('#detail').html($compile(tpl)($scope.child));
                });
            };

            $scope.goBack = function () {
                $scope.child.$destroy();
                $('#detail').html('');
                $scope.loadListData();
            };

            $scope.deleteGoods = function () {
                var ids = getSelectIds();
                if (!ids.length) {
                    commodityView.promptBox({ msg: '请先选择数据!' });
                    return;
                }
                commodityView.promptMidBox('', { msg: '确定删除该商品?' }, '', function () {
                    commodityService.deleteOneGoods(ids, function (res) {
                        commodityView.promptBox(res);
                        if (res.errorCode === 0) {
                            $scope.loadListData();
                            $scope.$apply();
                        }
                    });
                });
            };

            function getSelectIds() {
                var ids = [];
                var data = tableService.getSelectTable($scope.tableModel.tableBody);
                data.forEach(function (item) {
                    ids.push(item.id);
                });
                return ids;
            }

            $scope.initEnabledSelect = function () {
                var data = {
                    data: [{ name: '已启用', code: true }, { name: '已停用', code: false }],
                };

                selectFactory({
                    data: data,
                    defaultText: '全部',
                    id: 'isEnabled',
                    showTextField: 'name',
                    attrTextField: {
                        'ng-value': 'code',
                    },
                    attrTextId: function (code) {
                        if (code === 'true') {
                            $scope.search.isEnabled = true;
                        } else if (code === 'false') {
                            $scope.search.isEnabled = false;
                        } else {
                            $scope.search.isEnabled = '';
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        if (name) {
                            $scope.isEnabled = name;
                        } else {
                            $('#isEnabled').val('全部');
                        }
                        $scope.$apply();
                    },
                });
                $scope.isEnabled = '全部';
            };

            $scope.initEnabledSelect();

            // 采购限制下拉

            $scope.initPurchaseLimit = function () {
                var data = {
                    data: [{ name: '是', code: '1' }, { name: '否', code: '0' }],
                };
                selectFactory({
                    data: data,
                    defaultText: '全部',
                    id: 'purchaserLimit',
                    showTextField: 'name',
                    attrTextField: {
                        'ng-value': 'code',
                    },
                    attrTextId: function (code) {
                        if (code === 'undefined') {
                            // 全部
                            $scope.search.purchaserLimit = '';
                        } else {
                            $scope.search.purchaserLimit = code;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        if (name) {
                            $scope.purchaserLimit = name;
                        } else {
                            $scope.purchaserLimit = '全部';
                        }
                        $scope.$apply();
                    },
                });
                $scope.purchaserLimit = '全部';
            };
            $scope.initPurchaseLimit();

            // 项目限制
            $scope.initProjectLimit = function () {
                var data = {
                    data: [{ name: '是', code: '1' }, { name: '否', code: '0' }],
                };
                selectFactory({
                    data: data,
                    defaultText: '全部',
                    id: 'projectLimit',
                    showTextField: 'name',
                    attrTextField: {
                        'ng-value': 'code',
                    },
                    attrTextId: function (code) {
                        if (code === 'undefined') {
                            // 全部
                            $scope.search.projectLimit = '';
                        } else {
                            $scope.search.projectLimit = code;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        if (name) {
                            $scope.projectLimit = name;
                        } else {
                            $scope.projectLimit = '全部';
                        }
                        $scope.$apply();
                    },
                });
                $scope.projectLimit = '全部';
            };
            $scope.initProjectLimit();

            $scope.formatArr = function (data) {
                var str = [];
                data.forEach(function (item) {
                    str.push(item.name);
                });
                return str.join(',');
            };

            // 商品类别列表下拉
            var goodsTypeSelect;
            $scope.initBusinessType = function () {
                if (goodsTypeSelect) {
                    return;
                }

                goodsTypeSelect = selectFactory({
                    data: [],
                    id: 'goodsType',
                    showTextField: 'name',
                    attrTextField: {
                        'ng-value': 'code',
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
                    },
                });
                goodsTypeSelect.setData($scope.goodsTypeData);
            };

            // 采购企业下拉菜单
            $scope.getPurchaseData = function (q, currentPage) {
                q = q.length ? q.trim() : '';
                var config = {
                    q: q,
                    pageIndex: currentPage ? currentPage : 1,
                    pageSize: 10,
                    isAsc: false,
                    sortName: '',
                    userType: 2,
                    suppelierCode: '',
                };
                return commodityService.getCustomerShortGoods(config);
            };
            $scope.initPurchaseCus = function () {
                var select = selectFactory({
                    data: [],
                    isSearch: true,
                    isUsePinyin: true,
                    multipleSign: ',',
                    defaultText: '请选择',
                    searchPlaceHoder: '请输入企业名称或编码',
                    id: 'purchaserCustomerCodes',
                    showTextField: 'userName',
                    attrTextField: {
                        'ng-value': 'code',
                    },
                    pagination: true,
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.customerData = $scope.getPurchaseData(data, currentPage);
                        angular.forEach($scope.customerData.data, function (value) {
                            value.userName = value.userName + '(' + value.code + ')';
                        });
                        attachEvent.setData($scope.customerData);
                        $scope.$apply();
                    },
                    attrTextId: function (code) {
                        if (!code) {
                            $scope.search.purchaserCustomerCodes = '';
                        } else {
                            $scope.search.purchaserCustomerCodes = $scope.search.purchaserCustomerCodes ? $scope.search.purchaserCustomerCodes + ',' + code : code;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (userName) {
                        $scope.purchaserCustomerCodes = userName;
                        $scope.$apply();
                    },
                });
                select.open();
                $('#purchaserCustomerCodes').val($scope.purchaserCustomerCodes);
            };

            // 项目多选下拉菜单
            $scope.getProjectShortData = function (q, currentPage) {
                q = q.length ? q.trim() : '';
                var config = {
                    project: q,
                    pageIndex: currentPage ? currentPage : 1,
                    pageSize: 10,
                    isAsc: false,
                    sortName: '',
                };
                return commodityService.trdProjectsShort(config);
            };
            $scope.initProjectShort = function () {
                var select = selectFactory({
                    data: [],
                    isSearch: true,
                    isUsePinyin: true,
                    defaultText: '请选择',
                    multipleSign: ',',
                    id: 'projectIds',
                    showTextField: 'userName',
                    searchPlaceHoder: '请输入项目名称或编码',
                    attrTextField: {
                        'ng-value': 'id',
                    },
                    pagination: true,
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.customerData = $scope.getProjectShortData(data, currentPage);
                        if ($scope.customerData.data.length) {
                            angular.forEach($scope.customerData.data, function (value) {
                                value.userName = value.name + '(' + value.code + ')';
                            });
                            attachEvent.setData($scope.customerData);
                        } else {
                            attachEvent.setData({ data: [] });
                        }
                        $scope.$apply();
                    },
                    attrTextId: function (id) {
                        if (!id) {
                            $scope.search.projectIds = '';
                        }
                        if (id && !$scope.search.projectIds.includes(id)) {
                            $scope.search.projectIds = id + ',' + $scope.search.projectIds;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (userName) {
                        var selectList = userName.split('，').map(function (item) {
                            return item.substring(item.indexOf('(') + 1, item.indexOf(')'));
                        });
                        var projectIdList = [];
                        for (var i = 0, iLength = selectList.length; i < iLength; i++) {
                            for (var j = 0, jLength = $scope.customerData.data.length; j < jLength; j++) {
                                if ($scope.customerData.data[j].code === selectList[i]) {
                                    projectIdList.push($scope.customerData.data[j].id);
                                }
                            }
                        }
                        $scope.search.projectIds = projectIdList.join(',');
                        $scope.projectIds = userName;
                        $scope.$apply();
                    },
                });
                select.open();
                $('#projectIds').val($scope.projectIds);
            };

            // 供应商列表下拉菜单
            $scope.getSellData = function (q, currentPage) {
                q = q.length ? q.trim() : '';
                var config = {
                    q: q,
                    pageIndex: currentPage ? currentPage : 1,
                    pageSize: 10,
                    isAsc: false,
                    sortName: '',
                    isIncludePlatform: 1,
                };
                return commodityService.trdSuppelyList(config);
            };
            $scope.initSupplier = function () {
                var select = selectFactory({
                    data: [],
                    isSearch: true,
                    isUsePinyin: true,
                    defaultText: '请选择',
                    id: 'supplier',
                    showTextField: 'userName',
                    searchPlaceHoder: '请输入供应商名称或编码',
                    attrTextField: {
                        'ng-value': 'id',
                    },
                    pagination: true,
                    closeLocalSearch: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        $scope.suppelierData = $scope.getSellData(data, currentPage);

                        angular.forEach($scope.suppelierData.data, function (value) {
                            value.userName = value.name + ' (' + value.code + ')';
                        });
                        attachEvent.setData($scope.suppelierData);
                        $scope.$apply();
                    },
                    attrTextId: function (id) {
                        if (!id) {
                            $scope.search.supplier = '';
                        } else {
                            $scope.search.supplier = id;
                        }
                        $scope.$apply();
                    },
                    attrTextModel: function (userName) {
                        $scope.supplier = userName;
                        $scope.$apply();
                    },
                });
                select.open();
            };
        },
    ]);
});

// Array.includes polyfill
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (len === 0) {
                return false;
            }
            var n = fromIndex | 0;
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                if (o[k] === searchElement) {
                    return true;
                }
                k++;
            }
            return false;
        },
    });

}
