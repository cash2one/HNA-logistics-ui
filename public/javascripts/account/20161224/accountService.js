app.factory('accountService', ['easyHttp', function(easyHttp) {
    var accountService = {};

    /**
     * 获取语言库
     * @param callback
     */
    accountService.getLanguage = function(callback){
        return easyHttp.get('logistics.getInternational', callback);
    };

    /**
     * 删除结算方式
     * @param param  {'urlParams':{},'seatParams':{}}
     * @param callback    回调
     * @returns {*}
     */
    accountService.delAccount = function(param, callback){
        return easyHttp.post('logistics.delAccount', {'urlParams':param}, callback);
    };

    /**
     * 保存新增结算方式
     * @param config
     * @param callback
     * @returns {*}
     */
    accountService.saveAccount = function(config, callback){
        return easyHttp.post('logistics.saveAccount', config, callback);
    };

    accountService.saveEditAccount = function(config, callback){
        return easyHttp.post('logistics.saveEditAccount', config, callback);
    };

    /**
     * 获取结算费方式详情
     * @param id    结算方式Id
     * @param callback
     * @returns {*}
     */
    accountService.getAccountDetail = function(id, callback){
        return easyHttp.get('logistics.getAccountDetail', {'seatParams':{'id':id}}, callback);
    };

    accountService.checkCode = function(config, callback){
        return easyHttp.get('logistics.checkAccountCode', config, callback);
    };

    return accountService;
}]);