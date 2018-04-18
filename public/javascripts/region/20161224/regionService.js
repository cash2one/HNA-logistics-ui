app.factory('regionService', ['$http', 'easyHttp', function($http, easyHttp) {
    var regionService = {};

    /**
     * 新增计费分区方案
     * @param
     * @returns {*}
     */
    regionService.addChargingRegion = function(config, callback){
        return easyHttp.post('logistics.addRegion', config, callback);
    }

    /**
     * 修改计费分区方案
     * @param id 分区ID
     * @returns {*}
     */
    regionService.editChargingRegion = function(config, callback){
        return easyHttp.post('logistics.editRegion', config, callback);
    }

    /**
     * 删除计费分区方案
     * @param id 分区ID
     * @returns {*}
     */
    regionService.deleteChargingRegion = function(config, callback){
        return easyHttp.post('logistics.deleteRegion', config, callback);
    }

    /**
     * 获取当前计费分区方案的详情
     * @param id 分区ID
     * @returns {*}
     */
    regionService.getChargingRegionDetail = function(config, callback){
        return easyHttp.get('logistics.getChargingRegionDetail', config, callback);
    }

    /**
     * 异步校验计费分区编码
     * @param id 分区ID
     * @returns {*}
     */
    regionService.validateChargingCode = function(config, callback){
        return easyHttp.get('logistics.validateChargingCode', config, callback);
    }

    return regionService;
}]);