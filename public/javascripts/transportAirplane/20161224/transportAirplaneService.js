app.factory('transportAirplaneService', ['easyHttp', function(easyHttp) {
    var transportAirplaneService = {};

    /**
     * 获取语言库
     * @param callback
     */
    transportAirplaneService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    /**
     * 保存新增机型
     * @param config
     * @param callback
     * @returns {*}
     */
    transportAirplaneService.save = function(config, callback){
        return easyHttp.post('logistics.saveTransport', config, callback);
    };

    transportAirplaneService.saveEdit = function(config, callback){
        return easyHttp.post('logistics.saveEditTransport', config, callback);
    };

    /**
     * 机型详情
     * @param config
     * @param callback
     */
    transportAirplaneService.getDetail = function(config, callback){
        return easyHttp.get('logistics.getTransportDetail', config, callback);
    };

    /**
     * 删除
     * @param config
     * @param callback
     * @returns {*}
     */
    transportAirplaneService.del = function(config, callback){
        return easyHttp.post('logistics.delTransport', config, callback);
    };

    /**
     * 三字码校验
     * @param config
     * @param callback
     * @returns {*}
     */
    transportAirplaneService.checkIata = function(config, callback){
        return easyHttp.get('logistics.checkTransportIata', config, callback);
    };

    return transportAirplaneService;
}]);