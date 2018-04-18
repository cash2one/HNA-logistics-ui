app.factory('customerMessageService', ['easyHttp', function (easyHttp) {
    var customerMessageService = {};

    //获取用户列表
    customerMessageService.getCustomerFullNameList = function (param) {
        return easyHttp.get("logistics.searchAllCustomerList", param)
    }

    //删除用户列表
    customerMessageService.delCustomerMsg = function (param, callback) {
        easyHttp.post("logistics.delCustomerMsg", {'urlParams': param}, callback)
    }


    return customerMessageService;
}]);