app.factory('ordersService', ['$http', 'easyHttp', function ($http, easyHttp) {
    var ordersService = {};

    /**
     * 获取客户账号下拉列表   凭借主账号Id查询子账号信息
     * @param config
     */
    ordersService.getClient = function (config) {
        return easyHttp.get('logistics.getCusUserList', config);
    };
    /**
     * 获取客户账户下拉列表(主账号)
     * @param config
     */
    ordersService.getCustomer = function (config) {
        return easyHttp.get('logistics.getCustomerList', config);
    };

    /**
     * 删除订单
     */
    ordersService.del = function (config, callback) {
        easyHttp.post('logistics.delOrders', config, callback);
    };

    ordersService.commitOrder = function (config, callback) {
        easyHttp.post('logistics.commitOrder', config, callback);
    };

    ordersService.sendInform = function (config, callback) {
        easyHttp.post('logistics.sendInform', {urlParams: config}, callback);
    };

    ordersService.orderAccepted = function (config, callback) {
        easyHttp.post('logistics.orderAccepted', config, callback);
    };

    ordersService.checkOrderMessageSend = function (config, callback) {
        easyHttp.post('logistics.checkOrderMessageSend', config, callback);
    };

    ordersService.getPayStatusList = function () {
        return easyHttp.get('logistics.getPayStatusList');
    };

    ordersService.pay = function (config, callback) {
        easyHttp.post('logistics.orderPayTest', config, callback);
    };

    ordersService.getProductAllData = function (config) {
        return easyHttp.get('logistics.getProductAllData',config);
    };

    ordersService.getProductNavItem = function () {
        return easyHttp.get('logistics.getProductNavItem');
    };

    return ordersService;
}]);