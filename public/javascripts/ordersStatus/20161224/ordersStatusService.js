app.factory('ordersStatusService', ['$http','easyHttp', function($http,easyHttp) {
    var ordersStatusService = {};

    ordersStatusService.getOrderStatus = function(params,callback){
        return easyHttp.get("logistics.getOrderStatus",params,callback);
    };

    ordersStatusService.getOrderInfoByorderNo = function(params,callback){
        return easyHttp.get("logistics.getOrderInfoByorderNo", params, callback);
    };


    return ordersStatusService;
}]);