app.factory('commodityService', [
    'easyHttp',
    '$http',
    function (easyHttp, $http) {
        var commodityService = {};
        commodityService.getTrdGoodList = function (params, cb) {
            return easyHttp.get(
                'logistics.trdGoodList',
                { urlParams: params },
                cb
            );
        };
        // 采购企业列表
        commodityService.getCustomerShortGoods = function (params) {
            return easyHttp.get('logistics.getCustomerShortGoods', {
                urlParams: params,
            });
        };
        // 商品类别
        commodityService.trdGoodTypeList = function () {
            // return easyHttp.get("logistics.trdGoodTypeList", cb);

            return $http
                .get('/api/v1/trade/goodstype/list')
                .then(function (res) {
                    return res.data.data;
                });
        };

        commodityService.trdSuppelyList = function (params) {
            return easyHttp.get('logistics.trdSuppelyList', {
                urlParams: params,
            });
        };

        // 商品下拉列表
        commodityService.getTrdGoodsShortList = function (params) {
            return easyHttp.get('logistics.getTrdGoodsShortList', {
                urlParams: params,
            });
        };

        commodityService.trdProjectsShort = function (params, callback) {
            return easyHttp.get(
                'logistics.trdProjectsShort',
                { urlParams: params },
                callback
            );
        };

        commodityService.trdSuppelyItem = function (q) {
            return $http
                .get('/api/v1/sup/suppliers/trade/list', {
                    q: q,
                    isIncludePlatform: 1,
                })
                .then(function (res) {
                    console.log(res, ' suppliers');
                });
        };

        commodityService.getOneGoods = function (id) {
            return $http.get('/api/v1/trd/goods/' + id).then(function (res) {
                if (res.status == 200 && res.data) {
                    return res.data.data;
                }
            });
        };

        commodityService.enabledGoods = function (param) {
            return $http
                .post('/api/v1/trd/goods/enabled', param)
                .then(function (res) {
                    if (res.status == 200 && res.data) {
                        return res.data;
                    }
                });
        };

        commodityService.weight = function () {
            return $http.get('/api/v1/dict/unit/weight/trade').then(function (res) {
                if (res.status == 200 && res.data) {
                    return res.data;
                }
            });
        };

        commodityService.currency = function (config, callback) {
            return easyHttp.get('logistics.getCurrencyList', config, callback);
        };

        commodityService.deleteOneGoods = function (ids, fn) {
            return easyHttp.post(
                'logistics.deleteOneGoods',
                { urlParams: ids },
                fn
            );
        };

        commodityService.saveOneGoods = function (data) {
            return $http
                .post('/api/v1/trd/goods/save', data)
                .then(function (res) {
                    return res.data;
                });
            // return easyHttp.post("logistics.saveOneGoods",{"urlParams" : data},fn);
        };

        commodityService.updateOneGoods = function (data) {
            return $http
                .post('/api/v1/trd/goods/update', data)
                .then(function (res) {
                    return res.data;
                });
            // return easyHttp.post("logistics.updateOneGoods",{"urlParams" : data},fn);
        };

        commodityService.getCurrencyList = function (params, callback) {
            return easyHttp.get('logistics.getAllCurrencyList', { urlParams: params }, callback);
        };

        return commodityService;
    },
]);
