easySpa.require([
    'public/common/tableController.js',
    "widget/select",
    "widget/prompt",
    "public/javascripts/goodsdes/20161224/detailController.js"
], function() {
    app.controller("goodsdesCtrl",['$scope','goodsdesService','goodsdesView','tableService','$compile', goodsdesCtrl]);
    function goodsdesCtrl($scope, goodsdesService,goodsdesView,tableService,$compile){

        $scope.tableModel = {
            tableHeader: [
                "业务类型",
                "品名",
                "品名代码",
                "供应商",
                "状态"
            ],
            tableHeaderSize: ['20%','20%','20%','20%','20%'],
            tableBody: [],
            restURL: "logistics.getTaskList",
            restData: {
                q: '',
                refCombos: '',
                isAsc: false,
                pageIndex: 1,
                pageSize: 10,
            },
            selectNumber: 0,
            selectFlag: false
        };

        $scope.loadListData = function(){

            var params = {'urlParams' : {}};

            tableService.getTable($scope.tableModel.restURL, params, function(data) {
                $scope.q = $scope.tableModel.restData.q;
                $scope.tableModel = tableService.table($scope.tableModel, params, data);
                //  $scope.$apply();
            });

        };

        $scope.loadListData();

        $scope.getDetail = function(){
            goodsdesView.getTpl('detail').then(function(tpl){
                $scope.child = $scope.$new();
                $("#detail").html($compile(tpl)($scope.child));
            });
        };
        $scope.getDetail();
        $scope.goBack = function(){
            $scope.child.$destroy();
            $("#detail").html('');
        };
    }
});