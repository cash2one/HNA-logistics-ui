app.factory('projectManageService', [
    'easyHttp',
    function (easyHttp) {
        var projectManageService = {};
        var projectBelong = sessionStorage.getItem('projectBelong');

        /**
         * 获取项目列表数据
         */
        projectManageService.getProjectsData = function (url, config, callback) {
            return easyHttp.get(url, config, callback);
        };

        /**
         * 获取项目干系企业
         */
        projectManageService.getRelationshipEnt = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.getRelationshipEntLog' : 'logistics.getRelationshipEnt';
            return easyHttp.get(url, config, callback);
        };

        /**
         * 删除项目
         */
        projectManageService.delProjectsData = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.delProjectsDataLog' : 'logistics.delProjectsData';
            return easyHttp.post(url, config, callback);
        };

        /**
         * 提交项目
         */
        projectManageService.submitProjectsData = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.submitProjectsDataLog' : 'logistics.submitProjectsData';
            return easyHttp.post(url, config, callback);
        };

        // 获取用户组织身份
        projectManageService.getUserIdentity = function (config, callback) {
            var url = projectBelong === '1' ? 'logistics.getUserIdentityLog' : 'logistics.getUserIdentity';
            return easyHttp.get(url, config, callback);
        };

        /**
         * 获取语言库
         * @param callback
         */
        projectManageService.getLanguage = function (callback) {
            return easyHttp.get('logistics.getInternational', callback);
        };

        return projectManageService;
    },
]);
