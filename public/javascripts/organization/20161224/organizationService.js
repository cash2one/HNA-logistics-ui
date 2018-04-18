app.factory('organizationService', ['easyHttp', function(easyHttp) {

    var organizationService = {};

    /**
     * 获取当前组织机构详情
     * @param orgId    组织ID
     * @returns {*}
     */
    organizationService.getOrganization = function(orgId, callback){

        return easyHttp.get('logistics.getOrganization',{'seatParams':{'orgId':orgId}}, callback);
    };

    /**
     * 删除组织机构
     * @param orgId    组织ID
     * @returns {*}
     */
    organizationService.deleteOrganization = function(orgId, callback){

        return easyHttp.delete('logistics.deleteOrganization',{'seatParams':{'orgId':orgId}}, callback);
    };

    /**
     * 移动组织机构
     * @param orgId    组织ID
     * @returns {*}
     */
    organizationService.moveOrganization = function(config, callback){

        return easyHttp.put('logistics.moveOrganization',config, callback);
    };

    /**
     * 保存新建组织机构
     * @param orgId    组织ID
     * @returns {*}
     */
    organizationService.saveOrganization = function(config, callback){

        return easyHttp.post('logistics.saveOrganization', config, callback);
    };

    /**
     * 保存修改组织机构
     * @param orgId    组织ID
     * @returns {*}
     */
    organizationService.editOrganization = function(config, callback){

        return easyHttp.put('logistics.editOrganization', config, callback);
    };

    /**
     * 组织机构异步校验名称。
     * @param orgId 修改时传id 新增时传空
     * @returns {*}
     */
    organizationService.validateName = function(config, callback){
        return easyHttp.get('logistics.validateName' ,config, callback);
    };

    /**
     * 组织机构异步校验简称。
     * @param orgId 修改时传id 新增时传空
     * @returns {*}
     */
    organizationService.validateShortName = function(config, callback){
        return easyHttp.get('logistics.validateShortName' ,config, callback);
    };

    /**
     * 组织机构异步校验编码。
     * @param orgId 修改时传id 新增时传空
     * @returns {*}
     */
    organizationService.validateCode = function(config, callback){
        return easyHttp.get('logistics.validateCode' ,config, callback);
    };

    return organizationService;
}]);