app.factory('channelNumberService', ['easyHttp', function(easyHttp) {
    var channelNumberService = {};

    //单号规则
    channelNumberService.channelNumberRuleSave = function(config,callback){
        easyHttp.post("logistics.ruleChSave",config,callback);
    };

    channelNumberService.channelNumberRuleSaveEdit = function(config,callback){
        easyHttp.post("logistics.ruleChSaveEdit",config,callback);
    };

    channelNumberService.channelNumberGetRuleDetail = function(config,callback){
        easyHttp.get("logistics.ruleChDetail",config,callback);
    };

    //单号规则启用
    channelNumberService.orderNumberStarUsed = function(config,callback){
        easyHttp.post('logistics.starChUsed',config, callback);
    };

    //单号规则模拟生成单号
    channelNumberService.orderNumberSimulateUsed = function(config,callback){
        easyHttp.get('logistics.simulateChUsed',config, callback);
    };

    //单号规则停用
    channelNumberService.orderNumberEndUsed = function(config,callback){
        easyHttp.post('logistics.endChUsed',config, callback);
    };

    //获取校验规则
    channelNumberService.getRegexRule = function(config,callback){
        easyHttp.get('logistics.getRegexChRule', config,callback);
    };
    //获取校验位规则
    channelNumberService.getRegexWeiRule = function(callback){
        easyHttp.get('logistics.getRegexWeiChRule',callback);
    };

    //单号库存
    channelNumberService.orderNumberInventorySave = function(config,callback){
        easyHttp.post('logistics.inventoryChSave',config, callback);
    };

    //单号库存导入单号完成上传单号
    channelNumberService.orderNumberInventoryLoadSave = function(config,callback){
        easyHttp.post('logistics.inventoryChLoadSave',config, callback);
    };

    channelNumberService.channelNumberGetInventoryDetail = function(config,callback){
        easyHttp.get("logistics.inventoryChDetail",config,callback);
    };


    return channelNumberService;
}]);