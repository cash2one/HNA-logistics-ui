easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/nestable',
    'widget/htree',
    'widget/tab',
    'widget/select',
    'public/common/tableController.js'
],function(){
    app.controller('roleCtrl', [
        '$scope',
        'roleService',
        'roleView',
        'tableService',
        function ($scope, roleService, roleView, tableService) {
            $scope.roleModel = {
                q: '',
                pageIndex: 1,
                pageSize: 10000,
                id: 0, // 角色ID
                name: '', // 角色名称
                newRole: false, // 角色是否新增
                domainId: 1,
                candidateFlag: true, // 待选用户全选框状态
                candidateData: [], // 待选用户数据
                selectedFlag: false, // 已选用户全选框状态
                selectedData: [], // 已选用户数据

                userSeniorFlag: false,
                senior: Lang.getValByKey('common', 'common_page_advancedFilter'),
                ordinary: Lang.getValByKey('common', 'common_page_ordinaryFilter'),
                seniorTypeData: [{ id: '0', name: '全部' }, { id: '2', name: '组织' }, { id: '3', name: '用户组' }, { id: '1', name: '用户' }],

                seniorText: Lang.getValByKey('common', 'common_page_advancedFilter'),
                seniorFlag: false, // 资源高级搜索
                htree: {}, // 资源树handle
                resourceFlag: false, // 资源显示已选复选框

                searchCandidate: '', // 初始化待选搜索框数据
                searchSelected: '', // 初始化已选搜索框数据

                orgCandidateData: [], // 组织待选数据
                groupCandidateData: [], // 用户组待选数据
                userCandidateData: [], // 用户待选数据

                system: [
                    { domainId: 1, name: Lang.getValByKey('role', 'role_code_operationSys') },
                    { domainId: 2, name: Lang.getValByKey('role', 'role_code_supplierSys') },
                    { domainId: 3, name: Lang.getValByKey('role', 'role_code_clientSys') },
                ],
                domainId: 1,
                domainName: Lang.getValByKey('role', 'role_code_operationSys'),
                tableRole: {
                    // 表格为tableRole 的表格
                    tableHeader: [
                        Lang.getValByKey('common', 'common_thead_number'),
                        Lang.getValByKey('common', 'common_thead_type'),
                        Lang.getValByKey('common', 'common_thead_name'),
                        Lang.getValByKey('common', 'common_thead_code'),
                        Lang.getValByKey('common', 'common_thead_department'),
                        Lang.getValByKey('common', 'common_thead_role'),
                    ], // 表格头
                    tableBody: [],
                    restURL: 'logistics.getRoleUser', // 请求RestAPI 地址
                    restData: {
                        // 发送请求参数。
                        q: '',
                        roleType: 0,
                        roleId: 0,
                        pageIndex: 1,
                        pageSize: 10,
                    },
                    selectNumber: 0, // 角色成员列表勾选数量
                    selectFlag: false, // 复选框全选按钮状态位
                },
            };

            // tab操作
            $scope.roleModel.tabOne = roleView.tab('#m-tab', refreshTable);

            $scope.roleModel.tabTwo = roleView.tab('#m-tab-propmt', restCandidateData);

            $scope.initSelect = function () {
                var data = { data: $scope.roleModel.system };
                selectFactory({
                    data: data,
                    defaultText: '',
                    id: 'select-sys-input',
                    showTextField: 'name',
                    attrTextField: {
                        'ng-value': 'domainId',
                    },
                    attrTextId: function (domainId) {
                        if ($scope.roleModel.domainId != domainId) {
                            $scope.roleModel.change(domainId);
                        }
                        $scope.roleModel.domainId = domainId;
                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        $scope.roleModel.domainName = name;
                        $scope.$apply();
                    },
                });
            };
            $scope.initSelect();

            /**
             *
             * @param q    //搜索关键字
             * @param pageIndex    //加载当前页码
             * @param pageSize    //每页显示记录数
             */
            $scope.roleModel.getRoleList = function (q, pageIndex, pageSize, domainId) {
                $scope.roleModel.roleName = $scope.roleModel.roleCode = $scope.roleModel.description = '';
                $scope.roleModel.isEdit = false;
                $scope.roleModel.tabOne.exdisable(0);
                $('#editRole').hide();

                $('#wrap-tree').html('').html('<div id="tree" class="m-tree-layer"></div>');
                $('#tree')
                    .nestable({
                        isRoot: false,
                        name: 'name',
                        orgShortName: 'name',
                        id: 'id',
                        parameter: '?q=' + q + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&domainId=' + domainId,
                        isTree: false,
                        isSearch: false,
                        searchInput: undefined,
                        treeScrollHeight: $('#wrap-tree'),
                        childUrl: Interface.getUrlById('logistics.getRoleList'),
                        clickNode: function (id) {
                            $scope.$apply($scope.roleModel.roleListClick(id));
                        },
                        loadFirstNode: function (id) {
                            if ($scope.roleModel.domainId == 1) {
                                $scope.roleModel.tabOne.enableAll();
                            }
                            $('#editRole').show();

                            $scope.$apply($scope.roleModel.roleListClick(id));
                        },
                        deleteNodes: function (id) {
                            $scope.$apply($scope.roleModel.delRole(id));
                        },
                    })
                    .on('change', function () {
                        var prevId = $('.moving').prev().length == 0 ? 0 : $('.moving').prev().data('uid');
                        var id = $('.moving').data('uid');
                        id && $scope.roleModel.order(id, prevId);
                    });
            };

            $scope.roleModel.getRoleList($scope.roleModel.q, $scope.roleModel.pageIndex, $scope.roleModel.pageSize, $scope.roleModel.domainId);

            /**
             * 切换系统类型
             * @param domainId    系统类型：1：运营系统，2：供应商系统，3：客户系统
             */
            $scope.roleModel.change = function (domainId) {
                $scope.roleModel.domainId = domainId;
                $scope.roleModel.q = '';
                // 更新角色列表视图
                $scope.roleModel.getRoleList($scope.roleModel.q, $scope.roleModel.pageIndex, $scope.roleModel.pageSize, domainId);
            };

            /**
             * 角色列表排序
             * @param id    角色ID
             * @param prevId    排序prevId
             */
            $scope.roleModel.order = function (id, prevId) {
                var param = {
                    targetpreid: prevId,
                    domainId: $scope.roleModel.domainId,
                };
                roleService.orderRole(id, param, function (data) {
                    if (data.errorCode === 0) {
                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                    } else {
                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                    }
                });
            };

            /**
             * 角色列表搜索
             */
            $scope.roleModel.search = function () {
                $scope.roleModel.getRoleList($scope.roleModel.q, $scope.roleModel.pageIndex, $scope.roleModel.pageSize, $scope.roleModel.domainId);
            };

            /**
             * 点击左侧角色列表中的某个角色。
             * @param id    //角色ID
             */
            $scope.roleModel.roleListClick = function (id) {
                // 缓存点击角色ID
                $scope.roleModel.id = id;

                $scope.q = $scope.roleModel.tableRole.restData.q = '';
                $scope.roleModel.tableRole.restData.pageIndex = 1;
                $scope.typeValue = $scope.roleModel.tableRole.restData.roleType = 0;
                $scope.roleModel.userSeniorFlag = false;
                $scope.types = typeNameById($scope.typeValue);

                // 重置编辑状态
                $scope.roleModel.isEdit = false;
                $scope.roleModel.resourceFlag = false;
                $scope.roleModel.newRole = false;

                $('.seat-node').length ? $('.seat-node').remove() : '';

                if ($scope.roleModel.domainId == 1 && id !==5 || id !==6) {
                    $scope.roleModel.tabOne.enableAll();
                }

                if(id ===5 || id ===6){
                    $scope.isSystemEdit = false;
                    $scope.roleModel.tabOne.disable(1);
                    $scope.roleModel.tabOne.selected(0);
                }else{
                    $scope.isSystemEdit = true;
                }

                // 加载角色详情
                $scope.roleModel.getRoleDetail(id);

                // 加载角色资源权限
                $scope.roleModel.getResources(id);

                // 加载角色成员
                $scope.roleModel.resourceFlag = $scope.roleModel.seniorFlag = false;
                $scope.roleModel.getRoleUser(id);
            };

            /**
             * 获取角色详细信息
             * @param id    //角色ID
             */
            $scope.roleModel.getRoleDetail = function (id) {
                roleService.getRoleDetail(id, function (data) {
                    if (data.errorCode === 0) {
                        $scope.roleModel.name = data.data.name;
                        $scope.roleModel.roleName = $scope.roleModel.roleInputName = data.data.name;
                        $scope.roleModel.roleCode = $scope.roleModel.roleInputCode = data.data.code;
                        $scope.roleModel.description = $scope.roleModel.roleInputdescription = data.data.description;
                    }
                });
            };

            /**
             * 新增角色
             */
            $scope.roleModel.addRole = function () {
                $scope.roleModel.form.roleInputCode.errorTips = '';
                $scope.roleModel.tabOne.exdisable(0);
                $('.remote-invalid').removeClass('remote-invalid');

                // 清除angular表单脏值检测
                $scope.roleModel.form.$setPristine();
                $scope.roleModel.form.$setUntouched();

                // 初始化状态
                $scope.roleModel.newRole = true;
                $scope.roleModel.isEdit = true;

                // 初始化数据值
                $scope.roleModel.roleInputName = '';
                $scope.roleModel.roleInputCode = '';
                $scope.roleModel.roleInputdescription = '';
                $scope.textareaNumber = 140;

                // 添加 新增角色 占位
                $('.seat-node').length ? $('.seat-node').remove() : '';
                $('#tree .dd3-content').removeClass('active');
                $('#tree').children('ol').prepend('<li class="seat-node new-nodes dd-item dd3-item"><div class="dd3-content active">' + Lang.getValByKey('role', 'role_code_addRole') + '</div></li>');

                roleService.getRoleCode($scope.roleModel.domainId, function (data) {
                    if (data.errorCode === 0 && $scope.roleModel.roleInputCode == '') {
                        $scope.roleModel.roleInputCode = data.data.code;
                    }
                });
            };

            /**
             * 编辑角色详情
             */
            $scope.roleModel.editRole = function () {
                $scope.roleModel.isEdit = true;
                $scope.roleModel.form.roleInputName.errorTips = '';
                $scope.roleModel.form.roleInputCode.errorTips = '';
                $('.remote-invalid').removeClass('remote-invalid');

                $scope.roleModel.roleInputName = $scope.roleModel.roleName;
                $scope.roleModel.roleInputCode = $scope.roleModel.roleCode;
                $scope.roleModel.roleInputdescription = $scope.roleModel.description;

                $scope.textareaNumber = 140 - ($scope.roleModel.roleInputdescription ? $scope.roleModel.roleInputdescription.length : 0);
            };

            $scope.showTextNumber = function () {
                $scope.textareaNumber = 140 - $scope.roleModel.roleInputdescription.length;
            };

            /**
             * 取消角色编辑
             */
            $scope.roleModel.cancelRole = function (isApply) {
                if ($('.seat-node').length) {
                    $('.seat-node').remove();

                    var id = $scope.roleModel.id;
                    $('#tree').children('ol').children('li').each(function () {
                        if ($(this).attr('data-uid') == id) {
                            $(this).children('.dd3-content').addClass('active');
                        }
                    });
                }

                $scope.roleModel.isEdit = $scope.roleModel.newRole = false;

                if ($('#tree').children('ol').children('li').length) {
                    if ($scope.roleModel.domainId == 1) {
                        $scope.roleModel.tabOne.enableAll();
                    }
                }

                isApply == undefined ? '' : $scope.$apply();
            };

            /**
             * 保存 新增/编辑 角色详情
             */
            $scope.roleModel.saveRole = function () {
                if (!$scope.roleModel.roleInputName) {
                    $scope.roleModel.form.roleInputName.$setDirty();
                }
                if (!$scope.roleModel.roleInputCode) {
                    $scope.roleModel.form.roleInputCode.$setDirty();
                }
                if ($('#name-msg').hasClass('remote-invalid')) {
                    return;
                }
                if ($('#code-msg').hasClass('remote-invalid')) {
                    return;
                }

                if (!$scope.roleModel.form.$valid) {
                    return;
                }
                var id = $scope.roleModel.id;

                $scope.roleModel.roleInputdescription = $.trim($scope.roleModel.roleInputdescription);
                var param = {
                    name: $scope.roleModel.roleInputName,
                    code: $scope.roleModel.roleInputCode,
                    description: $scope.roleModel.roleInputdescription,
                    domainId: $scope.roleModel.domainId,
                };

                if (!$scope.roleModel.newRole) {
                    // 修改保存
                    roleService.saveEditRole(id, param, function (data) {
                        if (data.errorCode === 0) {
                            $scope.roleModel.isEdit = false;

                            $scope.roleModel.roleName = param.name;
                            $scope.roleModel.roleCode = param.code;
                            $scope.roleModel.description = param.description;

                            $('#tree .active').attr({ 'data-name': param.name, 'data-orgname': param.name }).html(param.name);

                            roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                        } else {
                            roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                        }
                    });
                } else {
                    roleService.saveAddRole(param, function (data) {
                        if (data.errorCode === 0) {
                            $scope.roleModel.isEdit = $scope.roleModel.newRole = false;

                            // 更新角色列表视图
                            $scope.roleModel.getRoleList($scope.roleModel.q, $scope.roleModel.pageIndex, $scope.roleModel.pageSize, $scope.roleModel.domainId);

                            roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                        } else {
                            roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                        }
                    });
                }
            };

            /**
             * 删除角色
             * @param id    角色ID
             */
            $scope.roleModel.delRole = function (id) {
                $scope.roleModel.roleListClick(id);

                var roleName = $('#tree').find('li[data-uid="' + id + '"]').children('div').attr('data-name');

                $scope.roleModel.isEdit = $scope.roleModel.newRole = false;

                if ($scope.roleModel.domainId == 1) {
                    $scope.roleModel.tabOne.enableAll();
                }

                var opt = {
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey('common', 'common_page_delete') + '“' + roleName + '”' + Lang.getValByKey('role', 'role_code_delRole'),
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                roleService.deleteRole(id, function (data) {
                                    if (data.errorCode === 0) {
                                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                                        roleView.promptBox('closePrompt');

                                        // 更新角色列表视图
                                        $scope.roleModel.getRoleList($scope.roleModel.q, $scope.roleModel.pageIndex, $scope.roleModel.pageSize, $scope.roleModel.domainId);
                                        $scope.$apply();
                                    } else {
                                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                                    }
                                });
                            },
                        },
                    ],
                };
                roleView.promptBox(opt);
            };

            /**
             * 角色名称校验
             */
            $scope.checkName = function () {
                var id = $scope.roleModel.newRole == true ? '' : $scope.roleModel.id;
                var config = {
                    urlParams: {
                        name: $scope.roleModel.roleInputName,
                        domainId: $scope.roleModel.domainId,
                        id: id,
                    },
                };
                if ($scope.roleModel.roleInputName) {
                    roleService.checkName(config, function (data) {
                        if (data.errorCode != 0) {
                            // 编码重复
                            $scope.roleModel.form.roleInputName.errorTips = data.msg;
                            $('#name-msg').removeClass('ng-hide').addClass('remote-invalid');
                        } else {
                            // 编码不重复
                            $('#name-msg').addClass('ng-hide').removeClass('remote-invalid');
                            $scope.roleModel.form.roleInputName.errorTips = '';
                        }
                    });
                }
            };

            /**
             * 角色编码校验
             */
            $scope.checkCode = function () {
                var id = $scope.roleModel.newRole == true ? '' : $scope.roleModel.id;
                var config = {
                    urlParams: {
                        code: $scope.roleModel.roleInputCode,
                        domainId: $scope.roleModel.domainId,
                        id: id,
                    },
                };
                if ($scope.roleModel.roleInputCode) {
                    roleService.checkCode(config, function (data) {
                        if (data.errorCode != 0) {
                            // 编码重复
                            $scope.roleModel.form.roleInputCode.errorTips = data.msg;
                            $('#code-msg').removeClass('ng-hide').addClass('remote-invalid');
                        } else {
                            // 编码不重复
                            $('#code-msg').addClass('ng-hide').removeClass('remote-invalid');
                            $scope.roleModel.form.roleInputCode.errorTips = '';
                        }
                    });
                }
            };

            /** ==================     资源权限    ====================**/
            /**
             * 加载角色资源权限
             * @param id
             */
            $scope.roleModel.getResources = function (id) {
                roleView.getResourcesView();

                roleService.getRoleResources(id, function (data) {
                    try {
                        var data = data.data.children;
                        $scope.roleModel.htree = $('#resources').htree(data, {});
                        // 初始化复选框状态
                        $scope.roleModel.htree.upcheked();

                        // 刷新滚动条高度
                        if ($scope.roleModel.seniorFlag) {
                            var height = roleView.height('getSeniorResources');
                        } else {
                            var height = roleView.height('getResources');
                        }
                        setTimeout(function () {
                            roleView.slimscroll('#resources', height);
                            $(window).resize(function () {
                                if ($scope.roleModel.seniorFlag) {
                                    var height = roleView.height('getSeniorResources');
                                } else {
                                    var height = roleView.height('getResources');
                                }
                                roleView.slimscroll('#resources', height);
                            });
                        }, 10);
                    } catch (e) {}
                });
            };

            /**
             * 角色资源权限保存
             */
            $scope.roleModel.saveResources = function () {
                var id = $scope.roleModel.id;
                var param = $scope.roleModel.htree.getLeafsChecked();

                roleService.saveRoleResources(id, param, function (data) {
                    if (data.errorCode === 0) {
                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                        $scope.roleModel.getResources(id);

                        $scope.roleModel.resourceFlag = false;
                        $scope.roleModel.resKey = '';
                    } else {
                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                    }
                });
            };

            /**
             * 资源权限复选框
             */
            $scope.roleModel.toggleChecked = function () {
                var key = $scope.roleModel.resKey ? $scope.roleModel.resKey : '';

                if ($scope.roleModel.resourceFlag) {
                    $scope.roleModel.htree.setParam({ key: key, checkedFlag: true });
                } else {
                    $scope.roleModel.htree.setParam({ key: key, checkedFlag: false });
                }

                $scope.roleModel.htree.treeParam();
            };

            /**
             * 资源权限搜索
             */
            $scope.roleModel.searchResources = function () {
                var checkedFlag = $scope.roleModel.resourceFlag;
                var key = $scope.roleModel.resKey;
                $scope.roleModel.htree.setParam({ key: key, checkedFlag: checkedFlag });
                $scope.roleModel.htree.treeParam();
            };

            /**
             *
             */
            $scope.roleModel.seniorSeach = function () {
                if ($scope.roleModel.seniorFlag == true) {
                    $scope.roleModel.resourceFlag = false;
                    $scope.roleModel.searchResources();
                    $scope.roleModel.seniorText = Lang.getValByKey('common', 'common_page_advancedFilter');
                } else {
                    $scope.roleModel.seniorText = Lang.getValByKey('common', 'common_page_ordinaryFilter');
                }

                $scope.roleModel.seniorFlag = !$scope.roleModel.seniorFlag;

                // 刷新滚动条高度
                if ($scope.roleModel.seniorFlag) {
                    var height = roleView.height('getSeniorResources');
                } else {
                    var height = roleView.height('getResources');
                }

                setTimeout(function () {
                    roleView.slimscroll('#resources', height);
                }, 10);
            };

            /**
             * 资源全部收起
             */
            $scope.roleModel.shrinkResources = function () {
                $scope.roleModel.htree.shrinkAll();
            };

            /** ====================    成员    ====================**/
            /**
             * 获取角色成员列表
             * @param id    角色ID
             */
            $scope.roleModel.getRoleUser = function (id) {
                $scope.roleModel.tableRole.restData.roleId = id ? id : $scope.roleModel.tableRole.restData.roleId;

                var params = {
                    urlParams: $scope.roleModel.tableRole.restData,
                };

                tableService.getTable($scope.roleModel.tableRole.restURL, params, function (data) {
                    if (data.errorCode === 0) {
                        $scope.roleModel.tableRole = tableService.table($scope.roleModel.tableRole, params, data);

                        $scope.$apply();

                        if ($scope.roleModel.userSeniorFlag) {
                            var height = roleView.height('getSeniorRoleUser');
                        } else {
                            var height = roleView.height('getRoleUser');
                        }
                        setTimeout(function () {
                            roleView.slimscroll('.table-container tbody', height);
                            $(window).resize(function () {
                                if ($scope.roleModel.userSeniorFlag) {
                                    var height = roleView.height('getSeniorRoleUser');
                                } else {
                                    var height = roleView.height('getRoleUser');
                                }
                                roleView.slimscroll('.table-container tbody', height);
                            });
                        }, 10);
                    }
                });
            };

            function refreshTable(index) {
                if (index == 2) {
                    $scope.roleModel.getRoleUser();
                }
            }

            /**
             * 搜索角色对应的成员列表
             */
            $scope.roleModel.searchUser = function () {
                $scope.q = $scope.roleModel.tableRole.restData.q;
                $scope.roleModel.tableRole.restData.pageIndex = 1;

                $scope.roleModel.getRoleUser();
            };

            $scope.roleModel.userSenior = function () {
                $scope.roleModel.userSeniorFlag = !$scope.roleModel.userSeniorFlag;

                if ($scope.roleModel.userSeniorFlag) {
                    var height = roleView.height('getSeniorRoleUser');
                } else {
                    var height = roleView.height('getRoleUser');

                    $scope.typeValue = $scope.roleModel.tableRole.restData.roleType = 0;
                    $scope.types = typeNameById($scope.typeValue);
                    $scope.roleModel.getRoleUser();
                }
                setTimeout(function () {
                    roleView.slimscroll('.table-container tbody', height);
                }, 10);
            };

            $scope.getType = function () {
                selectFactory({
                    data: { data: $scope.roleModel.seniorTypeData },
                    maxHeight: 340,
                    minHeight: 34,
                    offset: 4,
                    id: 'type-select-input',
                    showTextField: 'name',
                    attrTextField: {
                        'ng-value': 'id',
                    },
                    defaultText:'',
                    attrTextId: function (id) {
                        $scope.typeValue = $scope.roleModel.tableRole.restData.roleType = id;
                    },
                    attrTextModel: function (name) {
                        $scope.types = name;
                        $scope.roleModel.getRoleUser();
                        $scope.$apply();
                    },
                }).build();
            };

            /**
             * 删除角色成员对应的角色
             * @param roleId
             * @param userId
             * @param userType
             */
            $scope.roleModel.delUserRole = function (roleId, userId, userType) {
                var opt = {
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey('role', 'role_code_delUserRole'),
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                if (userType == 0) {
                                    // 用户
                                    roleService.delUserRole(roleId, userId, function (data) {
                                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                                        roleView.promptBox('closePrompt');

                                        // 更新table表数据
                                        $scope.roleModel.getRoleUser();
                                    });
                                } else if (userType == 1) {
                                    // 组织
                                    roleService.delOrgRole(roleId, userId, function (data) {
                                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                                        roleView.promptBox('closePrompt');

                                        // 更新table表数据
                                        $scope.roleModel.getRoleUser();
                                    });
                                } else if (userType == 2) {
                                    // 用户组
                                    roleService.delGroupRole(roleId, userId, function (data) {
                                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                                        roleView.promptBox('closePrompt');

                                        // 更新table表数据
                                        $scope.roleModel.getRoleUser();
                                    });
                                }
                            },
                        },
                    ],
                };
                roleView.promptBox(opt);
            };

            /**
             * 获取已选用户
             */
            $scope.roleModel.getSelectedUser = function () {
                // 初始化数据
                $scope.roleModel.selectedData = [];
                $scope.roleModel.selectedFlag = false;

                var height = roleView.height('getGroupCandidate');
                var params = {
                    q: '',
                    roleId: $scope.roleModel.id,
                    roleType: 0,
                    pageIndex: 1,
                    pageSize: 10000,
                };

                roleService.getRoleMember(params, function (data) {
                    if (data.errorCode === 0) {
                        var value = data.data,
                            length = value.length ? value.length : 0,
                            map = {};

                        $scope.roleModel.selectedData = [];
                        for (var i = 0; i < length; i++) {
                            map = {
                                id: value[i].id,
                                type: value[i].type,
                                name: value[i].shortName,
                                checkbox: $scope.roleModel.selectedFlag,
                                delete: false,
                                isShow: true,
                            };
                            $scope.roleModel.selectedData.push(map);
                        }

                        roleView.slimscroll('.selected-user', height);

                        // 待选区判断delete
                        $scope.roleModel.deleteCandidate();
                    }
                });
            };

            /**
             * 添加角色成员loadData
             */
            $scope.roleModel.loadData = function () {
                // 组织、用户组、用户树结构加载
                $('#wrap-orgTree').html('').html('<div id="orgTree"></div>');
                $('#wrap-groupTree').html('').html('<div id="groupTree" style="margin-left:-1px;"></div>');
                $('#wrap-userTree').html('').html('<div id="userTree"></div>');

                $('#orgTree').nestable({
                    iconOpen: 'icon-organization-Open',
                    iconClose: 'icon-organization-Close',
                    iconSeat: 'icon-organization',
                    userCount: 'undefined',
                    isMove: true,
                    isOperate: true,
                    isRoot: true,
                    childUrl: Interface.getUrlById('logistics.treeChildUrl'),
                    searchUrl: Interface.getUrlById('logistics.searchTreeUrl'),
                    searchInput: $('input[name=orgSearch]'),
                    searchKeyNodes: function (uid) {
                        $scope.roleModel.getOrgCandidate(uid);
                    },
                    clickNode: function (uid) {
                        $scope.roleModel.getOrgCandidate(uid);
                    },
                    loadFirstNode: function (uid) {
                        $scope.roleModel.getOrgCandidate(uid);
                    },
                    treeScrollHeight: $('.select-tree-box'),
                });

                $('#userTree').nestable({
                    iconOpen: 'icon-organization-Open',
                    iconClose: 'icon-organization-Close',
                    iconSeat: 'icon-organization',
                    userCount: 'undefined',
                    isMove: true,
                    isOperate: true,
                    isRoot: true,
                    childUrl: Interface.getUrlById('logistics.treeChildUrl'),
                    searchUrl: Interface.getUrlById('logistics.searchTreeUrl'),
                    searchInput: $('input[name=userSearch]'),
                    searchKeyNodes: function (uid) {
                        $scope.roleModel.getUserCandidate(uid);
                    },
                    clickNode: function (uid) {
                        $scope.roleModel.getUserCandidate(uid);
                    },
                    loadFirstNode: function (uid) {
                        $scope.roleModel.getUserCandidate(uid, true);
                    },
                    treeScrollHeight: $('.select-tree-box'),
                });

                $('#groupTree').nestable({
                    iconOpen: 'icon-usergroup-Open',
                    iconClose: 'icon-usergroup-Close',
                    iconSeat: 'icon-usergroup',
                    userCount: 'undefined',
                    isRoot: false,
                    isMove: true,
                    isOperate: true,
                    childUrl: Interface.getUrlById('logistics.userTreeChildUrl'),
                    searchUrl: Interface.getUrlById('logistics.userSearchTreeUrl'),
                    searchInput: $('input[name=groupSearch]'),
                    searchKeyNodes: function (uid) {
                        $scope.roleModel.getGroupCandidate(uid);
                    },
                    clickNode: function (uid) {
                        $scope.roleModel.getGroupCandidate(uid);
                    },
                    loadFirstNode: function (uid) {
                        $scope.roleModel.getGroupCandidate(uid, true);
                    },
                    treeScrollHeight: $('.select-tree-box'),
                });

                // 获取已选用户
                $scope.roleModel.getSelectedUser();
            };

            /**
             * 添加角色成员
             */
            $scope.roleModel.addUser = function () {
                $scope.roleModel.tabTwo.selected(0);

                // 清除缓存数据及重置状态位
                $scope.roleModel.candidateFlag = $scope.roleModel.selectedFlag = false;
                $scope.roleModel.candidateData = $scope.roleModel.selectedData = [];

                // 清除搜索条件
                $('#orgTreeSearch, #groupTreeSearch, #userTreeSearch').val('');

                // 获取添加成员角色名称
                var roleId = $scope.roleModel.id,
                    roleName = $scope.roleModel.name;

                var opt = {
                    title: Lang.getValByKey('role', 'role_code_addRoleUser') + '<span class="u-blue">' + roleName + '</span>' + Lang.getValByKey('common', 'common_thead_role'),
                    isHidden: true,
                    boxWidth: true,
                    isNest: true,
                    loadData: function () {
                        $scope.roleModel.loadData();
                    },
                    loadTitle: function () {
                        return roleName;
                    },
                    content: {
                        nest: $('#userRole'),
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_prompt_confirm'),
                            operationEvent: function () {
                                var param = {
                                    orgIds: [],
                                    userGroupIds: [],
                                    userIds: [],
                                };
                                // 组织数据
                                angular.forEach($scope.roleModel.selectedData, function (val) {
                                    if (val.type == 0) {
                                        param.userIds.push(val.id);
                                    } else if (val.type == 1) {
                                        param.orgIds.push(val.id);
                                    } else if (val.type == 2) {
                                        param.userGroupIds.push(val.id);
                                    }
                                });
                                roleService.addRoleMember($scope.roleModel.id, param, function (data) {
                                    if (data.errorCode === 0) {
                                        roleView.promptBox('closeFormPrompt');
                                        // 更新table表数据
                                        $scope.roleModel.getRoleUser();

                                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                                    } else {
                                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                                    }
                                });
                            },
                        },
                    ],
                };
                roleView.promptBox(opt);
            };

            /**
             * 已选用户全选开关
             */
            $scope.roleModel.toggleSelectedAll = function () {
                var data = $scope.roleModel.selectedData;
                var length = data.length ? data.length : 0;

                if ($scope.roleModel.selectedFlag) {
                    for (var i = 0; i < length; i++) {
                        data[i].checkbox = true;
                    }
                    $scope.roleModel.selectedData = data;
                } else {
                    for (var i = 0; i < length; i++) {
                        data[i].checkbox = false;
                    }
                    $scope.roleModel.selectedData = data;
                }
            };

            /**
             * 已选用户单个checkbox
             * @param userId    用户Id
             * @param userType    用户类型
             */
            $scope.roleModel.toggleSelectedOne = function (userId, userType) {
                var data = $scope.roleModel.selectedData;
                var length = data.length ? data.length : 0;
                var unselect = 0;
                for (var i = 0; i < length; i++) {
                    if (data[i].id === userId && data[i].type == userType) {
                        data[i].checkbox = !data[i].checkbox;
                    }
                    if (!data[i].checkbox) {
                        ++unselect;
                    }
                }
                $scope.roleModel.selectedData = data;
                if (unselect) {
                    $scope.roleModel.selectedFlag = false;
                } else {
                    $scope.roleModel.selectedFlag = true;
                }
            };

            /**
             * 待选用户全选开关
             */
            $scope.roleModel.toggleCandidateAll = function () {
                var data = $scope.roleModel.candidateData;
                var length = data.length ? data.length : 0;

                if ($scope.roleModel.candidateFlag) {
                    for (var i = 0; i < length; i++) {
                        if (!data[i]['delete']) {
                            data[i].checkbox = true;
                        }
                    }
                    $scope.roleModel.candidateData = data;
                } else {
                    for (var i = 0; i < length; i++) {
                        if (!data[i]['delete']) {
                            data[i].checkbox = false;
                        }
                    }
                    $scope.roleModel.candidateData = data;
                }
            };

            /**
             * 待选用户单个checkbox
             * @param userId    用户Id
             * @param userType    用户类型
             */
            $scope.roleModel.toggleCandidateOne = function (userId, userType) {
                var data = $scope.roleModel.candidateData;
                var length = data.length ? data.length : 0;
                var unselect = 0;
                for (var i = 0; i < length; i++) {
                    if (data[i].id === userId && data[i].type == userType) {
                        data[i].checkbox = !data[i].checkbox;
                    }
                    if (!data[i].checkbox) {
                        ++unselect;
                    }
                }
                $scope.roleModel.candidateData = data;
                if (unselect) {
                    $scope.roleModel.candidateFlag = false;
                } else {
                    $scope.roleModel.candidateFlag = true;
                }
            };

            /**
             * tab 组织，用户组，用户进行切换时操作
             * @param index 0：组织；1：用户组；2：用户。
             */
            function restCandidateData(index) {
                if (index == 0) {
                    // 组织
                    $scope.roleModel.candidateData = $scope.roleModel.orgCandidateData;
                } else if (index == 1) {
                    // 用户组
                    $scope.roleModel.candidateData = $scope.roleModel.groupCandidateData;
                } else if (index == 2) {
                    // 用户
                    $scope.roleModel.candidateData = $scope.roleModel.userCandidateData;
                }

                // 清除搜索值
                $scope.roleModel.searchCandidate = '';

                // 重置勾选状态
                $scope.roleModel.candidateFlag = false;
                var data = $scope.roleModel.candidateData;
                var length = data.length ? data.length : 0;
                for (var i = 0; i < length; i++) {
                    data[i].checkbox = $scope.roleModel.candidateFlag;
                }
                $scope.roleModel.candidateData = data;

                // 待选区判断delete
                $scope.roleModel.deleteCandidate();

                $scope.$apply();
            }

            function typeNameById(type) {
                var ret = '';
                angular.forEach($scope.roleModel.seniorTypeData, function (val) {
                    if (val.id == type) {
                        ret = val.name;
                    }
                });
                return ret;
            }

            /**
             * 获取组织对应的待选用户数据
             * @param uid
             */
            $scope.roleModel.getOrgCandidate = function (uid) {
                $scope.roleModel.candidateFlag = false;
                roleService.getOrgDetail(uid, function (data) {
                    if (data.errorCode === 0) {
                        $scope.roleModel.searchCandidate = '';
                        $scope.roleModel.orgCandidateData = $scope.roleModel.candidateData = [
                            {
                                id: data.data.id,
                                type: 1,
                                name: data.data.shortName,
                                checkbox: $scope.roleModel.candidateFlag,
                                delete: false,
                                isShow: true,
                            },
                        ];

                        // 待选区判断delete
                        $scope.roleModel.deleteCandidate();
                        $scope.$apply();
                    }
                });
            };

            /**
             * 获取用户组对应的待选用户数据
             * @param uid
             */
            $scope.roleModel.getGroupCandidate = function (uid, isfirstLoad) {
                var height = roleView.height('getGroupCandidate');

                $scope.roleModel.candidateFlag = false;
                roleService.getGroupDetail(uid, function (data) {
                    if (data.errorCode === 0) {
                        $scope.roleModel.searchCandidate = '';

                        $scope.roleModel.groupCandidateData = [
                            {
                                id: data.data.id,
                                type: 2,
                                name: data.data.shortName,
                                checkbox: $scope.roleModel.candidateFlag,
                                delete: false,
                                isShow: true,
                            },
                        ];
                        isfirstLoad ? '' : $scope.roleModel.candidateData = $scope.roleModel.groupCandidateData;

                        // 待选区判断delete
                        $scope.roleModel.deleteCandidate();

                        $scope.$apply();
                        roleView.slimscroll('.selected-user', height);
                    }
                });
            };

            /**
             * 获取组织对应的用户的待选用户数据
             * @param uid
             */
            $scope.roleModel.getUserCandidate = function (uid, isfirstLoad) {
                $scope.roleModel.candidateFlag = false;
                var params = {
                    q: '',
                    locked: -1,
                    pageIndex: 1,
                    pageSize: 10000,
                };
                roleService.getOgrUserList(uid, params, function (data) {
                    if (data.errorCode === 0) {
                        $scope.roleModel.searchCandidate = '';

                        var data = data.data;
                        var length = data.length ? data.length : 0;
                        var map = {};

                        $scope.roleModel.userCandidateData = [];
                        for (var i = 0; i < length; i++) {
                            var userCode = data[i].userCode ? data[i].userCode : '';
                            map = {
                                id: data[i].userId,
                                type: 0,
                                name: data[i].fullName,
                                userCode: userCode,
                                checkbox: $scope.roleModel.candidateFlag,
                                delete: false,
                                isShow: true,
                            };
                            $scope.roleModel.userCandidateData.push(map);
                        }
                        isfirstLoad ? '' : $scope.roleModel.candidateData = $scope.roleModel.userCandidateData;

                        // 待选区判断delete
                        $scope.roleModel.deleteCandidate();
                        $scope.$apply();
                    }
                });
            };

            /**
             * 待选区域 -》 已选区域
             */
            $scope.roleModel.addSelectedData = function () {
                var candidateData = $scope.roleModel.candidateData,
                    selectedData = $scope.roleModel.selectedData;

                var candidateLength = candidateData.length;
                for (var i = 0; i < candidateLength; i++) {
                    if (candidateData[i].checkbox && !candidateData[i]['delete'] && candidateData[i].isShow) {
                        selectedData.unshift({
                            id: candidateData[i].id,
                            name: candidateData[i].name,
                            delete: true,
                            type: candidateData[i].type,
                            checkbox: $scope.roleModel.selectedFlag,
                            isShow: true,
                        });
                        candidateData[i]['delete'] = true;
                    }
                }
                $scope.roleModel.candidateData = candidateData;
                $scope.roleModel.selectedData = selectedData;
            };

            /**
             * 已选区域 -》 待选区域
             */
            $scope.roleModel.removeSelectedData = function () {
                var candidateData = $scope.roleModel.candidateData,
                    oldSelectedData = $scope.roleModel.selectedData;

                var newSelectedData = [];

                var candidateLength = candidateData.length,
                    selectedLength = oldSelectedData.length;

                for (var i = 0; i < selectedLength; i++) {
                    if (oldSelectedData[i].checkbox && oldSelectedData[i].isShow) {
                        for (var j = 0; j < candidateLength; j++) {
                            if (oldSelectedData[i].id == candidateData[j].id && oldSelectedData[i].type == candidateData[j].type && candidateData[j]['delete']) {
                                candidateData[j]['delete'] = false;
                                candidateData[j].checkbox = $scope.roleModel.candidateFlag;
                            }
                        }
                    } else {
                        newSelectedData.push({
                            id: oldSelectedData[i].id,
                            name: oldSelectedData[i].name,
                            type: oldSelectedData[i].type,
                            checkbox: oldSelectedData[i].checkbox,
                            delete: oldSelectedData[i]['delete'],
                            isShow: oldSelectedData[i].isShow,
                        });
                    }
                }
                $scope.roleModel.candidateData = candidateData;
                $scope.roleModel.selectedData = newSelectedData;
            };

            /**
             * 待选区 delete  置灰
             */
            $scope.roleModel.deleteCandidate = function () {
                if ($scope.roleModel.candidateData.length && $scope.roleModel.selectedData.length) {
                    var candidateData = $scope.roleModel.candidateData,
                        selectedData = $scope.roleModel.selectedData;

                    var candidateLength = candidateData.length,
                        selectedLength = selectedData.length;

                    for (var i = 0; i < candidateLength; i++) {
                        for (var j = 0; j < selectedLength; j++) {
                            if (selectedData[j].id == candidateData[i].id && selectedData[j].type == candidateData[i].type) {
                                candidateData[i]['delete'] = true;
                                candidateData[i].checkbox = true;
                            }
                        }
                    }
                    $scope.roleModel.candidateData = candidateData;
                }
            };

            /**
             * 待选用户搜索
             */
            $scope.roleModel.searchCandidateData = function () {
                var key = $scope.roleModel.searchCandidate.toLowerCase(),
                    data = $scope.roleModel.candidateData;

                var length = data.length;
                var arr = [];
                var isShow = true;

                for (var i = 0; i < length; i++) {
                    var userCode = data[i].userCode ? data[i].userCode : '';
                    arr.push({
                        id: data[i].id,
                        name: data[i].name,
                        type: data[i].type,
                        userCode: userCode,
                        checkbox: data[i].checkbox,
                        delete: data[i]['delete'],
                        isShow: true,
                    });
                    if (data[i].userCode && data[i].name) {
                        if (data[i].name.toLowerCase().indexOf(key) != -1 || data[i].userCode.toLowerCase().indexOf(key) != -1) {
                            isShow = true;
                        } else {
                            isShow = false;
                        }
                    } else {
                        if (!data[i].name || data[i].name.toLowerCase().indexOf(key) == -1) {
                            isShow = false;
                        } else {
                            isShow = true;
                        }
                    }
                    arr[i].isShow = isShow;
                }
                $scope.roleModel.candidateData = arr;
            };

            /**
             * 已选用户搜索
             */
            $scope.roleModel.searchSelectedData = function () {
                var key = $scope.roleModel.searchSelected.toLowerCase(),
                    data = $scope.roleModel.selectedData;
                var length = data.length;
                var arr = [];

                for (var i = 0; i < length; i++) {
                    arr.push({
                        id: data[i].id,
                        name: data[i].name,
                        type: data[i].type,
                        checkbox: data[i].checkbox,
                        delete: data[i]['delete'],
                        isShow: true,
                    });
                    if (!data[i].name || data[i].name.toLowerCase().indexOf(key) == -1) {
                        arr[i].isShow = false;
                    } else {
                        arr[i].isShow = true;
                    }
                }
                $scope.roleModel.selectedData = arr;
            };

            /**
             * 移除角色对应的成员
             */
            $scope.roleModel.removeUser = function () {
                var id = $scope.roleModel.id; // 角色ID

                var param = {
                    orgIds: [],
                    userGroupIds: [],
                    userIds: [],
                };

                var oldData = tableService.getSelectTable($scope.roleModel.tableRole.tableBody);
                if (!oldData.length) {
                    roleView.promptBox({ isDelay: true, contentDelay: Lang.getValByKey('common', 'common_code_noSelected'), type: 'errer', manualClose: true });
                    return false;
                }

                // 组织数据
                angular.forEach(oldData, function (val) {
                    if (val.type == 0) {
                        param.userIds.push(val.id);
                    } else if (val.type == 1) {
                        param.orgIds.push(val.id);
                    } else if (val.type == 2) {
                        param.userGroupIds.push(val.id);
                    }
                });

                var opt = {
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey('role', 'role_code_removeRoleUser'),
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_page_remove'),
                            application: 'delete',
                            operationEvent: function () {
                                roleService.removeUser(id, param, function (data) {
                                    if (data.errorCode === 0) {
                                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                                        roleView.promptBox('closePrompt');

                                        // 更新table表数据
                                        $scope.roleModel.getRoleUser(id);
                                    } else {
                                        roleView.promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                                    }
                                });
                            },
                        },
                    ],
                };
                roleView.promptBox(opt);
            };
        },
    ]);
});
