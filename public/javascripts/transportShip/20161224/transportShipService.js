app.factory('transportShipService', ['easyHttp', function(easyHttp) {
    var transportShipService = {};

    transportShipService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    transportShipService.getCountry = function(config){
        return easyHttp.get('logistics.getCountry', config);
    };

    transportShipService.getShippingCompany = function(config){
        return easyHttp.get('logistics.getShippingCompanyShort', config);
    };

    transportShipService.del = function(config, callback){
        return easyHttp.post('logistics.delTransportShip', config, callback);
    };

    transportShipService.getDetail = function(config, callback){
        return easyHttp.get('logistics.getTransportShipDetail', config, callback);
    };

    transportShipService.saveEdit = function(config, callback){
        return easyHttp.post('logistics.saveEditTransportShip', config, callback);
    };

    transportShipService.save = function(config, callback){
        return easyHttp.post('logistics.saveTransportShip', config, callback);
    };

    transportShipService.checkShipNameEn = function(config, callback){
        return easyHttp.get('logistics.checkShipNameEn', config, callback);
    };

    transportShipService.checkShipMmsi = function(config, callback){
        return easyHttp.get('logistics.checkShipMmsi', config, callback);
    };

    transportShipService.checkShipImo = function(config, callback){
        return easyHttp.get('logistics.checkShipImo', config, callback);
    };

    return transportShipService;
}]);