app.factory('historyRateService', ['easyHttp', function(easyHttp) {
    var historyRateService = {};
    historyRateService.getRateList = function(callback) {
        return easyHttp.get('logistics.getRateList', {async:false}, callback);
    }
    historyRateService.deleteRateList = function(param, callback) {
        return easyHttp.post('logistics.deleteRateList', {'urlParams':param, async:false}, callback);
    };
    historyRateService.createNewRate = function(param, callback) {
        return easyHttp.post('logistics.createNewRate', {'urlParams':param}, callback);
    }
    historyRateService.updateRate = function(param, callback) {
        return easyHttp.put('logistics.updateRate', {'urlParams':param}, callback);
    }
    return historyRateService;
}]);