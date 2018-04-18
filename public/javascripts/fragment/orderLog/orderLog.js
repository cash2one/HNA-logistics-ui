easySpa.require([
    'public/common/tableController.js',
    'widget/prompt'
], function(){
    app.controller('orderLogCtrl', ['$scope', 'tableService', function($scope, tableService){
    	//初始化状态
    	$scope.nestLogDetail = false;

        $scope.logTable = {
            'tableHeader': [
                Lang.getValByKey("common", "common_thead_number"),
                Lang.getValByKey("confirmOrder", "confirmOrder_operationTime"),
                Lang.getValByKey("confirmOrder", "confirmOrder_event"),
                Lang.getValByKey("confirmOrder", "confirmOrder_operator"),
                Lang.getValByKey("confirmOrder", "confirmOrder_operatorSource"),
                Lang.getValByKey("confirmOrder", "confirmOrder_page_detail_orderStatus"),
                '支付状态'
            ],
            'tableBody': [],
            'restURL': 'logistics.getOrderLogList',
            'restData': {

            },
            'selectNumber': 0,
            'selectFlag': false
        };

        $scope.detailTable = {
            'tableHeader': [
                Lang.getValByKey("common", "common_thead_number"),
                Lang.getValByKey("confirmOrder", "confirmOrder_modifyContent")
            ],
            'tableTitle': '',
            'tableBody': [],
            'restURL': 'logistics.getOrderLogDetail',
            'restData': {

            },
            'selectNumber': 0,
            'selectFlag': false
        };

    	$scope.$on('operatelog', function(e, orderId){
            //获取操作日志详情
            var listConfig = {
                'seatParams':{
                    'orderId': orderId
                }
            };
            tableService.getTable($scope.logTable.restURL, listConfig, function(data){
                if(data.errorCode === 0){
                    $scope.logTable.tableBody = data.data;
                }
            });
        });

        $scope.showDetail = function(logId, logName){
            var detailConfig = {
                'seatParams': {
                    'logId': logId
                }
            };
            tableService.getTable($scope.detailTable.restURL, detailConfig, function(data){
                $scope.detailTable.tableBody = [];
                if(data.errorCode === 0){
                    if(data.data.recordTxtList === null && data.data.upDataList.length === 0){
                        return;
                    }else{
                        $scope.nestLogDetail = true;
                        if(data.data.recordTxtList === null){
                            $scope.showRecordTxt = false;
                            $scope.indexNum = 1;
                        }else{
                            $scope.showRecordTxt = true;
                            $scope.indexNum = data.data.recordTxtList.length + 1;
                        }
                        $scope.detailTable.tableTitle = logName;
                        $scope.recordTxtList = data.data.recordTxtList;
                        data.data.upDataList.forEach(function(val,index){
                            var temName = val.paramName;
                            switch (temName)
                            {
                                case "customerName":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_customerName");
                                    break;
                                case "externalNo":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_externalNo");
                                    break;
                                case "productName":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_productName");
                                    break;
                                case "orderAdditionalDtos":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_orderAdditionalDtos");
                                    break;
                                case "cargoTypeName":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_cargoTypeName");
                                    break;
                                case "packageNum":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_packageNum");
                                    break;
                                case "cargoTotalWeight":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_cargoTotalWeight");
                                    break;
                                case "fromAddress":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_fromAddress");
                                    break;
                                case "toAddress":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_toAddress");
                                    break;
                                case "fetchAddress":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_fetchAddress");
                                    break;
                                case "orderCargoDtos":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_orderCargoDtos");
                                    break;
                                case "customerNote":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_page_customerMsg");
                                    break;
                                case "feeWeight":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_feeWeight");
                                    break;
                                case "subOrder":
                                    val.paramName = Lang.getValByKey("confirmOrder", "confirmOrder_subOrder");
                                    break;
                                case "order":
                                    val.paramName = '订单信息';
                                    break;
                                default:
                                    val.paramName = temName;
                            }

                        });
                        $scope.detailTable.tableBody = data.data.upDataList;

                    }
                }
            });
        };

    	$scope.cancelShowDetail = function(){
    		$scope.nestLogDetail = false;
    	};


    }])
});