app.factory('carrierMaritimeService', ['easyHttp', function(easyHttp) {
    var carrierMaritimeService = {};

    carrierMaritimeService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    carrierMaritimeService.getCountry = function(config){
        return easyHttp.get('logistics.getCountry', config);
    };

    carrierMaritimeService.del = function(config, callback){
        return easyHttp.post('logistics.deleteShippingCompany', config, callback);
    };

    carrierMaritimeService.save = function(config, callback){
        return easyHttp.post('logistics.saveShippingCompany', config, callback);
    };

    carrierMaritimeService.saveEdit = function(config, callback){
        return easyHttp.post('logistics.saveEditShippingCompany', config, callback);
    };

    carrierMaritimeService.getDetail = function(config, callback){
        return easyHttp.get('logistics.getShippingCompanyDetail', config, callback);
    };

    carrierMaritimeService.checkShippingCompanyCode = function(config, callback){
        return easyHttp.get('logistics.checkShippingCompanyCode', config, callback);
    };

    carrierMaritimeService.checkShippingCompanyName = function(config, callback){
        return easyHttp.get('logistics.checkShippingCompanyName', config, callback);
    };

    return carrierMaritimeService;
}]);