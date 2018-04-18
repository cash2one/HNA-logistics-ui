app.factory('customerMessageDetailService', ['easyHttp', function(easyHttp) {
    var customerMessageDetailService = {};
    //获取留言聊天记录
    customerMessageDetailService.getMsgHistoryList =function (param,callback) {
        return easyHttp.get("logistics.getMsgHistoryList",param,callback);
    };

    // 关闭对话框
    customerMessageDetailService.closeLeaveMsg = function (param,callback) {
        return easyHttp.put("logistics.closeLeaveMsg",param,callback);

    };

    //留言
    customerMessageDetailService.leaveMsg = function (param,callback) {
        return easyHttp.post("logistics.leaveMsg",param,callback);
    }
    //获取留言客户详细信息
    customerMessageDetailService.getCustomerDetailInfo = function (param,callback) {
        return easyHttp.get("logistics.getCustomerDetailInfo",param,callback);

    }
    return customerMessageDetailService;
}]);