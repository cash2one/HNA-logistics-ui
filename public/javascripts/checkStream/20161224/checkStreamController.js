app.controller('checkStreamCtrl', ['$scope', 'checkStreamService', 'checkStreamView', function($scope, checkStreamService, checkStreamView) {
    $scope.name = easySpa.queryUrlValByKey("name");
    $scope.goBack = function() {
        var from = easySpa.queryUrlValByKey("from");
        var type = easySpa.queryUrlValByKey("type");
        var page = "";
        if(location.href.indexOf("page") != -1) {
            page = easySpa.queryUrlValByKey("page");
        }
        if(page) {
            window.location.href = "#/" + page + "?module=" + from + "&type=" + type;
        } else {
            window.location.href = "#/price?module=" + from + "&type=" + type;
        }
    }
    function getStreamData() {
        var uid = easySpa.queryUrlValByKey("uid");
        if(location.href.indexOf("page") != -1 && easySpa.queryUrlValByKey("page") == "product") {
            var data = checkStreamService.getProductStream({seatParams:{"uid": uid}});
            console.log(data, ' data');
            return data;
        } else {
            return checkStreamService.getPriceStream({seatParams:{"uid": uid}});
        }
    }
    $scope.streamList = getStreamData();
}]);
