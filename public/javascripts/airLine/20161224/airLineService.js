app.factory('airLineService', ['easyHttp', function(easyHttp) {
    var airLineService = {};

    airLineService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    airLineService.getAirportShort = function(callback){
        return easyHttp.get('logistics.getAirportShort', callback);
    };

    airLineService.getCity = function(config){
        return easyHttp.get('logistics.getCity', config);
    };

    airLineService.getAirPortListByCountryId = function(config){
        return easyHttp.get('logistics.getAirPortListByCountryId', config);
    };


    airLineService.getCountry = function(config){
        return easyHttp.get('logistics.getCountry', config);
    };

    airLineService.getLineType = function(callback){
        return easyHttp.get('logistics.getLineType', callback);
    };

    airLineService.del = function(config, callback){
        return easyHttp.post('logistics.deleteAirLine', config, callback);
    };

    airLineService.save = function(config, callback){
        return easyHttp.post('logistics.saveAirLine', config, callback);
    };

    airLineService.saveEdit = function(config, callback){
        return easyHttp.post('logistics.saveEditAirLine', config, callback);
    };

    airLineService.getDetail = function(config, callback){
        return easyHttp.get('logistics.getAirLineDetail', config, callback);
    };

    airLineService.checkAirLineName = function(config, callback){
        return easyHttp.get('logistics.checkAirLineName', config, callback);
    };

    airLineService.checkAirLineCode = function(config, callback){
        return easyHttp.get('logistics.checkAirLineCode', config, callback);
    };

    return airLineService;
}]);