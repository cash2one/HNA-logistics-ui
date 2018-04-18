easySpa.require([
    'widget/slimscroll',
    'public/common/tableController.js'
], function(){
    app.controller('tradeKeyIndicatorCtrl',[
        '$scope',
        'tradeKeyIndicatorService',
        'tradeKeyIndicatorView',
        'tableService',
        function($scope, tradeKeyIndicatorService, tradeKeyIndicatorView, tableService){
               $scope.tableModel = {
                   tableBody: [],
                   restURL: 'logistics.getAllTradeKeyIndicator',
                   restData: {
                       pageIndex: 1,
                       pageSize: 10
                   }
               };

               $(window).on('resize', setScrollDetail);

               function setScrollDetail() {
                   $('.table-container tbody').slimscroll({
                       height: $('.content-main').height() - 250
                   });
               };

               $scope.loadListData = function() {
                   var params = {
                       urlParams: $scope.tableModel.restData
                   };
                   tableService.getTable($scope.tableModel.restURL, params, function(res){
                       if(res.errorCode === 0){
                           $scope.tableModel = tableService.table($scope.tableModel, params, res);
                           setTimeout(function() {
                               setScrollDetail();
                               $scope.$apply();
                           }, 500);
                       }
                   });
               };

               $scope.loadListData();

                function initData() {
                    $scope.modifyId = '';
                    $scope.keyName = '';
                    $scope.overdueRate = '';
                    $scope.turnoverDays = '';
                    $scope.annualizedRate = '';
                }

                function checkForm() {
                    if(!$scope.keyName){
                        $scope.keyIndicator.keyName.$setDirty();
                    };
                    if(!$scope.overdueRate){
                        $scope.keyIndicator.overdueRate.$setDirty();
                    };
                    if(!$scope.turnoverDays){
                        $scope.keyIndicator.turnoverDays.$setDirty();
                    };
                    if(!$scope.annualizedRate){
                        $scope.keyIndicator.annualizedRate.$setDirty();
                    };
                    if(!$scope.keyIndicator.$valid){
                        return false;
                    }else{
                        return true;
                    }
                };

                $scope.add = function(){
                    initData();
                    $scope.showPrompt = true;
                };

                $scope.close = function(){
                    window.location.reload();
                };

                $scope.save = function(){
                    if(!checkForm()){
                        return;
                    }
                    if($scope.modifyId){
                        tradeKeyIndicatorService.modifyTradeKeyIndicator({
                            seatParams: {
                                id: $scope.modifyId
                            },
                            urlParams: {
                                id: $scope.modifyId,
                                projectName: $scope.keyName,
                                overdueRate: $scope.overdueRate,
                                turnoverDay: $scope.turnoverDays,
                                annualizedReturn: $scope.annualizedRate
                            }
                        },function(res){
                            if(res.errorCode === 0){
                                alert(res.msg);
                                $scope.loadListData();
                            }
                        });
                    }else{
                        tradeKeyIndicatorService.addTradeKeyIndicator({
                            urlParams: {
                                projectName: $scope.keyName,
                                overdueRate: $scope.overdueRate,
                                turnoverDay: $scope.turnoverDays,
                                annualizedReturn: $scope.annualizedRate
                            }
                        },function(res){
                            if(res.errorCode === 0){
                                alert(res.msg);
                                $scope.loadListData();
                            }
                        });
                    }
                    $scope.showPrompt = false;
                };

                $scope.modify = function(item){
                    $scope.modifyId = item.id;
                    $scope.keyName = item.projectName;
                    $scope.overdueRate = item.overdueRate;
                    $scope.turnoverDays = item.turnoverDay;
                    $scope.annualizedRate = item.annualizedReturn;
                    $scope.showPrompt = true;
                };

                $scope.del = function(id){
                    $scope.deleteId = id;
                    $scope.confirmDelete = true;
                };

                $scope.cancel = function(){
                    window.location.reload();
                };

                $scope.confirmDel = function(){
                    var arr = [];
                    arr.push($scope.deleteId);
                    tradeKeyIndicatorService.delTradeKeyIndicator({
                        urlParams: arr
                    }, function(res){
                        if(res.errorCode === 0){
                            alert(res.msg);
                            $scope.loadListData();
                        }
                    });
                    $scope.confirmDelete = false;
                }
    }]);
});


