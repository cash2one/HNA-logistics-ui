app.factory('orderNumberService', ['easyHttp', 'channelNumberService', 'waybillNumberService', '$http',
    function(easyHttp, channelNumberService, waybillNumberService,$http) {
    var moduleType = easySpa.queryUrlValByKey("module");
    var orderNumberService = {
        //单号规则
        orderNumberRuleSave: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.channelNumberRuleSave(params,callback)
                : waybillNumberService.waybillNumberRuleSave(params,callback);
        },

        orderNumberRuleSaveEdit: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.channelNumberRuleSaveEdit(params,callback)
                : waybillNumberService.waybillNumberRuleSaveEdit(params,callback);
        },

        orderNumberGetRuleDetail: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.channelNumberGetRuleDetail(params,callback)
                : waybillNumberService.waybillNumberGetRuleDetail(params,callback);
        },

        //单号库存
        orderNumberInventorySave: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.orderNumberInventorySave(params,callback)
                : waybillNumberService.waybillNumberInventorySave(params,callback);
        },

        orderNumberInventoryLoadSave: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.orderNumberInventoryLoadSave(params,callback)
                : waybillNumberService.waybillNumberInventoryLoadSave(params,callback);
        },

        orderNumberGetInventoryDetail: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.channelNumberGetInventoryDetail(params,callback)
                : waybillNumberService.waybillNumberGetInventoryDetail(params,callback);
        },

        //单号规则启用
        orderNumberStarUsed: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.orderNumberStarUsed(params,callback)
                : waybillNumberService.orderNumberStarUsed(params,callback);
        },

        //单号规则模拟生成单号
        orderNumberSimulateUsed: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.orderNumberSimulateUsed(params,callback)
                : waybillNumberService.orderNumberSimulateUsed(params,callback);
        },

        //单号规则停用
        orderNumberEndUsed: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.orderNumberEndUsed(params,callback)
                : waybillNumberService.orderNumberEndUsed(params,callback);
        },

        //获取校验规则
        getRegexRule: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.getRegexRule(params,callback)
                : waybillNumberService.getRegexRule(params,callback);
        },
        //获取校验位规则
        getRegexWeiRule: function(params, callback) {
            moduleType == "channelNumber" ? channelNumberService.getRegexWeiRule(params,callback)
                : waybillNumberService.getRegexWeiRule(params,callback);
        }
    };

    //获取服务短接口
    orderNumberService.getServiceShort = function(config,callback){
        return easyHttp.get('logistics.getServiceShort',config,callback);
    };
    //获取生成单号服务短接口
    orderNumberService.getServiceLoadShort = function(config,callback){
        return easyHttp.get('logistics.getServiceLoadShort',config,callback);
    };
    //获取供应商短接口
    orderNumberService.getSupplierShort = function(config,callback){
        return easyHttp.get('logistics.getSupplierShort', config,callback);
    };
    //获取搜索产品组短接口
    orderNumberService.getProductTeamLeafRuleShort = function (param, callback) {
        if (!param) { param = {}; } else { param = { parentId: param }; }
        return easyHttp.get('logistics.queryProductGroup', { urlParams: param }, callback);
    };
    //获取添加产品组短接口
    orderNumberService.getProductTeamRuleShort = function (config, callback) {
        return easyHttp.get('logistics.getProductTeamRuleShort', config,callback);
    };
    //获取产品短接口
    orderNumberService.getProductRuleShort = function(config,callback){
        return easyHttp.get('logistics.getProductRuleShort', config,callback);
    };
    //获取生成单号产品短接口
    orderNumberService.getProductInventoryShort = function(config,callback){
        return easyHttp.get('logistics.getProductInventoryShort', config,callback);
    };
    //获取客户短接口
    orderNumberService.getClienteleShort = function(config,callback){
        return easyHttp.get('logistics.getClienteleShort', config,callback);
    };

    //单号库存导入单号
    orderNumberService.uploadInventoryData = function(file,uid){
        var _10M = 10 * 1024 * 1024,fileAccept = ".xls,.xlsx,.xlt,.xltx,application/msword";
        var res = {};

        if(file == undefined){
            return false;
        }
        if (file.size > _10M) {
            res.errorlocal = "orderNumber_prompt_upload_too_large";
            return res;
        }
        if (file.size === 0) {
            res.errorlocal = "orderNumber_prompt_upload_zero";
            return res;
        }
        if(file.name){
            var fCode,idx = file.name.lastIndexOf('.');
            fCode= file.name.substr(idx + 1);
            if(fileAccept.indexOf(fCode) == -1){
                res.errorlocal = "orderNumber_prompt_upload_accept";
                return res;
            }
        }

        var fd = new FormData();
        fd.append('file', file);
        var args = {
            method: 'POST',
            url: Interface.getUrlById("logistics.uploadInventoryData",{serviceUid:uid}),
            data: fd,
            headers: {'Content-Type': undefined, 'x-token': cookie.get("token")},
            transformRequest: angular.identity
        };
        return $http(args);
    };

    return orderNumberService;
}]);