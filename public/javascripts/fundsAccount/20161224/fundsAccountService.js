app.factory('fundsAccountService', ['easyHttp', function (easyHttp) {
    var fundsAccountService = {};

    /**
     * 数字处理。返回Number类型数据
     * @param number
     * @returns {*}
     */
    fundsAccountService.digital = function (number) {
        var ret = parseFloat(number);

        ret = isNaN(ret) ? 0 : ret;

        return ret;
    };

    fundsAccountService.dealNumber = function(money){
        var resMoney;
        if(money && money != null){
            money = String(money);
            var left = money.split('.')[0],right = money.split('.')[1];
            right = right ? (right.length >= 2 ? '.' + right.substr(0,2) : '.' + right +'0') : '.00';
            var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
            resMoney = (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
        }else if(money === 0){
            resMoney = '0.00';
        }else{
            resMoney = "";
        }
        return resMoney
    };

    fundsAccountService.getAccountManagerList = function (config, callback) {
        return easyHttp.get('logistics.getAccountManagerList', config, callback);
    };

    fundsAccountService.getCustomerId = function (config, callback) {
        return easyHttp.get('logistics.getCustomerId', config, callback);
    };

    fundsAccountService.openAccountManager = function(config, callback){
        return easyHttp.get('logistics.openAccountManager', config, callback);
    };

    fundsAccountService.getAccountInfo = function (config, callback) {
        return easyHttp.get('logistics.getAccountInfo', config, callback);
    };

    fundsAccountService.getAccountBank = function (config, callback) {
        return easyHttp.get('logistics.getAccountBank', config, callback);
    };

    fundsAccountService.getBankCardList = function (config, callback) {
        return easyHttp.get('logistics.getBankCardList', config, callback);
    };

    fundsAccountService.getBankVerdCardList = function(config, callback){
        return easyHttp.get('logistics.getBankVerdCardList', config, callback);
    };

    fundsAccountService.getRechargeInfo = function (callback) {
        easyHttp.get('logistics.submitRecharge', callback);
    };

    fundsAccountService.unbundledBankCard = function (config, callback) {
        return easyHttp.get('logistics.unbundledBankCard', config, callback);
    };

    fundsAccountService.sendSms = function (config, callback) {
        return easyHttp.get('logistics.sendSmsOnBankModel', config, callback);
    };

    fundsAccountService.getBankList = function (callback) {
        return easyHttp.get('logistics.getBankList', callback);
    };

    fundsAccountService.getSubbranchList = function (config, callback) {
        return easyHttp.get('logistics.getSubbranchList', config, callback);
    };

    fundsAccountService.ansycVerCode = function (config, callback) {
        return easyHttp.get('logistics.ansycVerCode', config, callback);
    };

    fundsAccountService.saveBankCard = function (config, callback) {
        return easyHttp.post('logistics.saveBankCard', config, callback);
    };

    fundsAccountService.getFeeCheck = function (config, callback) {
        return easyHttp.post('logistics.getFeeCheck', config, callback);
    };

    fundsAccountService.confirmVerifyAccount = function (config, callback) {
        return easyHttp.post('logistics.confirmVerifyAccount', config, callback);
    };

    fundsAccountService.getBussinessRecordDetail = function(config, callback){
        return easyHttp.get('logistics.getBussinessRecordDetail', config, callback);
    };

    fundsAccountService.submitRecharge = function(config, callback){
        return easyHttp.post('logistics.submitRecharge', config, callback);
    };

    fundsAccountService.getSignature = function(config, callback){
        return easyHttp.post('logistics.getSignature', config, callback);
    };

    fundsAccountService.ansycCardNo = function(config, callback){
        return easyHttp.get('logistics.ansycCardNo', config, callback);
    };

    fundsAccountService.getTransPassSignature = function(config, callback){
        return easyHttp.get('logistics.getTransPassSignature', config, callback);
    };

    fundsAccountService.getPaymentSignature = function(config, callback){
        return easyHttp.post('logistics.getPaymentSignature', config, callback);
    };

    fundsAccountService.paymentCallback = function(config, callback){
        return easyHttp.post('logistics.paymentCallback', config, callback);
    };

    fundsAccountService.withdrawCallback = function(config, callback){
        return easyHttp.post('logistics.withdrawCallback', config, callback);
    };

    return fundsAccountService;
}]);