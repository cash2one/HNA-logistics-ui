app.factory('pricePackageService', ['easyHttp', function(easyHttp) {
    var pricePackageService = {};


    pricePackageService.getProductsList = function(param, callback){
        return easyHttp.get('logistics.getProductsList', {'urlParams':param}, callback);
    };



    pricePackageService.getPriceLevelByProductUid = function (id) {
        return easyHttp.get("logistics.getPriceLevelByProductUid", {
            seatParams: {
                "productUid": id
            }
        });
    }

    pricePackageService.deletePricePackage = function(param, callback) {
        return easyHttp.post('logistics.delPricePackage', {'urlParams':param}, callback);
    };

    pricePackageService.addPricePackage = function (param,callback) {
        return easyHttp.post('logistics.addPricePackage', {'urlParams':param}, callback);

    }

    pricePackageService.isExistedCode = function(param) {
        return easyHttp.get('logistics.isExistedPricePackageCode', {'urlParams':param});
    }

    // var config = {
    //     'urlParams':{
    //         'freightItems':priceDetail,
    //         'freightWeightSettings':priceMethod
    //     },
    //     'seatParams':{
    //         'uid': $scope.uid
    //     }
    // };

    pricePackageService.modifyPricePackage = function(config, callback) {
        return easyHttp.post('logistics.modifyPricePackage', config, callback);
    };


    return pricePackageService;
}]);