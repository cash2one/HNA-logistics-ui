app.factory('stationPortService', ['easyHttp', function(easyHttp) {
    var stationPortService = {};

    /**
     * 获取国家
     * @param data
     * @returns {*}
     */
    stationPortService.getCountry = function(config){
        return easyHttp.get('logistics.getCountry', config);
    };

    /**
     * 获取城市
     * @param data
     * @returns {*}
     */
    stationPortService.getCity = function(config){
        return easyHttp.get('logistics.getCity', config);
    };

    /**
     * 获取语言库
     * @param callback
     */
    stationPortService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };
    /**
     * 新增港口信息
     * @param callback
     */
    stationPortService.savePort = function (config,callback) {
        return easyHttp.post('logistics.savePort', config, callback);
    }

    /**
     * 修改港口信息
     * @param callback
     */
    stationPortService.modifyPort = function (config,callback) {
        return easyHttp.put('logistics.modifyPort', config, callback);
    }

    /**
     * 删除港口信息
     * @param callback
     */
    stationPortService.delPort = function (config,callback) {
        return easyHttp.post('logistics.delPort', config, callback);
    }

    /**
     *根据ID获取港口信息
     * @param callback
     */

    stationPortService.getPortById = function (config,callback) {
        return easyHttp.get('logistics.getPortById', config, callback);

    }
    /**
     *异步校验港口代码
     * @param callback
     */

    stationPortService.checkPortCode = function (config,callback) {
        return easyHttp.get('logistics.checkPortCode', config, callback);

    }


    return stationPortService;
}]);