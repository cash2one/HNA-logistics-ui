app.factory('service', ['$http', 'easyHttp', function($http, easyHttp) {
    var service = {};

    /**
     * 提交审核
     * @param config
     * @param callback
     * @returns {*}
     */
    service.audit = function(config, callback){
        return easyHttp.post('logistics.submitCostPrice', config, callback);
    };

    return service;
}]);