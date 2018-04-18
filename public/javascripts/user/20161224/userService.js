app.factory('userService', ['easyHttp', '$http', function (easyHttp, $http) {
    var userService = {};

    /**
     * 获取职位
     * @param id    组织id
     * @returns {*}
     */
    userService.getPositionsData = function (callback) {
        return easyHttp.get('logistics.getPositionsData', callback);
    };

    /**
     * 新增用户信息
     * @param fullName
     * @param userCode
     * @param sex
     * @param positionId
     * @param mobilephone
     * @param email
     * @param description
     * @param orgId
     * @returns {*}
     */
    userService.userSave = function (config, callback) {
        return easyHttp.post('logistics.userSave', config, callback);
    };

    /**
     * 修改用户信息
     * @param fullName
     * @param userCode
     * @param sex
     * @param positionId
     * @param mobilephone
     * @param email
     * @param description
     * @param orgId
     * @returns {*}
     */
    userService.editSave = function (config, callback) {
        return easyHttp.put('logistics.editSave', config, callback);
    };

    /**
     * 获取用户详情
     * @param id
     * @returns {*}
     */
    userService.getUserDetail = function (config, callback) {
        return easyHttp.get('logistics.getUserDetail', config, callback);
    };

    /**
     * 批量删除用户
     * @param id
     * @returns {*}
     */
    userService.deleteUsers = function (config, callback) {
        return easyHttp.post('logistics.deleteUsers', config, callback);
    };
    /**
     * 批量移动用户。
     * @param targetorgid
     * @param userIds
     * @returns {*}
     */
    userService.moveUsers = function (config, callback) {
        return easyHttp.post('logistics.moveUsers', config, callback);
    };

    /**
     * 批量重置用户密码
     * @param userIds
     * @returns {*}
     */
    userService.modifyPassword = function (config, callback) {
        return easyHttp.post('logistics.modifyPassword', config, callback);
    };

    /**
     * 批量锁定用户
     * @param ids
     * @returns {*}
     */
    userService.lockUser = function (config, callback) {
        return easyHttp.post('logistics.lockUser', config, callback);
    };

    /**
     * 批量解锁用户
     * @param ids
     * @returns {*}
     */
    userService.unlockUser = function (config, callback) {
        return easyHttp.post('logistics.unlockUser', config, callback);
    };

    /**
     * 提交用户头像
     * @param ids
     * @returns {*}
     */
    userService.uploadFileToUrl = function(file){
        var _4M = 4 * 1024 * 1024;
        var res = {};

        if(file == undefined){
            return false;
        }
        if (file.size > _4M) {
            res.errorlocal = "user_prompt_upload_too_large";
            return res;
        }
        if (file.size === 0) {
            res.errorlocal = "user_prompt_upload_zero";
            return res;
        }

        var fd = new FormData();
        fd.append('file', file);
        var args = {
            method: 'POST',
            url: Interface.getUrlById("logistics.uploadFileToUrl")+ 'pic',
            data: fd,
            headers: {'Content-Type': undefined, 'x-token': cookie.get("token")},
            transformRequest: angular.identity,
            //timeout: 10000
        };
        return $http(args);
    };

    /**
     * 用户管理异步校验工号
     * @param orgId 修改时传id 新增时传空
     * @returns {*}
     */
    userService.validateUserCode = function (config, callback) {
        return easyHttp.get('logistics.validateUserCode', config, callback);
    };

    /**
     * 用户管理异步校验邮箱
     * @param orgId 修改时传id 新增时传空
     * @returns {*}
     */
    userService.validateUserEmail = function (config, callback) {
        return easyHttp.get('logistics.validateUserEmail', config, callback);
    };

    return userService;
}]);