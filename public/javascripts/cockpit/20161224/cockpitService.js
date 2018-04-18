app.factory('cockpitService', ['$http', 'easyHttp', function($http, easyHttp) {
    var cockpitService = {};
    /*驾驶舱数据统计 饼图*/
    cockpitService.getCumulativeStatics = function(config, callback){
        easyHttp.get("logistics.getCumulativeStatics", config, callback);
    };

    /*获取排行数据1:首屏数据*/
    cockpitService.getStaticsRankDefault = function(config, callback){
        easyHttp.get("logistics.getStaticsRankDefault", config, callback);
    };

    /*获取排行数据2:排行&地图单独请求接口*/
    cockpitService.getStaticsRank = function(config, callback){
        easyHttp.get("logistics.getStaticsRank", config, callback);
    };

    /*获取每周统计数据*/
    cockpitService.getWeeklyStatics = function(config, callback){
        easyHttp.get("logistics.getWeeklyStatics", config, callback);
    };

    /*获取物流订单列表*/
    cockpitService.getOrdersTable = function(config, callback){
        easyHttp.get("logistics.getOrdersTable", config, callback);
    };

    /*获取贸易订单列表*/
    cockpitService.getTrdOrderList = function(config, callback){
        easyHttp.get("logistics.getTrdOrderList", config, callback);
    };

    /*获取贸易关键指标数据(最新的三条数据)*/
    cockpitService.getTradeKeyIndicator = function(callback){
        easyHttp.get("logistics.getTradeKeyIndicator", callback);
    };
    return cockpitService;
}]);