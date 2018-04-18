easySpa.require([
    'widget/slimscroll',
    'widget/select',
    'public/javascripts/product/20161224/productRoute.js',
    'public/common/tableController.js',
    'widget/prompt',
    'widget/select'
], function () {
    app.controller('productCtrl', [
        '$scope',
        'productService',
        'productView',
        'tableService',
        '$timeout',
        function ($scope, productService, productView, tableService, $timeout) {
            var productGroup2Ele;
            $scope.states = {
                data: [
                    {
                        id: -1,
                        name: Lang.getValByKey('product', 'product_state_all')
                    },
                    {
                        id: 1,
                        name: Lang.getValByKey('product', 'product_state_draft')
                    },
                    {
                        id: 2,
                        name: Lang.getValByKey('product', 'product_state_unAudit')
                    },
                    {
                        id: 3,
                        name: Lang.getValByKey('product', 'product_state_audit')
                    },
                    {
                        id: 4,
                        name: Lang.getValByKey('product', 'product_status_online')
                    },
                    {
                        id: 5,
                        name: Lang.getValByKey('product', 'product_status_offline')
                    }
                ]
            };
            $scope.viewButton = {
                isTabList: false,
                isShowOperAreaLine: false,
                isShowCheckBox: true
            };
            function setScroll() {
                $('.table-container tbody').slimScroll({
                    height: $('.content-main').height() - 250
                });
            }
            function loadProductList() {
                if (typeof $scope.tableModel.restData.status === 'undefined') {
                    $scope.tableModel.restData.status = 1;
                }
                var params = {
                    urlParams: $scope.tableModel.restData
                };
                $scope.q = $scope.productName;
                tableService.getTable($scope.tableModel.restURL, params, function (data) {
                    $scope.q = $scope.tableModel.restData.q;
                    if (data.errorCode === 0) {
                        $scope.tableModel = tableService.table($scope.tableModel, params, data);
                        setTimeout(function () {
                            setScroll();
                            $(window).on('resize', setScroll);
                            $scope.$apply();
                            $('.table-box').focus();
                            productView.unlockBtn();
                        }, 100);
                    }
                });
            }
            $scope.getTabType = function () {
                var type = -1;
                var tabActiveEle = $('.tab-active');
                if ($('.tab-list').css('display') != 'none' && tabActiveEle.length > 0) {
                    type = tabActiveEle.attr('data-type');
                }
                return type;
            };
            $scope.initTable = function () {
                $scope.tableModel = {
                    tableHeader: [
                        Lang.getValByKey('common', 'common_thead_number'),
                        Lang.getValByKey('product', 'product_product_name'),
                        Lang.getValByKey('product', 'product_code'),
                        Lang.getValByKey('product', 'product_group'),
                        Lang.getValByKey('product', 'product_good_type'),
                        Lang.getValByKey('product', 'product_introduce'),
                        Lang.getValByKey('product', 'product_service_state')
                    ],
                    tableHeaderSize: [
                        '5%',
                        '15%',
                        '15%',
                        '15%',
                        '15%',
                        '15%',
                        '15%'
                    ],
                    tableBody: [],
                    restURL: 'logistics.queryProductList',
                    restData: {
                        q: '',
                        pageIndex: 1,
                        pageSize: 10,
                        orderby: 'createtime'
                    },
                    selectNumber: 0,
                    selectFlag: false
                };
                loadProductList();
                $scope.$watch('tableModel.tableBody', function (newData, oldData) {
                    for (var k = 0; k < newData.length; k++) {
                        var cargos = newData[k].cargos;
                        var cargoStr = [];
                        for (var index = 0; index < cargos.length; index++) {
                            if (cargos[index].cargoTypeName) {
                                cargoStr.push(cargos[index].cargoTypeName);
                            }
                        }
                        newData[k].goodsType = cargoStr.join(',');
                    }
                });
            };
            $scope.bindEvent = function () {
                $scope.add = function () {
                    var from = easySpa.queryUrlValByKey('module');
                    var type = $scope.getTabType();
                    location.href = '#/addProduct?' + '&from=' + from + '&type=' + type;
                };
                $scope.search = function () {
                    if ($scope.statusId == -1) {
                        var from = easySpa.queryUrlValByKey('module');
                        if (from == 'approval') {
                            $scope.tableModel.restData.status = 3;
                        } else {
                            $scope.tableModel.restData.status = -1;
                        }
                        $scope.tableModel.restData.includeAllAudit = true;
                    } else {
                        $scope.tableModel.restData.includeAllAudit = false;
                        $scope.tableModel.restData.status = $scope.statusId;
                    }
                    $scope.tableModel.restData.cargoType = $scope.goodsTypeId;
                    $scope.tableModel.restData.topGrade = $scope.productGroup1Id;
                    $scope.tableModel.restData.secondGrade = $scope.productGroup2Id;
                    $scope.tableModel.restData.q = $scope.productName;
                    $scope.tableModel.restData.pageIndex = 1;
                    loadProductList();
                };
                $scope.editProduct = function (uid, id) {
                    var type = $scope.getTabType();
                    var from = easySpa.queryUrlValByKey('module');
                    location.href = '#/addProduct?uid=' + uid + '&id=' + id + '&type=' + type + '&from=' + from;
                };
                $scope.resetData = function () {
                    var type = $scope.getTabType();
                    $scope.tableModel.restData.status = '';
                    $scope.tableModel.restData.cargoType = '';
                    $scope.tableModel.restData.topGrade = '';
                    $scope.tableModel.restData.secondGrade = '';
                    $scope.tableModel.restData.q = '';
                    $scope.goodsType = '';
                    $scope.goodsTypeId = '';
                    $scope.productGroup1Id = '';
                    $scope.productGroup2Id = '';
                    $scope.productGroup1 = '';
                    $scope.productGroup2 = '';
                    $scope.productName = '';
                    $scope.state = Lang.getValByKey('product', 'product_state_draft'); // 默认为草稿状态
                    $scope.statusId = 1;
                    // $scope.showStatus = false;
                    if (type == 1) {
                        $scope.state = Lang.getValByKey('product', 'product_state_unAudit');
                        $scope.statusId = 2;
                    } else if (type == 2) {
                        $scope.state = Lang.getValByKey('product', 'product_state_audit');
                        $scope.statusId = 3;
                    }
                    $scope.search();
                };
                $scope['delete'] = function () {
                    if ($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {
                        var param = [];
                        var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                        if (!oldData.length) {
                            accountView.promptBox({
                                isDelay: true,
                                contentDelay: Lang.getValByKey('product', 'product_prompt_delay_tip'),
                                type: 'errer',
                                manualClose: true
                            });
                            return false;
                        }
                        // 组织数据
                        angular.forEach(oldData, function (val) {
                            param.push(val.uid);
                        });
                        $(document).promptBox({
                            title: Lang.getValByKey('common', 'common_prompt_title'),
                            type: 'warning',
                            content: {
                                tip: Lang.getValByKey('product', 'product_prompt_delete_tip')
                            },
                            operation: [
                                {
                                    type: 'submit',
                                    description: Lang.getValByKey('common', 'common_page_delete'),
                                    application: 'delete',
                                    operationEvent: function () {
                                        productService.deleteProduct(param, function (data) {
                                            if (data.errorCode === 0) {
                                                $(document).promptBox({
                                                    isDelay: true,
                                                    contentDelay: data.msg,
                                                    type: 'success',
                                                    time: 3000
                                                });
                                                $(document).promptBox('closePrompt');
                                                // 更新table表数据
                                                loadProductList();
                                            } else {
                                                $(document).promptBox({
                                                    isDelay: true,
                                                    contentDelay: data.msg,
                                                    type: 'errer',
                                                    manualClose: true
                                                });
                                            }
                                        });
                                    }
                                }
                            ]
                        });
                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: Lang.getValByKey('product', 'product_prompt_delay_tip'),
                            type: 'errer',
                            manualClose: true
                        });
                    }
                };
                $scope.showConfirmWindow = function (callback, description) {
                    if ($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {
                        if (!description) {
                            description = Lang.getValByKey('common', 'common_pagination_confirm');
                        }
                        $(document).promptBox({
                            title: Lang.getValByKey('common', 'common_prompt_title'),
                            type: 'success',
                            content: {
                                tip: description
                            },
                            operation: [
                                {
                                    type: 'submit',
                                    description: Lang.getValByKey('common', 'common_pagination_confirm'),
                                    application: 'confirm',
                                    operationEvent: function () {
                                        $(document).promptBox('closePrompt');
                                        callback();
                                    }
                                }
                            ]
                        });
                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: Lang.getValByKey('product', 'product_prompt_delay_tip'),
                            type: 'errer',
                            manualClose: true
                        });
                    }
                };
                $scope.verify = function () {
                    $scope.showConfirmWindow(function () {
                        var param = [];
                        var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                        if (!oldData.length) {
                            accountView.promptBox({
                                isDelay: true,
                                contentDelay: Lang.getValByKey('product', 'product_prompt_delay_tip'),
                                type: 'errer',
                                manualClose: true
                            });
                            return false;
                        }
                        // 组织数据
                        angular.forEach(oldData, function (val) {
                            param.push(val.uid);
                        });
                        productService.submitProducts(param, function (data) {
                            if (data.errorCode === 0) {
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: data.msg,
                                    type: 'success',
                                    time: 3000
                                });
                                $(document).promptBox('closePrompt');
                                // 更新table表数据
                                loadProductList();
                            } else {
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: data.msg,
                                    type: 'errer',
                                    manualClose: true
                                });
                            }
                        });
                    }, '确定提交已选产品？');
                };
                $scope.showCheckStream = function (uid, name) {
                    var from = easySpa.queryUrlValByKey('module');
                    var type = $scope.getTabType();
                    window.location.href = '#/checkStream?uid=' + uid + '&page=product' + '&from=' + from + '&name=' + name + '&type=' + type;
                };
            };
            $scope.initSelect = function () {
                productService.getGoods(function (result) {
                    selectFactory({
                        data: result,
                        id: 'goods-type',
                        attrTextModel: function (name, data, currentData) {
                            if (name) {
                                $scope.goodsTypeId = currentData.id;
                            } else {
                                $scope.goodsTypeId = '';
                            }
                            $scope.goodsType = name;
                            $scope.$apply();
                        }
                    });
                });
                productService.queryProductGroup({ async: true }, function (data) {
                    selectFactory({
                        data: data,
                        id: 'product-group1',
                        defaultText: '全部',
                        attrTextModel: function (name, data, currentData) {
                            $('#product-group2').val('');
                            delete $scope.productGroup2;
                            delete $scope.productGroup2Id;
                            productGroup2Ele.clearData();
                            if (!name) {
                                delete $scope.productGroup1;
                                delete $scope.productGroup1Id;
                                // productGroup2Ele = null;
                                return;
                            }
                            var id = currentData.id;
                            $scope.productGroup1 = name;
                            $scope.productGroup1Id = currentData.id;
                            productService.queryProductGroup({ parentId: id }, function (result) {
                                productGroup2Ele.setData(result);
                            });
                            $scope.$apply();
                        }
                    });
                });
                productGroup2Ele = selectFactory({
                    data: [],
                    id: 'product-group2',
                    defaultText: '全部',
                    attrTextModel: function (name, data, currentData) {
                        $scope.productGroup2 = name;
                        $scope.productGroup2Id = currentData.id;
                        $scope.$apply();
                    }
                });
                $scope.states.data.forEach(function (item) {
                    if (item.name === '草稿') {
                        $scope.state = item.name;
                        $scope.statusId = item.id;
                    }
                });
                $timeout(function () {
                    if ($scope.viewButton.isTabList) {
                        $scope.states.data = $scope.states.data.filter(function (item) {
                            if (item.id != 1 && item.id != 2) {
                                return item;
                            }
                        });
                    }
                    selectFactory({
                        data: $scope.states,
                        id: 'service-state',
                        defaultText: '',
                        attrTextModel: function (name, data, currentData) {
                            $scope.state = name;
                            $scope.statusId = currentData.id;
                            $scope.$apply();
                        }
                    });
                }, 0);
            };
            $scope.initPageData = function () {
                var from = easySpa.queryUrlValByKey('module');
                if (from == 'new') {
                    $scope.showSelectStatus = true;
                } else {
                    $scope.showSelectStatus = false;
                }
            };
    
            var id = easySpa.queryUrlValByKey('id');
            var uid = easySpa.queryUrlValByKey('uid');
            if (id) {
                $scope.initPageData();
                $scope.initTable();
                controller.init($scope, productService, tableService); // 初始化个性业务
                var type = $scope.getTabType();
                var from = easySpa.queryUrlValByKey('module');
                var orderNo = easySpa.queryUrlValByKey('orderNo');
                location.href = '#/addProduct?uid=' + uid + '&id=' + id + '&type=' + type + '&from=' + from + '&orderNo=' + orderNo;
            }
    
            function initPublic() {
                $scope.initPageData();
                $scope.initTable();
                $scope.bindEvent();
                $scope.initSelect();
                productView.bindEvent();
            }
            initPublic(); // 初始化通用业务
            controller.init($scope, productService, tableService); // 初始化个性业务
        }
    ]);
});
