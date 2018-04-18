app.factory('confirmOrderService', ['$http', 'easyHttp', function($http, easyHttp) {



    var confirmOrderService = {};

    confirmOrderService.getOrderStatus = function(params,callback){
        return easyHttp.get("logistics.getOrderStatus",params,callback);
    };

    confirmOrderService.getOrderInfoByorderNo = function(params,callback){
        return easyHttp.get("logistics.getOrderInfoByorderNo", params, callback);
    };

    //货物类型
    confirmOrderService.getCargoTypes = function(params,callback){
        return easyHttp.get("logistics.getGoodTypes",params,callback);
    };
    //产品列表
    confirmOrderService.getProductList = function(config,callback){
        return easyHttp.get("logistics.getProductsListMin",config,callback);
    };
    //货物单位列表
    confirmOrderService.getCargoUnitList = function(config){
        return easyHttp.get("logistics.getWeightUnitList",config);
    };

    //当前客户可见用户列表
    confirmOrderService.getUserList = function(config){
        return easyHttp.get("logistics.getCurrentUserVisibleUserList-confirmOrder",config);
    };

    //拉取可选服务
    confirmOrderService.getServiceList = function(params,callback){
        return easyHttp.get("logistics.getProductServiceTypes",params, callback);
    };

    //拉取用户地址
    confirmOrderService.getAddressList = function(config,callback){
        return easyHttp.get("logistics.queryAddressList",config, callback);
    };

    //获取国家列表
    confirmOrderService.getCountryList =  function (config, callback) {
        return easyHttp.get("logistics.productCountryList",config,callback);
    };

    //获取地址列表
    confirmOrderService.getAddressData =  function(config) {
        return easyHttp.get("logistics.productAreaList", config);
    };

    //保存修改地址
    confirmOrderService.saveOrUpdateAddress =  function(config, callback) {
        return easyHttp.post("logistics.saveOrModifyAddress", config,callback);
    };
    //设置为默认地址
    confirmOrderService.setDefaultAddress = function(config,callback){
        return easyHttp.post("logistics.setDefaultAddress",config,callback);
    };
    //删除地址
    confirmOrderService.delUserAddress = function(config,callback){
        return easyHttp.post("logistics.delUserAddress",config,callback);
    };

    //通过orderId查找订单信息
    confirmOrderService.getOrderInfoByOrderId = function(config,callback){
        return easyHttp.get("logistics.getOrderInfoByOrderId",config,callback);
    };

    //提交下单数据
    confirmOrderService.submitOrder = function(config,callback){
        return easyHttp.post("logistics.getOrdersTable",config,callback);
    };

    //update下单数据
    confirmOrderService.updateOrder = function(config,callback){
        return easyHttp.post("logistics.updateOrder",config,callback);
    };

    //提交下单数据
    confirmOrderService.getUnitDictionary = function(config,callback){
        return easyHttp.get("logistics.getUnitDictionary",config,callback);
    };

    //根据产品Id校验地址是否在范围内
    confirmOrderService.isAddressAccessForCurrentProduce = function(config,callback){
        return easyHttp.get("logistics.isAddressAccessForCurrentProduce",config,callback);
    };

    //获取产品重量是否在限制范围内
    confirmOrderService.isWeightInRange = function(config,callback){
        return easyHttp.post("logistics.isWeightInRange",config,callback);
    };

    //通过账号查找货币单位
    confirmOrderService.getCurrencyByAccountId = function(config,callback){
        return easyHttp.get("logistics.getCurrencyByAccountId",config,callback);
    };
	confirmOrderService.getClientNum = function(config,callback){
        return easyHttp.get("logistics.getClientNum",config,callback);
    };

    //检查客户填写的客户运单号是否已经存在
    confirmOrderService.checkExternalNo = function(config,callback){
        return easyHttp.post("logistics.checkExternalNo",config,callback);
    };

    //获取产品组类型（即地址类型）
    confirmOrderService.getAddressType = function(config){
        return easyHttp.get("logistics.queryProductGroup",config);
    };

    //获取港口、航空数据
    confirmOrderService.getAirSeaData = function(config, callback){
        return easyHttp.get("logistics.getProAirSeaData",config, callback);
    };

    /**
     * 获取产品是否包含揽收服务
     */
    confirmOrderService.getProductReceived = function(config, callback){
        return easyHttp.get("logistics.getProductReceived",config, callback);
    };

    /**
     * 根据产品Id，获取产品组根Id
     */
    confirmOrderService.getProductGroupRootId = function(config, callback){
        return easyHttp.get("logistics.getProductGroupRootId",config, callback);
    }

    confirmOrderService.getProductCargoData = function(config){
        return easyHttp.get("logistics.getProductCargoData",config);
    }

    /**
     * 获取订单支付信息
     * @param config
     * @param callback
     * @returns {*}
     */
    confirmOrderService.getPayInfo = function(config, callback){
        return easyHttp.get("logistics.getPayInfo", config, callback);
    };

    /**
     * 根据orderNo获取订单相关服务信息
     * @param config
     * @param callback
     * @returns {*}
     */
    confirmOrderService.getServiceInfo = function(config, callback){
        return easyHttp.get("logistics.getOrderServiceInfo", config, callback);
    };

    confirmOrderService.getProductAllData = function (config) {
        return easyHttp.get('logistics.getProductAllData',config);
    };

    confirmOrderService.getProductNavItem = function () {
        return easyHttp.get('logistics.getProductNavItem');
    };

    return confirmOrderService;
}]);
