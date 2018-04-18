app.factory('logisticsService', ['easyHttp', function (easyHttp) {
    var logisticsService = {};

    logisticsService.getType = function (config, callback) {
        easyHttp.get("logistics.getType", config, callback);
    };

    logisticsService.isOrderNumExist = function (config, callback) {
        easyHttp.get("logistics.isOrderNumExist", config, callback);
    };

    logisticsService.getLogisticsInfoType = function (config, callback) {
        easyHttp.get("logistics.getLogisticsInfoType", config, callback);
    };

    logisticsService.addLogisticsInfo = function (config, callback) {
        easyHttp.post("logistics.addLogisticsInfo", config, callback);
    };

    return logisticsService;
}]);