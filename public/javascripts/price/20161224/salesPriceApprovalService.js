app.factory('service', ['easyHttp', function(easyHttp) {
    var service = {};
    service.verifySalePrice = function(param, callback) {
        return easyHttp.post('logistics.verifySalePrice', {'urlParams':param, 'seatParams':param.seatParams}, callback);
    }
    service.salePriceNoPass = function(param, callback) {
        return easyHttp.post('logistics.salePriceNoPass', {'urlParams':param}, callback);
    }
    service.salePriceStartUse = function(param, callback) {
        return easyHttp.post('logistics.salePriceStartUse', {'urlParams':param}, callback);
    }
    service.salePriceStopUse = function(param, callback) {
        return easyHttp.post('logistics.salePriceStopUse', {'urlParams':param}, callback);
    }
    return service;
}]);