app.factory('service', ['easyHttp', function(easyHttp) {
    var service = {};
    service.verifyPass = function(param, callback) {
        return easyHttp.post('logistics.verifyPass', {'urlParams':param, 'seatParams':param.seatParams}, callback);
    }
    service.nopassDraft = function(param, callback) {
        return easyHttp.post('logistics.nopassDraft', {'urlParams':param}, callback);
    }
    service.startUse = function(param, callback) {
        return easyHttp.post('logistics.startUse', {'urlParams':param}, callback);
    }
    service.stopUse = function(param, callback) {
        return easyHttp.post('logistics.stopUse', {'urlParams':param}, callback);
    }
    return service;
}]);