app.factory('shippingSettingService', ['easyHttp', function(easyHttp) {
    var shippingSettingService = {};

    shippingSettingService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    //删除海运航班
    shippingSettingService.del = function(config, callback){
        return easyHttp.post('logistics.delShippingSetting', config, callback);
    }

    //搜索港口短接口
    shippingSettingService.getPortShort = function(config){
        return easyHttp.get("logistics.getShippingPort", config);
    }

    //获取海运航班
    shippingSettingService.getShippingLine = function(config,callback){
        return easyHttp.get('logistics.getShipinglineSettingsDetail', config, callback);
    }

    //Detail 使用接口

    //获取船舶短接口
    shippingSettingService.getShippingShort = function(param){
            return easyHttp.get('logistics.getShippingShort', {'urlParams':param});
    };


    //获取海运航线接口
    shippingSettingService.getShippingLineShort = function(param){
        return easyHttp.get('logistics.getShippingLineShort', {'urlParams':param});
    };


    //增加海运航班
    shippingSettingService.addShipingLineSettingsDetail = function (param,callback) {
        return easyHttp.post('logistics.addShipingLineSettingsDetail', {'urlParams':param},callback);
    }

    //修改海运航班
    shippingSettingService.modifyShipingLineSettingsDetail = function (param,callback) {
        return easyHttp.post('logistics.modifyShipingLineSettingsDetail', param,callback);
    }

    //检查海运航班航次号是否唯一
    shippingSettingService.checkShippingVesselUnique = function (param,callback) {
        return easyHttp.get('logistics.checkShippingVesselUnique', param,callback);
    }
    return shippingSettingService;
}]);