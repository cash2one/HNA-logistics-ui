app.factory('customerService', [
    '$http',
    'easyHttp',
    function ($http, easyHttp) {
        var customerService = {};

        /**
     * 价格套餐
     * @returns {*}
     */
        customerService.getCombos = function () {
            return easyHttp.get('logistics.getCombos');
        };
        customerService.getCombosAll = function () {
            return easyHttp.get('logistics.getCombosAll');
        };
        customerService.lockCustomer = function (param, callback) {
            return easyHttp.post('logistics.lockCustomer', { urlParams: param }, callback);
        };
        customerService.unlockCustomer = function (param, callback) {
            return easyHttp.post('logistics.unlockCustomer', { urlParams: param }, callback);
        };
        customerService.deleteCustomer = function (param, callback) {
            return easyHttp.post('logistics.deleteCustomer', { urlParams: param }, callback);
        };
        customerService.addCustomerChildAccount = function (param, callback) {
            return easyHttp.post('logistics.addCustomerChildAccount', { urlParams: param }, callback);
        };
        customerService.updateCustomerChildAccount = function (param, callback) {
            return easyHttp.put('logistics.updateCustomerChildAccount', { urlParams: param }, callback);
        };
        customerService.deleteCustomerChildAccount = function (param, callback) {
            return easyHttp.post('logistics.deleteCustomerChildAccount', { urlParams: param }, callback);
        };
        customerService.checkUserInfoEmail = function (param, callback) {
            return easyHttp.post('logistics.checkUserInfoEmail', { urlParams: param }, callback);
        };
        customerService.checkUserExsist = function (param, callback) {
            return easyHttp.get('logistics.checkUserExsist', { urlParams: param }, callback);
        };
        customerService.checkAccountEmail = function (param, callback) {
            return easyHttp.get('logistics.checkAccountEmail', { urlParams: param }, callback);
        };
        customerService.getLicense = function () {
            return easyHttp.get('logistics.getLicense');
        };
        customerService.getCompanyInfo = function (param, callback) {
            return easyHttp.get('logistics.getCompanyInfo', { seatParams: param, async: false }, callback);
        };
        customerService.submitCompany = function (param, callback) {
            return easyHttp.put('logistics.submitCompany', { urlParams: param }, callback);
        };
        customerService.lockCustomerChildAccount = function (param, callback) {
            return easyHttp.post('logistics.lockCustomerChildAccount', { urlParams: param }, callback);
        };
        customerService.resetCustomerChildPassword = function (param, callback) {
            return easyHttp.post('logistics.resetCustomerChildPassword', { urlParams: param }, callback);
        };
        customerService.unlockCustomerChildAccount = function (param, callback) {
            return easyHttp.post('logistics.unlockCustomerChildAccount', { urlParams: param }, callback);
        };
        customerService.getAccount = function (param, callback) {
            return easyHttp.get('logistics.getAccountTable', { urlParams: param }, callback);
        };
        customerService.getCurrencyList = function (param,callback) {
            return easyHttp.get('logistics.getAllCurrencyList', { urlParams: param }, callback);
        };
        customerService.getSupplierTypes = function () {
            return easyHttp.get('logistics.getSupplierTypes');
        };
        customerService.getTradeSupplierTypes = function () {
            return easyHttp.get('logistics.getTradeServiceType');
        };
        customerService.addCustomer = function (param, callback) {
            return easyHttp.post('logistics.addCustomer', { urlParams: param }, callback);
        };
        customerService.updateCustomer = function (param, callback) {
            return easyHttp.put('logistics.updateCustomer', { urlParams: param }, callback);
        };
        customerService.checkCustomerCode = function (param, callback) {
            return easyHttp.get('logistics.checkCustomerCode', { seatParams: param }, callback);
        };
        customerService.getCustomerInfo = function (param, callback) {
            return easyHttp.get('logistics.getCustomerInfo', { seatParams: param }, callback);
        };
        customerService.getCountry = function (config) {
            return easyHttp.get('logistics.getCountry', config);
        };
        customerService.getCity = function (config) {
            return easyHttp.get('logistics.getCity', config);
        };
        customerService.checkUserPhoneExist = function (param, callback) {
            return easyHttp.get('logistics.checkUserPhoneExist', param, callback);
        };

        // 业务联系人部分

        customerService.getFuncTeam = function () {
            return easyHttp.get('logistics.getFuncTeam', {
                seatParams: {
                    parentid: 0,
                },
            });
        };

        customerService.getBuzCustomerDuty = function (callback) {
            return easyHttp.post('logistics.getBuzCustomerDuty', { urlParams: '' }, callback);
        };

        customerService.getUsersByFuncTeam = function (funcTeamId) {
            return easyHttp.get('logistics.getUserByFuncTeamId', {
                seatParams: {
                    orgCode: funcTeamId,
                },
            });
        };

        // customerService.getUsersByFuncTeam = function (funcTeamId) {
        //     return easyHttp.get("logistics.getUserByFuncTeamId", {
        //         seatParams: {
        //             "orgCode": funcTeamId
        //         }
        //     });
        // }

        // customerService.getUsersByDutyCode = function (code) {
        //     return easyHttp.get('logistics.getUsersByDutyCode', { urlParams: { orgCode: code } });
        // };

        customerService.getUsersByDutyCode = function (param) {
            return easyHttp.get('logistics.getUsersByDutyCode', { urlParams: param });
        };

        customerService.addBizContacter = function (param, callback) {
            return easyHttp.post('logistics.addBizContacter', { urlParams: param }, callback);
        };

        customerService.deleteBizContacterList = function (param, callback) {
            return easyHttp.post('logistics.deleteBizContacterList', { urlParams: param }, callback);
        };

        customerService.modifyBizContacter = function (param, callback) {
            return easyHttp.put('logistics.modifyBizContacter', { urlParams: param }, callback);
        };

        customerService.isBuzCustomerExist = function (param, callback) {
            return easyHttp.post('logistics.isBuzCustomerExist', { urlParams: param }, callback);
        };

        // 客户联系人部分
        customerService.addClientContacter = function (param, callback) {
            return easyHttp.post('logistics.addClientContacter', { urlParams: param }, callback);
        };

        customerService.modifyClientContacter = function (param, callback) {
            return easyHttp.put('logistics.modifyClientContacter', { urlParams: param }, callback);
        };

        customerService.deleteClientContacterList = function (param, callback) {
            return easyHttp.post('logistics.delClientContacterList', { urlParams: param }, callback);
        };

        // 获取产品可见性
        customerService.getProductVisiblity = function (param, callback) {
            return easyHttp.get('logistics.getProductVisiblity', { urlParams: param }, callback);
        };

        // 获取所有产品组
        customerService.getAllProductGroup = function (param, callback) {
            return easyHttp.get('logistics.getAllProductGroup', { urlParams: param }, callback);
        };

        // 获取所有产品
        customerService.getAllProduct = function (param, callback) {
            return easyHttp.get('logistics.getAllProduct', { urlParams: param }, callback);
        };

        // 提交产品可见性
        customerService.saveProductVisiblity = function (param, callback) {
            if (param.isUpdate) {
                return easyHttp.post('logistics.updateProductVisiblity', { urlParams: param }, callback);
            }
            return easyHttp.post('logistics.postProductVisiblity', { urlParams: param }, callback);
        };

        //消息通知部分
        customerService.getMessageNotify = function (param,callback) {
            return easyHttp.get('logistics.getMessageNotify', param, callback);
        }

        customerService.saveMessageNotify = function (param,callback) {
            return easyHttp.post('logistics.saveMessageNotify', param, callback);
        }

        customerService.auditCustomers = function (param,callback) {
            return easyHttp.post('logistics.auditCustomers',param, callback)
            
        }

        customerService.getCustomerAuditStatus = function (param,callback) {
            return easyHttp.get('logistics.getCustomerAuditStatus',param, callback)

        }

        return customerService;
    },
]);
