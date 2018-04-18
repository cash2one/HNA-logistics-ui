easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'public/common/tableController.js',
    'widget/select',
    'widget/searchBox',
    'public/common/calander.js'
], function () {
    app.controller('orderSearchCtrl', ['$scope', 'orderSearchService', 'orderSearchView', 'tableService',
        function ($scope, orderSearchService, orderSearchView, tableService) {

            $scope.from = easySpa.queryUrlValByKey("from");

            $.extend($scope, {
                orderSearch: {},
                initCalander: function () {
                    orderSearchView.initCalander($scope);
                },
                initTable: function () {
                    orderSearchView.initTable($scope);
                },
                bindEvent: function () {
                    orderSearchView.bindEvent($scope);
                }
            });

            $scope.showDetail = function (orderNo, orderStatus) {
                window.location.href = '#/confirmOrder?orderNum=' + orderNo + '&orderStatus=' + orderStatus + '&from=orderSearch';
            };

            $scope.showFlowProcess = function (waybillNo, orderStatus) {

                window.location.href = '#/ordersStatus?orderNum=' + waybillNo + '&orderStatus=' + orderStatus + '&from=orderSearch';
            };

            function resetKeys(result, obj) {
                for (var i in obj) delete result[i];
            }

            $scope.search = function () {
                if(!$scope.orderProduct){
                    $scope.orderProductUid = '';
                }
                $scope.tableModel.restData.productUid = $scope.orderProductUid;
                var param = angular.copy($scope.tableModel.restData);
                resetKeys(param, $scope.orderSearch);
                $.extend(param, $scope.orderSearch);

                var config = {
                    'urlParams': param
                };
                tableService.getTable($scope.tableModel.restURL, config, function (data) {
                    if (data.errorCode === 0) {
                        $scope.tableModel = tableService.table($scope.tableModel, config, data);
                        var height = $('.g-orders').height() - 314;
                        setTimeout(function () {
                            $('.table-container tbody').slimscroll({'height': height});
                            $(window).resize(function () {
                                height = $('.g-orders').height() - 314;
                                $('.table-container tbody').slimscroll({'height': height});
                            });
                        }, 10);
                    }
                });
            };


            $scope.initCalander();//初始化日历组件
            $scope.initTable();//初始化表格
            $scope.bindEvent();//初始化事件绑定
            if ($scope.from === 'ordersStatus' || $scope.from === 'orderDetail') {
                $scope.search();
            }


            $scope.clearCondition = function () {
                $scope.tableModel.restData = {
                    'pageIndex': 1,
                    'pageSize': 10,
                    'sort': 'createTime',
                    'productUid': '',
                    'asc': false
                };

                for (var i in $scope.orderSearch) {
                    $scope.orderSearch[i] = undefined;

                }
                $scope.orderCustomerName = '';
                $scope.orderProduct = '';
                $scope.orderProductUid = '';
                $scope.initCalander();


                $('#select-orders-status').val("");
                $scope.search();

            };

            function rechangeProductData(data){
                data.forEach(function(value){
                    value.name += '('+ value.code +')';
                });
                return data
            }
            $scope.getProduct = function () {
                $scope.contentList = orderSearchService.getProductAllData({'urlParams': {'isHot': true}});
                $scope.navItem = orderSearchService.getProductNavItem();
                var productBox = new SearchBox.init({
                    inputId:"select-product",
                    searchData:[],
                    defaultText: '请选择',
                    tip:'请输入名称或编码',
                    navItem: $scope.navItem.data,
                    tabIndex:'热门',
                    contentList: rechangeProductData($scope.contentList.data),
                    toggleTab: function(currentPage,index){
                        this.tabIndex = index;
                        var config = {
                            'urlParams': {
                                'isHot':false,
                                'pageIndex': currentPage || 1,
                                'pageSize': 10,
                                'capital': index
                            }
                        };
                        if(index == "热门"){
                            config.urlParams.isHot = true;
                            config.urlParams.capital = '';
                        }
                        if(index == "其他"){
                            config.urlParams.isHot = false;
                            config.urlParams.capital = '_';
                        }
                        var result = orderSearchService.getProductAllData(config);
                        return {data:rechangeProductData(result.data),pagination:result.pagination}
                    },
                    onSearchValueChange:function(data,currentPage) {
                        var config = {
                            'urlParams': {
                                'q':data,
                                'isHot':false,
                                'pageIndex': currentPage || 1,
                                'pageSize': 10,
                                'capital': ''
                            }
                        };
                        var result = orderSearchService.getProductAllData(config);
                        return {data:rechangeProductData(result.data),pagination:result.pagination};
                    },
                    attrTextModel: function (name, data) {
                        $scope.orderProduct = name || '';
                        $scope.orderProductUid = data.uid || '';
                        $scope.$apply();
                    }
                });
            };
            $scope.getProduct();
        }]
    )
});
