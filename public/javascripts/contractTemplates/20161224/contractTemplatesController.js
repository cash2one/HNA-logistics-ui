easySpa.require([
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/select',
    'public/common/calander.js',
    'widget/prompt'
],function(){
    app.controller('contractTemplatesCtrl', ['$scope', 'contractTemplatesService', 'contractTemplatesView','tableService', function($scope, contractTemplatesService, contractTemplatesView,tableService) {

        $.extend($scope, {
            initSelect: function() {
                contractTemplatesView.initStateSelect($scope); //初始化状态下拉列表
            },
            initCalander: function() {
                contractTemplatesView.initCalander();
            },
            setScroll: function() {
                contractTemplatesView.setScroll();
            },
            initTable: function() {
                contractTemplatesView.initTable($scope);
            },
            loadData: function() {
                var self = this;

                var params = {
                    'urlParams': $scope.tableModel.restData
                };

                tableService.getTable($scope.tableModel.restURL, params, function(data) {
                    if(data.errorCode === 0) {
                        angular.forEach(data.data,function (item) {
                            item.enableCheckbox = (item.createUserId.toString() === $scope.userId)
                        })
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
            bindEvent: function() {
                contractTemplatesView.bindEvent($scope);
            }
        });

        // $scope.$watch('tableModel', function(newVal, oldVal){
        //     if(newVal == oldVal){
        //        return ;
        //     }
        //     console.log($scope.tableModel);
        //
        // }, true)

        $scope.test= function (id) {
            top.location.href = 'http://' + location.host + "#/contractTemplateDetail?id="+id;

        }

        function initData() {
            $scope.userId = cookie.get("userId");
            $scope.serviceType = "全部";
            $scope.serviceTypeCode = null;
            $scope.tableModel={}
        }

        initData(); //初始化数据
        $scope.initTable(); //初始化table组件
        $scope.initSelect(); //初始化搜索框
        $scope.initCalander();//初始化日历组件
        $scope.bindEvent(); //初始化事件绑定
    }]);
});
