app.factory('regionDetailService', ['easyHttp', function(easyHttp) {
    var regionDetailService = {};

    /**
     * 删除分区方案详情
     * @param param  {'urlParams':{},'seatParams':{}}
     * @param callback    回调
     * @returns {*}
     */
    regionDetailService.del = function(param, callback){
        return easyHttp.post('logistics.delRegionDetail', {'urlParams':param}, callback);
    };

    regionDetailService.saveRegionDetail = function(config, callback){
        return easyHttp.post('logistics.saveRegionDetail', config, callback);
    };

    /**
     * 通过ID获取分区方案详情的详情
     * @param id
     * @param callback
     * @returns {*}
     */
    regionDetailService.getEdit = function(id, callback){
        return easyHttp.get('logistics.editRegionDetail', {'seatParams':{'id':id}}, callback);
    };

    /**
     * 保存修改分区方案详情
     * @param config
     * @param callback
     * @returns {*}
     */
    regionDetailService.saveEditRegionDetail = function(config, callback){
        return easyHttp.post('logistics.saveEditRegionDetail', config, callback);
    };

    /**
     * 获取国家
     * @param data
     * @returns {*}
     */
    regionDetailService.getCountry = function(config, callback){
        return easyHttp.get('logistics.getCountry', config, callback);
    };

    /**
     * 获取国家列表
     * @returns {*}
     */
    regionDetailService.getCountryData = function(config){
        return easyHttp.get("logistics.getCountry",config);
    };

    /**
     * 获取国家对于的省，市，区……
     * @param countryCode
     * @param parentId
     * @returns {*}
     */
    regionDetailService.getAddressData = function(countryCode, parentId) {
        return easyHttp.get("logistics.search", {urlParams: {"countryCode": countryCode,"parentId": parentId}});
    };

    /**
     * 编码异步校验
     * @param config
     * @param callback
     * @returns {*}
     */
    regionDetailService.checkCode = function(config, callback){
        return easyHttp.get('logistics.checkRegionDetailCode', config, callback);
    };

    /**
     * 获取国家数据
     * @param config
     * @param callback
     */
    regionDetailService.getCountryList = function(config, callback){
        return easyHttp.get("logistics.getCountry", config, callback);
    };

    /**
     * 获取海运空运地区
     * @param config
     * @returns {*}
     */
    regionDetailService.getCityList = function(config, callback){
        return easyHttp.get("logistics.getCity", config, callback);
    };

    regionDetailService.getAirSeaData = function(config, callback){
        return easyHttp.get("logistics.getAirSeaList", config, callback);
    };

    return regionDetailService;
}]);