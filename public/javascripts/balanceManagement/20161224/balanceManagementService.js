app.factory('balanceManagementService', ['easyHttp', function(easyHttp) {
    var balanceManagementService = {};
    /*查询账户是否设置了密码*/
    balanceManagementService.isNeedPassword = function(callback){
    	return easyHttp.get('logistics.isNeedPassword', callback)
    };
    /*物流账户信息查询*/
    balanceManagementService.getLogisticAccountInfo = function(param, callback){
    	return easyHttp.get('logistics.getLogisticAccountInfo', param, callback);
    };
    /*物流账户余额查询*/
    /*balanceManagementService.getLogisticAccountBalance = function(param, callback){
    	return easyHttp.get('logistics.getLogisticAccountBalance', param, callback);
    };*/
    /*验证原始支付密码*/
    balanceManagementService.verifyPayPwd = function(param, callback){
    	return easyHttp.post('logistics.verifyPayPwd', param, callback);
    };
    /*充值*/
    balanceManagementService.logisticAccountRecharge = function(param, callback){
    	return easyHttp.post('logistics.logisticAccountRecharge', param, callback);
    };
    /*当前物流账户是否被锁定*/
    balanceManagementService.isLogisticAccountLocked = function(callback){
		return easyHttp.post('logistics.isLogisticAccountLocked', callback);
    };
    return balanceManagementService;
}]);