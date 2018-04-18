app.factory('internationalService', ['$http', 'easyHttp', function($http, easyHttp) {
    var internationalService = {};

    /**
     * 获取国际化语言
     * @param data
     * @returns {*}
     */
    internationalService.getInternational = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    /**
     * 保存机场国际化
     * @param data
     * @returns {*}
     */
    internationalService.saveInternational = function(config, callback){
        return easyHttp.post('logistics.saveInternational', config, callback);
    };
    /**
     * 保存港口国际化
     * @param data
     * @returns {*}
     */
    internationalService.savePortInternational = function(config, callback){
        return easyHttp.post('logistics.savePortInternational', config, callback);
    };
    /**
     * 保存公司国际化
     * @param data
     * @returns {*}
     */
    internationalService.saveCompanyInternational = function(config, callback) {
        return easyHttp.post('logistics.saveCompanyInternational', config, callback);
    };

    /**
     * 保存国家国际化
     * @param data
     * @returns {*}
     */
    internationalService.saveCountryInternational = function(config, callback) {
        return easyHttp.post('logistics.saveCountryInternational', config, callback);
    };

    /**
     * 保存币种国际化
     * @param data
     * @returns {*}
     */
    internationalService.saveCurrencyInternational = function(config, callback) {
        return easyHttp.post('logistics.saveCurrencyInternational', config, callback);
    };

    /**
     * 费用类型国际化保存
     * @param config
     * @param callback
     * @returns {*}
     */
    internationalService.saveCostInternational = function(config, callback){
        return easyHttp.post('logistics.saveCostInternational', config, callback);
    };

    /**
     * 结算方式国际化保存
     * @param config
     * @param callback
     * @returns {*}
     */
    internationalService.saveAccountInternational = function(config, callback){
        return easyHttp.post('logistics.saveAccountInternational', config, callback);
    };

    /**
     * 机型国际化保存
     * @param config
     * @param callback
     * @returns {*}
     */
    internationalService.saveTransportAirplaneInternational = function(config, callback){
        return easyHttp.post('logistics.saveTransportAirplaneInternational', config, callback);
    };

    internationalService.saveInternationalShip = function(config, callback){
        return easyHttp.post('logistics.saveInternationalShip', config, callback);
    };    

    internationalService.saveInternationalCarrierMaritime = function(config, callback){
        return easyHttp.post('logistics.saveInternationalShippingCompany', config, callback);
    };

    return internationalService;
}]);