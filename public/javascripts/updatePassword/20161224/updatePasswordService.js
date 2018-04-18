app.factory('updatePasswordService', ['easyHttp',function(easyHttp) {
    var updatePasswordService = {};
    updatePasswordService.updatePassword = function(config, callback){
        return easyHttp.post('logistics.updatePassword', config, callback);
    };
    updatePasswordService.logout = function (callback) {
        return easyHttp.get('logistics.logout', callback);

    };
    updatePasswordService.getUserProfile = function (callback) {
        return easyHttp.get('logistics.getUserProfile', callback);
    }
    return updatePasswordService;
}]);