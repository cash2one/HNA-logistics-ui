app.factory('contractDetailService', ['easyHttp', function(easyHttp) {
    var contractDetailService = {};

    //获取合同列表类型
    contractDetailService.getContractType = function (callback) {
        return easyHttp.get('logistics.getContractType', callback);
    }

    contractDetailService.getContractTemplateByType = function (param,callback) {
        return easyHttp.get('logistics.getContractTemplateByType',{'urlParams':param},callback)
    }

    //新增合同
    contractDetailService.saveContract = function (param,callback) {
        return easyHttp.post('logistics.saveContract',{'urlParams':param}, callback);
    }

    //根据Id获取合同详情
    contractDetailService.getContractById = function (param,callback) {
        return easyHttp.get('logistics.getContractById',{'seatParams':{id:param}}, callback);
    }

    //根据模板Id获取模板信息
    contractDetailService.getContractTemplateById = function (param,callback) {
        return easyHttp.get('logistics.getContractTemplateById',{'seatParams':{id:param}}, callback);
    }
    //修改合同
    contractDetailService.updateContract = function (param,callback) {
        return easyHttp.post('logistics.updateContract', {'urlParams':param,'seatParams':{id:param.id}},callback);
    }

    //删除合同
    contractDetailService.delContract = function(param, callback) {
        return easyHttp.del('logistics.delContract', {'urlParams':param}, callback);
    };

    return contractDetailService;
}]);