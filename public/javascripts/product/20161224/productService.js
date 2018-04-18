app.factory('productService', ['easyHttp', function(easyHttp) {
    var productService = {};
    productService.getGoods = function(callback){
        return easyHttp.get('logistics.getGoodTypes', {"urlParams": {"async": true}}, callback);
    };
    productService.queryProductGroup = function(param, callback){
        return easyHttp.get('logistics.queryProductGroup', {"urlParams": param}, callback);
    };
    productService.deleteProduct = function(param, callback){
        return easyHttp.post('logistics.deleteProduct', {'urlParams':param}, callback);
    };
    productService.submitProducts = function(param, callback){
        return easyHttp.post('logistics.submitProducts', {'urlParams':param}, callback);
    };
    return productService;
}]);