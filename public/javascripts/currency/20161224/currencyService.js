app.factory('currencyService', ['easyHttp', function(easyHttp) {
    var currencyService = {};
    currencyService.delCurrency = function(param, callback) {
        return easyHttp.post('logistics.deleteCurrencys', {'urlParams':param, async:false}, callback);
    };
    currencyService.getInternational = function(callback) {//获取国际化语言
        return easyHttp.get('logistics.getInternational', callback);
    };
    currencyService.createCurrency = function(param, callback) {
        return easyHttp.post('logistics.createCurrency', {'urlParams':param}, callback);
    }
    currencyService.updateCurrency = function(param, callback) {
        return easyHttp.put('logistics.updateCurrency', {'urlParams':param}, callback);
    }
    currencyService.getCountryList = function(callback) {//获取国际化语言
        return easyHttp.get('logistics.getCountry', {async:false}, callback);
    };
    currencyService.verifyCodeExist = function(param, callback) {
        return easyHttp.get('logistics.verifyCodeExist', {'seatParams':param.seatParams, async:false}, callback);
    }
    return currencyService;
}]);