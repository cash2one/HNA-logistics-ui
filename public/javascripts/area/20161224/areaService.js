app.factory('areaService', ['easyHttp', '$http', function(easyHttp, $http) {
    var areaService = {
        getAddressData: function(countryCode, parentId) {
            return easyHttp.get("logistics.search", {
                urlParams: {
                    "countryCode": countryCode,
                    "parentId": parentId,
                    "pageSize": 1000
                }
            });
        },

        getAddrData:function(param) {
            return easyHttp.get("logistics.search", param);
        }
    };
    return areaService;
}]);