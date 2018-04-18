app.controller("superviseCtrl", ["$scope", "orderNumberService", "tableService", function($scope, orderNumberService, tableService) {
    var tablehearder,tableHeaderSize,restURL;
    $scope.superviseUseInfoId = 1;
    if($scope.module==="channelNumber"){
        tablehearder = [
            Lang.getValByKey('common', 'common_thead_number'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_channelNumber'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_orderNumber'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_service'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_supplierName'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_batchNumber'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_useInfo'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_useTime')
        ];
        tableHeaderSize =['5%','12%','16%','12%','10%','12%','8%','10%'];
        restURL = 'logistics.getChannelNumberChannelNo'
    }else{
        tablehearder = [
            Lang.getValByKey('common', 'common_thead_number'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_waybillNumber'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_orderNumber'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_clientele'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_batchNumber'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_useInfo'),
            Lang.getValByKey('orderNumber', 'orderNumber_table_useTime')
        ];
        tableHeaderSize =['8%','18%','20%','12%','13%','12%','12%'];
        restURL = 'logistics.getWaybillNumberChannelNo'
    }
    $scope.tableModel = {
        'tableHeader': tablehearder,
        'tableHeaderSize': tableHeaderSize,
        'tableBody': [],
        'restURL': restURL,
        'restData': {
            'q': '',
            'channelNumber': '',
            'waybillNumber': '',
            'orderNumber': '',
            'batchNumber': '',
            'status': '1',
            'pageIndex': 1,
            'pageSize': 10,
            'sort': ''
        },
        'selectNumber': 0,
        'selectFlag': false
    };
    $scope.getTable = function(isSearch){
        $scope.tableModel.restData.channelNumber = $scope.searchChannelNumber;
        $scope.tableModel.restData.waybillNumber = $scope.searchWaybillNumber;
        $scope.tableModel.restData.orderNumber = $scope.searchOrderNumber;
        $scope.tableModel.restData.batchNumber = $scope.searchBatchNumber;
        if(isSearch){
            $scope.tableModel.restData.pageIndex = 1;
            $scope.tableModel.restData.status = $scope.superviseUseInfoId;
        }
        if($scope.tableModel.restData.orderNumber){
            $scope.tableModel.restData.batchNumber = "";
            $scope.tableModel.restData.status = "" ;
        }
        if($scope.tableModel.restData.channelNumber || $scope.tableModel.restData.waybillNumber){
            $scope.tableModel.restData.orderNumber = "";
            $scope.tableModel.restData.batchNumber = "";
            $scope.tableModel.restData.status = "" ;
        }
        var config = {
            'urlParams': $scope.tableModel.restData
        };
        tableService.getTable($scope.tableModel.restURL, config, function(data){
            if(data.errorCode === 0){
                $scope.tableModel = tableService.table($scope.tableModel, config, data);
                var height = $('.order-table-supervise').height() - 240;
                setTimeout(function() {
                    $('.table-container tbody').slimscroll({ height: height });
                    $(window).resize(function(){
                        height = $('.order-table-supervise').height() - 240;
                        $('.table-container tbody').slimscroll({ height: height });
                    });
                }, 10);
            }
        });
    };
    
    $scope.resetData = function() {
        $scope.tableModel.restData.channelNumber = "";
        $scope.searchChannelNumber = "";
        $scope.tableModel.restData.waybillNumber = "";
        $scope.searchWaybillNumber = "";
        $scope.tableModel.restData.orderNumber = "";
        $scope.searchOrderNumber = "";
        $scope.tableModel.restData.batchNumber = "";
        $scope.searchBatchNumber = "";
        $scope.tableModel.restData.status = "1";
        $scope.superviseUseInfoId = "1";
        $scope.superviseUseInfo = Lang.getValByKey("orderNumber", 'orderNumber_select_used');
        $scope.tableModel.restData.pageIndex = 1;
        $scope.getTable();
    };

    //搜索状态
    var superviseUseInfoEle;
    $scope.getSearchSuperviseUseInfoData = function(){
        var searchSuperviseUseInfos = [
            {code:-1,name:Lang.getValByKey("orderNumber", 'orderNumber_select_all')},
            {code:1,name:Lang.getValByKey("orderNumber", 'orderNumber_select_used')},
            {code:0,name:Lang.getValByKey("orderNumber", 'orderNumber_select_nouse')}
        ];
        if(superviseUseInfoEle){
            superviseUseInfoEle.destroy();
        }
        superviseUseInfoEle = selectFactory({
            data: {data:searchSuperviseUseInfos},
            id: "supervise-useInfo",
            isCreateNewSelect:true,
            defaultText:'',
            attrTextModel: function(name, data,currentData) {
                $scope.superviseUseInfoId = currentData.code;
                $scope.superviseUseInfo = currentData.name;
                $scope.$apply();
            }
        });
        superviseUseInfoEle.open();
    };
}]);