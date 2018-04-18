app.factory('waybillNumberService', ['easyHttp', function(easyHttp) {
    var waybillNumberService = {};

    //单号规则
    waybillNumberService.waybillNumberRuleSave = function(config,callback){
        easyHttp.post("logistics.ruleWSave",config,callback);
    };

    waybillNumberService.waybillNumberRuleSaveEdit = function(config,callback){
        easyHttp.post("logistics.ruleWSaveEdit",config,callback);
    };

    waybillNumberService.waybillNumberGetRuleDetail = function(config,callback){
        easyHttp.get("logistics.ruleWDetail",config,callback);
    };

    //单号规则启用
    waybillNumberService.orderNumberStarUsed = function(config,callback){
        easyHttp.post('logistics.starWUsed',config, callback);
    };

    //单号规则模拟生成单号
    waybillNumberService.orderNumberSimulateUsed = function(config,callback){
        easyHttp.get('logistics.simulateWUsed',config, callback);
    };

    //单号规则停用
    waybillNumberService.orderNumberEndUsed = function(config,callback){
        easyHttp.post('logistics.endWUsed',config, callback);
    };

    //获取校验规则
    waybillNumberService.getRegexRule = function(config,callback){
        easyHttp.get('logistics.getRegexWRule', config,callback);
    };

    //获取校验位规则
    waybillNumberService.getRegexWeiRule = function(callback){
        easyHttp.get('logistics.getRegexWeiWRule', callback);
    };

    //单号库存
    waybillNumberService.waybillNumberInventorySave = function(config,callback){
        easyHttp.post("logistics.inventoryWSave",config,callback);
    };

    waybillNumberService.waybillNumberInventoryLoadSave = function(config,callback){
        easyHttp.post("logistics.inventoryWLoadSave",config,callback);
    };

    waybillNumberService.waybillNumberGetInventoryDetail = function(config,callback){
        easyHttp.get("logistics.inventoryWDetail",config,callback);
    };


    return waybillNumberService;
}]);