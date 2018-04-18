app.factory('supplierService', ['$http', 'easyHttp', function($http, easyHttp) {
    var supplierService = {};

    /**
     * 返回供应商类型列表
     * @param data
     * @returns {*}
     */
    supplierService.getSupplierTypes = function(callback){
        return easyHttp.get('logistics.getSupplierTypes', callback);
    };

    /**
     * 获取贸易供应商类型
     * @param data
     * @returns {*}
     */
    supplierService.getTradetSupplierTypes = function(callback){
      return easyHttp.get('logistics.getTradetSupplierTypes', callback);
    };

    /**
     * 获取国家
     * @param data
     * @returns {*}
     */
    supplierService.getCountry = function(config, callback){
        return easyHttp.get('logistics.getCountry', config, callback);
    };

    /**
     * 异步校验编码
     * @param data
     * @returns {*}
     */
    supplierService.validateSupplierCode = function(config, callback){
        return easyHttp.get('logistics.validateSupplierCode', config, callback);
    };

    /**
     * 新建供应商
     * @param data
     * @returns {*}
     */
    supplierService.saveSupplier = function(config, callback){
        return easyHttp.post('logistics.saveSupplier', config, callback);
    };

    /**
     * 修改供应商
     * @param data
     * @returns {*}
     */
    supplierService.editSupplier = function(config, callback){
        return easyHttp.put('logistics.editSupplier', config, callback);
    };

    /**
     * 删除供应商
     * @param data
     * @returns {*}
     */
    supplierService.deleteSupplier = function(config, callback){
        return easyHttp.post('logistics.deleteSupplier', config, callback);
    };

    /**
     * 根据ID获取供应商
     * @param data
     * @returns {*}
     */
    supplierService.getSupplierById = function(config, callback){
        return easyHttp.get('logistics.getSupplierById', config, callback);
    };

    /**
     * 用户模糊匹配
     * @param data
     * @returns {*}
     */
    supplierService.getBDUser = function(config, callback){
        return easyHttp.get('logistics.getBDUser', config, callback);
    };

    /**
     * 添加BD
     * @param data
     * @returns {*}
     */
    supplierService.addBD = function(config, callback){
        return easyHttp.post('logistics.addBD', config, callback);
    };

    /**
     * 修改BD
     * @param data
     * @returns {*}
     */
    supplierService.editBD = function(config, callback){
        return easyHttp.put('logistics.editBD', config, callback);
    };

    /**
     * 删除BD
     * @param data
     * @returns {*}
     */
    supplierService.deleteBD = function(config, callback){
        return easyHttp.post('logistics.deleteBD', config, callback);
    };

    /**
     * 新增联系人
     * @param data
     * @returns {*}
     */
    supplierService.addContacts = function(config, callback){
        return easyHttp.put('logistics.addContacts', config, callback);
    };

    /**
     * 修改联系人
     * @param data
     * @returns {*}
     */
    supplierService.editContacts = function(config, callback){
        return easyHttp.put('logistics.editContacts', config, callback);
    };

    /**
     * 删除联系人
     * @param data
     * @returns {*}
     */
    supplierService.deleteContacts = function(config, callback){
        return easyHttp.post('logistics.deleteContacts', config, callback);
    };

    /**
     * 新建或修改业务信息
     * @param data
     * @returns {*}
     */
    supplierService.saveOrAddBusiness = function(config, callback){
        return easyHttp.put('logistics.saveOrAddBusiness', config, callback);
    };

    /**
     * 新建或修改财务信息
     * @param data
     * @returns {*}
     */
    supplierService.saveOrAddFinancial = function(config, callback){
        return easyHttp.put('logistics.saveOrAddFinancial', config, callback);
    };
    supplierService.checkBDUserExist = function (config,callback) {
        return easyHttp.get('logistics.checkBDUserExist', config, callback);
    }
    supplierService.checkSupplierUserExsist = function (param, callback) {
        return easyHttp.get('logistics.checkSupplierUserExsist', { urlParams: param }, callback);
    };
    supplierService.checkSupplierUserPhoneExist = function (param, callback) {
        return easyHttp.get('logistics.checkSupplierUserPhoneExist', param, callback);
    };
    supplierService.checkSupplierAccountEmail = function (param, callback) {
        return easyHttp.get('logistics.checkSupplierAccountEmail', { urlParams: param }, callback);
    };
    supplierService.checkSupplierUserInfoEmail = function (param, callback) {
        return easyHttp.post('logistics.checkSupplierUserInfoEmail', { urlParams: param }, callback);
    };
    supplierService.addSupplierChildAccount = function (param, callback) {
        return easyHttp.post('logistics.addSupplierChildAccount', { urlParams: param }, callback);
    };
    supplierService.updateSupplierChildAccount = function (param, callback) {
        return easyHttp.put('logistics.updateSupplierChildAccount', { urlParams: param }, callback);
    };
    supplierService.deleteSupplierChildAccount = function (param, callback) {
        return easyHttp.post('logistics.deleteSupplierChildAccount', { urlParams: param }, callback);
    };
    supplierService.lockSupplierChildAccount = function (param, callback) {
        return easyHttp.post('logistics.lockSupplierChildAccount', { urlParams: param }, callback);
    };
    supplierService.unlockSupplierChildAccount = function (param, callback) {
        return easyHttp.post('logistics.unlockSupplierChildAccount', { urlParams: param }, callback);
    };
    supplierService.resetSupplierChildPassword = function (param, callback) {
        return easyHttp.post('logistics.resetSupplierChildPassword', { urlParams: param }, callback);
    };

    return supplierService;
}]);
