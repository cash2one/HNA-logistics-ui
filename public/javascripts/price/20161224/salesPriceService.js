app.factory('service', ['easyHttp', function(easyHttp) {
    var service = {};
    service.deleteSalePrice = function(param, callback) {
        return easyHttp.post('logistics.deleteSalePrice', {'urlParams':param}, callback);
    }
    service.submitSalePrice = function(param, callback) {
        return easyHttp.post('logistics.submitSalePrice', {'urlParams':param}, callback);
    }
    return service;
}]);