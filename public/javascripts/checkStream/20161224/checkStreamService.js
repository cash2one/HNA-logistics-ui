app.factory('checkStreamService', ['easyHttp', function(easyHttp) {
    var checkStreamService = {};
    checkStreamService.getPriceStream = function(param) {
        return easyHttp.get('logistics.getPriceStream', {'urlParams':param.urlParams, 'seatParams':param.seatParams});
    }
    checkStreamService.getProductStream = function(param) {
        return easyHttp.get('logistics.getProductStream', {'urlParams':param.urlParams, 'seatParams':param.seatParams});
    }
    return checkStreamService;
}]);