app.factory('priceDetailService', [
    '$http',
    'easyHttp',
    function ($http, easyHttp) {
        var priceDetailService = {};

        /**
         * 获取
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getProducts = function (config, callback) {
            return easyHttp.get('logistics.getProductsList', config, callback);
        };

        /**
         * 获取服务下拉列表
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getServices = function (config, callback) {
            return easyHttp.get('logistics.getServicesList', config, callback);
        };

        /**
         * 获取费用类型大类
         * @returns {*}
         */
        priceDetailService.getCostType = function () {
            return easyHttp.get('logistics.getBigType');
        };

        /**
         * 获取费用类型下拉列表
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getCost = function (config, callback) {
            return easyHttp.get('logistics.getCostTable', config, callback);
        };

        /**
         * 获取货物类型
         * @returns {*}
         */
        priceDetailService.getGoods = function () {
            return easyHttp.get('logistics.getGoodTypes');
        };

        /**
         * 获取计价货币
         * @returns {*}
         */
        priceDetailService.getCurrency = function (config) {
            return easyHttp.get('logistics.getAllCurrencyList', config);
        };

        /**
         * 获取结算方式
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getAccount = function (config, callback) {
            return easyHttp.get('logistics.getAccountTable', config, callback);
        };

        /**
         * 获取重量段
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getWeight = function (config, callback) {
            return easyHttp.get('logistics.getWeightList', config, callback);
        };

        /**
         * 获取分区列表
         * @returns {*}
         */
        priceDetailService.getRegion = function (config, callback) {
            return easyHttp.get('logistics.getRegionList', config, callback);
        };
        /**
         * 根据服务查询一个参考的采购价分区
         * @returns {*}
         */priceDetailService.getRegionByService = function (config, callback) {
            return easyHttp.get('logistics.getRegionByService', config, callback);
        };
        /**
         * 复制价格明细
         * @returns {*}
         */priceDetailService.copyPriceDetail = function (config, callback) {
            return easyHttp.post('logistics.copyPriceDetail', config, callback);
        };
        /**
         * 获取重量段和分区对应的重量段和分区列表
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getWeightAndRegion = function (config, callback) {
            return easyHttp.get('logistics.getWeigthAndRegion', config, callback);
        };

        /**
         * 获取重量单位列表
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getPriceUnit = function (config, callback) {
            return easyHttp.get('logistics.getWeightUnitList', config, callback);
        };

        /**
         * 获取客户列表
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getClient = function (config, callback) {
            return easyHttp.get('logistics.getCustomerShortList', config, callback);
        };

        /**
         * 获取计价方式列表
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getCalcTypeList = function (config, callback) {
            return easyHttp.get('logistics.getCalcTypeList', config, callback);
        };

        /**
         * 获取国家列表
         * @returns {*}
         */
        priceDetailService.getCountry = function (config) {
            var config = {
                urlParams: {
                    q: '',
                    pageIndex: 1,
                    pageSize: 1000
                }
            };
            return easyHttp.get('logistics.getCountry', config);
        };

        /**
         * 获取成本价基本信息
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getCostPriceInfo = function (config, callback) {
            return easyHttp.get('logistics.getCostPriceInfo', config, callback);
        };

        /**
         * 获取产品基本信息
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getProductAllInfo = function (config, callback) {
            return easyHttp.get('logistics.getProductAllInfo', config, callback);
        };

        /**
         * 获取销售价基本信息
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getSalesPriceInfo = function (config, callback) {
            return easyHttp.get('logistics.getSalesPriceInfo', config, callback);
        };

        /**
         * 新增成本价
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveCostAddInfo = function (config, callback) {
            return easyHttp.post('logistics.saveAddCostPriceInfo', config, callback);
        };

        /**
         * 新增销售价
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveSalesAddInfo = function (config, callback) {
            return easyHttp.post('logistics.saveAddSalesPriceInfo', config, callback);
        };

        /**
         * 编辑成本价
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveCostEditInfo = function (config, callback) {
            return easyHttp.put('logistics.saveEditCostPriceInfo', config, callback);
        };

        /**
         * 编辑销售价
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveSalesEditInfo = function (config, callback) {
            return easyHttp.put('logistics.saveEditSalesPriceInfo', config, callback);
        };

        /**
         * 成本价格明细保存
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveCostPrice = function (config, callback) {
            return easyHttp.post('logistics.saveCostPriceDetails', config, callback);
        };

        /**
         * 销售价格明细保存
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveSalesPrice = function (config, callback) {
            return easyHttp.post('logistics.saveSalesPriceDetails', config, callback);
        };

        /**
         * 待审核状态编辑成本价基本信息
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveAuditCostInfo = function (config, callback) {
            return easyHttp.put('logistics.updateCostPriceInfo', config, callback);
        };

        /**
         * 待审核状态编辑销售价基本信息
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveAuditSalesInfo = function (config, callback) {
            return easyHttp.put('logistics.updateSalesPriceInfo', config, callback);
        };

        /**
         * 待审核状态编辑成本价价格明细
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveAuditCostPrice = function (config, callback) {
            return easyHttp.post('logistics.updateCostPriceDetails', config, callback);
        };

        /**
         * 待审核状态编辑销售价价格明细
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveAuditSalesPrice = function (config, callback) {
            return easyHttp.post('logistics.updateSalesPriceDetails', config, callback);
        };

        /**
         * 通过ID获取分区方案详情的详情
         * @param id
         * @param callback
         * @returns {*}
         */
        priceDetailService.getRegionDetail = function (id, callback) {
            return easyHttp.get('logistics.editRegionDetail', {seatParams: {id: id}}, callback);
        };

        /**
         * 根据UID获取服务详情
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getServiceDetail = function (config, callback) {
            return easyHttp.get('logistics.getServiceById', config, callback);
        };

        /**
         * 根据UID获取重量段详情
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getWeightDetail = function (config, callback) {
            return easyHttp.get('logistics.getWeightByUid', config, callback);
        };

        /**
         * 获取成本价-价格明细单个tab的明细数据
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getOneCostPriceDetail = function (config, callback) {
            return easyHttp.get('logistics.getOneCostPriceDetail', config, callback);
        };

        /**
         * 获取销售价-价格明细单个tab的明细数据
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getOneSalesPriceDetail = function (config, callback) {
            return easyHttp.get('logistics.getOneSalesPriceDetail', config, callback);
        };

        /**
         * 根据ID获取结算方式信息
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getAccountDetail = function (config, callback) {
            return easyHttp.get('logistics.getAccountDetail', config, callback);
        };

        /**
         * 根据货币Code获取货币信息
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getCurrencyByCode = function (config, callback) {
            return easyHttp.get('logistics.getCurrencyByCode', config, callback);
        };

        /**
         * 根据价格方案UID 获取对应价格方案的所有价格明细。（只限销售价）
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.getSalesDetailsByUid = function (config, callback) {
            return easyHttp.get('logistics.getSalesDetailsByUid', config, callback);
        };

        /**
         * 新建销售价， 价格明细批量保存
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveAllSalesPrice = function(config, callback){
            return easyHttp.post('logistics.saveAllSalesPrice', config, callback);
        };

        /**
         * 审核销售价， 价格明细批量保存
         * @param config
         * @param callback
         * @returns {*}
         */
        priceDetailService.saveAllAuditSalesPrice = function(config, callback){
            return easyHttp.post('logistics.saveAllAuditSalesPrice', config, callback);
        };
	
	 priceDetailService.getProductAllData = function (config) {
            return easyHttp.get('logistics.getProductAllData',config);
        };
        priceDetailService.getProductNavItem = function () {
            return easyHttp.get('logistics.getProductNavItem');
        };

        return priceDetailService;
    },
]);
