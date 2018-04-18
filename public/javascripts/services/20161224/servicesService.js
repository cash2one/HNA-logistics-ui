//@ sourceURL=servicesService.js
app.factory('servicesService', ['$http', 'easyHttp', function($http, easyHttp) {
    var servicesService = {};

    /**
     * 返回服务类型列表
     * @param data
     * @returns {*}
     */
    servicesService.getServicesTypes = function(callback){
        easyHttp.get('logistics.getSupplierTypes', callback);
    };

    /**
     * 返回服务类型列表
     * @param data
     * @returns {*}
     */
    servicesService.getServicesTypeList = function(){
        return easyHttp.get('logistics.getSupplierTypes');
    };

    /**
     * 异步校验服务编码
     * @param data
     * @returns {*}
     */
    servicesService.validateServiceCode = function(config, callback){
        easyHttp.get('logistics.validateServiceCode', config, callback);
    };

    /**
     * 返回货物类型列表
     * @param data
     * @returns {*}
     */
    servicesService.getGoodTypes = function(config, callback){
        easyHttp.get('logistics.getGoodTypes', config, callback);
    };

    /**
     * 获取国家列表
     * @returns {*}
     */
    servicesService.getCountry = function(){
        return easyHttp.get("logistics.getCountry");
    };

    /**
     * 根据id获取服务详情
     * @returns {*}
     */
    servicesService.getServiceById = function(config, callback){
        easyHttp.get("logistics.getServiceById", config, callback);
    };
    servicesService.getWeightValueMode = function (callback) {
        return easyHttp.get('logistics.getWeightValueMode', callback);
    };
    /**
     * 检索供应商 不用这个接口，用下面的，暂时先不删除
     * @returns {*}
     */
    servicesService.retrievalSupplier = function(config){
        return easyHttp.get("logistics.retrievalSupplier", config);
    };

    servicesService.serviceGetSupplier = function (config) {
        return easyHttp.get("logistics.serviceGetSupplier",config);
    }
    /**
     * 新建服务
     * @returns {*}
     */
    servicesService.addServices = function(config, callback){
        easyHttp.post("logistics.addServices", config, callback);
    };

    /**
     * 修改服务
     * @returns {*}
     */
    servicesService.editServices = function(config, callback){
        easyHttp.put("logistics.editServices", config, callback);
    };
    servicesService.getServiceWeightRule = function(config, callback){
        easyHttp.get("logistics.getServiceWeightRule", config, callback);
    };
    /**
     * 计重规则
     * @returns {*}
     */
     servicesService.serviceWeightRule = function(config, callback){
        easyHttp.post("logistics.serviceWeightRule", config, callback);
    };

    /**
     * 删除服务
     * @returns {*}
     */
    servicesService.deleteServices = function(config, callback){
        easyHttp.post("logistics.deleteServices", config, callback);
    };

    /**
     * 审核服务
     * @returns {*}
     */
    servicesService.toAuditServices = function(config, callback){
        easyHttp.post("logistics.toAuditServices", config, callback);
    };

    /**
     * 根据ID获取供应商
     * @param data
     * @returns {*}
     */
    servicesService.getSupplierById = function(config, callback){
         easyHttp.get('logistics.getSupplierById', config, callback);
    };

    /**
     * 获取服务流转过程
     * @param config
     * @param callback
     * @returns {*}
     */
    servicesService.getServiceProcess = function(config, callback){
        easyHttp.get('logistics.getServiceStream', config, callback);
    };

    // by jinxyang
    servicesService.saveServicesRegion = function(config, callback){
        easyHttp.post('logistics.saveServicesRegion', config, callback);
    };

    servicesService.editServicesRegion = function(config, callback){
        easyHttp.put('logistics.editServicesRegion', config, callback);
    };

    servicesService.deleteServicesRegion = function(config, callback){
        easyHttp.post('logistics.deleteServicesRegion', config, callback);
    };

    // 获取空/海运航线
    servicesService.getLines = function(config, callback) {
        var url = 'logistics.getAirLineShort';
        if (config.subServiceTypeCode === 'MAINLINESHIP') {
            url = 'logistics.getShippingLineShort';
        }
        easyHttp.get(url, { urlParams: config.params }, callback);
    }

    // 获取航班/航次
    servicesService.getFlights = function (url, params, callback) {
        easyHttp.get(url, { urlParams: params }, callback);
    }

    // 修改干线服务
    servicesService.submitFlights = function(config, callback) {
        easyHttp.post('logistics.changeFlightService', config, callback);
    }

    // 获取时效单位
    servicesService.getProductEstimated = function (param, callback) {
        easyHttp.get('logistics.getProductEstimated', callback);
    };

    return servicesService;
}]);