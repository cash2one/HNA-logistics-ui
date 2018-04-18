app.factory('carrierAirlineService', ['$http', 'easyHttp', function($http, easyHttp) {
    var carrierAirlineService = {};

    /**
     * 新增公司信息
     * @param data
     * @returns {*}
     */
    carrierAirlineService.saveCompany = function(config, callback){
        return easyHttp.post('logistics.saveCompany', config, callback);
    };

    /**
     * 获取国家
     * @param data
     * @returns {*}
     */
    carrierAirlineService.getCountry = function(config){
        return easyHttp.get('logistics.getCountry', config);
    };

    /**
     * 修改公司信息
     * @param data
     * @returns {*}
     */
    carrierAirlineService.editCompany = function(config, callback){
        return easyHttp.put('logistics.editCompany', config, callback);
    };

    /**
     * 获取当前id公司的信息
     * @param data
     * @returns {*}
     */
    carrierAirlineService.getCompanyById = function(config, callback){
        return easyHttp.get('logistics.getCompanyById', config, callback);
    };

    /**
     * 删除公司信息
     * @param data
     * @returns {*}
     */
    carrierAirlineService.deleteCompanyById = function(config, callback){
        return easyHttp.post('logistics.deleteCompanyById', config, callback);
    };

    /**
     * 异步校验公司名称
     * @param airportId    name
     */
    carrierAirlineService.validateCompanyName = function(config, callback){
        return easyHttp.get('logistics.validateAirportName', config, callback);
    };

    /**
     * 异步校验公司二字码
     * @param airportId    figureCode
     */
    carrierAirlineService.validateCompanyFigureCode = function(config, callback){
        return easyHttp.get('logistics.validateCompanyFigureCode', config, callback);
    };
    /**
     * 异步校验公司三字码
     * @param airportId    triadCode
     */
    carrierAirlineService.validateAirportTriadCode = function(config, callback){
        return easyHttp.get('logistics.validateAirportTriadCode', config, callback);
    };

    /**
     * 获取语言库
     * @param callback
     */
    carrierAirlineService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    return carrierAirlineService;
}]);