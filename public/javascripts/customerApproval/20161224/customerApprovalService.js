
app.factory('customerApprovalService', [
    '$http',
    'easyHttp',
    function ($http, easyHttp) {
        var customerApprovalService = {};

        /**
         * 价格套餐
         * @returns {*}
         */
        customerApprovalService.getCombos = function () {
            return easyHttp.get('logistics.getCombos');
        };
        customerApprovalService.getCombosAll = function () {
            return easyHttp.get('logistics.getCombosAll');
        };
        customerApprovalService.lockCustomer = function (param, callback) {
            return easyHttp.post('logistics.lockCustomer', { urlParams: param }, callback);
        };
        customerApprovalService.unlockCustomer = function (param, callback) {
            return easyHttp.post('logistics.unlockCustomer', { urlParams: param }, callback);
        };
        customerApprovalService.deleteCustomer = function (param, callback) {
            return easyHttp.post('logistics.deleteCustomer', { urlParams: param }, callback);
        };
        customerApprovalService.addCustomerChildAccount = function (param, callback) {
            return easyHttp.post('logistics.addCustomerChildAccount', { urlParams: param }, callback);
        };
        customerApprovalService.updateCustomerChildAccount = function (param, callback) {
            return easyHttp.put('logistics.updateCustomerChildAccount', { urlParams: param }, callback);
        };
        customerApprovalService.deleteCustomerChildAccount = function (param, callback) {
            return easyHttp.post('logistics.deleteCustomerChildAccount', { urlParams: param }, callback);
        };
        customerApprovalService.checkUserInfoEmail = function (param, callback) {
            return easyHttp.post('logistics.checkUserInfoEmail', { urlParams: param }, callback);
        };
        customerApprovalService.checkUserExsist = function (param, callback) {
            return easyHttp.get('logistics.checkUserExsist', { urlParams: param }, callback);
        };
        customerApprovalService.checkAccountEmail = function (param, callback) {
            return easyHttp.get('logistics.checkAccountEmail', { urlParams: param }, callback);
        };
        customerApprovalService.getLicense = function () {
            return easyHttp.get('logistics.getLicense');
        };
        customerApprovalService.getCompanyInfo = function (param, callback) {
            return easyHttp.get('logistics.getCompanyInfo', { seatParams: param, async: false }, callback);
        };
        customerApprovalService.submitCompany = function (param, callback) {
            return easyHttp.put('logistics.submitCompany', { urlParams: param }, callback);
        };
        customerApprovalService.lockCustomerChildAccount = function (param, callback) {
            return easyHttp.post('logistics.lockCustomerChildAccount', { urlParams: param }, callback);
        };
        customerApprovalService.resetCustomerChildPassword = function (param, callback) {
            return easyHttp.post('logistics.resetCustomerChildPassword', { urlParams: param }, callback);
        };
        customerApprovalService.unlockCustomerChildAccount = function (param, callback) {
            return easyHttp.post('logistics.unlockCustomerChildAccount', { urlParams: param }, callback);
        };
        customerApprovalService.getAccount = function (param, callback) {
            return easyHttp.get('logistics.getAccountTable', { urlParams: param }, callback);
        };
        customerApprovalService.getCurrencyList = function (param,callback) {
            return easyHttp.get('logistics.getAllCurrencyList', { urlParams: param }, callback);
        };
        customerApprovalService.getSupplierTypes = function () {
            return easyHttp.get('logistics.getSupplierTypes');
        };
        customerApprovalService.getTradeSupplierTypes = function () {
            return easyHttp.get('logistics.getTradeServiceType');
        };
        customerApprovalService.addCustomer = function (param, callback) {
            return easyHttp.post('logistics.addCustomer', { urlParams: param }, callback);
        };
        customerApprovalService.updateCustomer = function (param, callback) {
            return easyHttp.put('logistics.updateCustomer', { urlParams: param }, callback);
        };
        customerApprovalService.checkCustomerCode = function (param, callback) {
            return easyHttp.get('logistics.checkCustomerCode', { seatParams: param }, callback);
        };
        customerApprovalService.getCustomerInfo = function (param, callback) {
            return easyHttp.get('logistics.getCustomerInfo', { seatParams: param }, callback);
        };
        customerApprovalService.getCountry = function (config) {
            return easyHttp.get('logistics.getCountry', config);
        };
        customerApprovalService.getCity = function (config) {
            return easyHttp.get('logistics.getCity', config);
        };
        customerApprovalService.checkUserPhoneExist = function (param, callback) {
            return easyHttp.get('logistics.checkUserPhoneExist', param, callback);
        };

        // 业务联系人部分

        customerApprovalService.getFuncTeam = function () {
            return easyHttp.get('logistics.getFuncTeam', {
                seatParams: {
                    parentid: 0,
                },
            });
        };

        customerApprovalService.getBuzCustomerDuty = function (callback) {
            return easyHttp.post('logistics.getBuzCustomerDuty', { urlParams: '' }, callback);
        };

        customerApprovalService.getUsersByFuncTeam = function (funcTeamId) {
            return easyHttp.get('logistics.getUserByFuncTeamId', {
                seatParams: {
                    orgCode: funcTeamId,
                },
            });
        };

        // customerApprovalService.getUsersByFuncTeam = function (funcTeamId) {
        //     return easyHttp.get("logistics.getUserByFuncTeamId", {
        //         seatParams: {
        //             "orgCode": funcTeamId
        //         }
        //     });
        // }

        // customerApprovalService.getUsersByDutyCode = function (code) {
        //     return easyHttp.get('logistics.getUsersByDutyCode', { urlParams: { orgCode: code } });
        // };

        customerApprovalService.getUsersByDutyCode = function (param) {
            return easyHttp.get('logistics.getUsersByDutyCode', { urlParams: param });
        };

        customerApprovalService.addBizContacter = function (param, callback) {
            return easyHttp.post('logistics.addBizContacter', { urlParams: param }, callback);
        };

        customerApprovalService.deleteBizContacterList = function (param, callback) {
            return easyHttp.post('logistics.deleteBizContacterList', { urlParams: param }, callback);
        };

        customerApprovalService.modifyBizContacter = function (param, callback) {
            return easyHttp.put('logistics.modifyBizContacter', { urlParams: param }, callback);
        };

        customerApprovalService.isBuzCustomerExist = function (param, callback) {
            return easyHttp.post('logistics.isBuzCustomerExist', { urlParams: param }, callback);
        };

        // 客户联系人部分
        customerApprovalService.addClientContacter = function (param, callback) {
            return easyHttp.post('logistics.addClientContacter', { urlParams: param }, callback);
        };

        customerApprovalService.modifyClientContacter = function (param, callback) {
            return easyHttp.put('logistics.modifyClientContacter', { urlParams: param }, callback);
        };

        customerApprovalService.deleteClientContacterList = function (param, callback) {
            return easyHttp.post('logistics.delClientContacterList', { urlParams: param }, callback);
        };

        // 获取产品可见性
        customerApprovalService.getProductVisiblity = function (param, callback) {
            return easyHttp.get('logistics.getProductVisiblity', { urlParams: param }, callback);
        };

        // 获取所有产品组
        customerApprovalService.getAllProductGroup = function (param, callback) {
            return easyHttp.get('logistics.getAllProductGroup', { urlParams: param }, callback);
        };

        // 获取所有产品
        customerApprovalService.getAllProduct = function (param, callback) {
            return easyHttp.get('logistics.getAllProduct', { urlParams: param }, callback);
        };

        // 提交产品可见性
        customerApprovalService.saveProductVisiblity = function (param, callback) {
            if (param.isUpdate) {
                return easyHttp.post('logistics.updateProductVisiblity', { urlParams: param }, callback);
            }
            return easyHttp.post('logistics.postProductVisiblity', { urlParams: param }, callback);
        };

        //消息通知部分
        customerApprovalService.getMessageNotify = function (param,callback) {
            return easyHttp.get('logistics.getMessageNotify', param, callback);
        }

        customerApprovalService.saveMessageNotify = function (param,callback) {
            return easyHttp.post('logistics.saveMessageNotify', param, callback);
        }

        customerApprovalService.auditCustomers = function (param,callback) {
            return easyHttp.post('logistics.auditCustomers',param, callback)

        }

        //客户审核通过
        customerApprovalService.auditSuccCustomers =function (param,callback) {
            return easyHttp.post('logistics.auditSuccCustomers',param, callback)
        }

        //客户审核不通过
        customerApprovalService.auditFailCustomers =function (param,callback) {
            return easyHttp.post('logistics.auditFailCustomers',param, callback)
        }

        return customerApprovalService;
    },
]);
