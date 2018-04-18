app.factory('tryBillingService', ['$http', 'easyHttp', function ($http, easyHttp) {
    var tryBillingService = {};

    /**
     * 获取服务列表
     * @param config
     * @param callback
     * @returns {*}
     */
    tryBillingService.getServices = function (config) {
        return easyHttp.get('logistics.getServicesList', config);
    };

    /**
     * 获取产品列表
     * @param config
     * @param callback
     * @returns {*}
     */
    tryBillingService.getProducts = function (config) {
        return easyHttp.get('logistics.getProductsShortList', config);
    };

    /**
     * 获取客户列表
     * @param config
     * @param callback
     * @returns {*}
     */
    tryBillingService.getClient = function (config) {
        return easyHttp.get('logistics.getCustomerList', config);
    };

    /**
     * 获取货物类型
     * @returns {*}
     */
    tryBillingService.getGoods = function () {
        return easyHttp.get('logistics.getGoodTypes');
    };

    /**
     * 获取重量单位
     */
    tryBillingService.getWeightUnitList = function () {
        return easyHttp.get('logistics.getWeightUnitList');
    };

    /**
     * 获取国家列表
     * @returns {*}
     */
    tryBillingService.getCountry = function (config) {
        return easyHttp.get("logistics.getCountry", config);
    };

    /**
     * 搜索地区
     * @param config
     * @param callback
     * @returns {*}
     */
    tryBillingService.getAddressSearch = function (config) {
        return easyHttp.get("logistics.search", config);
    };

    /**
     * 获取结算方式
     * @param config
     * @param callback
     * @returns {*}
     */
    tryBillingService.getAccount = function (config) {
        return easyHttp.get('logistics.getAccountTable', config);
    };

    /**
     * 计算服务成本价
     * @param config
     * @param callback
     * @returns {*}
     */
    tryBillingService.calcService = function (config, callback) {
        easyHttp.post('logistics.calcService', config, callback);
    };

    /**
     * 计算产品计费
     * @param config
     * @param callback
     * @returns {*}
     */
    tryBillingService.calcProduct = function (config, callback) {
        easyHttp.post('logistics.calcProduct', config, callback);
    };

    return tryBillingService;
}]);