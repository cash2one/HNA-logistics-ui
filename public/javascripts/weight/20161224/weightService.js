app.factory('weightService', ['easyHttp', function(easyHttp) {
    var weightService = {};
    weightService.deleteWeightList = function(param, callback) {
        return easyHttp.post('logistics.deleteWeightList', {'urlParams':param}, callback);
    };
    weightService.getDefaultBeginPoint = function(callback) {
        return easyHttp.get('logistics.getDefaultBeginPoint', callback);
    }
    weightService.addWeight = function(param, callback) {
        return easyHttp.post('logistics.addWeight', {'urlParams':param}, callback);
    }
    weightService.updateWeight = function(param, callback) {
        return easyHttp.put('logistics.updateWeight', {'urlParams':param}, callback);
    }
    weightService.isExistedCode = function(param) {
        return easyHttp.get('logistics.isExistedCode', {'urlParams':param});
    }
    weightService.getWeightUnitList = function() {
        return easyHttp.get('logistics.getWeightUnitList');
    }
    return weightService;
}]);