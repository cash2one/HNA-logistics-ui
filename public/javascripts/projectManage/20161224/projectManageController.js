easySpa.require([
    'widget/prompt',
    'widget/parseUrl',
    'public/common/tableController.js',
    'public/common/calander.js',
    'widget/slimscroll/',
    'widget/select'
], function () {
    app.controller('projectManageCtrl', [
        '$scope',
        'projectManageService',
        'projectManageView',
        'tableService',
        function ($scope, projectManageService, projectManageView, tableService) {
            // 日期控件
            Calander.init({
                ele: [
                    '#startTime',
                    '#endTime'
                ],
                isClear: true
            });
    
            var bizTypeName = window.parseUrl.getParams().module;
            if (bizTypeName && bizTypeName === 'logistics') {
                $scope.biztype = 1;
            }
            if (bizTypeName && bizTypeName === 'trade') {
                $scope.biztype = 2;
            }
            sessionStorage.setItem('projectBelong', $scope.biztype);
            var actionName = window.parseUrl.getParams().action;
            if (actionName && actionName === 'new') {
                $scope.projectAction = 1;
            }
            if (actionName && actionName === 'approval') {
                $scope.projectAction = 2;
            }
            sessionStorage.setItem('projectAction', $scope.projectAction);
            var restUrl = '';
            if ($scope.biztype === 1) {
                if ($scope.projectAction === 1) {
                    restUrl = 'logistics.getProjectsDataNewLog';
                }
                if ($scope.projectAction === 2) {
                    restUrl = 'logistics.getProjectsDataApprovalLog';
                }
            }
            if ($scope.biztype === 2) {
                if ($scope.projectAction === 1) {
                    restUrl = 'logistics.getProjectsDataNew';
                }
                if ($scope.projectAction === 2) {
                    restUrl = 'logistics.getProjectsDataApproval';
                }
            }
    
            var projectStatusData = {
                data: [
                    {
                        name: '全部',
                        code: '-1'
                    },
                    {
                        name: '草稿',
                        code: '1'
                    },
                    {
                        name: '待初审',
                        code: '2'
                    },
                    {
                        name: '待终审',
                        code: '3'
                    },
                    {
                        name: '已立项',
                        code: '4'
                    },
                    {
                        name: '已结项',
                        code: '5'
                    },
                    {
                        name: '已关闭',
                        code: '6'
                    }
                ]
            };
            $scope.statusName = '全部';
            if ($scope.projectAction === 2) {
                projectStatusData.data.splice(1, 1);
            }
            selectFactory({
                data: projectStatusData,
                id: 'projectStatus',
                showTextField: 'name',
                defaultText: '',
                attrTextField: {
                    'ng-value': 'code'
                },
                attrTextId: function (code) {
                    $scope.tableModel.restData.status = code;
                    $scope.$apply();
                },
                attrTextModel: function (value) {
                    $scope.statusName = value;
                    $scope.$apply();
                }
            });
    
            $scope.tableModel = {
                tableHeader: [
                    Lang.getValByKey('common', 'common_thead_number'),
                    Lang.getValByKey('projectManage', 'projectManage_project_name'),
                    Lang.getValByKey('projectManage', 'projectManage_project_code'),
                    Lang.getValByKey('projectManage', 'projectManage_business_type'),
                    Lang.getValByKey('projectManage', 'projectManage_relationship_enterprise'),
                    Lang.getValByKey('projectManage', 'projectManage_project_creator'),
                    Lang.getValByKey('projectManage', 'projectManage_project_createTime'),
                    Lang.getValByKey('projectManage', 'projectManage_project_status')
                ],
                tableBody: [],
                restURL: restUrl,
                restData: {
                    biztype: $scope.biztype,
                    starttime: getBeforeDate(6)+' 00:00:00',
                    endtime: new Date().format("yyyy-MM-dd 23:59:59"),
                    status: '-1',
                    companyname: '',
                    project: '',
                    pageIndex: 1,
                    pageSize: 10
                }
            };
            // 获取语言库
            $scope.getLanguage = function () {
                projectManageService.getLanguage(function (data) {
                    if (data.errorCode === 0) {
                        $scope.language = data.data;
                    }
                });
            };
            $scope.getLanguage();
    
            // 获取干系企业
            $scope.getRelationshipEnt = function () {
                var isAudit = $scope.projectAction === 1 ? 'false' : 'true';
                projectManageService.getRelationshipEnt(
                    {
                        urlParams: {
                            isAudit: isAudit,
                            biztype: $scope.biztype
                        }
                    },
                    function (res) {
                        $scope.relationshipEnterprise = selectFactory({
                            data: res,
                            isSearch: true,
                            closeLocalSearch: true,
                            pagination: true,
                            id: 'relationshipEnterprise',
                            searchPlaceHoder: '请输入企业名称',
                            showTextField: 'companyName',
                            defaultText: '全部',
                            attrTextModel: function (value) {
                                $scope.tableModel.restData.companyname = value;
                                $scope.$apply();
                            },
                            onSearchValueChange: function (attachEvent, data, currentPage) {
                                var config = {
                                    urlParams: {
                                        q: data,
                                        isAudit: isAudit,
                                        biztype: $scope.biztype,
                                        pageIndex: currentPage
                                    }
                                };
                                projectManageService.getRelationshipEnt(config, function (result) {
                                    if (result.errorCode === 0) {
                                        $scope.relationshipEnterprise.setData(result);
                                    } else {
                                        $scope.relationshipEnterprise.setData([]);
                                    }
                                });
                                $scope.$apply();
                            }
                        });
                    }
                );
            };
    
            /**
                 * watch tableModel的变化。
                 */
            $scope.$watch(
                'tableModel',
                function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    $scope.delDisabled = false;
                    $scope.submitDisabled = false;
                    angular.forEach($scope.tableModel.tableBody, function (value) {
                        if (value.checkbox && value.status !== 1) {
                            // 草稿
                            $scope.delDisabled = true;
                            $scope.submitDisabled = true;
                        }
                    });
                },
                true
            );
    
            // 删除项目
            $scope.delProjectsData = function () {
                var selectItems = tableService.getSelectTable($scope.tableModel.tableBody);
                if (!selectItems.length) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: '请先选择数据！',
                        type: 'errer',
                        manualClose: true
                    });
                    return;
                }
                var statusList = selectItems.map(function (item) {
                    return item.status;
                });
                var result = '';
                statusList.forEach(function (item) {
                    if (item !== 1) {
                        result = false;
                    } else {
                        result = true;
                    }
                });
                if (result) {
                    $(document).promptBox({
                        title: '提示',
                        type: 'warning',
                        content: {
                            tip: '确认删除选中项目?'
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_page_delete'),
                                application: 'delete',
                                operationEvent: function () {
                                    var list = selectItems.map(function (item) {
                                        return item.id;
                                    });
                                    projectManageService.delProjectsData({ urlParams: list }, function (res) {
                                        if (res.errorCode === 0) {
                                            $scope.getProjectsData();
                                            $(document).promptBox('closePrompt');
                                            $(document).promptBox({
                                                isDelay: true,
                                                contentDelay: res.msg,
                                                type: 'success'
                                            });
                                        } else {
                                            $(document).promptBox({
                                                isDelay: true,
                                                contentDelay: res.msg,
                                                type: 'errer',
                                                manualClose: true
                                            });
                                        }
                                        $scope.$apply();
                                    });
                                }
                            }
                        ]
                    });
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: '只有草稿才能删除！',
                        type: 'errer',
                        manualClose: true
                    });
                }
            };
    
            // 提交项目
            $scope.submitProjectsData = function () {
                var selectItems = tableService.getSelectTable($scope.tableModel.tableBody);
                if (!selectItems.length) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: '请先选择数据！',
                        type: 'errer',
                        manualClose: true
                    });
                    return;
                }
                var statusList = selectItems.map(function (item) {
                    return item.status;
                });
                var result = '';
                statusList.forEach(function (item) {
                    if (item > 1) {
                        result = false;
                    } else {
                        result = true;
                    }
                });
                if (result) {
                    $(document).promptBox({
                        title: '提示',
                        type: 'success',
                        content: {
                            tip: '确认提交选中项目?'
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_pagination_confirm'),
                                application: 'confirm',
                                operationEvent: function () {
                                    var list = selectItems.map(function (item) {
                                        return item.id;
                                    });
                                    projectManageService.submitProjectsData({ urlParams: list }, function (res) {
                                        if (res.errorCode === 0) {
                                            $scope.getProjectsData();
                                            $(document).promptBox('closePrompt');
                                            $(document).promptBox({
                                                isDelay: true,
                                                contentDelay: res.msg,
                                                type: 'success'
                                            });
                                        } else {
                                            $(document).promptBox({
                                                isDelay: true,
                                                contentDelay: res.msg,
                                                type: 'errer',
                                                manualClose: true
                                            });
                                        }
                                        $scope.$apply();
                                    });
                                }
                            }
                        ]
                    });
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: '只有草稿才能提交审核！',
                        type: 'errer',
                        manualClose: true
                    });
                }
            };
    
            // 跳转
            $scope.jumpTo = function () {
    
                /**
                     * arguments: [url, status, id, ...]
                     */
                if (arguments[1]) {
                    sessionStorage.setItem('status', arguments[1]);
                } else {
                    sessionStorage.setItem('status', $scope.projectAction);
                }
    
                sessionStorage.setItem(
                    'managePath',
                    location.hash
                        .split('&')
                        .slice(0, 2)
                        .join('&')
                );
    
                top.location.href = arguments[2] ? 'http://' + location.host + arguments[0] + '?module=' + bizTypeName + '&id=' + arguments[2] : 'http://' + location.host + arguments[0] + '?module=' + bizTypeName;
            };
    
            // 获取项目列表数据
            $scope.getProjectsData = function () {
                var params = { urlParams: $scope.tableModel.restData };
                $scope.project = $scope.tableModel.restData.project;
                tableService.getTable(restUrl, params, function (res) {
                    if (res.errorCode === 0) {
                        $scope.tableModel = tableService.table($scope.tableModel, params, res);
                    }
                });
            };
    
            // 重置搜索
            $scope.resetProjectsData = function () {
                $scope.tableModel.restData = {
                    biztype: $scope.biztype,
                    starttime: getBeforeDate(6)+' 00:00:00',
                    endtime: new Date().format("yyyy-MM-dd 23:59:59"),
                    status: '-1',
                    companyname: '',
                    project: '',
                    pageIndex: 1,
                    pageSize: 10
                };
                $scope.project = '';
                $scope.statusName = '全部';
                var params = { urlParams: $scope.tableModel.restData };
                tableService.getTable(restUrl, params, function (res) {
                    if (res.errorCode === 0) {
                        $scope.tableModel = tableService.table($scope.tableModel, params, res);
                    }
                });
            };
    
            // 获取用户组织身份
            $scope.getUserIdentity = function () {
                projectManageService.getUserIdentity('', function (res) {
                    if (res.errorCode === 0) {
                        var identity = '';
                        if (res.data.length === 0) {
                            identity = 0;
                        }
                        if (res.data.length > 0) {
                            res.data.forEach(function (item) {
                                identity += item.type;
                            });
                        }
                        sessionStorage.setItem('identity', identity);
                    }
                });
            };
    
            $scope.getProjectsData();
            $scope.getRelationshipEnt();
            $scope.getUserIdentity();
        }
    ]);
});


window.onhashchange = function () {
    $('.content-main').remove();
    window.location.reload();
};
