app.factory('contractsService', ['easyHttp', function(easyHttp) {
    var contractsService = {};


    contractsService.delContracts = function (param,callback) {
        return easyHttp.post('logistics.delContracts',{'urlParams':param}, callback);
    }

    contractsService.getContractType = function (callback) {
        return easyHttp.get('logistics.getContractType', callback);
    }


    //新增合同－－基于自定义文件上传
    contractsService.uploadContract = function (param,callback) {
        return easyHttp.post('logistics.uploadContract',{'urlParams':param}, callback);
    }
    return contractsService;
}]);