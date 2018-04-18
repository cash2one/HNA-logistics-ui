app.controller('tradeIndicatorCtrl', ['$scope', '$route', 'cockpitService', function($scope, $route, cockpitService){
    $scope.$on('changeToIndicator', function(e, res){
        initPage();
    });
    if($route.current.params){
        initPage();
    }else{
        return;
    }

    function initPage(){
        cockpitService.getTradeKeyIndicator(function(res){
            if(res.errorCode === 0){
                $scope.data = res.data;
            }
        });
    }
}]);