app.factory('tradeKeyIndicatorService', ['easyHttp', function(easyHttp) {
    var tradeKeyIndicatorService = {};
    /*获取全部贸易关键指标*/
    tradeKeyIndicatorService.getAllTradeKeyIndicator = function(param, callback){
        return easyHttp.get('logistics.getAllTradeKeyIndicator', param, callback);
    };
    /*添加贸易关键指标*/
    tradeKeyIndicatorService.addTradeKeyIndicator = function(param, callback){
        return easyHttp.post('logistics.addTradeKeyIndicator', param, callback);
    };
    /*修改贸易关键指标*/
    tradeKeyIndicatorService.modifyTradeKeyIndicator = function(config, callback){
        return easyHttp.post('logistics.modifyTradeKeyIndicator', config, callback);
    };
    /*删除贸易关键指标*/
    tradeKeyIndicatorService.delTradeKeyIndicator = function(config, callback){
        return easyHttp.post('logistics.delTradeKeyIndicator', config, callback);
    };
    return tradeKeyIndicatorService;
}]);