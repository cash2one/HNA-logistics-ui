app.factory('shippingLineService', ['easyHttp', function(easyHttp) {
    var shippingLineService = {};

    shippingLineService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    shippingLineService.getCountry = function(config){
        return easyHttp.get('logistics.getCountry', config);
    };

    shippingLineService.getCity = function(config){
        return easyHttp.get('logistics.getCity', config);
    };

    shippingLineService.getShippingPort = function(callback){
        return easyHttp.get('logistics.getShippingPort', callback);
    };

    shippingLineService.getLineType = function(callback){
        return easyHttp.get('logistics.getLineType', callback);
    };

    shippingLineService.del = function(config, callback){
        return easyHttp.post('logistics.deleteShippingLine', config, callback);
    };

    shippingLineService.save = function(config, callback){
        return easyHttp.post('logistics.saveShippingLine', config, callback);
    };

    shippingLineService.saveEdit = function(config, callback){
        return easyHttp.post('logistics.saveEditShippingLine', config, callback);
    };

    shippingLineService.getDetail = function(config, callback){
        return easyHttp.get('logistics.getShippingLineDetail', config, callback);
    };

    shippingLineService.checkShippingLineName = function(config, callback){
        return easyHttp.get('logistics.checkShippingLineName', config, callback);
    };

    shippingLineService.checkShippingLineCode = function(config, callback){
        return easyHttp.get('logistics.checkShippingLineCode', config, callback);
    };

    shippingLineService.getPortListByCountryId = function (config, callback) {
        return easyHttp.get('logistics.getPortListByCountryId', config, callback);
    };

    shippingLineService.getShippingLineType = function (config, callback) {
        return easyHttp.get('logistics.getBusinessTypeData', config, callback);
    };
    return shippingLineService;
}]);