app.factory('confirmOrderTestService', ['easyHttp', function(easyHttp) {
    var confirmOrderTestService = {};

    confirmOrderTestService.SetOrderToAccept = function (param,callback) {

        console.log("confirmOrderTestService.SetOrderToAccept");

        return easyHttp.post("logistics.SetOrderToAccept",param,callback);
    }

    confirmOrderTestService.getProviderByOrderSerial = function (param,callback) {
        return easyHttp.get("logistics.getProviderByOrderSerial",param,callback);

    }

    confirmOrderTestService.getSubOrderByOrderSerial = function (param,callback) {
        return easyHttp.get("logistics.getSubOrderByOrderSerial",param,callback);

    }

    confirmOrderTestService.getCodeFormProvider = function () {
        return easyHttp.get("logistics.getCodeFormProvider");

    }

    confirmOrderTestService.addOrder = function (param,callback) {
        return easyHttp.post("logistics.addOrder",param,callback);

    }



    confirmOrderTestService.calcOrderSales = function (param,callback) {
        return easyHttp.get("logistics.calcOrderSales",param,callback);

    }
    confirmOrderTestService.calcOrderPurchases = function (param,callback) {
        return easyHttp.get("logistics.calcOrderPurchases",param,callback);

    }
    confirmOrderTestService.calcOrderProcess = function (param,callback) {
        return easyHttp.get("logistics.calcOrderProcess",param,callback);

    }
    return confirmOrderTestService;
}]);