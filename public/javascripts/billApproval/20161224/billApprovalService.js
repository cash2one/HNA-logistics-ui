app.factory('billApprovalService', ['$http', 'easyHttp', function ($http, easyHttp) {
    var billApprovalService = {};

    /**
     * 获取客户账户下拉列表
     * @param config
     */
    billApprovalService.getCustomer = function (config) {
        return easyHttp.get('logistics.getCustomerShortList', config);
    };

    /**
     * 获取供应商下拉列表
     * @param config
     */
    billApprovalService.getSupplierList = function (config) {
        return easyHttp.get("logistics.retrievalSupplierList", config);
    };

    /**
     * 获取平台实体下拉列表
     * @param config
     */
    billApprovalService.getPlatformData = function (config) {
        return easyHttp.get('logistics.getEnterpriseNameTradePlatform', config);
    };

    /**
     * 获取状态列表
     * @returns {*}
     */
    billApprovalService.getStatus = function (config) {
        return easyHttp.get('logistics.getBillingStatus', config);
    };

    /**
     * 打回草稿, 审核通过，已付款
     * @param config
     * @param callback
     * @returns {*}
     */
    billApprovalService.audit = function (config, callback) {
        return easyHttp.post('logistics.postBillsAudit', config, callback);
    };

    /**
     * 价格调整
     * @param config
     * @param callback
     * @returns {*}
     */
    billApprovalService.adjust = function (config, callback) {
        return easyHttp.post('logistics.adjustBillsPrice', config, callback);
    };

    /**
     * 账单导出
     * @param config
     * @param callback
     * @returns {*}
     */
    billApprovalService.exportExcel = function (config, callback) {
        return easyHttp.post('logistics.billExports', config, callback);
    };


    billApprovalService.getBankCardList = function (config, callback) {
        return easyHttp.get('logistics.getBankCardList', config, callback);
    };

    billApprovalService.getThirdPayAccountId = function (config, callback) {
        return easyHttp.get('logistics.getThirdPayAccountId', config, callback);
    };

    billApprovalService.getPayWayData = function (config) {
        return easyHttp.get('logistics.getAccountTable', config);
    };

    billApprovalService.checkPopType = function (config, callback) {
        return easyHttp.post('logistics.checkPopType', config, callback);
    };

    return billApprovalService;
}]);
