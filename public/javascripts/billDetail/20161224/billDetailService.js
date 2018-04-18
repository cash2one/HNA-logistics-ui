app.factory('billDetailService', ['$http', 'easyHttp', function($http, easyHttp) {
    var billDetailService = {};

    /**
     * 打回草稿, 审核通过，已付款
     * @param config
     * @param callback
     * @returns {*}
     */
    billDetailService.audit = function(config, callback){
        return easyHttp.post('logistics.postBillsAudit', config, callback);
    };

    /**
     * 获取客户账号下拉列表   凭借主账号Id查询子账号信息
     * @param config
     */
    billDetailService.getClient = function(config){
        return easyHttp.get('logistics.getCusUserList', config);
    };

    /**
     * 获取
     * @param config
     * @param callback
     * @returns {*}
     */
    billDetailService.getProducts = function(config, callback){
        return easyHttp.get('logistics.getProductsList', config, callback);
    };

    /**
     * 获取
     * @param config
     * @param callback
     * @returns {*}
     */
    billDetailService.getServices = function(config, callback){
        return easyHttp.get('logistics.getServicebyServiceType', config, callback);
    };

    /**
     * 获取平台实体下拉列表
     * @param config
     */
    billDetailService.getPlatformData = function(config){
        return easyHttp.get('logistics.getEnterpriseNameTradePlatform', config);
    };

    /**
     * 获取商品下拉列表
     * @param config
     */
    billDetailService.getGood = function(config){
        return easyHttp.get('logistics.trdGoodList', config);
    };

    /**
     * 获取供应商下拉列表
     * @param config
     */
    billDetailService.getSupplierList = function(config){
        return easyHttp.get("logistics.retrievalSupplier", config);
    };

    billDetailService.getPayStatusData = function(){
        return easyHttp.get("logistics.getPayStatusData");
    };

    return billDetailService;
}]);
