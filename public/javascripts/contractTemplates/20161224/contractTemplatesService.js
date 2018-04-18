app.factory('contractTemplatesService', ['easyHttp', function(easyHttp) {
    var contractTemplatesService = {};


    //获取合同列表类型
    contractTemplatesService.getContractType = function (callback) {
        return easyHttp.get('logistics.getContractType', callback);
    }
    
    contractTemplatesService.delContractTemplate = function (param,callback) {
        return easyHttp.post('logistics.delContractTemplate',{'urlParams':param}, callback);
    }


    contractTemplatesService.checkContractTemplateName = function (param,callback) {
        return easyHttp.get('logistics.delContractTemplate',{'urlParams':param}, callback)

    }


    return contractTemplatesService;
}]);