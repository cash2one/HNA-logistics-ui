app.factory('paymentPwdManageService', ['easyHttp', function(easyHttp) {
    var paymentPwdManageService = {};
    /*查询账户是否设置了密码*/
    paymentPwdManageService.isNeedPassword = function(callback){
    	return easyHttp.get('logistics.isNeedPassword', callback)
    };
    /*设置支付初始密码*/
    paymentPwdManageService.initPaymentPwd = function(param, callback){
    	return easyHttp.put('logistics.initPaymentPwd', param, callback)
    };
    /*验证原始支付密码*/
    paymentPwdManageService.verifyPayPwd = function(param, callback){
    	return easyHttp.post('logistics.verifyPayPwd', param, callback);
    };
    /*更新支付密码*/
    paymentPwdManageService.updatePaymentPwd = function(param, callback){
    	return easyHttp.put('logistics.updatePaymentPwd', param, callback);
    };
    /*当前物流账户是否被锁定*/
    paymentPwdManageService.isLogisticAccountLocked = function(callback){
        return easyHttp.post('logistics.isLogisticAccountLocked', callback);
    };
    return paymentPwdManageService;
}]);