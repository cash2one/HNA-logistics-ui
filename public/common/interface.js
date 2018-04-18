window.Interface={
    "logistics": {
        "title": "物流平台app接口",
        "host": "",
        "interfaces": [
            {
                "name": "获取token参数",
                "id": "getToken",
                "url": "/api/v1/auth/whoami",
                "desc": ""
            },
            {
                "name": "上传模板",
                "id": "uploadTemplate",
                "url": "/api/v1/trd/order/export/base64code?type={type}&orderNo={orderNo}",
                "desc": ""
            },
            {
                "name": "获取模板",
                "id": "getTemplate",
                "url": "/api/v1/trd/order/html",
                "desc": ""
            },
            {
                "name": "获取模板数据",
                "id": "getTemplateData",
                "url": "/api/v1/trd/order/{orderNo}",
                "desc": ""
            },
            {
                "name": "批量删除工单",
                "id": "deleteWorkOrderList",
                "url": "/api/v1/csrworkorder/deletions",
                "desc": ""
            },
            {
                "name": "搜索所有客户列表",
                "id": "searchAllCustomerList",
                "url": "/api/v1/csrworkorder/usernamelist",
                "desc": ""
            },
            {
                "name": "获取工单列表",
                "id": "getWorkOrderList",
                "url": "/api/v1/csrworkorder/search",
                "desc": ""
            },
            {
                "name": "新增产品基本信息",
                "id": "addProductBaseInfo",
                "url": "/api/v1/biz/product",
                "desc": ""
            },
            {
                "name": "产品下线",
                "id": "offlineProdcut",
                "url": "/api/v1/biz/product/{uid}/offline",
                "desc": ""
            },
            {
                "name": "根据ID获取用户信息",
                "id": "getUserDetailById",
                "url": "/api/v1/sys/users/{id}",
                "desc": ""
            },
            {
                "name": "产品上线",
                "id": "onlineProdcut",
                "url": "/api/v1/biz/product/{uid}/online",
                "desc": ""
            },
            {
                "name": "异步校验产品编码",
                "id": "productCheckCode",
                "url": "/api/v1/biz/product/checkCode",
                "desc": ""
            },
            {
                "name": "审核产品",
                "id": "audit",
                "url": "/api/v1/biz/product/audit/{uid}",
                "desc": ""
            },
            {
                "name": "打回产品",
                "id": "rejections",
                "url": "/api/v1/biz/product/rejections/{uid}",
                "desc": ""
            },
            {
                "name": "修改产品基本信息",
                "id": "modifyProductBaseInfo",
                "url": "/api/v1/biz/product/{uid}",
                "desc": ""
            },
            {
                "name": "获取产品预估时效单位",
                "id": "getProductEstimated",
                "url": "/api/v1/biz/product/services/estimated",
                "desc": ""
            },
            {
                "name": "获取单个产品的基本信息",
                "id": "getProductBaseInfo",
                "url": "/api/v1/biz/product/search/{uid}",
                "desc": ""
            },
            {
                "name": "获取产品组信息",
                "id": "queryProductGroup",
                "url": "/api/v1/biz/product/group/get",
                "desc": ""
            },
            {
                "name": "搜索产品组信息",
                "id": "searchProductGroup",
                "url": "/api/v1/biz/product/group/all",
                "desc": ""
            },
            {
                "name": "获取产品可见性",
                "id": "getProductVisiblity",
                "url": "/api/v1/biz/product/customer/find",
                "desc": ""
            },
            {
                "name": "获取所有产品组",
                "id": "getAllProductGroup",
                "url": "/api/v1/biz/product/group/list",
                "desc": ""
            },
            {
                "name": "获取所有产品",
                "id": "getAllProduct",
                "url": "/api/v1/biz/product/list/short/all",
                "desc": ""
            },
            {
                "name": "提交产品可见性数据",
                "id": "postProductVisiblity",
                "url": "/api/v1/biz/product/customer",
                "desc": ""
            },
            {
                "name": "修改产品可见性数据",
                "id": "updateProductVisiblity",
                "url": "/api/v1/biz/product/customer/update",
                "desc": ""
            },
            {
                "name": "批量提交审核产品",
                "id": "submitProducts",
                "url": "/api/v1/biz/product/submit",
                "desc": ""
            },
            {
                "name": "批量删除产品",
                "id": "deleteProduct",
                "url": "/api/v1/biz/product/deletions",
                "desc": ""
            },
            {
                "name": "获取产品列表",
                "id": "queryProductList",
                "url": "/api/v1/biz/product/list",
                "desc": ""
            },
            {
                "name": "获取随机id",
                "id": "getLicense",
                "url": "/api/v1/sys/files/upload/pic",
                "desc": ""
            },
            {
                "name": "客户管理校验账号email",
                "id": "checkUserInfoEmail",
                "url": "/api/v1/customer/email",
                "desc": ""
            },
            {
                "name": "异步校验账号邮箱",
                "id": "checkAccountEmail",
                "url": "/api/v1/customer/user/checkemail",
                "desc": ""
            },
            {
                "name": "异步校验用户是否存在",
                "id": "checkUserExsist",
                "url": "/api/v1/customer/user/checkusername",
                "desc": ""
            },
            {
                "name": "通过用户id获取公司信息",
                "id": "getCompanyInfo",
                "url": "/api/v1/customer/company/{costomerid}",
                "desc": ""
            },
            {
                "name": "添加客户子账户",
                "id": "addCustomerChildAccount",
                "url": "/api/v1/customer/user",
                "desc": ""
            },
            {
                "name": "重置子账号密码",
                "id": "resetCustomerChildPassword",
                "url": "/api/v1/customer/user/resetpasswd",
                "desc": ""
            },
            {
                "name": "提交客户公司信息",
                "id": "submitCompany",
                "url": "/api/v1/customer/company",
                "desc": ""
            },
            {
                "name": "删除子账号",
                "id": "deleteCustomerChildAccount",
                "url": "/api/v1/customer/user/deletions",
                "desc": ""
            },
            {
                "name": "更新客户子账号",
                "id": "updateCustomerChildAccount",
                "url": "/api/v1/customer/user",
                "desc": ""
            },
            {
                "name": "解锁子账号",
                "id": "unlockCustomerChildAccount",
                "url": "/api/v1/customer/user/unlock",
                "desc": ""
            },
            {
                "name": "锁定子账号",
                "id": "lockCustomerChildAccount",
                "url": "/api/v1/customer/user/lock",
                "desc": ""
            },
            {
                "name": "搜索子账号列表",
                "id": "searchChildAccount",
                "url": "/api/v1/customer/user/search",
                "desc": ""
            },
            {
                "name": "检测编码是否存在",
                "id": "checkCustomerCode",
                "url": "/api/v1/customer/checkcode?code={code}",
                "desc": ""
            },
            {
                "name": "获取客户信息",
                "id": "getCustomerInfo",
                "url": "/api/v1/customer/{id}",
                "desc": ""
            },
            {
                "name": "锁定用户",
                "id": "lockCustomer",
                "url": "/api/v1/customer/lock",
                "desc": ""
            },
            {
                "name": "添加客户",
                "id": "addCustomer",
                "url": "/api/v1/customer",
                "desc": ""
            },
            {
                "name": "修改客户",
                "id": "updateCustomer",
                "url": "/api/v1/customer",
                "desc": ""
            },
            {
                "name": "批量删除客户",
                "id": "deleteCustomer",
                "url": "/api/v1/customer/deletions",
                "desc": ""
            },
            {
                "name": "解锁用户",
                "id": "unlockCustomer",
                "url": "/api/v1/customer/unlock",
                "desc": ""
            },
            {
                "name": "获取新建价格列表",
                "id": "getCostPriceList",
                "url": "/api/v1/biz/quotations/search",
                "desc": ""
            },
            {
                "name": "获取价格审批流程",
                "id": "getPriceStream",
                "url": "/api/v1/biz/approval/price/{uid}",
                "desc": ""
            },
            {
                "name": "获取产品审批流程",
                "id": "getProductStream",
                "url": "/api/v1/biz/approval/product/{uid}",
                "desc": ""
            },
            {
                "name": "获取产品审批流程",
                "id": "getProductStream",
                "url": "/api/v1/biz/approval/product/{uid}",
                "desc": ""
            },
            {
                "name": "获取服务的审批流程",
                "id": "getServiceStream",
                "url": "/api/v1/biz/approval/service/{uid}",
                "desc": ""
            },
            {
                "name": "销售价方案审核通过",
                "id": "salePriceAuditPassed",
                "url": "/api/v1/biz/quotations/sales/{uid}/audit",
                "desc": ""
            },
            {
                "name": "销售价方案打回草稿",
                "id": "salePriceReturnDraft",
                "url": "/api/v1/biz/quotations/sales/{uid}/rejections",
                "desc": ""
            },
            {
                "name": "启用销售价方案",
                "id": "salePriceStartUse",
                "url": "/api/v1/biz/quotations/sales/online?isconfirmed={isconfirmed}",
                "desc": ""
            },
            {
                "name": "停用销售价方案",
                "id": "salePriceStopUse",
                "url": "/api/v1/biz/quotations/sales/offline",
                "desc": ""
            },
            {
                "name": "启用成本价格方案",
                "id": "startUse",
                "url": "/api/v1/biz/quotations/cost/online?isconfirmed={isconfirmed}",
                "desc": ""
            },
            {
                "name": "停用成本价格方案",
                "id": "stopUse",
                "url": "/api/v1/biz/quotations/cost/offline",
                "desc": ""
            },
            {
                "name": "审核通过",
                "id": "verifyPass",
                "url": "/api/v1/biz/quotations/cost/audit?{confirmed}",
                "desc": ""
            },
            {
                "name": "打回草稿",
                "id": "nopassDraft",
                "url": "/api/v1/biz/quotations/cost/rejections",
                "desc": ""
            },
            {
                "name": "删除报价方案",
                "id": "deleteCostPrice",
                "url": "/api/v1/biz/quotations/cost/deletions",
                "desc": ""
            },
            {
                "name": "审核销售价报价方案",
                "id": "submitSalePrice",
                "url": "/api/v1/biz/quotations/sale/submit",
                "desc": ""
            },
            {
                "name": "删除销售价报价方案",
                "id": "deleteSalePrice",
                "url": "/api/v1/biz/quotations/sale/deletions",
                "desc": ""
            },
            {
                "name": "提交成本价审核报价方案",
                "id": "submitCostPrice",
                "url": "/api/v1/biz/quotations/cost/submit",
                "desc": ""
            },
            {
                "name": "批量删除重量段",
                "id": "deleteWeightList",
                "url": "/api/v1/biz/weightschema/deletions",
                "desc": ""
            },
            {
                "name": "获取重量单位列表",
                "id": "getWeightUnitList",
                "url": "/api/v1/dict/unit/weight",
                "desc": ""
            },
            {
                "name": "重量段中编码是否存在",
                "id": "isExistedCode",
                "url": "/api/v1/biz/weightschema/isexistedcode",
                "desc": ""
            },
            {
                "name": "获取服务器系统时间",
                "id": "getServerTime",
                "url": "/api/v1/sys/time/",
                "desc": ""
            },
            {
                "name": "增加重量段",
                "id": "addWeight",
                "url": "/api/v1/biz/weightschema",
                "desc": ""
            },
            {
                "name": "获取重量段列表",
                "id": "getWeightList",
                "url": "/api/v1/biz/weightschema",
                "desc": ""
            },
            {
                "name": "更新重量段",
                "id": "updateWeight",
                "url": "/api/v1/biz/weightschema",
                "desc": ""
            },
            {
                "name": "获取汇率列表",
                "id": "getRateList",
                "url": "/api/v1/biz/exchangerate/exchangeratelist",
                "desc": ""
            },
            {
                "name": "获取最新汇率列表",
                "id": "getLatestRate",
                "url": "/api/v1/biz/exchangerate/latestexchangeratelist",
                "desc": ""
            },
            {
                "name": "获取币种国际化数据",
                "id": "currencyInternational",
                "url": "/api/v1/biz/currency/i18n/list/{language}",
                "desc": ""
            },
            {
                "name": "校验三字码是否存在",
                "id": "verifyCodeExist",
                "url": "/api/v1/biz/currency/code/{code}",
                "desc": ""
            },
            {
                "name": "更新币种",
                "id": "updateCurrency",
                "url": "/api/v1/biz/currency",
                "desc": ""
            },
            {
                "name": "添加币种",
                "id": "createCurrency",
                "url": "/api/v1/biz/currency",
                "desc": ""
            },
            {
                "name": "保存币种国际化编辑数据",
                "id": "saveCurrencyInternational",
                "url": "/api/v1/biz/currency/i18n",
                "desc": ""
            },
            {
                "name": "新增汇率",
                "id": "createNewRate",
                "url": "/api/v1/biz/exchangerate",
                "desc": ""
            },
            {
                "name": "更新汇率",
                "id": "updateRate",
                "url": "/api/v1/biz/exchangerate",
                "desc": ""
            },
            {
                "name": "批量删除汇率",
                "id": "deleteRateList",
                "url": "/api/v1/biz/exchangerate/deletions",
                "desc": ""
            },
            {
                "name": "批量删除货币",
                "id": "deleteCurrencys",
                "url": "/api/v1/biz/currency/deletions",
                "desc": ""
            },
            {
                "name": "获取所有货币",
                "id": "getCurrencyList",
                "url": "/api/v1/biz/currency/list",
                "desc": ""
            },
            {
                "name": "查询所有货币",
                "id": "searchCurrencyList",
                "url": "/api/v1/biz/currency/currencylist/{language}",
                "desc": ""
            },
            {
                "name": "校验区号是否重复",
                "id": "checkAreaCode",
                "url": "/api/v1/biz/area/checkareacode",
                "desc": ""
            },
            {
                "name": "修改地区信息",
                "id": "updateArea",
                "url": "/api/v1/biz/area/{id}",
                "desc": ""
            },
            {
                "name": "通过id获取单条数据",
                "id": "getSingleCountryById",
                "url": "/api/v1/biz/area/{id}",
                "desc": ""
            },
            {
                "name": "批量删除国家",
                "id": "deleteCountrys",
                "url": "/api/v1/biz/area/deletions",
                "desc": ""
            },
            {
                "name": "获取国家国际化列表",
                "id": "countryInternational",
                "url": "/api/v1/biz/area/i18n/list/{language}",
                "desc": ""
            },
            {
                "name": "保存国际化接口",
                "id": "saveCountryInternational",
                "url": "/api/v1/biz/area/i18n",
                "desc": ""
            },
            {
                "name": "校验三字码是否重复",
                "id": "checkTriadCode",
                "url": "/api/v1/biz/area/checktriadcode",
                "desc": ""
            },
            {
                "name": "校验国家名称是否重复",
                "id": "checkCountryName",
                "url": "/api/v1/biz/area/checkname",
                "desc": ""
            },
            {
                "name": "校验二字码是否重复",
                "id": "checkFigureCode",
                "url": "/api/v1/biz/area/checkfigurecode",
                "desc": ""
            },
            {
                "name": "新增国家",
                "id": "createCountry",
                "url": "/api/v1/biz/area",
                "desc": ""
            },
            {
                "name": "国家列表",
                "id": "countryList",
                "url": "/api/v1/biz/area/search/countrylist",
                "desc": ""
            },
            {
                "name": "获取地址信息",
                "id": "search",
                "url": "/api/v1/biz/area/search",
                "desc": ""
            },
            {
                "name": "获取其他国家的地址信息",
                "id": "searchList",
                "url": "/api/v1/biz/area/searchlist",
                "desc": ""
            },
            {
                "name": "获取验证码",
                "id": "getCodeImage",
                "url": "/api/v1/auth/login/getcodeimage",
                "desc": ""
            },
            {
                "name": "检验验证码",
                "id": "checkCode",
                "url": "/api/v1/auth/login/checkcodeimage",
                "desc": ""
            },
            {
                "name": "登录接口",
                "id": "login",
                "url": "/api/v1/auth/login",
                "desc": ""
            },
            {
                "name": "退出登录",
                "id": "logout",
                "url": "/api/v1/auth/logout",
                "desc": ""
            },
            {
                "name": "登录验证",
                "id": "loginCheck",
                "url": "/api/v1/context",
                "desc": ""
            },
            {
                "name": "获取机构详情",
                "id": "getOrganization",
                "url": "/api/v1/sys/orgs/{orgId}",
                "desc": "orgId:组织id"
            },
            {
                "name": "获取机构节点",
                "id": "getOrganizationNode",
                "url": "/api/v1/sys/orgs/",
                "desc": ""
            },
            {
                "name": "删除当前组织",
                "id": "deleteOrganization",
                "url": "/api/v1/sys/orgs/{orgId}",
                "desc": "orgId:组织id"
            },
            {
                "name": "组织移动事件",
                "id": "moveOrganization",
                "url": "/api/v1/sys/orgs/drag/{orgId}",
                "desc": "orgId:组织id"
            },
            {
                "name": "保存新建组织机构",
                "id": "saveOrganization",
                "url": "/api/v1/sys/orgs",
                "desc": ""
            },
            {
                "name": "保存修改组织机构",
                "id": "editOrganization",
                "url": "/api/v1/sys/orgs/{orgId}",
                "desc": "orgId:组织id"
            },
            {
                "name": "组织机构异步校验名称",
                "id": "validateName",
                "url": "/api/v1/sys/orgs/checkname",
                "desc": ""
            },
            {
                "name": "组织机构异步校验简称",
                "id": "validateShortName",
                "url": "/api/v1/sys/orgs/checkshortname",
                "desc": ""
            },
            {
                "name": "组织机构异步校验编码",
                "id": "validateCode",
                "url": "/api/v1/sys/orgs/checkcode",
                "desc": ""
            },
            {
                "name": "组织机构tree数据",
                "id": "treeChildUrl",
                "url": "/api/v1/sys/orgs/subnode/",
                "desc": ""
            },
            {
                "name": "组织机构检索",
                "id": "searchTreeUrl",
                "url": "/api/v1/sys/orgs",
                "desc": ""
            },
            {
                "name": "用户组table",
                "id": "userTableUrl",
                "url": "/api/v1/sys/users/search/{uid}",
                "desc": "uid: 用户Id"
            },
            {
                "name": "用户组tree数据",
                "id": "userTreeChildUrl",
                "url": "/api/v1/sys/usergroups/subnode/",
                "desc": ""
            },
            {
                "name": "用户组树检索",
                "id": "userSearchTreeUrl",
                "url": "/api/v1/sys/usergroups",
                "desc": ""
            },
            {
                "name": "获取用户组详情",
                "id": "getGroupDetail",
                "url": "/api/v1/sys/usergroups/{userGroupId}",
                "desc": "userGroupId:组织id"
            },
            {
                "name": "获取用户组节点",
                "id": "getGroupNode",
                "url": "/api/v1/sys/usergroups/",
                "desc": ""
            },
            {
                "name": "修改用户组",
                "id": "saveEditUserGroup",
                "url": "/api/v1/sys/usergroups/{userGroupId}",
                "desc": "userGroupId:组织id"
            },
            {
                "name": "移动用户组组织",
                "id": "moveGroup",
                "url": "/api/v1/sys/usergroups/drag/{userGroupId}",
                "desc": "userGroupId:组织id"
            },
            {
                "name": "新增用户组",
                "id": "saveAddUserGroup",
                "url": "/api/v1/sys/usergroups",
                "desc": ""
            },
            {
                "name": "删除用户组",
                "id": "deleteUserGroup",
                "url": "/api/v1/sys/usergroups/{userGroupId}",
                "desc": "userGroupId:组织id"
            },
            {
                "name": "移除用户组用户",
                "id": "deleteTableUser",
                "url": "/api/v1/sys/usergroups/removeuser",
                "desc": ""
            },
            {
                "name": "添加用户组用户",
                "id": "addTableUser",
                "url": "/api/v1/sys/usergroups/{userGroupId}/assignuser",
                "desc": "userGroupId:组织id"
            },
            {
                "name": "用户组异步校验名称",
                "id": "validateUserGroupName",
                "url": "/api/v1/sys/usergroups/checkname",
                "desc": ""
            },
            {
                "name": "用户组异步校验简称",
                "id": "validateUserGroupShortName",
                "url": "/api/v1/sys/usergroups/checkshortname",
                "desc": ""
            },
            {
                "name": "用户组异步校验编码",
                "id": "validateUserGroupCode",
                "url": "/api/v1/sys/usergroups/checkcode",
                "desc": ""
            },
            {
                "name": "用户管理获取职位",
                "id": "getPositionsData",
                "url": "/api/v1/sys/positions",
                "desc": ""
            },
            {
                "name": "用户管理保存",
                "id": "userSave",
                "url": "/api/v1/sys/users",
                "desc": ""
            },
            {
                "name": "用户管理修改",
                "id": "editSave",
                "url": "/api/v1/sys/users/{userId}",
                "desc": "userId:用户id"
            },
            {
                "name": "获取用户详情",
                "id": "getUserDetail",
                "url": "/api/v1/sys/users/{userId}",
                "desc": "userId:用户id"
            },
            {
                "name": "批量删除用户",
                "id": "deleteUsers",
                "url": "/api/v1/sys/users/deletions",
                "desc": ""
            },
            {
                "name": "批量移动用户",
                "id": "moveUsers",
                "url": "/api/v1/sys/users/moveorg/{targetorgid}",
                "desc": "targetorgid:要移动到改id上"
            },
            {
                "name": "批量重置用户密码",
                "id": "modifyPassword",
                "url": "/api/v1/sys/users/resetpasswd",
                "desc": ""
            },
            {
                "name": "批量锁定用户",
                "id": "lockUser",
                "url": "/api/v1/sys/users/lock",
                "desc": ""
            },
            {
                "name": "批量解锁用户",
                "id": "unlockUser",
                "url": "/api/v1/sys/users/unlock",
                "desc": ""
            },
            {
                "name": "提交用户头像",
                "id": "uploadFileToUrl",
                "url": "/api/v1/sys/files/upload/",
                "desc": ""
            },
            {
                "name": "用户管理异步校验工号",
                "id": "validateUserCode",
                "url": "/api/v1/sys/users/checkcode",
                "desc": ""
            },
            {
                "name": "用户管理异步校验邮箱",
                "id": "validateUserEmail",
                "url": "/api/v1/sys/users/checkemail",
                "desc": ""
            },
            {
                "name": "获取角色详细信息",
                "id": "getRoleDetail",
                "url": "/api/v1/sys/roles/{id}",
                "desc": "id: 角色id"
            },
            {
                "name": "获取角色列表",
                "id": "getRoleList",
                "url": "/api/v1/sys/roles/search",
                "desc": "q:搜索关键字; pageIndex:当前页; pageSize:每页记录数"
            },
            {
                "name": "新增角色时获取角色编号",
                "id": "getRoleCode",
                "url": "/api/v1/sys/roles/code/{domainId}",
                "desc": "domainId:系统值; 1:运营系统; 2:供应商系统; 3:客户系统;"
            },
            {
                "name": "修改角色详情",
                "id": "saveEditRole",
                "url": "/api/v1/sys/roles/{id}",
                "desc": "id:角色id;  urlParams参数"
            },
            {
                "name": "新增角色详情",
                "id": "saveAddRole",
                "url": "/api/v1/sys/roles",
                "desc": "urlParams参数"
            },
            {
                "name": "删除角色",
                "id": "deleteRole",
                "url": "/api/v1/sys/roles/{id}",
                "desc": "id:角色id"
            },
            {
                "name": "角色排序",
                "id": "orderRole",
                "url": "/api/v1/sys/roles/drag/{id}",
                "desc": "id:角色id;  urlParams参数"
            },
            {
                "name": "删除用户角色",
                "id": "delUserRole",
                "url": "/api/v1/sys/users/{userId}/removerole/{roleId}",
                "desc": "userId:用户Id; roleId:角色Id"
            },
            {
                "name": "删除组织角色",
                "id": "delOrgRole",
                "url": "/api/v1/sys/orgs/{orgId}/removerole/{roleId}",
                "desc": "orgId:组织Id; roleId:角色Id"
            },
            {
                "name": "删除用户组角色",
                "id": "delGroupRole",
                "url": "/api/v1/sys/usergroups/{groupId}/removerole/{roleId}",
                "desc": "groupId:用户组Id; roleId:角色Id"
            },
            {
                "name": "移除角色成员",
                "id": "removeUser",
                "url": "/api/v1/sys/roles/{roleId}/removemembers",
                "desc": "roleId:角色Id;  urlParams参数"
            },
            {
                "name": "获取角色成员",
                "id": "getRoleMember",
                "url": "/api/v1/sys/roles/searchUserAndOrg",
                "desc": "urlParams参数"
            },
            {
                "name": "添加角色成员",
                "id": "addRoleMember",
                "url": "/api/v1/sys/roles/{roleId}/assignmembers",
                "desc": "roleId:角色Id;  urlParams参数"
            },
            {
                "name": "获取角色资源权限",
                "id": "getRoleResources",
                "url": "/api/v1/sys/menus/roletree/{roleId}",
                "desc": "roleId:角色Id;"
            },
            {
                "name": "保存角色资源权限",
                "id": "saveRoleResources",
                "url": "/api/v1/sys/auth/menu/{roleId}",
                "desc": "roleId:角色Id;  urlParams参数"
            },
            {
                "name": "获取角色成员列表",
                "id": "getRoleUser",
                "url": "/api/v1/sys/roles/searchUserAndOrg",
                "desc": "roleId:角色Id;"
            },
            {
                "name": "获取组织树结构",
                "id": "getOrgTree",
                "url": "/api/v1/sys/orgs/subnode/{parentid}",
                "desc": "parentid:父节点Id"
            },
            {
                "name": "获取用户导航菜单",
                "id": "getUserMenu",
                "url": "/api/v1/u/usertree",
                "desc": ""
            },
            {
                "name": "获取登录用户个性化配置",
                "id": "getUserConf",
                "url": "/api/v1/u/userconfig",
                "desc": ""
            },
            {
                "name": "设置登录用户国际化配置",
                "id": "setUserConf",
                "url": "/api/v1/u/userconfig",
                "desc": "urlParams参数"
            },
            {
                "name": "获取登录用户信息",
                "id": "getUserProfile",
                "url": "/api/v1/u/profile",
                "desc": ""
            },
            {
                "name": "新增机场",
                "id": "saveAirport",
                "url": "/api/v1/biz/airport",
                "desc": ""
            },
            {
                "name": "获取国家",
                "id": "getCountry",
                "url": "/api/v1/biz/area/search/country",
                "desc": ""
            },
            {
                "name": "删除机场",
                "id": "deleteAirports",
                "url": "/api/v1/biz/airport/deletions",
                "desc": ""
            },
            {
                "name": "获取所有机场列表",
                "id": "getAllAirports",
                "url": "/api/v1/biz/airport/searchlist",
                "desc": ""
            },
            {
                "name": "修改机场",
                "id": "updateAirport",
                "url": "/api/v1/biz/airport/{id}",
                "desc": "id:机场的id"
            },
            {
                "name": "获取机场信息",
                "id": "getAirportDetail",
                "url": "/api/v1/biz/airport/{id}",
                "desc": "id:机场的id"
            },
            {
                "name": "获取费用类型",
                "id": "getCostTable",
                "url": "/api/v1/biz/feetypes",
                "desc": "urlParams参数"
            },
            {
                "name": "获取费用类型大类",
                "id": "getBigType",
                "url": "/api/v1/biz/feetypes/type",
                "desc": ""
            },
            {
                "name": "删除费用子类型",
                "id": "delCost",
                "url": "/api/v1/biz/feetypes/deletions",
                "desc": "urlParams参数"
            },
            {
                "name": "获取结算方式",
                "id": "getAccountTable",
                "url": "/api/v1/biz/settypes",
                "desc": "urlParams参数"
            },
            {
                "name": "删除结算费方式",
                "id": "delAccount",
                "url": "/api/v1/biz/settypes/deletions",
                "desc": "urlParams参数"
            },
            {
                "name": "获取所有可用语言列表",
                "id": "getLanguage",
                "url": "/api/v1/languages",
                "desc": ""
            },
            {
                "name": "获取机场国际化列表",
                "id": "getAirportsInternational",
                "url": "/api/v1/biz/airport/i18n/list/{language}",
                "desc": "language:语言"
            },
            {
                "name": "获取国际化语言",
                "id": "getInternational",
                "url": "/api/v1/languages/nozhcn",
                "desc": ""
            },
            {
                "name": "保存国际化",
                "id": "saveInternational",
                "url": "/api/v1/biz/airport/i18n",
                "desc": ""
            },
            {
                "name": "新增费用类型",
                "id": "saveCost",
                "url": "/api/v1/biz/feetypes",
                "desc": "urlParams参数"
            },
            {
                "name": "异步校验机场名称",
                "id": "validateAirportName",
                "url": "/api/v1/biz/airport/checkname",
                "desc": ""
            },
            {
                "name": "异步校验机场四字码",
                "id": "validateAirportTetradCode",
                "url": "/api/v1/biz/airport/checktetradcode",
                "desc": ""
            },
            {
                "name": "异步校验机场三字码",
                "id": "validateAirportTriadCode",
                "url": "/api/v1/biz/airport/checktriadcode",
                "desc": ""
            },
            {
                "name": "获取城市",
                "id": "getCity",
                "url": "/api/v1/biz/area/search/city",
                "desc": ""
            },
            {
                "name": "获取所有公司信息",
                "id": "getCompanys",
                "url": "/api/v1/biz/carrierCompany/searchlist",
                "desc": ""
            },
            {
                "name": "新增公司信息",
                "id": "saveCompany",
                "url": "/api/v1/biz/carrierCompany",
                "desc": ""
            },
            {
                "name": "修改公司信息",
                "id": "editCompany",
                "url": "/api/v1/biz/carrierCompany/{id}",
                "desc": "id::公司id"
            },
            {
                "name": "获取当前id公司的信息",
                "id": "getCompanyById",
                "url": "/api/v1/biz/carrierCompany/{id}",
                "desc": "id: 公司id"
            },
            {
                "name": "删除公司信息",
                "id": "deleteCompanyById",
                "url": "/api/v1/biz/carrierCompany/deletions",
                "desc": ""
            },
            {
                "name": "异步校验公司名称",
                "id": "validateCompanyName",
                "url": "/api/v1/biz/carrierCompany/checkname",
                "desc": ""
            },
            {
                "name": "异步校验公司二字码",
                "id": "validateCompanyFigureCode",
                "url": "/api/v1/biz/carrierCompany/checkfigurecode",
                "desc": ""
            },
            {
                "name": "异步校验公司三字码",
                "id": "validateAirportTriadCode",
                "url": "/api/v1/biz/carrierCompany/checktriadcode",
                "desc": ""
            },
            {
                "name": "获取结算方式详情",
                "id": "getAccountDetail",
                "url": "/api/v1/biz/settypes/{id}",
                "desc": "id: 结算方式Id;"
            },
            {
                "name": "修改结算方式",
                "id": "saveEditAccount",
                "url": "/api/v1/biz/settypes/{id}",
                "desc": "id: 结算方式Id; urlParams参数"
            },
            {
                "name": "新增结算方式类型",
                "id": "saveAccount",
                "url": "/api/v1/biz/settypes",
                "desc": "urlParams参数"
            },
            {
                "name": "获取费用类型详情",
                "id": "getCostDetail",
                "url": "/api/v1/biz/feetypes/{id}",
                "desc": ""
            },
            {
                "name": "修改费用类型",
                "id": "saveEidtCost",
                "url": "/api/v1/biz/feetypes/{id}",
                "desc": "id: 费用类型Id; urlParams参数"
            },
            {
                "name": "根据指定条件获取公司国际化数据集合",
                "id": "companyInternational",
                "url": "/api/v1/biz/carrierCompany/i18n/list/{language}",
                "desc": "language：语言"
            },
            {
                "name": "保存公司国际化",
                "id": "saveCompanyInternational",
                "url": "/api/v1/biz/carrierCompany/i18n",
                "desc": ""
            },
            {
                "name": "获取国家国际化列表",
                "id": "countryInternational",
                "url": "/api/v1/biz/area/i18n/list/{language}",
                "desc": "language：语言"
            },
            {
                "name": "保存国家国际化",
                "id": "saveCountryInternational",
                "url": "/api/v1/biz/area/i18n",
                "desc": ""
            },
            {
                "name": "获取费用类型国际化",
                "id": "getCostInternational",
                "url": "/api/v1/biz/feetypes/i18n/{language}",
                "desc": "language：语言; urlParams参数"
            },
            {
                "name": "保存费用类型国际化",
                "id": "saveCostInternational",
                "url": "/api/v1/biz/feetypes/i18n",
                "desc": "urlParams参数"
            },
            {
                "name": "获取结算方式国际化",
                "id": "getAccountInternational",
                "url": "/api/v1/biz/settypes/i18n/{language}",
                "desc": "language：语言; urlParams参数"
            },
            {
                "name": "保存结算方式国际化",
                "id": "saveAccountInternational",
                "url": "/api/v1/biz/settypes/i18n",
                "desc": "urlParams参数"
            },
            {
                "name": "费用类型编码校验",
                "id": "checkCostCode",
                "url": "/api/v1/biz/feetypes/feetypecheckcode",
                "desc": "urlParams参数"
            },
            {
                "name": "结算方式编码校验",
                "id": "checkAccountCode",
                "url": "/api/v1/biz/settypes/feetypecheckcode",
                "desc": "urlParams参数"
            },
            {
                "name": "返回供应商类型列表",
                "id": "getSupplierTypes",
                "url": "/api/v1/biz/servicetypes",
                "desc": ""
            },
            {
                "name": "获取供应商列表",
                "id": "getSupplierList",
                "url": "/api/v1/sup/suppliers/{intertype}/search/{serviceTypeId}",
                "desc": "serviceTypeId:供应商类型"
            },
            {
                "name": "服务获取供应商列表",
                "id": "serviceGetSupplier",
                "url": "api/v1/sup/suppliers/logistics/list",
                "desc": ""
            },
            {
                "name": "异步校验角色名称",
                "id": "checkRoleName",
                "url": "/api/v1/sys/roles/checkname",
                "desc": "urlParams参数"
            },
            {
                "name": "异步校验角色编码",
                "id": "checkRoleCode",
                "url": "/api/v1/sys/roles/checkcode",
                "desc": "urlParams参数"
            },
            {
                "name": "获取机型列表",
                "id": "getTransportTable",
                "url": "/api/v1/biz/airplanemodels/",
                "desc": "urlParams参数"
            },
            {
                "name": "删除机型",
                "id": "delTransport",
                "url": "/api/v1/biz/airplanemodels/deletions",
                "desc": "urlParams参数"
            },
            {
                "name": "新增机型",
                "id": "saveTransport",
                "url": "/api/v1/biz/airplanemodels/",
                "desc": ""
            },
            {
                "name": "获取机型详情",
                "id": "getTransportDetail",
                "url": "/api/v1/biz/airplanemodels/{id}",
                "desc": "id: 机型id;"
            },
            {
                "name": "修改机型",
                "id": "saveEditTransport",
                "url": "/api/v1/biz/airplanemodels/{id}",
                "desc": "id: 机型id;"
            },
            {
                "name": "校验机型三字码",
                "id": "checkTransportIata",
                "url": "/api/v1/biz/airplanemodels/checkcode",
                "desc": ""
            },
            {
                "name": "获取机型国际化",
                "id": "getTransportAirplaneInternational",
                "url": "/api/v1/biz/airplanemodels/i18n/{language}",
                "desc": ""
            },
            {
                "name": "保存机型国际化",
                "id": "saveTransportAirplaneInternational",
                "url": "/api/v1/biz/airplanemodels/i18n",
                "desc": ""
            },
            {
                "name": "异步校验编码",
                "id": "validateSupplierCode",
                "url": "/api/v1/sup/suppliers/{intertype}/checkcode",
                "desc": ""
            },
            {
                "name": "新建供应商",
                "id": "saveSupplier",
                "url": "/api/v1/sup/suppliers/{intertype}",
                "desc": ""
            },
            {
                "name": "修改供应商",
                "id": "editSupplier",
                "url": "/api/v1/sup/suppliers/{intertype}/{sid}/main",
                "desc": "sid：供应商id"
            },
            {
                "name": "根据ID获取供应商",
                "id": "getSupplierById",
                "url": "/api/v1/sup/suppliers/{intertype}/{sid}",
                "desc": "sid：供应商id"
            },
            {
                "name": "删除供应商",
                "id": "deleteSupplier",
                "url": "/api/v1/sup/suppliers/{intertype}/deletions",
                "desc": ""
            },
            {
                "name": "添加BD",
                "id": "addBD",
                "url": "/api/v1/sup/suppliers/{intertype}/{sid}/bd",
                "desc": "sid：供应商id"
            },
            {
                "name": "修改BD",
                "id": "editBD",
                "url": "/api/v1/sup/suppliers/{intertype}/{sid}/bd/{bdid}",
                "desc": "sid：供应商id\nbdid:bd的id"
            },
            {
                "name": "删除BD",
                "id": "deleteBD",
                "url": "/api/v1/sup/suppliers/{intertype}/{sid}/bd/deletions",
                "desc": "sid：供应商id"
            },
            {
                "name": "BD用户模糊匹配",
                "id": "getBDUser",
                "url": "/api/v1/sys/users/bd/search",
                "desc": ""
            },
            {
                "name": "新增联系人",
                "id": "addContacts",
                "url": "/api/v1/sup/suppliers/{intertype}/{sid}/contact",
                "desc": "sid：供应商id"
            },
            {
                "name": "修改联系人",
                "id": "editContacts",
                "url": "/api/v1/sup/suppliers/{intertype}/{sid}/contacts/{cid}",
                "desc": "sid：供应商id\ncid:联系人id"
            },
            {
                "name": "删除联系人",
                "id": "deleteContacts",
                "url": "/api/v1/sup/suppliers/{intertype}/{sid}/contacts/deletions",
                "desc": "sid：供应商id"
            },
            {
                "name": "新建或修改业务信息",
                "id": "saveOrAddBusiness",
                "url": "/api/v1/sup/suppliers/{intertype}/{sid}/biz",
                "desc": "sid：供应商id"
            },
            {
                "name": "新建或修改财务信息",
                "id": "saveOrAddFinancial",
                "url": "/api/v1/sup/suppliers/{intertype}/{sid}/financial",
                "desc": "sid：供应商id"
            },
            {
                "name": "下载营业执照到本地",
                "id": "downloadPicture",
                "url": "/api/v1/sys/files/download/",
                "desc": ""
            },
            {
                "name": "获取计费分区列表",
                "id": "getRegionList",
                "url": "/api/v1/biz/partition/schema",
                "desc": ""
            },
            {
                "name": "根据服务查询一个参考的采购价分区",
                "id": "getRegionByService",
                "url": "/api/v1/biz/quotations/cost/{quotationUid}/{serviceUid}/region",
                "desc": ""
            },
            {
                "name": "复制价格明细",
                "id": "copyPriceDetail",
                "url": "/api/v1/biz/quotations/sale/{uid}/copy",
                "desc": ""
            },
            {
                "name": "新增计费分区方案",
                "id": "addRegion",
                "url": "/api/v1/biz/partition/schema",
                "desc": ""
            },
            {
                "name": "修改计费分区方案",
                "id": "editRegion",
                "url": "/api/v1/biz/partition/schema/{id}",
                "desc": "id： 分区ID"
            },
            {
                "name": "删除计费分区方案",
                "id": "deleteRegion",
                "url": "/api/v1/biz/partition/schema/deletions",
                "desc": ""
            },
            {
                "name": "获取当前计费分区方案的详情",
                "id": "getChargingRegionDetail",
                "url": "/api/v1/biz/partition/schema/{id}",
                "desc": "id： 分区ID"
            },
            {
                "name": "异步校验计费分区编码",
                "id": "validateChargingCode",
                "url": "/api/v1/biz/partition/schema/partition/schema/code",
                "desc": ""
            },
            {
                "name": "获取分区方案详情",
                "id": "getRegionsByID",
                "url": "/api/v1/biz/regions",
                "desc": ""
            },
            {
                "name": "删除分区方案详情",
                "id": "delRegionDetail",
                "url": "/api/v1/biz/regions/deletions",
                "desc": ""
            },
            {
                "name": "保存新增分区方案详情",
                "id": "saveRegionDetail",
                "url": "/api/v1/biz/regions",
                "desc": ""
            },
            {
                "name": "修改分区方案详情。",
                "id": "editRegionDetail",
                "url": "/api/v1/biz/regions/{id}",
                "desc": "id：分区方案详情ID"
            },
            {
                "name": "保存修改分区方案详情",
                "id": "saveEditRegionDetail",
                "url": "/api/v1/biz/regions/{id}",
                "desc": "id：分区方案详情ID"
            },
            {
                "name": "分区方案详情编码异步校验",
                "id": "checkRegionDetailCode",
                "url": "/api/v1/biz/regions/checkcode",
                "desc": ""
            },
            {
                "name": "服务列表",
                "id": "getServicesList",
                "url": "/api/v1/biz/services/search/{serviceTypeId}",
                "desc": "serviceTypeId:服务类型"
            },
            {
                "name": "异步校验服务编码",
                "id": "validateServiceCode",
                "url": "/api/v1/biz/services/checkcode",
                "desc": ""
            },
            {
                "name": "返回货物类型列表",
                "id": "getGoodTypes",
                "url": "/api/v1/biz/cargotypes",
                "desc": ""
            },
            {
                "name": "根据id获取服务详情",
                "id": "getServiceById",
                "url": "/api/v1/biz/services/{uid}",
                "desc": "uid:服务id"
            },
            {
                "name": "检索供应商",
                "id": "retrievalSupplier",
                "url": "/api/v1/sup/suppliers/{intertype}/search",
                "desc": ""
            },
            {
                "name": "检索供应商",
                "id": "retrievalSupplierList",
                "url": "/api/v1/sup/suppliers/{intertype}/list",
                "desc": ""
            },
            {
                "name": "获取订单支付状态数据",
                "id": "getPayStatusData",
                "url": "/api/v1/order/products/paystatus",
                "desc": ""
            },
            {
                "name": "新建服务",
                "id": "addServices",
                "url": "/api/v1/biz/services",
                "desc": ""
            },
            {
                "name": "修改服务",
                "id": "editServices",
                "url": "/api/v1/biz/services/{uid}",
                "desc": "uid:服务id"
            },
            {
                "name": "获取服务计重规则",
                "id": "getServiceWeightRule",
                "url": "/api/v1/biz/services/weight/{id}",
                "desc": "uid:服务id"
            },
            {
                "name": "修改服务计重规则",
                "id": "serviceWeightRule",
                "url": "/api/v1/biz/services/{uid}/weight",
                "desc": "uid:服务id"
            },
            {
                "name": "删除服务",
                "id": "deleteServices",
                "url": "/api/v1/biz/services/deletions",
                "desc": ""
            },
            {
                "name": "审核服务",
                "id": "toAuditServices",
                "url": "/api/v1/biz/services/submit",
                "desc": ""
            },
            {
                "name": "审核服务",
                "id": "examineServices",
                "url": "/api/v1/biz/services/audit",
                "desc": ""
            },
            {
                "name": "停用服务",
                "id": "unEnableServices",
                "url": "/api/v1/biz/services/offline?isconfirmed={isconfirmed}",
                "desc": ""
            },
            {
                "name": "启用服务",
                "id": "enableServices",
                "url": "/api/v1/biz/services/online",
                "desc": ""
            },
            {
                "name": "打回草稿",
                "id": "toDraftServices",
                "url": "/api/v1/biz/services/rejections",
                "desc": ""
            },
            {
                "name": "客户列表 主账号",
                "id": "getCustomerList",
                "url": "/api/v1/customer/search",
                "desc": ""
            },
            {
                "name": "客户列表   子账号",
                "id": "getCusUserList",
                "url": "/api/v1/customer/user/getbycustomer/{costomerid}",
                "desc": ""
            },
            {
                "name": "价格套餐",
                "id": "getCombos",
                "url": "/api/v1/biz/combos?pageSize=100",
                "desc": ""
            },
            {
                "name": "获取所有的价格套餐",
                "id": "getCombosAll",
                "url": "/api/v1/biz/combos/all",
                "desc": ""
            },
            {
                "name": "新增成本价基本信息",
                "id": "saveAddCostPriceInfo",
                "url": "/api/v1/biz/quotations/cost/main",
                "desc": ""
            },
            {
                "name": "编辑成本价基本信息",
                "id": "saveEditCostPriceInfo",
                "url": "/api/v1/biz/quotations/cost/{uid}/main",
                "desc": "uid: 价格uid"
            },
            {
                "name": "获取重量段和分区",
                "id": "getWeigthAndRegion",
                "url": "/api/v1/biz/quotations/{regionSchemaUid}/{weightSchemaUid}/sheetheaders",
                "desc": "regionSchemaUid： 分区UID\nweightSchemaUid：重量段UID"
            },
            {
                "name": "保存成本价价格明细",
                "id": "saveCostPriceDetails",
                "url": "/api/v1/biz/quotations/cost/{uid}/detail",
                "desc": "uid: 价格UID"
            },
            {
                "name": "获取成本价详情",
                "id": "getCostPriceInfo",
                "url": "/api/v1/biz/quotations/cost/{uid}",
                "desc": "uid: 价格UID"
            },
            {
                "name": "获取计价方式列表",
                "id": "getCalcTypeList",
                "url": "/api/v1/dict/price/calctype",
                "desc": ""
            },
            {
                "name": "成本价格审核打回草稿",
                "id": "costPriceReturnDraft",
                "url": "/api/v1/biz/quotations/cost/{uid}/rejections",
                "desc": "uid: 价格UID"
            },
            {
                "name": "成本价格审核-审核通过",
                "id": "costPriceAuditPassed",
                "url": "/api/v1/biz/quotations/cost/{uid}/audit",
                "desc": "uid: 价格UID"
            },
            {
                "name": "审核权限-更新成本价基本信息",
                "id": "updateCostPriceInfo",
                "url": "/api/v1/biz/quotations/cost/{uid}/main/approval",
                "desc": "uid: 价格UID"
            },
            {
                "name": "审核权限-更新成本价价格明细",
                "id": "updateCostPriceDetails",
                "url": "/api/v1/biz/quotations/cost/{uid}/detail/approval",
                "desc": "uid: 价格UID"
            },
            {
                "name": "获取销售价基本信息",
                "id": "getSalesPriceInfo",
                "url": "/api/v1/biz/quotations/sale/{uid}",
                "desc": "uid: 价格UID"
            },
            {
                "name": "新增销售价基本信息",
                "id": "saveAddSalesPriceInfo",
                "url": "/api/v1/biz/quotations/sale/main",
                "desc": ""
            },
            {
                "name": "编辑销售价基本信息",
                "id": "saveEditSalesPriceInfo",
                "url": "/api/v1/biz/quotations/sale/{uid}/main",
                "desc": "uid: 价格UID"
            },
            {
                "name": "保存销售价价格明细",
                "id": "saveSalesPriceDetails",
                "url": "/api/v1/biz/quotations/sale/{uid}/detail",
                "desc": "uid: 价格UID"
            },
            {
                "name": "提交销售价审核报价方案",
                "id": "submitSalesPrice",
                "url": "/api/v1/biz/quotations/sale/submit",
                "desc": ""
            },
            {
                "name": "审核权限-更新销售价基本信息",
                "id": "updateSalesPriceInfo",
                "url": "/api/v1/biz/quotations/sales/{uid}/main/approval",
                "desc": "uid: 价格UID"
            },
            {
                "name": "审核权限-更新销售价价格明细",
                "id": "updateSalesPriceDetails",
                "url": "/api/v1/biz/quotations/sales/{uid}/detail/approval",
                "desc": "uid: 价格UID"
            },
            {
                "name": "根据UID获取重量段详情",
                "id": "getWeightByUid",
                "url": "/api/v1/biz/weightschema/{uid}",
                "desc": "uid: 重量段UID"
            },
            {
                "name": "获取计价货币列表",
                "id": "getAllCurrencyList",
                "url": "/api/v1/biz/currency/list",
                "desc": ""
            },
            {
                "name": "获取产品列表",
                "id": "getProductsList",
                "url": "/api/v1/biz/product/list",
                "desc": ""
            },
            {
                "name": "订单界面获取产品列表",
                "id": "getProductsListMin",
                "url": "/api/v1/biz/product/list/order",
                "desc": ""
            },
            {
                "name": "服务打回草稿",
                "id": "draftService",
                "url": "/api/v1/biz/services/{uid}/rejections",
                "desc": ""
            },
            {
                "name": "服务审核通过",
                "id": "auditService",
                "url": "/api/v1/biz/services/{uid}/audit",
                "desc": ""
            },
            {
                "name": "增加业务联系人",
                "id": "addBizContacter",
                "url": "/api/v1/customer/business",
                "desc": ""
            },
            {
                "name": "修改业务联系人",
                "id": "modifyBizContacter",
                "url": "/api/v1/customer/business",
                "desc": ""
            },
            {
                "name": "删除业务联系人",
                "id": "deleteBizContacterList",
                "url": "/api/v1/customer/business/deletions",
                "desc": ""
            },
            {
                "name": "获取业务联系人",
                "id": "getBizContacter",
                "url": "/api/v1/customer/business/search",
                "desc": ""
            },
            {
                "name": "增加客户联系人",
                "id": "addClientContacter",
                "url": "/api/v1/customer/contacts",
                "desc": ""
            },
            {
                "name": "删除客户联系人",
                "id": "delClientContacterList",
                "url": "/api/v1/customer/contacts/deletions",
                "desc": ""
            },
            {
                "name": "删除客户联系人",
                "id": "getClientContacter",
                "url": "/api/v1/customer/contacts/search",
                "desc": ""
            },
            {
                "name": "修改客户联系人",
                "id": "modifyClientContacter",
                "url": "/api/v1/customer/contacts",
                "desc": ""
            },
            {
                "name": "根据功能团队获取用户",
                "id": "getUserByFuncTeamId",
                "url": "/api/v1/sys/users/search/{orgid}",
                "desc": ""
            },
            {
                "name": "获取职能团队",
                "id": "getFuncTeam",
                "url": "/api/v1/sys/usergroups/subnode/{parentid}",
                "desc": ""
            },
            {
                "name": "计算服务成本价",
                "id": "calcService",
                "url": "/api/v1/biz/calc/cost/service",
                "desc": ""
            },
            {
                "name": "判断业务联系人是否存在",
                "id": "isBuzCustomerExist",
                "url": "/api/v1/customer/business/exist",
                "desc": ""
            },
            {
                "name": "根据产品Id获取产品价格等级",
                "id": "getPriceLevelByProductUid",
                "url": "/api/v1/biz/quotations/{productUid}/grades",
                "desc": ""
            },
            {
                "name": "获取所有的价格套餐",
                "id": "getPricePackage",
                "url": "/api/v1/biz/combos",
                "desc": ""
            },
            {
                "name": "删除价格套餐",
                "id": "delPricePackage",
                "url": "/api/v1/biz/combos/deletions",
                "desc": ""
            },
            {
                "name": "获取职责列表",
                "id": "getBuzCustomerDuty",
                "url": "/api/v1/customer/business/groupinfo",
                "desc": ""
            },
            {
                "name": "根据职责获取用户",
                "id": "getUsersByDutyCode",
                "url": "/api/v1/sys/users/searchpagebyorgcode",
                "desc": ""
            },
            {
                "name": "新增价格套餐",
                "id": "addPricePackage",
                "url": "/api/v1/biz/combos",
                "desc": ""
            },
            {
                "name": "修改价格套餐",
                "id": "modifyPricePackage",
                "url": "/api/v1/biz/combos/{uid}",
                "desc": ""
            },
            {
                "name": "获取成本价-价格明细单个tab的明细数据",
                "id": "getOneCostPriceDetail",
                "url": "/api/v1/biz/quotations/cost/{uid}/detail/{id}",
                "desc": ""
            },
            {
                "name": "获取销售价-价格明细单个tab的明细数据",
                "id": "getOneSalesPriceDetail",
                "url": "/api/v1/biz/quotations/sale/{uid}/detail/{id}",
                "desc": ""
            },
            {
                "name": "获取订单table",
                "id": "getOrdersTable",
                "url": "/api/v1/order/products",
                "desc": ""
            },
            {
                "name": "获取订单状态列表",
                "id": "getOrderStatus",
                "url": "/api/v1/order/products/orderstatus",
                "desc": ""
            },
            {
                "name": "根据orderNo获取订单的物流信息",
                "id": "getOrderInfoByorderNo",
                "url": "/api/v1/order/products/track/{waybillNo}",
                "desc": ""
            },
            {
                "name": "根据uid取产品的可选服务",
                "id": "getServicesByUid",
                "url": "/api/v1/order/products/track/{waybillNo}",
                "desc": ""
            },
            {
                "name": "删除订单",
                "id": "delOrders",
                "url": "/api/v1/order/products/deletions",
                "desc": ""
            },
            {
                "name": "将草稿的订单状态改为已提交状态",
                "id": "commitOrder",
                "url": "/api/v1/order/products/status/commit",
                "desc": ""
            },
            {
                "name": "给选定的订单发送消息",
                "id": "sendInform",
                "url": "/api/v1/order/products/cusorderno/message",
                "desc": ""
            },
            {
                "name": "将已提交的订单状态改为已经受理",
                "id": "orderAccepted",
                "url": "/api/v1/order/products/status/accept",
                "desc": ""
            },
            {
                "name": "判断价格套餐编码是否存在",
                "id": "isExistedPricePackageCode",
                "url": "/api/v1/biz/combos/checkcode",
                "desc": ""
            },
            {
                "name": "获取国家地区接口",
                "id": "getAreaList",
                "url": "/api/v1/biz/area/arealist",
                "desc": ""
            },
            {
                "name": "产品记重规则获取取值方式",
                "id": "getWeightValueMode",
                "url": "/api/v1/biz/product/weight/valueType",
                "desc": ""
            },
            {
                "name": "删除地址",
                "id": "delUserAddress",
                "url": "/api/v1/customer/useraddress/delete/{cusUserId}",
                "desc": "ids,cusUserId"
            },
            {
                "name": "保存修改地址",
                "id": "saveOrModifyAddress",
                "url": "/api/v1/customer/useraddress/saveOrUpdate",
                "desc": "addressDto"
            },
            {
                "name": "查询地址",
                "id": "queryAddressList",
                "url": "/api/v1/customer/useraddress/search",
                "desc": "customerId,id"
            },
            {
                "name": "设为默认地址",
                "id": "setDefaultAddress",
                "url": "/api/v1/customer/useraddress/setdefault?newId={newId}&customerId={customerId}&type={type}&transportType={transportType}",
                "desc": "customerId,oldId,newId"
            },
            {
                "name": "添加产品服务",
                "id": "addProductService",
                "url": "/api/v1/biz/product/services",
                "desc": ""
            },
            {
                "name": "修改产品服务",
                "id": "modifyProductService",
                "url": "/api/v1/biz/product/{id}/services",
                "desc": ""
            },
            {
                "name": "增加产品记重规则",
                "id": "addProductServiceWeight",
                "url": "/api/v1/biz/product/{uid}/weight",
                "desc": ""
            },
            {
                "name": "获取产品服务（按照类型）",
                "id": "getProductServiceByType",
                "url": "/api/v1/biz/product/{uid}/services/{type}",
                "desc": ""
            },
            {
                "name": "获取产品服务属性",
                "id": "getProductPropertyType",
                "url": "/api/v1/biz/product/services/property",
                "desc": ""
            },
            {
                "name": "根据服务类型获取服务（添加服务页面）",
                "id": "getServicebyServiceType",
                "url": "/api/v1/biz/services/search/short/{serviceTypeCode}",
                "desc": ""
            },
            {
                "name": "根据产品ID获取产品",
                "id": "getProduct",
                "url": "/api/v1/biz/product/services",
                "desc": ""
            },
            {
                "name": "根据订单号获取订单信息",
                "id": "getOrderInfoByOrderId",
                "url": "/api/v1/order/products/{orderNo}",
                "desc": "orderNo 订单号"
            },
            {
                "name": "删除产品服务",
                "id": "delProductService",
                "url": "/api/v1/biz/product/services/deletions",
                "desc": ""
            },
            {
                "name": "获取单个产品的所有信息",
                "id": "getProductAllInfo",
                "url": "/api/v1/biz/product/{id}",
                "desc": ""
            },
            {
                "name": "新增产品范围",
                "id": "saveProductRegion",
                "url": "/api/v1/biz/product/region",
                "desc": ""
            },
            {
                "name": "修改产品范围",
                "id": "putProductRegion",
                "url": "/api/v1/biz/product/{id}/region",
                "desc": ""
            },
            {
                "name": "删除产品范围",
                "id": "delProductRegion",
                "url": "/api/v1/biz/product/region/deletions",
                "desc": ""
            },
            {
                "name": "计算产品计费",
                "id": "calcProduct",
                "url": "/api/v1/biz/calc/sale/product",
                "desc": ""
            },
            {
                "name": "异步校验产品范围编码",
                "id": "checkProductRegion",
                "url": "/api/v1/biz/product/region/code",
                "desc": ""
            },
            {
                "name": "当前客户可见用户列表",
                "id": "getCurrentUserVisibleUserList",
                "url": "/api/v1/csrworkorder/usernamelist",
                "desc": ""
            },
            {
                "name": "下单模块-当前客户可见用户列表",
                "id": "getCurrentUserVisibleUserList-confirmOrder",
                "url": "/api/v1/customer/user/usernamelist",
                "desc": ""
            },
            {
                "name": "获取单位字典",
                "id": "getUnitDictionary",
                "url": "/api/v1/dict/unit/base",
                "desc": ""
            },
            {
                "name": "将已提交的订单状态改为已经受理",
                "id": "SetOrderToAccept",
                "url": "/api/v1/order/products/{orderNo}/status",
                "desc": ""
            },
            {
                "name": "根据订单编号获取服务商信息",
                "id": "getProviderByOrderSerial",
                "url": "/api/v1/order/products/{orderNo}/services",
                "desc": ""
            },
            {
                "name": "根据订单编号获取子订单",
                "id": "getSubOrderByOrderSerial",
                "url": "/api/v1/order/products/{orderNo}/subOrders",
                "desc": ""
            },
            {
                "name": "服务商返回的物流消息的编码",
                "id": "getCodeFormProvider",
                "url": "/api/v1/order/statuscodes",
                "desc": ""
            },
            {
                "name": "新增订单",
                "id": "addOrder",
                "url": "/api/v1/order/tracking",
                "desc": ""
            },
            {
                "name": "计算订单销售价格",
                "id": "calcOrderSales",
                "url": "/api/v1/biz/calc/sale/{orderNo}",
                "desc": ""
            },
            {
                "name": "计算订单采购价格",
                "id": "calcOrderPurchases",
                "url": "/api/v1/biz/calc/cost/{orderNo}",
                "desc": ""
            },
            {
                "name": "计算服务流转",
                "id": "calcOrderProcess",
                "url": "/api/v1/biz/calc/orders/{orderNo}/process",
                "desc": ""
            },
            {
                "name": "更新订单",
                "id": "updateOrder",
                "url": "/api/v1/order/products/{orderNo}",
                "desc": ""
            },
            {
                "name": "同一种类型的服务在统一产品下只能有一个",
                "id": "checkServiceType",
                "url": "/api/v1/biz/product/checkserviceType",
                "desc": ""
            },
            {
                "name": "异步校验服务是否已经在产品中存在",
                "id": "checkServices",
                "url": "/api/v1/biz/product/checkservices",
                "desc": ""
            },
            {
                "name": "产品Tab计重规则获取",
                "id": "getWeightRule",
                "url": "/api/v1/biz/product/weight/{id}",
                "desc": ""
            },
            {
                "name": "查询产品范围",
                "id": "getProductRegion",
                "url": "/api/v1/biz/product/productregion/{id}",
                "desc": ""
            },
            {
                "name": "校验产品重量是否在计重范围之内",
                "id": "isWeightInRange",
                "url": "/api/v1/biz/product/{uid}/checkweight",
                "desc": ""
            },
            {
                "name": "查询地址是否在产品范围内",
                "id": "isAddressAccessForCurrentProduce",
                "url": "/api/v1/biz/product/{uid}/checkcustomer/{customerId}/{transportType}",
                "desc": "用户ID和产品ID"
            },
            {
                "name": "通过账号查找货币单位",
                "id": "getCurrencyByAccountId",
                "url": "/api/v1/customer/user/getcoin/{userid}",
                "desc": ""
            },
            {
                "name": "账单任务列表",
                "id": "getTaskList",
                "url": "/api/v1/biz/financial/{interType}/task/{subInterType}/list",
                "desc": ""
            },
            {
                "name": "所有账单任务状态数据",
                "id": "getTaskStatus",
                "url": "/api/v1/biz/financial/task/{subInterType}/status",
                "desc": ""
            },
            {
                "name": "生成账单",
                "id": "generateBills",
                "url": "/api/v1/biz/financial/{interType}/task/{subInterType}/generate",
                "desc": ""
            },
            {
                "name": "根据任务编码删除任务-只能删除已完成的任务",
                "id": "deleteTask",
                "url": "/api/v1/biz/financial/{interType}/task/{subInterType}/delete",
                "desc": ""
            },
            {
                "name": "重新生成账单",
                "id": "repeatGenerateBills",
                "url": "/api/v1/biz/financial/{interType}/task/{subInterType}/regenerate",
                "desc": ""
            },
            {
                "name": "更新密码",
                "id": "updatePassword",
                "url": "/api/v1/u/changepassword",
                "desc": ""
            },
            {
                "name": "产品Tab服务配置是否主服务存在",
                "id": "IsMainServiceExist",
                "url": "/api/v1/biz/product/ismainservice",
                "desc": ""
            },
            {
                "name": "查询信息类型",
                "id": "getType",
                "url": "/api/v1/order/statuscodes/codetype",
                "desc": ""
            },
            {
                "name": "异步校验参数是否存在",
                "id": "isOrderNumExist",
                "url": "/api/v1/order/tracking/checkcontent",
                "desc": ""
            },
            {
                "name": "根据类型(正常or异常)获取物流信息编码，",
                "id": "getLogisticsInfoType",
                "url": "/api/v1/order/statuscodes/{type}",
                "desc": "1=正常;2=异常"
            },
            {
                "name": "增加物流信息",
                "id": "addLogisticsInfo",
                "url": "/api/v1/order/tracking/add",
                "desc": ""
            },
            {
                "name": "获取留言版主页列表",
                "id": "getMessageBookList",
                "url": "/api/v1/csraskboard/search",
                "desc": ""
            },
            {
                "name": "发起留言",
                "id": "newleavemessage",
                "url": "/api/v1/csraskboard/newleavemessage",
                "desc": ""
            },
            {
                "name": "留言",
                "id": "leaveMessage",
                "url": "/api/v1/csraskboard/leavemessage",
                "desc": ""
            },
            {
                "name": "获取留言聊天记录",
                "id": "getHstoryMessage",
                "url": "/api/v1/csraskboard/historylist",
                "desc": ""
            },
            {
                "name": "done 掉留言",
                "id": "doneLeaveMessage",
                "url": "/api/v1/csraskboard/doneleavemessage/{id}",
                "desc": ""
            },
            {
                "name": "获取code列表",
                "id": "getCodeList",
                "url": "/api/v1/csraskboard/codelist",
                "desc": ""
            },
            {
                "name": "获取账单状态",
                "id": "getBillingStatus",
                "url": "/api/v1/biz/financial/{interType}/{subInterType}/billingStatus",
                "desc": ""
            },
            {
                "name": "获取账单列表",
                "id": "getBillingList",
                "url": "/api/v1/biz/financial/{interType}/{subInterType}/list",
                "desc": ""
            },
            {
                "name": "账单审核",
                "id": "postBillsAudit",
                "url": "/api/v1/biz/financial/{interType}/{subInterType}/audit",
                "desc": ""
            },
            {
                "name": "付款-权限",
                "id": "checkPopType",
                "url": "/api/v1/biz/financial/{type}/pay",
                "desc": ""
            },
            {
                "name": "账单价格调整",
                "id": "adjustBillsPrice",
                "url": "/api/v1/biz/financial/{interType}/{subInterType}/adjustment",
                "desc": ""
            },
            {
                "name": "获取账单下面的订单",
                "id": "getBillsOrders",
                "url": "/api/v1/biz/financial/{interType}/{subInterType}/orders",
                "desc": ""
            },
            {
                "name": "获取留言聊天记录",
                "id": "getMsgHistoryList",
                "url": "/api/v1/csraskboard/historylist?pageIndex={pageIndex}&pageSize={pageSize}&refAskBoardId={refAskBoardId}",
                "desc": ""
            },
            {
                "name": "关闭留言对话框",
                "id": "closeLeaveMsg",
                "url": "/api/v1/csraskboard/doneleavemessage/{id}",
                "desc": ""
            },
            {
                "name": "留言",
                "id": "leaveMsg",
                "url": "/api/v1/csraskboard/leavemessage",
                "desc": ""
            },
            {
                "name": "获取工单类型列表",
                "id": "getWorkOrderTypeList",
                "url": "/api/v1/csrworkorder/typelist",
                "desc": ""
            },
            {
                "name": "凭借ID查找工单详细信息",
                "id": "getWorkOrderDetailById",
                "url": "/api/v1/csrworkorder/{id}",
                "desc": ""
            },
            {
                "name": "新增工单",
                "id": "createWorkOrder",
                "url": "/api/v1/csrworkorder",
                "desc": ""
            },
            {
                "name": "所有账单状态",
                "id": "billingStatus",
                "url": "/api/v1/biz/financial/billingStatus",
                "desc": ""
            },
            {
                "name": "搜索账单",
                "id": "getAllBillList",
                "url": "/api/v1/biz/financial/{interType}/{subInterType}/list",
                "desc": ""
            },
            {
                "name": "校验工单并获取用户信息",
                "id": "checkWorkOrder",
                "url": "/api/v1/csraskboard/check/{code}",
                "desc": ""
            },
            {
                "name": "校验工单并获取用户信息",
                "id": "checkorderNo",
                "url": "/api/v1/order/products/findcususerbyorderno?waybillNo={waybillNo}",
                "desc": ""
            },
            {
                "name": "获取员工列表",
                "id": "getStaffList",
                "url": "/api/v1/sys/users/search?q={q}",
                "desc": ""
            },
            {
                "name": "获取账单流转流程",
                "id": "getBillFlowProcess",
                "url": "/api/v1/biz/approval/financial/{billNo}",
                "desc": ""
            },
            {
                "name": "根据账单号删除账单",
                "id": "deleteBillByNumber",
                "url": "/api/v1/biz/financial/{interType}/{subInterType}/delete",
                "desc": ""
            },
            {
                "name": "账单列表提交审核",
                "id": "submitBillInBilllist",
                "url": "/api/v1/biz/financial/{interType}/{subInterType}/submit",
                "desc": ""
            },
            {
                "name": "账单任务详情",
                "id": "getBillTaskDetail",
                "url": "/api/v1/biz/financial/{interType}/task/{subInterType}/detail",
                "desc": ""
            },
            {
                "name": "处理工单",
                "id": "handleWorkOrder",
                "url": "/api/v1/csrworkorder/progressing",
                "desc": ""
            },
            {
                "name": "获取客户端用户",
                "id": "getCustomerFullNameList",
                "url": "/api/v1/customer/user/fullnamelist",
                "desc": ""
            },
            {
                "name": "账单导出",
                "id": "billExports",
                "url": "/api/v1/biz/financial/{interType}/{subInterType}/export",
                "desc": ""
            },
            {
                "name": "根据货币Code查询货币信息",
                "id": "getCurrencyByCode",
                "url": "/api/v1/biz/currency/{code}",
                "desc": ""
            },
            {
                "name": "删除留言",
                "id": "delCustomerMsg",
                "url": "/api/v1/csraskboard/deletions",
                "desc": ""
            },
            {
                "name": "获取主账号列表",
                "id": "getPrimaryaccountlist",
                "url": "/api/v1/customer/search/short",
                "desc": ""
            },
            {
                "name": "获取客户信息",
                "id": "getCustomerShortList",
                "url": "/api/v1/customer/search/short",
                "desc": ""
            },
            {
                "name": "获取端口客户列表",
                "id": "getCustomerShortGoods",
                "url": "/api/v1/customer/search/short/goods",
                "desc": ""
            },
            {
                "name": "异步校验子账户电话号码是否存在",
                "id": "checkUserPhoneExist",
                "url": "/api/v1/customer/user/checkmobilephone?mobilePhone={mobilePhone}&userId={userId}",
                "desc": ""
            },
            {
                "name": "自动生成客户单号",
                "id": "getClientNum",
                "url": "/api/v1/order/products/cusorderno/{cusUserId}",
                "desc": ""
            },
            {
                "name": "获取客户详细信息",
                "id": "getCustomerDetailInfo",
                "url": "/api/v1/customer/user/{id}",
                "desc": ""
            },
            {
                "name": "获取所有港口信息",
                "id": "getAllPorts",
                "url": "/api/v1/biz/port/searchlist",
                "desc": ""
            },
            {
                "name": "删除港口信息",
                "id": "delAllStationPorts",
                "url": "/api/v1/biz/port/deletions",
                "desc": ""
            },
            {
                "name": "异步校验港口编码",
                "id": "checkStationPortCode",
                "url": "/api/v1/biz/port/checkcode?id={id}&code={code}",
                "desc": ""
            },
            {
                "name": "新建港口",
                "id": "savePort",
                "url": "/api/v1/biz/port",
                "desc": ""
            },
            {
                "name": "修改港口",
                "id": "modifyPort",
                "url": "/api/v1/biz/port/{id}",
                "desc": ""
            },
            {
                "name": "删除港口",
                "id": "delPort",
                "url": "/api/v1/biz/port/deletions",
                "desc": ""
            },
            {
                "name": "获取港口国际化列表",
                "id": "getPortsInternational",
                "url": "/api/v1/biz/port/i18n/list/{language}",
                "desc": ""
            },
            {
                "name": "保持港口国际化数据",
                "id": "savePortInternational",
                "url": "/api/v1/biz/port/i18n",
                "desc": ""
            },
            {
                "name": "根据ID获取单条港口信息",
                "id": "getPortById",
                "url": "/api/v1/biz/port/{id}",
                "desc": ""
            },
            {
                "name": "异步校验港口代码",
                "id": "checkPortCode",
                "url": "/api/v1/biz/port/checkcode",
                "desc": ""
            },
            {
                "name": "获取项目列表-新增",
                "id": "getProjectsDataNew",
                "url": "/api/v1/trade/projects",
                "desc": ""
            },
            {
                "name": "获取项目列表-新增-物流",
                "id": "getProjectsDataNewLog",
                "url": "/api/v1/biz/logistics/projects",
                "desc": ""
            },
            {
                "name": "删除项目",
                "id": "delProjectsData",
                "url": "/api/v1/trade/projects/deletions",
                "desc": "POST"
            },
            {
                "name": "删除项目-物流",
                "id": "delProjectsDataLog",
                "url": "/api/v1/biz/logistics/projects/deletions",
                "desc": "POST"
            },
            {
                "name": "提交项目",
                "id": "submitProjectsData",
                "url": "/api/v1/trade/projects/submitions",
                "desc": "POST"
            },
            {
                "name": "提交项目-物流",
                "id": "submitProjectsDataLog",
                "url": "/api/v1/biz/logistics/projects/submitions",
                "desc": "POST"
            },
            {
                "name": "获取项目列表-审核",
                "id": "getProjectsDataApproval",
                "url": "/api/v1/trade/projects/approval",
                "desc": ""
            },
            {
                "name": "获取项目列表-审核物流",
                "id": "getProjectsDataApprovalLog",
                "url": "/api/v1/biz/logistics/projects/approval",
                "desc": ""
            },
            {
                "name": "获取干系企业",
                "id": "getRelationshipEnt",
                "url": "/api/v1/trade/projects/getprojectcompanys",
                "desc": "GET"
            },
            {
                "name": "获取干系企业-物流",
                "id": "getRelationshipEntLog",
                "url": "/api/v1/biz/logistics/projects/getprojectcompanys",
                "desc": "GET"
            },
            {
                "name": "获取项目基础信息",
                "id": "getProjectInfo",
                "url": "/api/v1/trade/projects/{projectId}",
                "desc": "GET"
            },
            {
                "name": "获取项目基础信息-物流",
                "id": "getProjectInfoLog",
                "url": "/api/v1/biz/logistics/projects/{projectId}",
                "desc": "GET"
            },
            {
                "name": "获取业务类型",
                "id": "getBusinessTypeData",
                "url": "/api/v1/dict/data",
                "desc": ""
            },
            {
                "name": "获取供应商列表-物流",
                "id": "getEnterpriseNameLogisticsSupplier",
                "url": "/api/v1/sup/suppliers/logistics/list",
                "desc": ""
            },
            {
                "name": "获取供应商列表-贸易",
                "id": "getEnterpriseNameTradeSupplier",
                "url": "/api/v1/sup/suppliers/trade/list",
                "desc": ""
            },
            {
                "name": "获取客户列表-物流",
                "id": "getEnterpriseNameLogisticsCustomer",
                "url": "/api/v1/customer/logistics/list",
                "desc": ""
            },
            {
                "name": "获取客户列表-贸易",
                "id": "getEnterpriseNameTradeCustomer",
                "url": "/api/v1/customer/trade/list",
                "desc": ""
            },
            {
                "name": "获取平台列表",
                "id": "getEnterpriseNameTradePlatform",
                "url": "/api/v1/trade/projects/platcompanys",
                "desc": ""
            },
            {
                "name": "获取平台列表-物流",
                "id": "getEnterpriseNameTradePlatformLog",
                "url": "/api/v1/biz/logistics/projects/platcompanys",
                "desc": ""
            },
            {
                "name": "获取项目部门tree",
                "id": "getProjectSection",
                "url": "/api/v1/sys/orgs/tree",
                "desc": ""
            },
            {
                "name": "保存项目草稿",
                "id": "sendProjectInfoNew",
                "url": "/api/v1/trade/projects?issubmit={issubmit}",
                "desc": "POST"
            },
            {
                "name": "保存项目草稿-物流",
                "id": "sendProjectInfoNewLog",
                "url": "/api/v1/biz/logistics/projects?issubmit={issubmit}",
                "desc": "POST"
            },
            {
                "name": "修改项目草稿",
                "id": "sendProjectInfoMod",
                "url": "/api/v1/trade/projects/{projectId}?issubmit={issubmit}",
                "desc": "PUT"
            },
            {
                "name": "修改项目草稿-物流",
                "id": "sendProjectInfoModLog",
                "url": "/api/v1/biz/logistics/projects/{projectId}?issubmit={issubmit}",
                "desc": "PUT"
            },
            {
                "name": "提交项目总结",
                "id": "sendsProjectSummary",
                "url": "/api/v1/trade/projects/baseinfo/{projectId}",
                "desc": "POST"
            },
            {
                "name": "提交项目总结-物流",
                "id": "sendsProjectSummaryLog",
                "url": "/api/v1/biz/logistics/projects/baseinfo/{projectId}",
                "desc": "POST"
            },
            {
                "name": "获取用户组织身份",
                "id": "getUserIdentity",
                "url": "/api/v1/trade/projects/currentUserOrg",
                "desc": "GET"
            },
            {
                "name": "获取用户组织身份-物流",
                "id": "getUserIdentityLog",
                "url": "/api/v1/biz/logistics/projects/currentUserOrg",
                "desc": "GET"
            },
            {
                "name": "获取项目审核状态",
                "id": "getApprovalStatus",
                "url": "/api/v1/trade/projects/getprojectprocesstatus/{projectId}",
                "desc": "GET"
            },
            {
                "name": "获取项目审核状态-物流",
                "id": "getApprovalStatusLog",
                "url": "/api/v1/biz/logistics/projects/getprojectprocesstatus/{projectId}",
                "desc": "GET"
            },
            {
                "name": "获取某部门初审信息",
                "id": "getApprvoalInfo",
                "url": "/api/v1/trade/projects/{projectId}/firstaudits",
                "desc": "GET"
            },
            {
                "name": "获取某部门初审信息-物流",
                "id": "getApprvoalInfoLog",
                "url": "/api/v1/biz/logistics/projects/{projectId}/firstaudits",
                "desc": "GET"
            },
            {
                "name": "异步校验项目代码",
                "id": "checkProjectCode",
                "url": "/api/v1/trade/projects/checkcode?code={code}",
                "desc": "GET"
            },
            {
                "name": "异步校验项目代码-物流",
                "id": "checkProjectCodeLog",
                "url": "/api/v1/biz/logistics/projects/checkcode?code={code}",
                "desc": "GET"
            },
            {
                "name": "初审提问",
                "id": "postQuestion",
                "url": "/api/v1/trade/projects/{projectId}/questions",
                "desc": "POST"
            },
            {
                "name": "初审提问-物流",
                "id": "postQuestionLog",
                "url": "/api/v1/biz/logistics/projects/{projectId}/questions",
                "desc": "POST"
            },
            {
                "name": "初审回复",
                "id": "postAnswer",
                "url": "/api/v1/trade/projects/{projectId}/questions/{questionId}",
                "desc": "POST"
            },
            {
                "name": "初审回复-物流",
                "id": "postAnswerLog",
                "url": "/api/v1/biz/logistics/projects/{projectId}/questions/{questionId}",
                "desc": "POST"
            },
            {
                "name": "初审意见",
                "id": "postOpinion",
                "url": "/api/v1/trade/projects/{projectId}/firstaudits",
                "desc": "POST"
            },
            {
                "name": "初审意见-物流",
                "id": "postOpinionLog",
                "url": "/api/v1/biz/logistics/projects/{projectId}/firstaudits",
                "desc": "POST"
            },
            {
                "name": "上传项目文件",
                "id": "uploadProjectFile",
                "url": "/api/v1/trade/projects/projectfile/{projectId}/{type}",
                "desc": "POST"
            },
            {
                "name": "上传项目文件-物流",
                "id": "uploadProjectFileLog",
                "url": "/api/v1/biz/logistics/projects/projectfile/{projectId}/{type}",
                "desc": "POST"
            },
            {
                "name": "提交初审意见",
                "id": "postFirstApproval",
                "url": "/api/v1/trade/projects/firstaudit/{projectId}",
                "desc": "POST"
            },
            {
                "name": "提交初审意见-物流",
                "id": "postFirstApprovalLog",
                "url": "/api/v1/biz/logistics/projects/firstaudit/{projectId}",
                "desc": "POST"
            },
            {
                "name": "提交终审意见",
                "id": "postFinalApproval",
                "url": "/api/v1/trade/projects/finalaudit/{projectId}",
                "desc": "POST"
            },
            {
                "name": "提交终审意见-物流",
                "id": "postFinalApprovalLog",
                "url": "/api/v1/biz/logistics/projects/finalaudit/{projectId}",
                "desc": "POST"
            },
            {
                "name": "获取项目文件",
                "id": "getProjectFile",
                "url": "/api/v1/trade/projects/projectfile/{projectId}",
                "desc": "GET"
            },
            {
                "name": "获取项目文件-物流",
                "id": "getProjectFileLog",
                "url": "/api/v1/biz/logistics/projects/projectfile/{projectId}",
                "desc": "GET"
            },
            {
                "name": "删除合同文件",
                "id": "delContractFile",
                "url": "/api/v1/trade/projects/projectfile/{projectId}/{id}",
                "desc": "DELETE"
            },
            {
                "name": "删除合同文件-物流",
                "id": "delContractFileLog",
                "url": "/api/v1/biz/logistics/projects/projectfile/{projectId}/{id}",
                "desc": "DELETE"
            },
            {
                "name": "贸易商品列表",
                "id": "trdGoodList",
                "url": "/api/v1/trd/goods/list",
                "desc": ""
            },
            {
                "name": "贸易新建商品",
                "id": "trdSaveGoods",
                "url": "/api/v1/trd/goods/save",
                "desc": ""
            },
            {
                "name": "贸易业务类型",
                "id": "trdBusinessType",
                "url": "/api/v1/trd/goods/businessType",
                "desc": ""
            },
            {
                "name": "商品类别",
                "id": "trdGoodTypeList",
                "url": "/api/v1/trade/goodstype/list",
                "desc": ""
            },
            {
                "name": "下拉框中获取供应商列表",
                "id": "trdSuppelyList",
                "url": "/api/v1/sup/suppliers/trade/list",
                "desc": ""
            },
            {
                "name": "根据id查询商品",
                "id": "getOneGoods",
                "url": "/api/v1/trd/goods/{id}",
                "desc": ""
            },
            {
                "name": "新建商品",
                "id": "saveOneGoods",
                "url": "/api/v1/trd/goods/save",
                "desc": ""
            },
            {
                "name": "修改商品",
                "id": "updateOneGoods",
                "url": "/api/v1/trd/goods/update",
                "desc": ""
            },
            {
                "name": "删除商品",
                "id": "deleteOneGoods",
                "url": "/api/v1/trd/goods/delete",
                "desc": "[1,2]"
            },
            {
                "name": "项目短接口--已立项和已结项的项目",
                "id": "trdProjectsShort",
                "url": "/api/v1/trade/projects/short",
                "desc": "[1,2]"
            },
            {
                "name": "获取贸易供应商类型",
                "id": "getTradetSupplierTypes",
                "url": "/api/v1/biz/servicetypes/trade",
                "desc": ""
            },
            {
                "name": "商品列表,返回id,code,name",
                "id": "getTrdGoodsShortList",
                "url": "/api/v1/trd/goods/list/short",
                "desc": ""
            },
            {
                "name": "订单列表",
                "id": "getTrdOrderList",
                "url": "/api/v1/trd/order/list",
                "desc": ""
            },
            {
                "name": "订单列表",
                "id": "deleteTrdOneOrder",
                "url": "/api/v1/trd/order/delete",
                "desc": ""
            },
            {
                "name": "合同模板－获取合同模板类型",
                "id": "getContractType",
                "url": "/api/v1/contracts/contract-common/serviceTypes",
                "desc": ""
            },
            {
                "name": "合同模板－新增合同模板",
                "id": "saveContractTemplate",
                "url": "/api/v1/contracts/contract-templates",
                "desc": ""
            },
            {
                "name": "合同模板－修改合同模板",
                "id": "updateContractTemplate",
                "url": "/api/v1/contracts/contract-templates/{id}",
                "desc": ""
            },
            {
                "name": "合同模板－获取合同列表",
                "id": "getContractTemplate",
                "url": "/api/v1/contracts/contract-templates",
                "desc": "Get"
            },
            {
                "name": "合同模板－删除模板",
                "id": "delContractTemplate",
                "url": "/api/v1/contracts/contract-templates/deletions",
                "desc": ""
            },
            {
                "name": "合同模板－根据ID获取合同模板",
                "id": "getContractTemplateById",
                "url": "/api/v1/contracts/contract-templates/{id}",
                "desc": ""
            },
            {
                "name": "获取用户名列表，支持分页-贸易",
                "id": "getTradeCustomerUsernamelist",
                "url": "/api/v1/customer/user/usernamelist",
                "desc": ""
            },
            {
                "name": "合同－获取合同列表",
                "id": "getContracsList",
                "url": "/api/v1/contracts/contract-contracts",
                "desc": "Get"
            },
            {
                "name": "合同－新增合同（基于模板）",
                "id": "saveContract",
                "url": "/api/v1/contracts/contract-contracts/templates",
                "desc": ""
            },
            {
                "name": "合同－修改合同（基于模板）",
                "id": "updateContract",
                "url": "/api/v1/contracts/contract-contracts/templates/{id}",
                "desc": ""
            },
            {
                "name": "合同－删除合同",
                "id": "delContracts",
                "url": "/api/v1/contracts/contract-contracts/deletions",
                "desc": ""
            },
            {
                "name": "根据Id获取合同详情",
                "id": "getContractById",
                "url": "/api/v1/contracts/contract-contracts/{id}",
                "desc": ""
            },
            {
                "name": "根据业务类型获取合同模板",
                "id": "getContractTemplateByType",
                "url": "/api/v1/contracts/contract-templates/simpleList",
                "desc": ""
            },
            {
                "name": "新增合同－自定义文件上传",
                "id": "uploadContract",
                "url": "/api/v1/contracts/contract-contracts/definitions",
                "desc": ""
            },
            {
                "name": "获取贸易服务类型",
                "id": "getTradeServiceType",
                "url": "/api/v1/biz/servicetypes/trade",
                "desc": ""
            },
            {
                "name": "校验模板名称唯一性",
                "id": "checkTemplateNameUnique",
                "url": "/api/v1/contracts/contract-templates/names/check",
                "desc": ""
            },
            {
                "name": "用户组table",
                "id": "searchByNameAndId",
                "url": "/api/v1/sys/users/searchbynameandid/{uid}",
                "desc": "uid: 用户Id"
            },
            {
                "name": "审核服务已停用修改",
                "id": "editServicesApproval",
                "url": "/api/v1/biz/services/{uid}/approval",
                "desc": ""
            },
            {
                "name": "查询服务范围",
                "id": "getServiceRange",
                "url": "/api/v1/biz/services/{id}/region",
                "desc": ""
            },
            {
                "name": "新建服务范围",
                "id": "saveServicesRegion",
                "url": "/api/v1/biz/services/region",
                "desc": ""
            },
            {
                "name": "修改服务范围",
                "id": "editServicesRegion",
                "url": "/api/v1/biz/services/{id}/region",
                "desc": ""
            },
            {
                "name": "删除服务范围",
                "id": "deleteServicesRegion",
                "url": "/api/v1/biz/services/region/deletions",
                "desc": ""
            },
            {
                "name": "获取username列表-为了支持二级联动",
                "id": "trdLikedusernamelist",
                "url": "/api/v1/customer/user/likedusernamelist",
                "desc": ""
            },
            {
                "name": "贸易订单批量确认",
                "id": "trdOrderListConfirms",
                "url": "/api/v1/trd/order/confirm",
                "desc": ""
            },
            {
                "name": "贸易订单批量发货",
                "id": "trdOrderListDeliverys",
                "url": "/api/v1/trd/order/delivery",
                "desc": ""
            },
            {
                "name": "非SUNRUN订单收货确认",
                "id": "trdOrderSigned",
                "url": "/api/v1/trd/order/signed",
                "desc": ""
            },
            {
                "name": "贸易订单批量提交",
                "id": "trdOrderListSubmit",
                "url": "/api/v1/trd/order/submit",
                "desc": ""
            },
            {
                "name": "根据订单号导出pdf文件",
                "id": "exportPDFByOrderNo",
                "url": "/api/v1/trd/order/export/content?orderNo={orderNo}&type={type}",
                "desc": ""
            },
            {
                "name": "获取船舶列表",
                "id": "getTransportShipTable",
                "url": "/api/v1/biz/ships/",
                "desc": ""
            },
            {
                "name": "增加船舶",
                "id": "saveTransportShip",
                "url": "/api/v1/biz/ships/",
                "desc": ""
            },
            {
                "name": "批量删除船舶",
                "id": "delTransportShip",
                "url": "/api/v1/biz/ships/deletions",
                "desc": ""
            },
            {
                "name": "检查船舶名是否存在",
                "id": "checkShipNameEn",
                "url": "/api/v1/biz/ships/checknameen",
                "desc": ""
            },
            {
                "name": "检查船舶mmsi是否存在",
                "id": "checkShipMmsi",
                "url": "/api/v1/biz/ships/checkmmsi",
                "desc": ""
            },
            {
                "name": "检查船舶imo是否存在",
                "id": "checkShipImo",
                "url": "/api/v1/biz/ships/checkimo",
                "desc": ""
            },
            {
                "name": "获取船舶详情",
                "id": "getTransportShipDetail",
                "url": "/api/v1/biz/ships/{id}",
                "desc": "id:船舶id;"
            },
            {
                "name": "修改船舶",
                "id": "saveEditTransportShip",
                "url": "/api/v1/biz/ships/{id}",
                "desc": "id:船舶id;"
            },
            {
                "name": "获取船运公司短接口",
                "id": "getShippingCompanyShort",
                "url": "/api/v1/biz/shippingcompanys/short",
                "desc": ""
            },
            {
                "name": "获取船舶国际化列表",
                "id": "getShipInternational",
                "url": "/api/v1/biz/ships/i18n/{language}",
                "desc": ""
            },
            {
                "name": "保存船舶国际化",
                "id": "saveInternationalShip",
                "url": "/api/v1/biz/ships/i18n",
                "desc": ""
            },
            {
                "name": "获取海运航线列表",
                "id": "getShippingLineTable",
                "url": "/api/v1/biz/shippinglines/",
                "desc": ""
            },
            {
                "name": "增加海运航线",
                "id": "saveShippingLine",
                "url": "/api/v1/biz/shippinglines/",
                "desc": ""
            },
            {
                "name": "批量删除海运航线",
                "id": "deleteShippingLine",
                "url": "/api/v1/biz/shippinglines/deletions",
                "desc": ""
            },
            {
                "name": "检查海运航线名是否存在",
                "id": "checkShippingLineName",
                "url": "/api/v1/biz/shippinglines/checkname",
                "desc": ""
            },
            {
                "name": "检查海运航线编码是否存在",
                "id": "checkShippingLineCode",
                "url": "/api/v1/biz/shippinglines/checkcode",
                "desc": ""
            },
            {
                "name": "获取海运航线详情",
                "id": "getShippingLineDetail",
                "url": "/api/v1/biz/shippinglines/{id}",
                "desc": "id:海运航线id;"
            },
            {
                "name": "修改海运航线",
                "id": "saveEditShippingLine",
                "url": "/api/v1/biz/shippinglines/{id}",
                "desc": "id:海运航线id;"
            },
            {
                "name": "获取港口短接口",
                "id": "getShippingPort",
                "url": "/api/v1/biz/port/searchlist/short",
                "desc": ""
            },
            {
                "name": "获取航线类型短接口",
                "id": "getLineType",
                "url": "/api/v1/dict/data?catalog=biz.linetype.base",
                "desc": ""
            },
            {
                "name": "获取空运航线列表",
                "id": "getAirLineTable",
                "url": "/api/v1/biz/airlines/",
                "desc": ""
            },
            {
                "name": "获取空运航线列表短接口",
                "id": "getAirLineShort",
                "url": "/api/v1/biz/airlines/short",
                "desc": ""
            },
            {
                "name": "增加空运航线",
                "id": "saveAirLine",
                "url": "/api/v1/biz/airlines/",
                "desc": ""
            },
            {
                "name": "批量删除空运航线",
                "id": "deleteAirLine",
                "url": "/api/v1/biz/airlines/deletions",
                "desc": ""
            },
            {
                "name": "检查空运航线名是否存在",
                "id": "checkAirLineName",
                "url": "/api/v1/biz/airlines/checkname",
                "desc": ""
            },
            {
                "name": "检查空运航线编码是否存在",
                "id": "checkAirLineCode",
                "url": "/api/v1/biz/airlines/checkcode",
                "desc": ""
            },
            {
                "name": "获取空运航线详情",
                "id": "getAirLineDetail",
                "url": "/api/v1/biz/airlines/{id}",
                "desc": ""
            },
            {
                "name": "修改空运航线",
                "id": "saveEditAirLine",
                "url": "/api/v1/biz/airlines/{id}",
                "desc": ""
            },
            {
                "name": "获取空运航班短接口",
                "id": "getAirFlights",
                "url": "/api/v1/biz/flights/",
                "desc": ""
            },
            {
                "name": "获取海运航班短接口",
                "id": "getShipFlights",
                "url": "/api/v1/biz/shipinglinesettings/",
                "desc": ""
            },
            {
                "name": "批量删除海运航班",
                "id": "delShippingSetting",
                "url": "/api/v1/biz/shipinglinesettings/deletions",
                "desc": ""
            },
            {
                "name": "修改干线服务",
                "id": "changeFlightService",
                "url": "/api/v1/biz/services/{uid}/classes",
                "desc": ""
            },
            {
                "name": "获取空运公司短接口",
                "id": "getCarrierCompanyShort",
                "url": "/api/v1/biz/carrierCompany/shortlist",
                "desc": ""
            },
            {
                "name": "获取空运航班短接口",
                "id": "getAirFlights",
                "url": "/api/v1/biz/flights/",
                "desc": ""
            },
            {
                "name": "获取海运航班短接口",
                "id": "getShipFlights",
                "url": "/api/v1/biz/shipinglinesettings/",
                "desc": ""
            },
            {
                "name": "获取航运公司列表",
                "id": "getShippingCompanyTable",
                "url": "/api/v1/biz/shippingcompanys/",
                "desc": ""
            },
            {
                "name": "增加航运公司",
                "id": "saveShippingCompany",
                "url": "/api/v1/biz/shippingcompanys/",
                "desc": ""
            },
            {
                "name": "批量删除航运公司",
                "id": "deleteShippingCompany",
                "url": "/api/v1/biz/shippingcompanys/deletions",
                "desc": ""
            },
            {
                "name": "获取航运公司详情",
                "id": "getShippingCompanyDetail",
                "url": "/api/v1/biz/shippingcompanys/{id}",
                "desc": ""
            },
            {
                "name": "修改航运公司",
                "id": "saveEditShippingCompany",
                "url": "/api/v1/biz/shippingcompanys/{id}",
                "desc": ""
            },
            {
                "name": "检查航运公司编码是否存在",
                "id": "checkShippingCompanyCode",
                "url": "/api/v1/biz/shippingcompanys/checkcode",
                "desc": ""
            },
            {
                "name": "检查航运公司英文名是否存在",
                "id": "checkShippingCompanyName",
                "url": "/api/v1/biz/shippingcompanys/checkname",
                "desc": ""
            },
            {
                "name": "保存航运公司国际化",
                "id": "saveInternationalShippingCompany",
                "url": "/api/v1/biz/shippingcompanys/i18n",
                "desc": ""
            },
            {
                "name": "获取航运公司",
                "id": "getShippingCompanyInternational",
                "url": "/api/v1/biz/shippingcompanys/i18n/{language}",
                "desc": ""
            },
            {
                "name": "获取客户已经选择的消息列表",
                "id": "getMessageNotify",
                "url": "/api/v1/customer/message/tree/{customerId}",
                "desc": ""
            },
            {
                "name": "保存客户已经选择的消息列表",
                "id": "saveMessageNotify",
                "url": "/api/v1/customer/message/{customerId}",
                "desc": ""
            },
            {
                "name": "获取机场或港口数据",
                "id": "getAirSeaData",
                "url": "/api/v1/customer/useraddress/shortlist",
                "desc": ""
            },
            {
                "name": "获取产品是否包含揽收服务",
                "id": "getProductReceived",
                "url": "/api/v1/biz/product/receiveservices",
                "desc": ""
            },
            {
                "name": "根据订单号获取订单确认单",
                "id": "getOrderConfrmByOrderNo",
                "url": "/api/v1/trd/order/confirmation/{orderNo}",
                "desc": ""
            },
            {
                "name": "保存订单确认单",
                "id": "saveOrderConfirm",
                "url": "/api/v1/trd/order/save/confirmation",
                "desc": ""
            },
            {
                "name": "物流订单查询",
                "id": "searchLogisticalOrder",
                "url": "/api/v1/order/products/search/list",
                "desc": ""
            },
            {
                "name": "判断订单中哪些订单无法发送消息",
                "id": "checkOrderMessageSend",
                "url": "/api/v1/order/products/cusorderno/check",
                "desc": ""
            },
            {
                "name": "地址类型下拉列表",
                "id": "getAddressType",
                "url": "/api/v1/biz/product/group/type",
                "desc": ""
            },
            {
                "name": "根据产品Id获取产品组根Id",
                "id": "getProductGroupRootId",
                "url": "/api/v1/biz/product/group/{productId}",
                "desc": ""
            },
            {
                "name": "根据产品Id获取货物类型",
                "id": "getProductCargoData",
                "url": "/api/v1/biz/product/cargo/{id}",
                "desc": ""
            },
            {
                "name": "异步校验供应商BDUser",
                "id": "checkBDUserExist",
                "url": "/api/v1/sup/suppliers/logistics/{supplierid}/bd/check?bdid={bdid}&id={id}",
                "desc": ""
            },
            {
                "name": "用户列表下拉框使用",
                "id": "getUserSelect",
                "url": "/api/v1/sys/users/short",
                "desc": ""
            },
            {
                "name": "获取贸易订单的状态",
                "id": "getTradeOrderStatus",
                "url": "/api/v1/trd/order/orderStatus",
                "desc": ""
            },
            {
                "name": "根据公司Id获取账户等信息",
                "id": "getAccountNoBySellId",
                "url": "/api/v1/trd/bank/list/{platformCompanyId}",
                "desc": ""
            },
            {
                "name": "获取产品列表短接口数据",
                "id": "getProductsShortList",
                "url": "/api/v1/biz/product/list/short",
                "desc": ""
            },
            {
                "name": "产品地址范围国家",
                "id": "productCountryList",
                "url": "/api/v1/biz/product/country",
                "desc": ""
            },
            {
                "name": "产品地址范围地区",
                "id": "productAreaList",
                "url": "/api/v1/biz/product/area",
                "desc": ""
            },
            {
                "name": "获取订单操作日志列表",
                "id": "getOrderLogList",
                "url": "/api/v1/order/logs/{orderId}",
                "desc": "orderId"
            },
            {
                "name": "获取订单操作日志详情",
                "id": "getOrderLogDetail",
                "url": "/api/v1/order/logs/detail/{logId}",
                "desc": "logId"
            },
            {
                "name": "根据运单号获取订单号码",
                "id": "getOrderId",
                "url": "/api/v1/order/products/{orderNo}",
                "desc": ""
            },
            {
                "name": "获取空运航线列表短接口",
                "id": "getAirLineShort",
                "url": "/api/v1/biz/airlines/short",
                "desc": ""
            },
            {
                "name": "获取海运航线列表短接口",
                "id": "getShippingLineShort",
                "url": "/api/v1/biz/shippinglines/short",
                "desc": ""
            },
            {
                "name": "获取船舶短接口",
                "id": "getShippingShort",
                "url": "/api/v1/biz/ships/short",
                "desc": ""
            },
            {
                "name": "根据id获取海运航班班次",
                "id": "getShipinglineSettingsDetail",
                "url": "/api/v1/biz/shipinglinesettings/{id}",
                "desc": ""
            },
            {
                "name": "获取产品港口或机场",
                "id": "getProAirSeaData",
                "url": "/api/v1/biz/product/transport",
                "desc": ""
            },
            {
                "name": "产品分区获取机场和港口数据",
                "id": "getAirSeaList",
                "url": "/api/v1/biz/product/transportlist",
                "desc": ""
            },
            {
                "name": "添加海运航班（详情页面）",
                "id": "addShipingLineSettingsDetail",
                "url": "/api/v1/biz/shipinglinesettings/",
                "desc": "POST"
            },
            {
                "name": "修改海运航班（详情页面）",
                "id": "modifyShipingLineSettingsDetail",
                "url": "/api/v1/biz/shipinglinesettings/{id}",
                "desc": "POST"
            },
            {
                "name": "检查海运航班编码是否存在",
                "id": "checkShippingVesselUnique",
                "url": "/api/v1/biz/shipinglinesettings/checkcode?code={code}&id={id}",
                "desc": ""
            },
            {
                "name": "获取空运航班列表",
                "id": "getFlightSettingTable",
                "url": "/api/v1/biz/flights/",
                "desc": ""
            },
            {
                "name": "批量删除空运航班",
                "id": "deleteFlightSetting",
                "url": "/api/v1/biz/flights/deletions",
                "desc": ""
            },
            {
                "name": "添加空运航班",
                "id": "saveFlightSetting",
                "url": "/api/v1/biz/flights/",
                "desc": ""
            },
            {
                "name": "修改空运航班",
                "id": "saveEditFlightSetting",
                "url": "/api/v1/biz/flights/{id}",
                "desc": ""
            },
            {
                "name": "获取空运航班详情",
                "id": "getFlightSettingDetail",
                "url": "/api/v1/biz/flights/{id}",
                "desc": ""
            },
            {
                "name": "检查空运航班编码是否存在",
                "id": "checkFlightsCode",
                "url": "/api/v1/biz/flights/checkcode",
                "desc": ""
            },
            {
                "name": "获取机场短接口",
                "id": "getAirportShort",
                "url": "/api/v1/biz/airport/shortlist",
                "desc": ""
            },
            {
                "name": "获取机型短接口",
                "id": "getAirplaneModelsShort",
                "url": "/api/v1/biz/airplanemodels/shortlist",
                "desc": ""
            },
            {
                "name": "获取空运航班航线短接口",
                "id": "getAirLineShort",
                "url": "/api/v1/biz/airlines/short",
                "desc": ""
            },
            {
                "name": "获取空运航班机型",
                "id": "getAirplaneModels",
                "url": "/api/v1/biz/airplanemodels/",
                "desc": ""
            },
            {
                "name": "获取产品服务详情",
                "id": "getProductService",
                "url": "/api/v1/biz/product/{uid}/services/region/{type}/{ordinal}",
                "desc": ""
            },
            {
                "name": "获取产品服务范围",
                "id": "getProductServiceRegions",
                "url": "/api/v1/biz/services/{uid}/regions",
                "desc": ""
            },
            {
                "name": "获取产品服务货物类型",
                "id": "getProductServiceCargos",
                "url": "/api/v1/biz/services/{uid}/cargos",
                "desc": ""
            },
            {
                "name": "删除产品服务子服务",
                "id": "delProductServiceItem",
                "url": "/api/v1/biz/product/services/delete",
                "desc": ""
            },
            {
                "name": "根据国家id获取机场列表",
                "id": "getAirPortListByCountryId",
                "url": "/api/v1/biz/airport/shortlist?countryId={countryId}&q={q}&pageIndex={pageIndex}&pageSize={pageSize}",
                "desc": ""
            },
            {
                "name": "根据国家id获取港口列表",
                "id": "getPortListByCountryId",
                "url": "/api/v1/biz/port/searchlist/short?countryId={countryId}&q={q}&pageIndex={pageIndex}&pageSize={pageSize}",
                "desc": ""
            },
            {
                "name": "根据产品id获取可选服务类型",
                "id": "getAvailableTypes",
                "url": "/api/v1/biz/product/servicetypes/{productId}",
                "desc": ""
            },
            {
                "name": "地址订单校验客户订单",
                "id": "checkExternalNo",
                "url": "/api/v1/order/products/cusorderno/{cusUserId}/{externalNo}/{id}",
                "desc": ""
            },
            {
                "name": "获取产品可选服务",
                "id": "getProductServiceTypes",
                "url": "/api/v1/biz/product/{uid}/servicetypes/{type}",
                "desc": ""
            },
            {
                "name": "通过订单号获取信息（普通订单流程）",
                "id": "getOrderInfoByOrderNoNormal",
                "url": "/api/v1/trd/order/goods?orderNo={orderNo}",
                "desc": ""
            },
            {
                "name": "普通订单收货确认",
                "id": "confirmTrdDeliveryOrderNormal",
                "url": "/api/v1/trd/order/save/delivery/normal",
                "desc": ""
            },
            {
                "name": "查询物流账户是否设置了密码",
                "id": "isNeedPassword",
                "url": "/api/v1/pay/check/needpassword",
                "desc": ""
            },
            {
                "name": "设置物流财务初始密码",
                "id": "initPaymentPwd",
                "url": "/api/v1/pay/init/password",
                "desc": ""
            },
            {
                "name": "验证物流原始财务密码",
                "id": "verifyPayPwd",
                "url": "/api/v1/pay/check/password",
                "desc": ""
            },
            {
                "name": "更新物流财务密码",
                "id": "updatePaymentPwd",
                "url": "/api/v1/pay/password",
                "desc": ""
            },
            {
                "name": "获取支付状态列表",
                "id": "getPayStatusList",
                "url": "/api/v1/order/products/paystatus",
                "desc": ""
            },
            {
                "name": "获取产品列表",
                "id": "getProductAllData",
                "url": "/api/v1/biz/product/list/order",
                "desc": ""
            },
            {
                "name": "获取首字母列表",
                "id": "getProductNavItem",
                "url": "/api/v1/biz/product/capitals",
                "desc": ""
            },
            {
                "name": "获取订单支付信息",
                "id": "getPayInfo",
                "url": "/api/v1/order/products/feeInfo/{orderNo}",
                "desc": ""
            },
            {
                "name": "物流账户信息查询",
                "id": "getLogisticAccountInfo",
                "url": "/api/v1/pay/search",
                "desc": ""
            },
            {
                "name": "物流账户余额查询",
                "id": "getLogisticAccountBalance",
                "url": "/api/v1/pay/search/{id}",
                "desc": ""
            },
            {
                "name": "物流账户充值",
                "id": "logisticAccountRecharge",
                "url": "/api/v1/pay/pay",
                "desc": ""
            },
            {
                "name": "当前物流账户是否被锁定",
                "id": "isLogisticAccountLocked",
                "url": "/api/v1/pay/islocked",
                "desc": ""
            },
            {
                "name": "根据订单Id获取相关服务信息",
                "id": "getOrderServiceInfo",
                "url": "/api/v1/order/products/order/serviceinfo/{orderNo}",
                "desc": ""
            },
            {
                "name": "资金账户管理列表",
                "id": "getAccountManagerList",
                "url": "/api/v1/pay/account",
                "desc": ""
            },
            {
                "name": "获取平安银行链接",
                "id": "getCustomerId",
                "url": "/api/v1/pay/getbankurl",
                "desc": ""
            },
            {
                "name": "资金账户管理-账户信息",
                "id": "getAccountInfo",
                "url": "/api/v1/pay/account/balance/{thirdPayAccountId}",
                "desc": ""
            },
            {
                "name": "资金账户管理-银行账户信息-最新添加",
                "id": "getAccountBank",
                "url": "/api/v1/pay/account/bankcardinfo/{thirdPayAccountId}",
                "desc": ""
            },
            {
                "name": "资金账户管理-交易记录列表",
                "id": "getAccountRecord",
                "url": "/api/v1/payment/searchTransaction/{custAcctId}",
                "desc": ""
            },
            {
                "name": "资金账户管理-查询所有银行卡信息",
                "id": "getBankCardList",
                "url": "/api/v1/pay/account/all/card/{thirdPayAccountId}",
                "desc": ""
            },
            {
                "name": "资金账户管理-解绑银行卡",
                "id": "unbundledBankCard",
                "url": "/api/v1/pay/account/unbind/card/{bankCardId}",
                "desc": ""
            },
            {
                "name": "资金账户管理-手机动态码",
                "id": "sendSmsOnBankModel",
                "url": "/api/v1/pay/account/sendsmscode",
                "desc": ""
            },
            {
                "name": "资金账户管理-银行列表",
                "id": "getBankList",
                "url": "/api/v1/pay/account/banklist",
                "desc": ""
            },
            {
                "name": "资金账户管理-异步校验验证码",
                "id": "ansycVerCode",
                "url": "/api/v1/pay/account/checkcode",
                "desc": ""
            },
            {
                "name": "资金账户管理-银行支行列表",
                "id": "getSubbranchList",
                "url": "/api/v1/pay/account/usernamelist",
                "desc": ""
            },
            {
                "name": "资金账户管理-添加银行卡",
                "id": "saveBankCard",
                "url": "/api/v1/pay/account/bind/card",
                "desc": ""
            },
            {
                "name": "资金账户管理-验证金额",
                "id": "confirmVerifyAccount",
                "url": "/api/v1/pay/account/verify/amount",
                "desc": ""
            },
            {
                "name": "资金账户管理-交易记录详情",
                "id": "getBussinessRecordDetail",
                "url": "/api/v1/payment/search/{id}",
                "desc": ""
            },
            {
                "name": "渠道单号中获取单号规则表格",
                "id": "getChannelNumberRule",
                "url": "/api/v1/biz/channel/rules/search",
                "desc": ""
            },
            {
                "name": "渠道单号中获取单号库存表格",
                "id": "getChannelNumberBatch",
                "url": "/api/v1/biz/channel/channelno/batch/search",
                "desc": ""
            },
            {
                "name": "渠道单号中获取单号监督表格",
                "id": "getChannelNumberChannelNo",
                "url": "/api/v1/biz/channel/channelno/search",
                "desc": ""
            },
            {
                "name": "运单号中获取单号规则表格",
                "id": "getWaybillNumberRule",
                "url": "/api/v1/biz/waybill/rules/search",
                "desc": ""
            },
            {
                "name": "运单号中获取单号库存表格",
                "id": "getWaybillNumberBatch",
                "url": "/api/v1/biz/waybill/waybillno/batch/search",
                "desc": ""
            },
            {
                "name": "运单号中获取单号监督表格",
                "id": "getWaybillNumberChannelNo",
                "url": "/api/v1/biz/waybill/waybillno/search",
                "desc": ""
            },
            {
                "name": "渠道单号中单号库存中获取具体详情",
                "id": "inventoryChDetail",
                "url": "/api/v1/biz/channel/channelno/batch/detail/{batchNo}",
                "desc": ""
            },
            {
                "name": "运单号中单号库存中获取具体详情",
                "id": "inventoryWDetail",
                "url": "/api/v1/biz/waybill/waybillno/batch/detail/{batchNo}",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则启用",
                "id": "starChUsed",
                "url": "/api/v1/biz/channel/rules/enable/{id}",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则停用",
                "id": "endChUsed",
                "url": "/api/v1/biz/channel/rules/disable/{id}",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则模拟生成单号",
                "id": "simulateChUsed",
                "url": "/api/v1/biz/channel/rules/example/{id}",
                "desc": ""
            },
            {
                "name": "运单号中单号规则启用",
                "id": "starWUsed",
                "url": "/api/v1/biz/waybill/rules/enable/{id}",
                "desc": ""
            },
            {
                "name": "运单号中单号规则停用",
                "id": "endWUsed",
                "url": "/api/v1/biz/waybill/rules/disable/{id}",
                "desc": ""
            },
            {
                "name": "运单号中单号规则模拟生成单号",
                "id": "simulateWUsed",
                "url": "/api/v1/biz/waybill/rules/example/{id}",
                "desc": ""
            },
            {
                "name": "渠道单号中单号库存导入单号",
                "id": "uploadInventoryData",
                "url": "/api/v1/biz/channel/channelno/upload/{serviceUid}",
                "desc": ""
            },
            {
                "name": "渠道单号中单号库存上传单号",
                "id": "inventoryChLoadSave",
                "url": "/api/v1/biz/channel/channelno/import/{serviceUid}",
                "desc": ""
            },
            {
                "name": "渠道单号中单号库存生成单号",
                "id": "inventoryChSave",
                "url": "/api/v1/biz/channel/channelno/generate",
                "desc": ""
            },
            {
                "name": "运单号中单号库存生成单号",
                "id": "inventoryWSave",
                "url": "/api/v1/biz/waybill/waybillno/generate",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则获取服务短接口",
                "id": "getServiceShort",
                "url": "/api/v1/biz/services/search/short/{serviceTypeCode}",
                "desc": ""
            },
            {
                "name": "单号库存获取生成服务短接口",
                "id": "getServiceLoadShort",
                "url": "/api/v1/biz/channel/channelno/service/search",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则获取供应商短接口",
                "id": "getSupplierShort",
                "url": "/api/v1/sup/suppliers/logistics/list",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则获取校验规则",
                "id": "getRegexChRule",
                "url": "/api/v1/biz/channel/rules",
                "desc": ""
            },
            {
                "name": "运单号中单号规则获取校验规则",
                "id": "getRegexWRule",
                "url": "/api/v1/biz/waybill/rules",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则获取校验位",
                "id": "getRegexWeiChRule",
                "url": "/api/v1/biz/channel/rules/verify",
                "desc": ""
            },
            {
                "name": "运单号中单号规则获取校验位",
                "id": "getRegexWeiWRule",
                "url": "/api/v1/biz/waybill/rules/verify",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则获取产品组短接口",
                "id": "getProductTeamRuleShort",
                "url": "/api/v1/biz/product/group/querychilds",
                "desc": ""
            },
            {
                "name": "运单号中单号库存获取产品短接口",
                "id": "getProductInventoryShort",
                "url": "/api/v1/biz/waybill/waybillno/product/search",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则获取产品短接口",
                "id": "getProductRuleShort",
                "url": "api/v1/biz/product/list",
                "desc": ""
            },
            {
                "name": "渠道单号中单号库存获取客户短接口",
                "id": "getClienteleShort",
                "url": "/api/v1/customer/search/short",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则添加单号规则",
                "id": "ruleChSave",
                "url": "/api/v1/biz/channel/rules/save",
                "desc": ""
            },
            {
                "name": "渠道单号中单号规则修改单号规则",
                "id": "ruleChSaveEdit",
                "url": "/api/v1/biz/channel/rules/update/{id}",
                "desc": ""
            },
            {
                "name": "渠道单号中获取单号规则详情",
                "id": "ruleChDetail",
                "url": "/api/v1/biz/channel/rules/{id}",
                "desc": ""
            },
            {
                "name": "运单号中单号规则添加单号规则",
                "id": "ruleWSave",
                "url": "/api/v1/biz/waybill/rules/save",
                "desc": ""
            },
            {
                "name": "运单号中单号规则修改单号规则",
                "id": "ruleWSaveEdit",
                "url": "/api/v1/biz/waybill/rules/update/{id}",
                "desc": ""
            },
            {
                "name": "运单号中获取单号规则详情",
                "id": "ruleWDetail",
                "url": "/api/v1/biz/waybill/rules/{id}",
                "desc": ""
            },
            {
                "name": "资金账户管理-充值",
                "id": "submitRecharge",
                "url": "/api/v1/rechargewithdrawals/recharge",
                "desc": ""
            },
            {
                "name": "资金账户管理-开通账户",
                "id": "openAccountManager",
                "url": "/api/v1/pay/account/open/account/{accountId}",
                "desc": ""
            },
            {
                "name": "资金账户管理-提现手续费",
                "id": "getFeeCheck",
                "url": "/api/v1/rechargewithdrawals/withdrawals/handFee",
                "desc": ""
            },
            {
                "name": "资金账户管理-提现前数字签名获取",
                "id": "getSignature",
                "url": "/api/v1/rechargewithdrawals/withdrawals/data",
                "desc": ""
            },
            {
                "name": "驾驶舱数据排行-局部更新",
                "id": "getStaticsRank",
                "url": "/api/v1/dashboard/summary/{biz}/{biztype}?scope={scope}&period={period}&regiontype={regiontype}",
                "desc": ""
            },
            {
                "name": "驾驶舱数据统计",
                "id": "getCumulativeStatics",
                "url": "/api/v1/dashboard/summary",
                "desc": ""
            },
            {
                "name": "驾驶舱数据统计-首屏数据",
                "id": "getStaticsRankDefault",
                "url": "/api/v1/dashboard/summary/first/{biz}/{biztype}",
                "desc": ""
            },
            {
                "name": "驾驶舱每周统计",
                "id": "getWeeklyStatics",
                "url": "/api/v1/dashboard/week/{type}",
                "desc": ""
            },
            {
                "name": "驾驶舱贸易关键指标(最新3条)",
                "id": "getTradeKeyIndicator",
                "url": "/api/v1/biz/trade/projectkpis/newest",
                "desc": ""
            },
            {
                "name": "获取所有贸易关键指标",
                "id": "getAllTradeKeyIndicator",
                "url": "/api/v1/biz/trade/projectkpis",
                "desc": ""
            },
            {
                "name": "添加贸易关键指标",
                "id": "addTradeKeyIndicator",
                "url": "/api/v1/biz/trade/projectkpis",
                "desc": ""
            },
            {
                "name": "删除贸易关键指标",
                "id": "delTradeKeyIndicator",
                "url": "/api/v1/biz/trade/projectkpis/deletions",
                "desc": ""
            },
            {
                "name": "修改贸易关键指标",
                "id": "modifyTradeKeyIndicator",
                "url": "/api/v1/biz/trade/projectkpis/{id}",
                "desc": ""
            },
            {
                "name": "资金账户管理-已验证过的银行卡List",
                "id": "getBankVerdCardList",
                "url": "/api/v1/pay/account/verify/bankcard/{thirdPayAccountId}",
                "desc": ""
            },
            {
                "name": "判断银行卡是否存在",
                "id": "ansycCardNo",
                "url": "/api/v1/pay/account/checkcard",
                "desc": ""
            },
            {
                "name": "将订单变成已支付",
                "id": "orderPayTest",
                "url": "/api/v1/order/products/pay/{waybillNo}",
                "desc": ""
            },
            {
                "name": "帐户密码操作的签名数据",
                "id": "getTransPassSignature",
                "url": "/api/v1/rechargewithdrawals/password/data/{thirdCustId}",
                "desc": ""
            },
            {
                "name": "将订单变成已支付",
                "id": "orderPayTest",
                "url": "/api/v1/order/products/pay/{waybillNo}",
                "desc": ""
            },
            {
                "name": "帐户密码操作的签名数据",
                "id": "getTransPassSignature",
                "url": "/api/v1/rechargewithdrawals/password/data/{thirdCustId}",
                "desc": ""
            },
            {
                "name": "通过客户ID來查询第三方账户id",
                "id": "getThirdPayAccountId",
                "url": "/api/v1/payment/searchPayID",
                "desc": ""
            },
            {
                "name": "账单支付签名数据",
                "id": "getPaymentSignature",
                "url": "/api/v1/payment/transaction/data",
                "desc": ""
            },
            {
                "name": "支付回调",
                "id": "paymentCallback",
                "url": "/api/v1/payment/transaction/pay",
                "desc": ""
            },
            {
                "name": "提现回调",
                "id": "withdrawCallback",
                "url": "/api/v1/rechargewithdrawals/withdrawals",
                "desc": ""
            },
            {
                "name": "提交客户审核",
                "id": "auditCustomers",
                "url": "/api/v1/customer/submit",
                "desc": ""
            },
            {
                "name": "根据价格方案UID 获取对应价格方案的所有价格明细",
                "id": "getSalesDetailsByUid",
                "url": "/api/v1/biz/quotations/sale/{uid}/details",
                "desc": ""
            },
            {
                "name": "客户审核通过",
                "id": "auditSuccCustomers",
                "url": "/api/v1/customer/audit/{id}",
                "desc": ""
            },
            {
                "name": "客户审核不通过",
                "id": "auditFailCustomers",
                "url": "/api/v1/customer/rejections/{id}",
                "desc": ""
            },
            {
                "name": "新建销售价-保存报价方案的明细信息_批量",
                "id": "saveAllSalesPrice",
                "url": "/api/v1/biz/quotations/sale/{uid}/details",
                "desc": ""
            },
            {
                "name": "根据Id获取当前用户的状态",
                "id": "getCustomerAuditStatus",
                "url": "/api/v1/customer/authstatus/{id}",
                "desc": ""
            },
            {
                "name": "订单查询查询客户账户下拉列表",
                "id": "getCustomerUserNameWithOutNoAudit",
                "url": "/api/v1/customer/user/search/username",
                "desc": ""
            },
            {
                "name": "审核销售价-保存报价方案的明细信息_批量",
                "id": "saveAllAuditSalesPrice",
                "url": "/api/v1/biz/quotations/sales/{uid}/details/approval",
                "desc": ""
            },
            {
                "name": "供应商管理异步校验用户是否存在",
                "id": "checkSupplierUserExsist",
                "url": "/api/v1/sup/suppliers/logistics/user/checkusername",
                "desc": ""
            },
            {
                "name": "供应商管理异步校验子账户电话号码是否存在",
                "id": "checkSupplierUserPhoneExist",
                "url": "/api/v1/sup/suppliers/logistics/user/checkmobilephone?mobilePhone={mobilePhone}&userId={userId}",
                "desc": ""
            },
            {
                "name": "供应商管理校验账号email",
                "id": "checkSupplierUserInfoEmail",
                "url": "/api/v1/sup/suppliers/logistics/email",
                "desc": ""
            },
            {
                "name": "供应商管理异步校验账号邮箱",
                "id": "checkSupplierAccountEmail",
                "url": "/api/v1/sup/suppliers/logistics/user/checkemail",
                "desc": ""
            },
            {
                "name": "供应商管理搜索子账号列表",
                "id": "searchSupplierChildAccount",
                "url": "/api/v1/sup/suppliers/logistics/user/search",
                "desc": ""
            },
            {
                "name": "供应商管理添加子账户",
                "id": "addSupplierChildAccount",
                "url": "/api/v1/sup/suppliers/logistics/user",
                "desc": ""
            },
            {
                "name": "供应商管理更新子账号",
                "id": "updateSupplierChildAccount",
                "url": "/api/v1/sup/suppliers/logistics/user",
                "desc": ""
            },
            {
                "name": "供应商管理删除子账号",
                "id": "deleteSupplierChildAccount",
                "url": "/api/v1/sup/suppliers/logistics/user/deletions",
                "desc": ""
            },
            {
                "name": "供应商管理锁定子账号",
                "id": "lockSupplierChildAccount",
                "url": "/api/v1/sup/suppliers/logistics/user/lock",
                "desc": ""
            },
            {
                "name": "供应商管理解锁子账号",
                "id": "unlockSupplierChildAccount",
                "url": "/api/v1/sup/suppliers/logistics/user/unlock",
                "desc": ""
            },
            {
                "name": "供应商管理重置子账号密码",
                "id": "resetSupplierChildPassword",
                "url": "api/v1/sup/suppliers/logistics/user/resetpasswd",
                "desc": ""
            }
        ]
    }
}
