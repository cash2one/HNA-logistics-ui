app.factory('costService', ['easyHttp', function(easyHttp) {
    var costService = {};

    /**
     * 获取费用类型大类
     * @param callback
     * @returns {*}
     */
    costService.getBigType = function(callback){
        return easyHttp.get('logistics.getBigType', callback);
    };

    /**
     * 删除费用类型
     * @param param
     * @param callback
     * @returns {*}
     */
    costService.delCost = function(param, callback){
        return easyHttp.post('logistics.delCost', {'urlParams':param}, callback);
    };

    /**
     * 获取语言库
     * @param callback
     */
    costService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    /**
     * 保存新增费用类型
     * @param config
     * @param callback
     * @returns {*}
     */
    costService.saveCost = function(config, callback){
        return easyHttp.post('logistics.saveCost', config, callback);
    };

    /**
     * 保存修改费用类型
     * @param config
     * @param callback
     * @returns {*}
     */
    costService.saveEditCost = function(config, callback){
        return easyHttp.post('logistics.saveEidtCost', config, callback);
    };

    /**
     * 获取费用类型详情
     * @param id
     * @param callback
     * @returns {*}
     */
    costService.getCostDetail = function(id, callback){
        return easyHttp.get('logistics.getCostDetail', {'seatParams':{'id':id}}, callback);
    };

    costService.checkCode = function(config, callback){
        return easyHttp.get('logistics.checkCostCode', config, callback);
    };

    return costService;
}]);