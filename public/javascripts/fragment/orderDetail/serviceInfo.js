app.controller('serviceInfoCtrl', ['$scope', 'confirmOrderService', function ($scope, confirmOrderService) {
    $scope.getServiceInfo = function (e, orderNo, orderStatus) {

        if (orderStatus == 'DRAFT' || orderStatus == 'COMMITED') {    //草稿和已提交不请求
            return;
        }
        var config = {
            'seatParams': {
                'orderNo': orderNo
            }
        };

        confirmOrderService.getServiceInfo(config, function (res) {
            if (res.errorCode === 0) {
                $scope.serviceInfoList = []
                angular.forEach(res.data, function(item, index){
                    if(item.serviceCode){
                        $scope.serviceInfoList.push(item);
                    }
                });
            }
        });
    };

    $scope.$on('serviceInfoEvent', $scope.getServiceInfo);
}]);