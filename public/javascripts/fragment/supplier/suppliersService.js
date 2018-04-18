app.factory('suppliersService', ['easyHttp', function (easyHttp) {
    var factory = {};

    factory.initSupplier = function(supplierModel){

        return supplierModel;
    };

    return factory;
}]);

