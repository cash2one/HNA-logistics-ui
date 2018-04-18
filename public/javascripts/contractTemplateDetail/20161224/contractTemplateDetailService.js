app.factory('contractTemplateDetailService', ['easyHttp', function(easyHttp) {
    var contractTemplateDetailService = {};

    //获取合同列表类型
    contractTemplateDetailService.getContractType = function (callback) {
        return easyHttp.get('logistics.getContractType', callback);
    }

    //新增合同模板
    contractTemplateDetailService.saveContractTemplate = function (param,callback) {
        return easyHttp.post('logistics.saveContractTemplate',{'urlParams':param}, callback);
    }

    //判断合同模板名称唯一性

    contractTemplateDetailService.checkTemplateNameUnique = function (param,callback) {
        return easyHttp.get('logistics.checkTemplateNameUnique',{'urlParams':param}, callback);
    }

    //修改合同模板
    contractTemplateDetailService.updateContractTemplate = function (param,callback) {
        return easyHttp.post('logistics.updateContractTemplate', {'urlParams':param,'seatParams':{id:param.id}},callback);
    }

    //删除合同模板
    contractTemplateDetailService.deleteContactTemplate = function(param, callback) {
        return easyHttp.del('logistics.deleteContactTemplate', {'urlParams':param}, callback);
    };

    //通过ID获取合同列表类型
    contractTemplateDetailService.getContractTemplateById = function (param,callback) {
        return easyHttp.get('logistics.getContractTemplateById',{'seatParams':{id:param}}, callback);
    }

    return contractTemplateDetailService;
}]);