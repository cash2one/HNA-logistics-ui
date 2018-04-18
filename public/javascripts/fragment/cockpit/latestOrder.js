easySpa.require([
	'widget/select',
	'public/common/tableController.js'
], function(){
	app.controller('latestOrderCtrl', [
		'$scope',
		'$route',
		'cockpitService',
		'tableService',
		function($scope, $route, cockpitService, tableService){
	        $scope.$on('changeToIndicator', function(e, res){
                initPage();
            });
	        if($route.current.params){
	            initPage();
            }else{
	            return;
            }
	        function initPage(){
                $scope.logisticsList = [];
                $scope.tradeList = [];
                $scope.saleList = [];
                $scope.purchaseList = [];
                if($route.current.params.from === 'saleOrder'){
                    initSaleData();
                    $scope.tradeList = $scope.saleList;
                    $scope.statesName = '贸易-销售订单';
                    $scope.stateCode = 'tradeSale';
                    $scope.showLogisticsTable = false;
                }else if($route.current.params.from === 'purchaseOrder'){
                    initPurchaseData();
                    $scope.tradeList = $scope.purchaseList;
                    $scope.statesName = '贸易-采购订单';
                    $scope.stateCode = 'tradePurchase';
                    $scope.showLogisticsTable = false;
                }else{
                    initLogisticsData();
                    $scope.statesName = '物流';
                    $scope.stateCode = 'logistics';
                    $scope.showLogisticsTable = true;
                }
            }

            
            //获取物流订单列表
            function initLogisticsData(){
            	$scope.tableModel = {
	            	tableBody: [],
	            	restUrl: 'logistics.getOrdersTable',
	            	restData: {
	            		sort: 'createTime',
	                    pageIndex: 1,
	                    pageSize: 10,
	                    asc: false
	            	}
	            };
            	var params = {
            		urlParams: $scope.tableModel.restData
            	}
            	tableService.getTable($scope.tableModel.restUrl, params, function(res){
            		if(res.errorCode === 0){
            			$scope.tableModel = tableService.table($scope.tableModel, params, res);
            			setTimeout(function(){
            				$scope.$apply();
            			},10)
            		}
            	});
                // cockpitService.getOrdersTable({
                //     urlParams: {
                //         sort: 'createTime',
                //         pageIndex: 1,
                //         pageSize: 10,
                //         asc: false
                //     }
                // }, function(res){
                //     if(res.errorCode === 0){
                //         $scope.logisticsList = res.data;
                //     }
                // });
            };

            //获取销售订单列表
            function initSaleData(){
                cockpitService.getTrdOrderList({
                    urlParams: {
                        sort: 'createTime',
                        orderType: 'SALE',
                        pageIndex: 1,
                        pageSize: 10,
                        asc: false
                    }
                }, function(res){
                    if(res.errorCode === 0){
                        $scope.saleList = res.data;
                    }
                });
            };

            //获取采购订单列表
            function initPurchaseData() {
                cockpitService.getTrdOrderList({
                    urlParams: {
                        sort: 'createTime',
                        orderType: 'PURCHASE',
                        pageIndex: 1,
                        pageSize: 10,
                        asc: false
                    }
                }, function(res){
                    if(res.errorCode === 0){
                        $scope.purchaseList = res.data;
                    }
                });
            }

			initStateSelect();
			function initStateSelect(){
				var selectOption = {
					data: [
						{
							name: '物流',
							code: 'logistics'
						},
                        {
                            name: '贸易-销售订单',
                            code: 'tradeSale'
                        },
                        {
							name: '贸易-采购订单',
							code: 'tradePurchase'
						}
					]
				};
				var stateEle = selectFactory({
					data: selectOption,
					id: 'states',
					defaultText: null,
					attrTextModel: function(name, data, currentData){
						if(currentData.code === 'logistics'){
                            if($scope.logisticsList.length < 1){
                                initLogisticsData();
                            }
                            $scope.statesName = '物流';
                            $scope.stateCode = 'logistics';
                            $scope.showLogisticsTable = true;
						}else if(currentData.code === 'tradeSale'){
                            if($scope.saleList.length < 1){
                                initSaleData();
                            }
                            $scope.statesName = '贸易-销售订单';
                            $scope.stateCode = 'tradeSale';
                            $scope.showLogisticsTable = false;
                            $scope.tradeList = $scope.saleList;
                        }else{
                            if($scope.purchaseList.length < 1){
                                initPurchaseData();
                            }
                            $scope.statesName = '贸易-采购订单';
                            $scope.stateCode = 'tradePurchase';
                            $scope.showLogisticsTable = false;
                            $scope.tradeList = $scope.purchaseList;
                        }
						$scope.$apply();
					}
				});
			};


            $scope.orderGoodsMsg = function(data){
                var title = '';
                title += '名称: ' + data.goodsName + '\n';
                if(data.goodsNum){
                    title += '数量: ' + data.goodsNum + ' ' + data.goodsUnit + '\n';
                }else{
                    title += '数量: ' + data.minLimit + ' - ' + data.maxLimit + ' ' + data.goodsUnit + '\n';
                }
                title += '单价: ' + data.goodsPrice + ' ' + data.goodsCurrencyType;

                return title;
            };

			//跳转至物流订单页面
			$scope.jumpToLogisticsOrder = function(orderNum, orderStatus){
				window.location.href = '#/confirmOrder?orderNum=' + orderNum + '&orderStatus=' + orderStatus + '&from=orderSearch&orderFrom=cockpit';
			};

			//跳转至贸易订单页面
			$scope.jumpToTradeOrder = function(item){
                var orderNo = item.orderNo;
                var page;
			    if(item.orderType === "SALE"){
                    page = item.orderStatusCode === '1' ? 'detail' : 'sdetail';
                    window.location.href = '#/tradeOrderSearch?orderFrom=cockpit&cockpitType=sale&cockpitPage='+page+'&orderNo=' + orderNo;
                }else{
                    page = item.orderStatusCode === '5' ? 'sdetail' : 'detail';
                    window.location.href = '#/tradeOrders?module=trade&action=purchase&orderFrom=cockpit&cockpitPage='+page+'&orderNo=' + orderNo;
                }
			};
	}]);
});