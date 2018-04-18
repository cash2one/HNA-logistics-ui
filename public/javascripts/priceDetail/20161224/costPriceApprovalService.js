app.factory('service', ['$http', 'easyHttp', function($http, easyHttp) {
    var service = {};

    /**
     * 审核通过
     * @param config
     * @param callback
     * @returns {*}
     */
    service.auditPassed = function(config, callback){
        return easyHttp.post('logistics.costPriceAuditPassed', config, callback);
    };

    /**
     * 打回草稿
     * @param config
     * @param callback
     * @returns {*}
     */
    service.returnDraft = function(config, callback){
        return easyHttp.post('logistics.costPriceReturnDraft', config, callback);
    };

    /**
     * 停用价格方案
     * @param config
     * @param callback
     * @returns {*}
     */
    service.stopPrice = function(config, callback){
        return easyHttp.post('logistics.stopUse', config, callback);
    };

    /**
     * 启用价格方案
     * @param config
     * @param callback
     * @returns {*}
     */
    service.startPrice = function(config, callback){
        return easyHttp.post('logistics.startUse', config, callback);
    };

    return service;
}]);