easySpa.require([
    'widget/parseUrl'
], function(){
    app.controller('billStreamCtrl', ['$scope', 'billStreamService', 'billStreamView', function($scope, billStreamService, billStreamView) {
        $scope.parameter = window.parseUrl.getParams();

        $scope.name = $scope.parameter.billNo;

        /**
         * 返回
         */
        $scope.goBack = function(){
            var from = $scope.parameter.from,
                module = $scope.parameter.module,
                submodule = $scope.parameter.submodule;
            window.location.href = '#/'+ from + '?from=' + from + '&module=' + module + '&submodule=' + submodule;
        };

        /**
         * 获取流转数据
         */
        $scope.getFlowProcess = function() {
            $scope.streamList = billStreamService.getFlowProcess({seatParams:{"billNo": $scope.parameter.billNo}});
        };

        $scope.getFlowProcess();
    }]);
});