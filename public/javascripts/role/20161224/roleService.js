app.factory('roleService', ['easyHttp', function(easyHttp) {
    var roleService = {};

    /**
     * 获取全部角色列表。
     * @param q    查询关键字
     * @param page    当前页Index
     * @param pageSize    显示数量
     * @returns {*}
     */
    roleService.getRoleList = function(q, pageIndex, pageSize, callback){
        return easyHttp.get('logistics.getRoleList',{'urlParams':{'q':q,'pageIndex':pageIndex,'pageSize':pageSize}}, callback);
    };

    /**
     * 获取角色详细信息
     * @param roleId    角色ID
     * @returns {*}
     */
    roleService.getRoleDetail = function(roleId, callback){
        return easyHttp.get('logistics.getRoleDetail',{'seatParams':{'id':roleId}}, callback);
    };

    /**
     * 获取新增时角色编号
     */
    roleService.getRoleCode = function(domainId, callback){
        return easyHttp.get('logistics.getRoleCode',{'seatParams':{'domainId':domainId}}, callback);
    };

    /**
     * 修改角色详情
     * @param roleId    角色ID
     * @param param     字段对象{'key':'value'}
     * @returns {*}
     */
    roleService.saveEditRole = function(roleId, param, callback){
        return easyHttp.put('logistics.saveEditRole',{'urlParams':param,'seatParams':{'id':roleId}}, callback);
    };

    /**
     * 新增角色
     * @param param    字段对象{'key':'value'}
     * @returns {*}
     */
    roleService.saveAddRole = function(param, callback){
        return easyHttp.post('logistics.saveAddRole',{'urlParams':param}, callback);
    };

    /**
     * 删除角色
     * @param roleId    角色ID
     */
    roleService.deleteRole = function(roleId, callback){
        return easyHttp.delete('logistics.deleteRole',{'seatParams':{'id':roleId}}, callback);
    };

    /**
     * 排序角色列表
     * @param roleId    角色ID
     * @param param    put数据
     */
    roleService.orderRole = function(roleId, param, callback){
        return easyHttp.put('logistics.orderRole',{'urlParams':param,'seatParams':{'id':roleId}}, callback);
    };

    /**
     * 删除用户成员角色
     * @param roleId    角色ID
     * @param userId    成员Id
     */
    roleService.delUserRole = function(roleId, userId, callback){
        return easyHttp.delete('logistics.delUserRole',{'seatParams':{'userId':userId,'roleId':roleId}}, callback);
    };

    /**
     * 删除组织成员角色
     * @param roleId    角色ID
     * @param orgId     组织成员Id
     */
    roleService.delOrgRole = function(roleId, orgId, callback){
        return easyHttp.delete('logistics.delOrgRole',{'seatParams':{'orgId':orgId,'roleId':roleId}}, callback);
    };

    /**
     * 删除用户组成员角色
     * @param roleId    角色ID
     * @param groupId    用户组成员Id
     */
    roleService.delGroupRole = function(roleId, groupId, callback){
        return easyHttp.delete('logistics.delGroupRole',{'seatParams':{'groupId':groupId,'roleId':roleId}}, callback);
    };

    /**
     * 移除角色成员
     * @param roleId    角色ID
     * @param data    put数据
     */
    roleService.removeUser = function(roleId, param, callback){
        return easyHttp.put('logistics.removeUser',{'urlParams':param,'seatParams':{'roleId':roleId}}, callback);
    };

    /**
     * 行政机构树。
     * @param orgPid    行政树
     * @returns {*}
     */
    roleService.getOrgTree = function(orgPid, callback){
        return easyHttp.get('logistics.getOrgTree',{'seatParams':{'parentid':orgPid}}, callback);
    };

    /**
     * 获取已选用户
     * @param param    下发参数
     */
    roleService.getRoleMember = function (param, callback) {
        return easyHttp.get('logistics.getRoleMember', {'urlParams':param}, callback);
    };

    /**
     * 获取用户组详细信息
     * @param uid    用户组Id
     */
    roleService.getGroupDetail = function(uid, callback){
        return easyHttp.get( 'logistics.getGroupDetail',{'seatParams':{'userGroupId':uid}}, callback);
    };

    /**
     * 获取组织详细信息
     * @param uid    组织Id
     */
    roleService.getOrgDetail = function(uid, callback){
        return easyHttp.get( 'logistics.getOrganization', {'seatParams':{'orgId':uid}}, callback);
    };

    /**
     * 获取组织对应的用户
     * @param uid    组织Id
     */
    roleService.getOgrUserList = function(uid, params, callback){
        return easyHttp.get( 'logistics.userTableUrl',{'urlParams':params, 'seatParams':{'uid':uid}}, callback);
    };

    /**
     * 添加角色成员
     * @param roleId    角色Id
     * @param param    下发参数
     * @param callback    回调函数
     * @returns {*}
     */
    roleService.addRoleMember = function(roleId, param, callback){
        return easyHttp.put( 'logistics.addRoleMember',{'urlParams':param,'seatParams':{'roleId':roleId}}, callback);
    };

    /**
     * 获取角色资源
     * @param roleId    角色ID
     * @returns {*}
     */
    roleService.getRoleResources = function(roleId, callback){
        return easyHttp.get( 'logistics.getRoleResources',{'seatParams':{'roleId':roleId}}, callback);
    };

    /**
     * 保存角色授予的资源权限
     * @param roleId
     * @param param
     */
    roleService.saveRoleResources = function(roleId, param, callback){
        return easyHttp.post('logistics.saveRoleResources',{'urlParams':param,'seatParams':{'roleId':roleId}}, callback);
    };

    /**
     * 角色名称校验
     * @param config
     * @param callback
     */
    roleService.checkName = function(config, callback){
        return easyHttp.get('logistics.checkRoleName', config, callback);
    };

    /**
     * 角色编码校验
     * @param config
     * @param callback
     */
    roleService.checkCode = function(config, callback){
        return easyHttp.get('logistics.checkRoleCode', config, callback);
    };

    return roleService;
}]);