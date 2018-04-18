app.factory('projectDetailService', [
    'easyHttp',
    function (easyHttp) {
        var projectDetailService = {};
        var projectBelong = sessionStorage.getItem('projectBelong');

        /**
         * 获取语言库
         * @param callback
         */
        projectDetailService.getLanguage = function (callback) {
            return easyHttp.get('logistics.getInternational', callback);
        };
        // 获取项目信息
        projectDetailService.getProjectInfo = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.getProjectInfoLog' : 'logistics.getProjectInfo';
            return easyHttp.get(url, config, callback);
        };
        // 获取项目审核状态
        projectDetailService.getApprovalStatus = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.getApprovalStatusLog' : 'logistics.getApprovalStatus';
            return easyHttp.get(url, config, callback);
        };
        // 获取业务类型
        projectDetailService.getBusinessType = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.getBusinessTypeDataLog' : 'logistics.getBusinessTypeData';
            return easyHttp.get(url, config, callback);
        };
        // 获取项目部门组织
        projectDetailService.getProjectSection = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.getProjectSectionLog' : 'logistics.getProjectSection';
            return easyHttp.get(url, config, callback);
        };
        // 获取企业名称
        projectDetailService.getEnterpriseName = function (config, callback) {
            var url = '';
            if (config.module === 'logistics') {
                switch (+config.code) {
                    case 1:
                        url = 'logistics.getEnterpriseNameLogisticsSupplier';
                        break;
                    case 2:
                        url = 'logistics.getEnterpriseNameLogisticsCustomer';
                        break;
                    default:
                        url = 'logistics.getEnterpriseNameTradePlatform';
                        break;
                }
            } else {
                switch (+config.code) {
                    case 1:
                        url = 'logistics.getEnterpriseNameTradeSupplier';
                        break;
                    case 2:
                        url = 'logistics.getEnterpriseNameTradeCustomer';
                        break;
                    default:
                        url = 'logistics.getEnterpriseNameTradePlatform';
                        break;
                }
            }
            return easyHttp.get(url, config, callback);
        };
        // 异步校验项目代码
        projectDetailService.checkProjectCode = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.checkProjectCodeLog' : 'logistics.checkProjectCode';
            return easyHttp.get(url, config, callback);
        };
        // 保存项目信息
        projectDetailService.sendProjectInfo = function (config, callback) {
            if (projectBelong === '1') {
                if (config.isNew) {
                    return easyHttp.post('logistics.sendProjectInfoNewLog', config, callback);
                } else {
                    return easyHttp.put('logistics.sendProjectInfoModLog', config, callback);
                }
            }
            if (projectBelong === '2') {
                if (config.isNew) {
                    return easyHttp.post('logistics.sendProjectInfoNew', config, callback);
                } else {
                    return easyHttp.put('logistics.sendProjectInfoMod', config, callback);
                }
            }
        };
        // 提交项目总结
        projectDetailService.sendsProjectSummary = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.sendsProjectSummaryLog' : 'logistics.sendsProjectSummary';
            return easyHttp.post(url, config, callback);
        };
        // 提交初审意见
        projectDetailService.postFirstApproval = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.postFirstApprovalLog' : 'logistics.postFirstApproval';
            return easyHttp.post(url, config, callback);
        };
        // 提交终审意见
        projectDetailService.postFinalApproval = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.postFinalApprovalLog' : 'logistics.postFinalApproval';
            return easyHttp.post(url, config, callback);
        };
        // 上传项目文件
        projectDetailService.uploadProjectFile = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.uploadProjectFileLog' : 'logistics.uploadProjectFile';
            return easyHttp.post(url, config, callback);
        };
        // 获取项目文件
        projectDetailService.getProjectFile = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.getProjectFileLog' : 'logistics.getProjectFile';
            return easyHttp.get(url, config, callback);
        };
        // 删除项目文件
        projectDetailService.delContractFile = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.delContractFileLog' : 'logistics.delContractFile';
            return easyHttp['delete'](url, config, callback);
        };
        return projectDetailService;
    },
]);
