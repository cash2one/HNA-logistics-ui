app.factory('priceService', ['easyHttp', function(easyHttp) {
    var priceService = {};
    priceService.getAccount = function(config, callback){
        return easyHttp.get('logistics.getAccountTable',config, callback);
    };
    priceService.getCost = function(config, callback){
        return easyHttp.get('logistics.getCostTable', config, callback);
    };
    priceService.getCostType = function(callback){
        return easyHttp.get('logistics.getBigType', {"async": true}, callback);
    };
    priceService.getGoods = function(callback){
        return easyHttp.get('logistics.getGoodTypes', {"urlParams": {"async": true}}, callback);
    };
    priceService.getCurrencyList = function(param, callback) {
        return easyHttp.get('logistics.getAllCurrencyList', { urlParams: param }, callback);
    };
    priceService.getServices = function(config, callback) {
        return easyHttp.get('logistics.getServicesList', config, callback);
    };
    priceService.getProducts = function(config, callback){
      return easyHttp.get('logistics.getProductsList', config, callback);
    };

    priceService.getProductAllData = function (config) {
        return easyHttp.get('logistics.getProductAllData',config);
    };
    priceService.getProductNavItem = function () {
        return easyHttp.get('logistics.getProductNavItem');
    };
    
    return priceService;
}]);
