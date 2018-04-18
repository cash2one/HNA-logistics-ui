easySpa.require([
	"service/templateService"
], function(){
    app.controller("simulateController",['$scope','tradeOrdersService','tradeOrdersView', 'templateService', simulateController]);

    // orderStatusCode
    // 2 是待发货
    // 3 是待收货

    function simulateController($scope, tradeOrdersService,tradeOrdersView, templateService){

        var ORDERIN = 3, // 待收货
            ORDEROUT = 2; // 待发货

        if($scope.orderType === 'SALE'){
            customerType = 1;
        }else{
            customerType = 2;
        }

        $scope.searchOneOrder = function(){
            if(!$scope.orderNo){
                $scope.form7.orderNo.$setDirty();
                return;
            }
            tradeOrdersService.getOrderStatusByOrderNo($scope.orderNo,customerType).then(function(res){

                $scope.orderIn = $scope.orderOut = false;
                $scope.out = {};
                $scope.inn = {};
                $scope.orderButtonName = '';
                $scope.orderStatusName = '';
                $scope.simOrderStatus = '';
                if(res.errorCode == 0){
                    initData(res.data || {});
                }else{
                    tradeOrdersView.promptBox({msg:res.msg});
                }
            });
        };

        if($scope.presentOrderNo){
            $scope.orderNo = $scope.presentOrderNo;
            $scope.searchOneOrder();
        }


        function initData(data){
            console.log(data,'data')
            if(data.orderStatusCode == ORDEROUT){
                $scope.orderOut = true;
                $scope.out = data;
                $scope.orderButtonName = '确认发货';
                $scope.simOrderStatus = 'out';
            }else if(data.orderStatusCode == ORDERIN || data.orderStatusCode == 4){
                $scope.orderIn = true;
                $scope.inn = data;
                $scope.orderButtonName = '确认收货';
                $scope.simOrderStatus = 'in';
            }


            $scope.orderStatusName = data.orderStatusName;
        }

        $scope.save = function(){

            if($scope.simOrderStatus === 'in'){
                var data = angular.copy($scope.inn);
                delete data.id;
                tradeOrdersService.confirmTrdDeliveryOrder(data).then(function(res){
                    Template.build(templateService, 2, $scope.orderNo, function(result) {
                        tradeOrdersView.promptBox({msg:res.msg});
                        $scope.goBack('fresh');
                        $scope.getDetail('sdetail', $scope.orderNo);
                    });
                });
            }else if($scope.simOrderStatus === 'out'){
                var data = angular.copy($scope.out);
                delete data.id;
                tradeOrdersService.confirmTrdOrder(data).then(function(res) {
                    if(res.errorCode == 0) {
                        Template.build(templateService, 1, $scope.orderNo, function(result) {
                            tradeOrdersView.promptBox({msg:res.msg});
                            $scope.getDetail('sdetail', $scope.orderNo);
                        });
                    }
                });
            }
        };


        setTimeout(function(){
            Calander.init({
                ele: "#InnReceiptTime",
                isClear: true
            });

            Calander.init({
                ele: "#innPaymentTime",
                isClear: true
            });

            Calander.init({
                ele: ["#outtransportStartTime","#outtransportEndTime"],
                isClear: true
            });
            Calander.init({
                ele: ["#outsailStartTime","#outsailEndTime"],
                isClear: true
            });
            Calander.init({
                ele: ["#outreachStartTime","#outreachEndTime"],
                isClear: true
            });
        },0);

        $scope.add = function(orderGoods){
            orderGoods.push({});
            console.log(orderGoods,'orderGoods')
        };

        $scope.delete = function(orderGoods,item){
            orderGoods.forEach(function(i,index){
                if(i === item) orderGoods.splice(index,1);
            });
        };

        $scope.edit = function(item,index){
            item.isEdit = !item.isEdit;
            setTimeout(function(){
                tradeOrdersView.initNgSelect($scope,'#goodsUnitName'+index,$scope.weightList,function(present){
                    item.goodsUnitName = present.name;
                    item.goodsUnit = present.code;
                });
                tradeOrdersView.initNgSelect($scope,'#goodsCurrencyTypeName'+index,$scope.currencyList,function(present){
                    item.goodsCurrencyTypeName = present.name;
                    item.goodsCurrencyType = present.code;
                });
            },0);
        };

        tradeOrdersService.weight().then(function(weightList){
            $scope.weightList = weightList.data;
        });

        tradeOrdersService.currency().then(function(currencyList){
            $scope.currencyList = currencyList.data;
        });
    }
});