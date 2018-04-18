app.factory('stationAirportService', ['easyHttp', function(easyHttp) {
    var stationAirportService = {};

    /**
     * 新增机场
     * @param data
     * @returns {*}
     */
    stationAirportService.saveAirport = function(config, callback){
        return easyHttp.post('logistics.saveAirport', config, callback);
    };

    /**
     * 获取国家
     * @param data
     * @returns {*}
     */
    stationAirportService.getCountry = function(config){
        return easyHttp.get('logistics.getCountry', config);
    };

    /**
     * 获取城市
     * @param data
     * @returns {*}
     */
    stationAirportService.getCity = function(config){
        return easyHttp.get('logistics.getCity', config);
    };

    /**
     * 获取地区
     * @param data
     * @returns {*}
     */
    stationAirportService.getArea = function(config, callback){
        return easyHttp.get('logistics.getArea', config, callback);
    };

    /**
     * 获取机场信息
     * @param data
     * @returns {*}
     */
    stationAirportService.getAirportDetail = function(config, callback){
        return easyHttp.get('logistics.getAirportDetail', config, callback);
    };

    /**
     * 修改机场
     * @param data
     * @returns {*}
     */
    stationAirportService.updateAirport = function(config, callback){
        return easyHttp.put('logistics.updateAirport', config, callback);
    };

    /**
     * 删除机场
     * @param airportId    机场ID
     */
    stationAirportService.deleteAirports = function(config, callback){
        return easyHttp.post('logistics.deleteAirports', config, callback);
    };

    /**
     * 异步校验机场名称
     * @param airportId    name
     */
    stationAirportService.validateAirportName = function(config, callback){
        return easyHttp.get('logistics.validateAirportName', config, callback);
    };

    /**
     * 异步校验机场四字码
     * @param airportId    tetradCode
     */
    stationAirportService.validateAirportTetradCode = function(config, callback){
        return easyHttp.get('logistics.validateAirportTetradCode', config, callback);
    };

    /**
     * 异步校验机场三字码
     * @param airportId    triadCode
     */
    stationAirportService.validateAirportTriadCode = function(config, callback){
        return easyHttp.get('logistics.validateAirportTriadCode', config, callback);
    };

    /**
     * 获取语言库
     * @param callback
     */
    stationAirportService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    return stationAirportService;
}]);