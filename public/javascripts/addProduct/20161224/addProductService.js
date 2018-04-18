app.factory('addProductService', ['easyHttp',
    function (easyHttp) {
        var addProductService = {};

        addProductService.getProductGroup = function (param, callback) {
            if (!param) { param = {}; } else { param = { parentId: param }; }
            return easyHttp.get('logistics.queryProductGroup', { urlParams: param }, callback);
        };

        addProductService.getWeightList = function (param, callback) {
            return easyHttp.get('logistics.getWeightUnitList', callback);
        };

        addProductService.productCheckCode = function (param, callback) {
            return easyHttp.get('logistics.productCheckCode', { urlParams: { code: param } }, callback);
        };

        addProductService.getUserDetail = function (param, callback) {
            return easyHttp.get('logistics.getUserDetailById', { seatParams: { id: param } }, callback);
        };

        addProductService.submitProducts = function (param, callback) {
            if (!param) { param = []; } else { param = [param]; }
            return easyHttp.post('logistics.submitProducts', { urlParams: param }, callback);
        };

        addProductService.onlineProdcut = function (param, callback) {
            return easyHttp.post('logistics.onlineProdcut', { seatParams: { uid: param } }, callback);
        };

        addProductService.offlineProdcut = function (param, callback) {
            return easyHttp.post('logistics.offlineProdcut', { seatParams: { uid: param } }, callback);
        };

        addProductService.searchProductGroup = function (param, callback) {
            if (!param) { param = {}; } else { param = { id: param }; }
            return easyHttp.get('logistics.searchProductGroup', { urlParams: param }, callback);
        };

        addProductService.getGoodTypes = function (param, callback) {
            return easyHttp.get('logistics.getGoodTypes', callback);
        };

        addProductService.getProductEstimated = function (param, callback) {
            return easyHttp.get('logistics.getProductEstimated', callback);
        };

        addProductService.auditAndRejections = function (type, uid, msg, callback) {
            var data = { msg: msg };
            easyHttp.post('logistics.' + type, { urlParams: data, seatParams: { uid: uid } }, callback);
        };

        addProductService.saveCustomer = function (data, callback) {
            easyHttp.post('logistics.addProductBaseInfo', { urlParams: data }, callback);
        };

        addProductService.modifyProductBaseInfo = function (uid, data, callback) {
            easyHttp.put('logistics.modifyProductBaseInfo', { urlParams: data, seatParams: { uid: uid } }, callback);
        };

        addProductService.getProductBaseInfo = function (uid, callback) {
            easyHttp.get('logistics.getProductBaseInfo', { seatParams: { uid: uid } }, callback);
        };

        addProductService.getWeightValueMode = function (callback) {
            return easyHttp.get('logistics.getWeightValueMode', callback);
        };

        addProductService.addProductServiceWeight = function (param, callback) {
            return easyHttp.put('logistics.addProductServiceWeight', param, callback);
        };

        // weightRegularCtrl

        addProductService.getWeightRule = function (id, callback) {
            return easyHttp.get('logistics.getWeightRule', { seatParams: { id: id } }, callback);
        };

        // ProductService

        addProductService.getProductServiceByType = function (param) {
            return easyHttp.get('logistics.getProductServiceByType', param);
        };

        addProductService.getCurrencyUnit = function (param, callback) {
            return easyHttp.get('logistics.getProductGroupRootId', param, callback);
        };

        addProductService.getProduct = function (param) {
            return easyHttp.get('logistics.getProduct', param);
        };

        addProductService.getProductPropertyType = function () {
            return easyHttp.get('logistics.getProductPropertyType');
        };

        addProductService.getSupplierTypes = function () {
            return easyHttp.get('logistics.getSupplierTypes');
        };

        addProductService.getServicebyServiceType = function (data) {
            return easyHttp.get('logistics.getServicebyServiceType', data);
        };

        addProductService.addProductService = function (params, callback) {
            return easyHttp.post('logistics.addProductService', { urlParams: params }, callback);
        };

        addProductService.modifyProductService = function (params, callback) {
            return easyHttp.put('logistics.modifyProductService', params, callback);
        };

        addProductService.delProductService = function (params, callback) {
            return easyHttp.post('logistics.delProductService', params, callback);
        };

        addProductService.getProductService = function (params, callback) {
            return easyHttp.get('logistics.getProductService', params, callback);
        };

        addProductService.getProductServiceRegions = function (params, callback) {
            return easyHttp.get('logistics.getProductServiceRegions', params, callback);
        };

        addProductService.getProductServiceCargos = function (config, callback) {
            return easyHttp.get('logistics.getProductServiceCargos', config, callback);
        };

        addProductService.delProductServiceItem = function (config, callback) {
            return easyHttp.post('logistics.delProductServiceItem', config, callback);
        };

        addProductService.getAvailableTypes = function (config, callback) {
            return easyHttp.get('logistics.getAvailableTypes', config, callback);
        };

        // 两个异步校验
        addProductService.checkServiceType = function (params, callback) {
            return easyHttp.get('logistics.checkServiceType', params, callback);
        };

        addProductService.checkServices = function (params, callback) {
            return easyHttp.get('logistics.checkServices', params, callback);
        };
        // ProductService

        // ProductRange
        addProductService.saveProductRegion = function (config, callback) {
            return easyHttp.post('logistics.saveProductRegion', config, callback);
        };
        addProductService.putProductRegion = function (config, callback) {
            return easyHttp.put('logistics.putProductRegion', config, callback);
        };
        addProductService.delProductRegion = function (config, callback) {
            return easyHttp.post('logistics.delProductRegion', config, callback);
        };
        addProductService.getProductAllInfo = function (param, callback) {
            return easyHttp.get('logistics.getProductAllInfo', { seatParams: { id: param } }, callback);
        };
        addProductService.checkRegionCode = function (config, callback) {
            return easyHttp.get('logistics.checkProductRegion', config, callback);
        };
        addProductService.IsMainServiceExist = function (param, callback) {
            return easyHttp.get('logistics.IsMainServiceExist', { urlParams: { id: param } }, callback);
        };
        // ProductRange End

        return addProductService;
    }
]);
