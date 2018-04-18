app.factory('goodsdesService', ['easyHttp', function(easyHttp) {
    var goodsdesService = {};

    goodsdesService.getBillTaskDetail = function(code,cb){
        return easyHttp.get("logistics.getBillTaskDetail", {"urlParams" :{"taskCode" : code}}, cb);
    };

    return goodsdesService;
}]);