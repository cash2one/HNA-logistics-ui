app.factory('servicesApprovalService', ['$http', 'easyHttp', function($http, easyHttp) {
    var servicesApprovalService = {};

    /**
     * 获取类型
     * @returns {*}
     */
    servicesApprovalService.getServiceTypes = function(config, callback){
        return easyHttp.get('logistics.getSupplierTypes', config, callback);
    };

    /**
     * 获取类型
     * @returns {*}
     */
    servicesApprovalService.getServicesTypeList = function(config, callback){
        return easyHttp.get('logistics.getSupplierTypes', config, callback);
    };
    http://172.16.2.4:8090/pages/viewpage.action?pageId=8950044
    /**
     * 根据id获取服务详情
     * @returns {*}
     */
    servicesApprovalService.getServiceById = function(config, callback){
        return easyHttp.get("logistics.getServiceById", config, callback);
    };
    servicesApprovalService.getWeightValueMode = function (callback) {
        return easyHttp.get('logistics.getWeightValueMode', callback);
    };
    servicesApprovalService.serviceWeightRule = function(config, callback){
        easyHttp.post("logistics.serviceWeightRule", config, callback);
    };
    /**
     * 获取国家列表
     * @returns {*}
     */
    servicesApprovalService.getCountry = function(){
        return easyHttp.get("logistics.getCountry");
    };

    /**
     * 返回货物类型列表
     * @param data
     * @returns {*}
     */
    servicesApprovalService.getGoodTypes = function(config, callback){
        return easyHttp.get('logistics.getGoodTypes', config, callback);
    };

    /**
     * 检索供应商
     * @returns {*}
     */
    servicesApprovalService.retrievalSupplier = function(config){
        return easyHttp.get("logistics.retrievalSupplier", config);
    };

    /**
     * 修改服务
     * @returns {*}
     */
    servicesApprovalService.editServices = function(config, callback){
        return easyHttp.put("logistics.editServices", config, callback);
    };

    /**
     * 根据ID获取供应商
     * @param data
     * @returns {*}
     */
    servicesApprovalService.getSupplierById = function(config, callback){
        return easyHttp.get('logistics.getSupplierById', config, callback);
    };
    servicesApprovalService.getServiceWeightRule = function(config, callback){
        easyHttp.get("logistics.getServiceWeightRule", config, callback);
    };
    /**
     * 审核服务
     * @param data
     * @returns {*}
     */
    servicesApprovalService.examineServices = function(config, callback){
        return easyHttp.post('logistics.examineServices', config, callback);
    };

    /**
     * 打回草稿
     * @param data
     * @returns {*}
     */
    servicesApprovalService.toDraftServices = function(config, callback){
        return easyHttp.post('logistics.toDraftServices', config, callback);
    };

    /**
     * 启用
     * @param data
     * @returns {*}
     */
    servicesApprovalService.enableServices = function(config, callback){
        return easyHttp.post('logistics.enableServices', config, callback);
    };

    /**
     * 停用
     * @param data
     * @returns {*}
     */
    servicesApprovalService.unEnableServices = function(config, callback){
        return easyHttp.post('logistics.unEnableServices', config, callback);
    };

    /**
     * 异步校验服务编码
     * @param data
     * @returns {*}
     */
    servicesApprovalService.validateServiceCode = function(config, callback){
        return easyHttp.get('logistics.validateServiceCode', config, callback);
    };

    /**
     * 打回草稿
     * @param config
     * @param callback
     * @returns {*}
     */
    servicesApprovalService.draftService = function(config, callback){
        return easyHttp.post('logistics.draftService', config, callback);
    };

    /**
     * 审核通过
     * @param config
     * @param callback
     * @returns {*}
     */
    servicesApprovalService.auditService = function(config, callback){
        return easyHttp.post('logistics.auditService', config, callback);
    };

    /**
     * 获取服务流转过程
     * @param config
     * @param callback
     * @returns {*}
     */
    servicesApprovalService.getServiceProcess = function(config, callback){
        return easyHttp.get('logistics.getServiceStream', config, callback);
    };

    // by jinxyang
    servicesApprovalService.saveServicesRegion = function(config, callback){
        return easyHttp.post('logistics.saveServicesRegion', config, callback);
    };

    servicesApprovalService.editServicesRegion = function(config, callback){
        return easyHttp.put('logistics.editServicesRegion', config, callback);
    };

    servicesApprovalService.deleteServicesRegion = function(config, callback){
        return easyHttp.post('logistics.deleteServicesRegion', config, callback);
    };

    servicesApprovalService.editServicesApproval = function(config, callback){
        return easyHttp.put('logistics.editServicesApproval', config, callback);
    };

    // 获取空/海运航线
    servicesApprovalService.getLines = function(config, callback) {
        var url = 'logistics.getAirLineShort';
        if (config.subServiceTypeCode === 'MAINLINESHIP') {
            url = 'logistics.getShippingLineShort';
        }
        return easyHttp.get(url, { urlParams: config.params }, callback);
    }
    // 修改干线服务
    servicesApprovalService.submitFlights = function(config, callback) {
        return easyHttp.post('logistics.changeFlightService', config, callback);
    }

    servicesApprovalService.retrievalSupplier = function(config){
      return easyHttp.get("logistics.retrievalSupplier", config);
    }

    /**
     * 根据ID获取供应商
     * @param data
     * @returns {*}
     */
    servicesApprovalService.getSupplierById = function(config, callback){
        return easyHttp.get('logistics.getSupplierById', config, callback);
    };

    // 获取时效单位
    servicesApprovalService.getProductEstimated = function (param, callback) {
        return easyHttp.get('logistics.getProductEstimated', callback);
    };

    return servicesApprovalService;
}]);
