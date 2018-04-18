app.factory('rateService', ['easyHttp', function(easyHttp) {
    var rateService = {};
    rateService.getRateList = function(callback) {
        return easyHttp.get('logistics.getRateList', callback);
    }
    rateService.getCurrencyList = function(callback) {
        return easyHttp.get('logistics.getCurrencyList', {'seatParams': {"language": "zh-CN"}, "urlParams":{"pageSize":"10000"}}, callback);
    }
    rateService.deleteRateList = function(param, callback) {
        return easyHttp.post('logistics.deleteRateList', {'urlParams':param}, callback);
    };
    rateService.createNewRate = function(param, callback) {
        return easyHttp.post('logistics.createNewRate', {'urlParams':param}, callback);
    }
    rateService.updateRate = function(param, callback) {
        return easyHttp.put('logistics.updateRate', {'urlParams':param}, callback);
    }
    rateService.getServerTime = function(callback) {
        return easyHttp.get('logistics.getServerTime', callback);
    }
    return rateService;
}]);