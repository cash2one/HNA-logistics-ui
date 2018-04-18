app.factory('workOrderService', ['easyHttp', function (easyHttp) {
    var workOrderService = {};
    workOrderService.deleteWorkOrder = function (param, callback) {
        easyHttp.post('logistics.deleteWorkOrderList', {'urlParams': param}, callback);
    };
    workOrderService.getCustomerList = function () {
        return easyHttp.get("logistics.getCurrentUserVisibleUserList");
    };
    workOrderService.getStaffList = function (config) {
        return easyHttp.get("logistics.getUserSelect", config);
    };
    //获取用户列表
    workOrderService.getCustomerFullNameList = function (config) {
        return easyHttp.get("logistics.searchAllCustomerList", config)
    };
    return workOrderService;
}]);