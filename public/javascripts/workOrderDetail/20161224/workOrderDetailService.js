app.factory('workOrderDetailService', ['$http','easyHttp',function($http,easyHttp) {
    var workOrderDetailService = {};
    //获取工单类型列表页面
    workOrderDetailService.getWorkOrderTypeList = function(config,callback){
        return easyHttp.get("logistics.getWorkOrderTypeList",config,callback);
    };
    //根据类型查询工单列表
    workOrderDetailService.getCodeList = function(config,callback){
        return easyHttp.get("logistics.getCodeList",config,callback);
    };
    //根据code校验工单是否存在 如果存在获取匿名用户名和联系方式
    workOrderDetailService.checkWorkOrder = function(config,callback){
        return easyHttp.get("logistics.checkWorkOrder",config,callback);
    };
    //根据orderNo校验工单是否存在 如果存在获取用户名和联系方式
    workOrderDetailService.checkorderNo = function(config,callback){
        return easyHttp.get("logistics.checkorderNo",config,callback);
    };
    //获取员工列表
    workOrderDetailService.getStaffList = function(config,callback){
        return easyHttp.get("logistics.getUserSelect",config,callback);
    };

    //凭借ID查找工单详细信息
    workOrderDetailService.getWorkOrderDetailById = function(config,callback){
        return easyHttp.get("logistics.getWorkOrderDetailById",config,callback);
    };
    //新增工单
    workOrderDetailService.createWorkOrder = function(config,callback){
        return easyHttp.post("logistics.createWorkOrder",config,callback);
    };

    //处理工单
    workOrderDetailService.handleWorkOrder = function(config,callback){
        return easyHttp.post("logistics.handleWorkOrder",config,callback);
    };
    return workOrderDetailService;
}]);