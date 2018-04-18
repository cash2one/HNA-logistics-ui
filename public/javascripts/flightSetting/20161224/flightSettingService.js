app.factory('flightSettingService', ['easyHttp', function(easyHttp) {
    var flightSettingService = {};

    flightSettingService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    flightSettingService.del = function(config, callback){
        return easyHttp.post('logistics.deleteFlightSetting', config, callback);
    };

    flightSettingService.getAirportShort = function(config, callback){
        return easyHttp.get('logistics.getAirportShort', config, callback);
    };

    flightSettingService.getAirLineShort = function(config, callback){
        return easyHttp.get('logistics.getAirLineShort', config, callback);
    };

    flightSettingService.getAirplaneModels = function(config, callback){
        return easyHttp.get('logistics.getAirplaneModelsShort', config, callback);
    };

    flightSettingService.getCarrierCompanyShort = function(config, callback){
        return easyHttp.get('logistics.getCarrierCompanyShort', config, callback);
    };

    flightSettingService.getAirLineDetail = function(config, callback){
        return easyHttp.get('logistics.getAirLineDetail', config, callback);
    };

    flightSettingService.save = function(config, callback){
        return easyHttp.post('logistics.saveFlightSetting', config, callback);
    };

    flightSettingService.saveEdit = function(config, callback){
        return easyHttp.post('logistics.saveEditFlightSetting', config, callback);
    };

    flightSettingService.getDetail = function(config, callback){
        return easyHttp.get('logistics.getFlightSettingDetail', config, callback);
    };

    flightSettingService.checkFlightsCode = function(config, callback){
        return easyHttp.get('logistics.checkFlightsCode', config, callback);
    };

    return flightSettingService;
}]);