app.factory('service', ['$http', 'easyHttp', function($http, easyHttp) {
    var service = {};

    /**
     * 提交审核销售价
     * @param config
     * @param callback
     * @returns {*}
     */
    service.audit = function(config, callback){
        return easyHttp.post('logistics.submitSalesPrice', config, callback);
    };

    return service;
}]);