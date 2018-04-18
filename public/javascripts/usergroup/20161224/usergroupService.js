app.factory('usergroupService', ['easyHttp', function(easyHttp) {

    var usergroupService = {};

    /**
     * 获取树信息
     * @param userGroupId    用户组ID
     * @returns {*}
     */
    usergroupService.getGroupDetail = function(userGroupId, callback){
        return easyHttp.get('logistics.getGroupDetail',{'seatParams':{'userGroupId':userGroupId}}, callback);
    }

    /**
     * 修改用户组
     * @param userGroupId    用户组ID
     * @param data    修改字段对象{'key':'value'}
     * @returns {*}
     */
    usergroupService.saveEditUserGroup = function(config, callback){
        return easyHttp.put('logistics.saveEditUserGroup',config, callback);
    };

    /**
     * 移动组织
     * @param orgId    用户组ID
     * @param parentId    父ID
     * @param preId    上一个兄弟ID
     * @returns {*}
     */
    usergroupService.moveGroup = function(config, callback){
        return easyHttp.put('logistics.moveGroup',config, callback);
    };

    /**
     * 新增用户组
     * @param data
     * @returns {*}
     */
    usergroupService.saveAddUserGroup = function(config, callback){
        return easyHttp.post('logistics.saveAddUserGroup',config, callback);
    };

    /**
     * 删除用户组
     * @param data
     * @returns {*}
     */

    usergroupService.deleteUserGroup = function(userGroupId, callback){
        return easyHttp.delete('logistics.deleteUserGroup',{'seatParams':{'userGroupId':userGroupId}}, callback);
    };

    /**
     * 移除用户组用户
     * @param data
     * @returns {*}
     */
    usergroupService.deleteTableUser = function(config, callback){
        return easyHttp.put('logistics.deleteTableUser',config, callback);
    };

    /**
     * 添加用户组用户
     * @param data
     * @returns {*}
     */
    usergroupService.addTableUser = function(config, callback){
        return easyHttp.put('logistics.addTableUser',config, callback);
    };

    /**
     * 用户组异步校验名称。
     * @param orgId 修改时传id 新增时传空
     * @returns {*}
     */
    usergroupService.validateUserGroupName = function(config, callback){
        return easyHttp.get('logistics.validateUserGroupName' ,config, callback);
    };

    /**GET
     * 用户组异步校验简称。
     * @param orgId 修改时传id 新增时传空
     * @returns {*}
     */
    usergroupService.validateUserGroupShortName = function(config, callback){
        return easyHttp.get('logistics.validateUserGroupShortName' ,config, callback);
    };

    /**
     * 用户组异步校验编码。
     * @param orgId 修改时传id 新增时传空
     * @returns {*}
     */
    usergroupService.validateUserGroupCode = function(config, callback){
        return easyHttp.get('logistics.validateUserGroupCode' , config, callback);
    };

    return usergroupService;
}]);