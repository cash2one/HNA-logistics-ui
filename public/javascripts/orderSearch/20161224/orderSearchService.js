app.factory('orderSearchService', ['$http', 'easyHttp', function ($http, easyHttp) {
    var orderSearchService = {};
    /**
     * 获取订单状态列表
     * @returns {*}
     */
    orderSearchService.getOrderStatus = function () {
        return easyHttp.get('logistics.getOrderStatus');
    };

    /**
     * 获取客户账号下拉列表   凭借主账号Id查询子账号信息
     * @param config
     */
    orderSearchService.getClient = function (config) {
        return easyHttp.get('logistics.getCusUserList', config);
    };
    /**
     * 获取客户账户下拉列表(主账号)
     * @param config
     */
    orderSearchService.getCustomer = function (config) {
        return easyHttp.get('logistics.getCustomerList', config);
    };

    /**
     * 删除订单
     */
    orderSearchService.del = function (config, callback) {
        easyHttp.post('logistics.delOrders', config, callback);
    };

    orderSearchService.getUserNameList = function (config) {
        return easyHttp.get('logistics.getCurrentUserVisibleUserList-confirmOrder', config);
    };

    /*查询结果不包括审核未通过的*/

    orderSearchService.getUserNameListWithoutNoAudit = function (config) {
        return easyHttp.get('logistics.getCustomerUserNameWithOutNoAudit', config);
    };


    orderSearchService.getProductAllData = function (config) {
        return easyHttp.get('logistics.getProductAllData',config);
    };

    orderSearchService.getProductNavItem = function () {
        return easyHttp.get('logistics.getProductNavItem');
    };

    return orderSearchService;
}]);