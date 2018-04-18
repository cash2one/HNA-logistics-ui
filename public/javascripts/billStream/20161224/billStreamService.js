app.factory('billStreamService', ['$http', 'easyHttp', function($http, easyHttp) {
    var billStreamService = {};

    billStreamService.getFlowProcess = function(config){
        return easyHttp.get('logistics.getBillFlowProcess', config);
    };

    return billStreamService;
}]);