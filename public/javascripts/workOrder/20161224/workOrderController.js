easySpa.require([
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/select',
    'public/common/calander.js',
    'widget/prompt'
], function() {
    app.controller('workOrderCtrl', ['$scope', 'workOrderService', 'workOrderView', 'tableService', function($scope, workOrderService, workOrderView, tableService) {
        $.extend($scope, {
            workId: "",
            creator: "",
            username: "",
            usernameId: "",
            title: "",
            state: "",
            stateId: "",
            searchTitle: "",
            searchWorkId: "",
            searchUsername: "",
            searchCreator: "",
            blockOrder: false,
            setScroll: function() {
                workOrderView.setScroll();
            },
            loadData: function() {
                var self = this;
                $scope.searchTitle = $scope.title;
                $scope.searchWorkId = $scope.workId;
                $scope.searchUsername = $scope.username;
                $scope.searchCreator = $scope.creator;
                if(!$scope.stateId) {
                    $scope.tableModel.restData.status = "0";
                }
                var params = {
                    'urlParams': $scope.tableModel.restData
                };
                tableService.getTable($scope.tableModel.restURL, params, function(data) {
                    if(data.errorCode === 0) {
                        $scope.tableModel = tableService.table($scope.tableModel, params, data);
                        setTimeout(function() {
                            self.setScroll();
                            $(window).on("resize", self.setScroll);
                            $scope.$apply();
                            $(".table-box").focus();
                        }, 100);
                    }
                });
            },
            initTable: function() {
                workOrderView.initTable($scope);
            },
            initSelect: function() {
                workOrderView.initStateSelect($scope); //初始化状态下拉列表
            },
            initCalander: function() {
                workOrderView.initCalander();
            },
            bindEvent: function() {
                workOrderView.bindEvent($scope);
            },
            initPageData: function() {
                $scope.state = Lang.getValByKey("workOrder", "workOrder_created_state");
            }
        });
        $scope.initPageData();
        $scope.initSelect(); //初始化搜索框
        $scope.initTable(); //初始化table组件
        $scope.initCalander();//初始化日历组件
        $scope.bindEvent(); //初始化事件绑定
    }]);
});
