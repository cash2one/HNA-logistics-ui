app.factory('countryService', ['easyHttp', function(easyHttp) {
    var countryService = {};
    countryService.delCountry = function(param, callback){
        return easyHttp.post('logistics.deleteCountrys', {'urlParams':param}, callback);
    };
    countryService.createCountry = function(param, callback) {
        return easyHttp.post('logistics.createCountry', {'urlParams':param}, callback);
    }
    countryService.checkCountryName = function(param, callback) {
        return easyHttp.get('logistics.checkCountryName', {'urlParams':param}, callback);
    }
    countryService.checkFigureCode = function(param, callback) {
        return easyHttp.get('logistics.checkFigureCode', {'urlParams':param}, callback);
    }
    countryService.checkTriadCode = function(param, callback) {
        return easyHttp.get('logistics.checkTriadCode', {'urlParams':param}, callback);
    }
    countryService.checkAreaCode = function(param, callback) {
        return easyHttp.get('logistics.checkAreaCode', {'urlParams':param}, callback);
    }
    countryService.updateArea = function(param, callback) {
        return easyHttp.put('logistics.updateArea', {'urlParams':param.urlParams, 'seatParams':param.seatParams}, callback);
    }
    countryService.getInternational = function(callback) {//获取国际化语言
        return easyHttp.get('logistics.getInternational', callback);
    };
    countryService.getSingleDataById = function(id) {
        return easyHttp.get('logistics.getSingleCountryById', {'seatParams':{"id": id}});
    }
    return countryService;
}]);