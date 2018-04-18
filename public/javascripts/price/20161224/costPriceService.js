app.factory('service', ['easyHttp', function(easyHttp) {
    var service = {};
    service.deleteCostPrice = function(param, callback) {
        return easyHttp.post('logistics.deleteCostPrice', {'urlParams':param}, callback);
    }
    service.submitVerifyCostPrice = function(param, callback) {
        return easyHttp.post('logistics.submitCostPrice', {'urlParams':param}, callback);
    }
    return service;
}]);