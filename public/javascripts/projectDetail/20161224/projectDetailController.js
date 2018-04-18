easySpa.require([
    'public/common/calander.js',
    'public/common/pictureController.js',
    'widget/prompt',
    'widget/tab',
    'widget/slimscroll/',
    'widget/nestable',
    'widget/select',
    'widget/slides',
    'widget/parseUrl'
], function () {
    app.controller('projectDetailCtrl', [
        '$scope',
        'projectDetailService',
        'projectDetailView',
        'pictureService',
        function ($scope, projectDetailService, projectDetailView, pictureService) {
            var relationshipEnterprise = {
                data: [
                    {
                        name: '供应商',
                        code: '1'
                    },
                    {
                        name: '客户',
                        code: '2'
                    },
                    {
                        name: '平台',
                        code: '3'
                    }
                ]
            };

            var $scopeExtend = {
                legacyBusinessType: window.parseUrl.getParams().module,
                projectStatus: sessionStorage.getItem('status'),
                identity: sessionStorage.getItem('identity'),
                projectId: window.parseUrl.getParams().id,
                projectAction: sessionStorage.getItem('projectAction'),
                isFirstCheck: false,
                choseEnterprise: false,
                addFinalCheck: false,
                firstResultContent: '',
                finalResultContent: '',
                finalResult: 'true',
                companySelected: {
                    companyRole: '',
                    companyName: ''
                },
                companyTxt: [],
                company: {
                    type: '',
                    companyId: ''
                },
                singleprojectFile: {
                    fileId: '',
                    fileName: '',
                    thumbnailPath: '',
                    filePath: '',
                    remark: '',
                    status: 'new'
                },
                singlecontractFile: {
                    fileId: '',
                    filePath: '',
                    thumbnailPath: '',
                    name: '',
                    remark: ''
                },
                bizTypeName: '',
                orgName: '',
                createor: '',
                createTime: '',
                pictureModel: {
                    edit: true, // 是否编辑状态
                    uploadShow: true, // 是否显示上传按钮图标
                    picture: [], // 图片存放地址
                    accept: '.doc,.docx,.xls,.xlsx,application/msword,image/jpg,image/jpeg,image/png,image/bmp,image/tiff,application/pdf'
                },
                contractFiles: [],
                projectInfo: {
                    name: '',
                    code: '',
                    bizTypeCode: '',
                    orgId: '',
                    companys: [],
                    files: [],
                    profile: '',
                    value: '',
                    risk: '',
                    summary: ''
                },
                approvalInfo: {},
                // 获取语言库
                getLanguage: function () {
                    projectDetailService.getLanguage(function (data) {
                        if (data.errorCode === 0) {
                            $scope.language = data.data;
                        }
                    });
                },
                // 获取项目审核状态
                getApprovalStatus: function () {
                    if (!$scope.projectId) {
                        return;
                    }
                    projectDetailService.getApprovalStatus({ seatParams: { projectId: $scope.projectId } }, function (res) {
                        if (res.errorCode === 0) {
                            $scope.approvalInfo = res.data;
                            $scope.projectStatus = res.data.status;
                            sessionStorage.setItem('status', res.data.status);
                        } else {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: res.msg,
                                type: 'errer',
                                manualClose: true
                            });
                        }
                    });
                },
                // 获取项目基础数据
                getProjectInfo: function () {
                    if (!$scope.projectId) {
                        return;
                    }
                    var that = this;
                    projectDetailService.getProjectInfo({ seatParams: { projectId: $scope.projectId } }, function (res) {
                        res.data.files.forEach(function (item) {
                            item.contentType = changeFileType(item, 'fileName');
                            item.thumbnailPath = that.getThumbnail(item.filePath) + '?filename='+item.fileName;
                        });
                        that.projectInfo = res.data;
                        that.companyTxt = res.data.companys.map(function (item) {
                            return {
                                companyId: item.companyId,
                                companyRole: item.type,
                                companyName: item.type != 3 ? item.companyName + '(' + item.companyCode + ')' : item.companyName
                            };
                        });
                        that.companyCodes = res.data.companys.map(function (item) {
                            // return item.companyName + '(' + item.companyId + ')' + item.type;
                            return item.companyId + '' + item.type;
                        });
                        that.pictureModel.picture = res.data.files.map(function (item) {
                            return {
                                name: item.fileName,
                                picUrl: item.filePath,
                                picUrlID: {
                                    id: item.fileId,
                                    path: item.filePath,
                                    type: item.contentType
                                }
                            };
                        });
                        that.projectStatus = res.data.status;
                        that.firstResultContent = res.data.firstAuditMsg;
                        sessionStorage.setItem('status', res.data.status);
                        sessionStorage.setItem('projectFileNum', that.pictureModel.picture.length);
                        that.orgName = res.data.orgName;
                    });
                },
                // 获取业务类型
                getBusinessType: function () {
                    projectDetailService.getBusinessType({ urlParams: { catalog: 'biz.trade.businesstype' } }, function (res) {
                        if (res.errorCode === 0) {
                            selectFactory({
                                data: res,
                                id: 'businessType',
                                showTextField: 'name',
                                attrTextField: {
                                    'ng-value': 'code'
                                },
                                attrTextId: function (code) {
                                    $scope.projectInfo.bizTypeCode = code;
                                    $scope.$apply();
                                },
                                attrTextModel: function (value) {
                                    $scope.bizTypeName = value;
                                    $scope.$apply();
                                }
                            });
                        }
                    });
                },
                // 获取组织机构
                moveUserGroup: function () {
                    function loadDataEdit() {
                        if ($('#userSelectGroup').length == 1) {
                            $('#userSelectGroup').remove();
                            if ($('#userSelectGroupBox .slimScrollDiv').length > 0) {
                                $('#userSelectGroupBox')
                                    .find('.slimScrollDiv')
                                    .remove();
                            }
                            $('#userSelectGroupBox').append('<div id="userSelectGroup"></div>');
                        }

                        $('#userSelectGroup').nestable({
                            iconOpen: 'icon-organization-Open', // 带加号图标
                            iconClose: 'icon-organization-Close', // 带减号图标
                            iconSeat: 'icon-organization', // 无展开图标
                            userCount: '',
                            isMove: true,
                            isOperate: true,
                            isRoot: true,
                            childUrl: Interface.getUrlById('logistics.treeChildUrl'),
                            isSearch: false,
                            treeScrollHeight: $('#userSelectGroupBox.user-prompt-box')
                        });
                    }

                    $(document).promptBox({
                        title: '选择负责部门',
                        isHidden: true,
                        isNest: true,
                        loadData: function () {
                            loadDataEdit();
                        },
                        content: {
                            nest: $('#userSelectGroupBox')
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_prompt_confirm'),
                                operationEvent: function () {
                                    $('input[name=orgNameInfo]').val($('#userSelectGroup .dd3-content.active').data('orgname'));
                                    $('#orgName').val($('#userSelectGroup .dd3-content.active').data('orgname'));
                                    $scope.orgName = $('#userSelectGroup .dd3-content.active').data('orgname');
                                    $scope.projectInfo.orgId = $('#userSelectGroup .dd3-content.active')
                                        .parent()
                                        .data('uid');
                                    $('#orgName').css('borderColor', '');
                                    $scope.orgNameError = false;
                                    $(document).promptBox('closeSlideBox');
                                }
                            }
                        ]
                    });
                },
                // 获取企业名称
                showPrompt: function (type) {
                    if (type == 1) {
                        this.choseEnterprise = true;
                        var that = this;
                        $scope.roleEle = selectFactory({
                            data: relationshipEnterprise,
                            id: 'enterpriseRole',
                            showTextField: 'name',
                            attrTextField: {
                                'ng-value': 'code'
                            },
                            closeLocalSearch: true,
                            defaultText: '',
                            attrTextId: function (code) {
                                that.company.type = code;
                                that.companySelected.companyRole = code;
                                var nextEle = $scope.roleEle.next;
                                nextEle.clearData();
                                $scope.enterprise.companyName.$viewValue = false;
                                $scope.companyCodeRepeat = false;
                                $scope.enterprise.companyName.errorTips = '';
                                var config = {
                                    module: $scope.legacyBusinessType,
                                    code: code
                                };
                                $scope.platCode = code;
                                projectDetailService.getEnterpriseName(config, function (res) {
                                    if (res.errorCode === 0) {
                                        if ($scope.platCode != 3) {
                                            res.data.forEach(function (item) {
                                                item.nameCode = item.name + '(' + item.code + ')';
                                            });
                                        } else {
                                            res.data.forEach(function (item) {
                                                item.nameCode = item.name;
                                            });
                                        }
                                        $scope.nameEle.setData(res);
                                    } else {
                                        $scope.nameEle.setData([]);
                                    }
                                });
                                that.company.companyId = '';
                                that.companySelected.companyName = '';
                                $scope.$apply();
                            }
                        });
                        $scope.nameEle = selectFactory({
                            data: [],
                            id: 'enterpriseName',
                            showTextField: 'nameCode',
                            isSearch: true,
                            closeLocalSearch: true,
                            pagination: true,
                            attrTextField: {
                                'ng-value': 'id'
                            },
                            defaultText: '请选择',
                            searchPlaceHoder: function () {
                                switch (parseInt($scope.platCode, 10)) {
                                    case 1:
                                        return '请输入供应商名称或编码';
                                    case 2:
                                        return '请输入账户名称或编码';
                                    default:
                                        return '请输入平台名称';
                                }
                            },
                            attrTextId: function (code) {
                                var repeat = '';
                                // code + type 去重
                                $.each($scope.companyTxt,function(index,val){
                                    if(val.companyId == code && val.companyRole == $scope.platCode){
                                        repeat = true;
                                        return;
                                    }
                                });
                                if ($scope.companyCodes && $scope.companyCodes.indexOf(code + $scope.platCode) !== -1) {
                                    repeat = true;
                                }
                                if (repeat && code) {
                                    $scope.enterprise.companyName.$viewValue = true;
                                    $scope.enterprise.companyName.$error.defined = true;
                                    $scope.enterprise.companyName.$dirty = true;
                                    $scope.enterprise.companyName.errorTips = '所选企业已存在';
                                    $scope.companyCodeRepeat = true;
                                    return;
                                } else {
                                    $scope.enterprise.companyName.$viewValue = false;
                                    $scope.companyCodeRepeat = false;
                                    delete $scope.enterprise.companyName.$error.defined;
                                    $scope.enterprise.companyName.$dirty = false;
                                    $scope.enterprise.companyName.errorTips = '';
                                }
                                that.company.companyId = code;
                                $scope.$apply();
                            },
                            attrTextModel: function (name) {
                                that.companySelected.companyName = name;
                                $scope.$apply();
                            },
                            onSearchValueChange: function (attachEvent, data, currentPage) {
                                if ($scope.platCode === 3) {
                                    return;
                                }
                                var config = {
                                    module: $scope.legacyBusinessType,
                                    code: $scope.platCode,
                                    urlParams: { q: data, pageIndex: currentPage ? currentPage : 1 }
                                };
                                projectDetailService.getEnterpriseName(config, function (res) {
                                    if (res.errorCode === 0) {
                                        if ($scope.platCode != 3) {
                                            res.data.forEach(function (item) {
                                                item.nameCode = item.name + '(' + item.code + ')';
                                            });
                                        } else {
                                            res.data.forEach(function (item) {
                                                item.nameCode = item.name;
                                            });
                                        }
                                        $scope.nameEle.setData(res);
                                    } else {
                                        $scope.nameEle.setData([]);
                                    }
                                });
                                $scope.$apply();
                            }
                        });
                        $scope.roleEle.next = $scope.nameEle;
                    }
                    if (type == 3) {
                        if ($scope.projectAction == 1 || !$scope.identity.includes(1) || $scope.approvalInfo.finalManId) {
                            return;
                        }
                        this.addFinalCheck = true;
                    }
                },
                closePrompt: function (type) {
                    $scope.companyCodeRepeat = false;
                    if (type == 1) {
                        this.choseEnterprise = false;
                        this.company = { type: '', companyId: '' };
                        this.companySelected = { companyRole: '', companyName: '' };
                        // $scope.roleEle.clearData();
                        $scope.nameEle.clearData();
                        // 清除angular表单脏值检测
                        $scope.enterprise.$setPristine();
                        $scope.enterprise.$setUntouched();
                    }
                    if (type == 3) {
                        this.finalResultContent = '';
                        this.finalResult = 'true';
                        this.addFinalCheck = false;
                        $scope.FinalCheck.$setPristine();
                        $scope.FinalCheck.$setUntouched();
                    }
                },
                // 异步校验项目代码
                checkProjectCode: function (code) {
                    if ($scope.projectBasic.projectCode.$viewValue && $scope.projectBasic.projectCode.$error.defined && $scope.projectBasic.projectCode.$dirty) {
                        return;
                    }
                    var config = {
                        seatParams: { id: '', code: code }
                    };
                    projectDetailService.checkProjectCode(config, function (res) {
                        if (res.errorCode !== 0) {
                            $scope.projectCodeRepeat = true;
                            $scope.projectBasic.projectCode.$viewValue = true;
                            $scope.projectBasic.projectCode.$error.defined = true;
                            $scope.projectBasic.projectCode.$dirty = true;
                            $scope.projectBasic.projectCode.errorTips = res.msg;
                        } else {
                            $scope.projectCodeRepeat = false;
                            $scope.projectBasic.projectCode.$dirty = false;
                        }
                    });
                },

                /**
             * 保存干系企业/终审意见
             * @params type: 1 => 干系企业, 3 => 终审意见
             */
                savePrompt: function (type) {
                    if (type == 1) {
                        if (!$scope.companySelected.companyRole) {
                            $scope.enterprise.companyRole.$setDirty();
                        }
                        if (!$scope.companySelected.companyName) {
                            $scope.enterprise.companyName.$setDirty();
                        }
                        if (!$scope.enterprise.$valid) {
                            return;
                        }
                        if ($scope.companyCodeRepeat) {
                            return;
                        }
                        this.projectInfo.companys.push(this.company);
                        // code + type 去重
                        $scope.companyCodes = this.projectInfo.companys.map(function (item) {
                            return item.companyId + item.type;
                        });
                        this.companyTxt.push(this.companySelected);
                    }
                    if (type == 3) {
                        if (!$scope.finalResultContent) {
                            $scope.FinalCheck.finalResultContent.$setDirty();
                        }
                        if (!$scope.finalResult) {
                            $scope.finalResultError = true;
                            $scope.FinalCheck.finalResult.$setDirty();
                        }
                        if (!$scope.FinalCheck.$valid) {
                            return;
                        }
                        if (!$scope.projectId) {
                            return;
                        }
                        var config = {
                            seatParams: { projectId: $scope.projectId },
                            urlParams: {
                                finalAuditMsg: $scope.finalResultContent,
                                isPass: $scope.finalResult
                            }
                        };
                        projectDetailService.postFinalApproval(config, function (res) {
                            if (res.errorCode === 0) {
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: res.msg,
                                    type: 'success'
                                });
                                $scope.getApprovalStatus();
                                $scope.$apply();
                            } else {
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: res.msg,
                                    type: 'errer',
                                    manualClose: true
                                });
                            }
                        });
                    }
                    this.closePrompt(type);
                },
                delCompany: function (index) {
                    $(document).promptBox({
                        title: '提示',
                        type: 'success',
                        content: {
                            tip: '确认删除选中企业?'
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_pagination_confirm'),
                                application: 'confirm',
                                operationEvent: function () {
                                    $scope.companyTxt.splice(index, 1);
                                    $scope.projectInfo.companys.splice(index, 1);
                                    $scope.companyCodes.splice(index, 1);
                                    $(document).promptBox('closePrompt');
                                    $(document).promptBox({
                                        isDelay: true,
                                        contentDelay: '删除成功！',
                                        type: 'success'
                                    });
                                    $scope.$apply();
                                }
                            }
                        ]
                    });
                },
                showUploadFile: function (type) {
                    $scope.addProjectFile = type;
                },
                // 检查文件名是否填写
                checkFileName: function (name) {
                    var value = this['single' + name + 'File'].name;
                    if (value.length) {
                        if (!/^([\w\u4E00-\u9FA5_\\-]+)+$/.test(value) || !/\S+$/g.test(value)) {
                            this[name + 'FileNameError'] = true;
                        } else {
                            this[name + 'FileNameError'] = false;
                        }
                    } else {
                        this[name + 'FileNameError'] = false;
                    }
                },
                // 检查文件描述是否填写
                checkFileRemark: function (e, name) {
                    if (!this['single' + name + 'File'].remark) {
                        if (e) {
                            e.preventDefault();
                        }
                        this[name + 'FileRemarkError'] = true;
                    } else {
                        this[name + 'FileRemarkError'] = false;
                    }
                },
                getFile: function (el) {
                    var that = this;
                    var result = pictureService.uploadFile($scope.pictureModel, $scope[el.target.id]);
                    if (!result) {
                        return false;
                    }
                    if (result.errorlocal) {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: result.errorlocal,
                            type: 'errer',
                            manualClose: true
                        });
                    } else {
                        $scope.uploadDisabled = true;
                        result.then(function (res) {
                            if (res.data.errorCode === 0) {
                                // res.data.data为图片对应的 picUrlID
                                $scope.pictureModel = pictureService.updateModel($scope.pictureModel, res.data.data);
                                res.data.data.type = changeFileType(res.data.data, 'name');
                                $scope['single' + el.target.id].fileId = res.data.data.id;
                                $scope['single' + el.target.id].filePath = res.data.data.path;
                                $scope['single' + el.target.id].contentType = res.data.data.type;
                                $scope['single' + el.target.id].name = $scope['single' + el.target.id].name ? $scope['single' + el.target.id].name : res.data.data.name;
                                if (el.target.id == 'projectFile') {
                                    $scope.singleprojectFile.thumbnailPath = that.getThumbnail($scope.singleprojectFile.filePath) + '?filename='+res.data.data.name;
                                    $scope.projectInfo.files.push($scope.singleprojectFile);
                                    $scope.singleprojectFile = {
                                        fileId: '',
                                        name: '',
                                        remark: '',
                                        url: '',
                                        status: 'new'
                                    };
                                }
                                if (el.target.id == 'contractFile') {
                                    if ($scope.singlecontractFile.fileId) {
                                        projectDetailService.uploadProjectFile(
                                            {
                                                seatParams: {
                                                    projectId: $scope.projectId,
                                                    type: 3
                                                },
                                                urlParams: $scope.singlecontractFile
                                            },
                                            function (res) {
                                                if (res.errorCode === 0) {
                                                    $scope.singlecontractFile.thumbnailPath = that.getThumbnail($scope.singlecontractFile.filePath);
                                                    $scope.contractFiles.push($scope.singlecontractFile);
                                                    $scope.singlecontractFile = {
                                                        fileId: '',
                                                        name: '',
                                                        remark: '',
                                                        url: ''
                                                    };
                                                    $scope.getFileList(3);
                                                } else {
                                                    $(document).promptBox({
                                                        isDelay: true,
                                                        contentDelay: res.msg,
                                                        type: 'errer',
                                                        manualClose: true
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                                $scope.addProjectFile = 0;
                                $scope.uploadDisabled = false;
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: res.data.msg,
                                    type: 'success'
                                });
                            } else {
                                $(document).promptBox({
                                    isDelay: true,
                                    contentDelay: res.data.msg,
                                    type: 'errer',
                                    manualClose: true
                                });
                                $scope.uploadDisabled = false;
                            }
                        });
                    }
                },
                getThumbnail:function(image){
                    if(image.indexOf('150x150') != -1) {
                        var idx = image.lastIndexOf('.');
                        var picName = image.substring(0, idx);
                        var picType = image.substring(idx, image.length);
                        var index = picName.lastIndexOf('_');
                        var picUrl = image.substring(0, index);
                        image = picUrl + picType;
                    }
                    return image
                },
                getPictureUrl: function (fileid) {
                    $('#slides').picturePreview({ pictureId: fileid }, $scope.pictureModel.picture);
                },
                // 删除项目文件
                delFile: function (index, type) {
                    $(document).promptBox({
                        title: '提示',
                        type: 'success',
                        content: {
                            tip: '确认删除选中文件?'
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_pagination_confirm'),
                                application: 'confirm',
                                operationEvent: function () {
                                    if (type == 1) {
                                        $scope.projectInfo.files.splice(index, 1);
                                        $scope.pictureModel.picture.splice(index, 1);
                                        $(document).promptBox('closePrompt');
                                        $(document).promptBox({
                                            isDelay: true,
                                            contentDelay: '删除成功！',
                                            type: 'success'
                                        });
                                        $scope.$apply();
                                    }
                                    if (type == 3) {
                                        var id = $scope.contractFiles[index].id;
                                        projectDetailService.delContractFile(
                                            {
                                                seatParams: {
                                                    projectId: $scope.projectId,
                                                    id: id
                                                }
                                            },
                                            function (res) {
                                                if (res.errorCode === 0) {
                                                    $scope.getFileList(3);
                                                    $(document).promptBox('closePrompt');
                                                    $(document).promptBox({
                                                        isDelay: true,
                                                        contentDelay: res.msg,
                                                        type: 'success'
                                                    });
                                                    $scope.$apply();
                                                } else {
                                                    $(document).promptBox({
                                                        isDelay: true,
                                                        contentDelay: res.msg,
                                                        type: 'errer',
                                                        manualClose: true
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                            }
                        ]
                    });
                },

                /**
             * 上传项目文件
             * @params type 1 => 项目, 2 => 问询, 3 => 合同
             */
                getFileList: function (type) {
                    var that = this;
                    if (!$scope.projectId) {
                        return;
                    }
                    projectDetailService.getProjectFile(
                        {
                            seatParams: { projectId: $scope.projectId },
                            urlParams: { type: type }
                        },
                        function (res) {
                            if (type == 3) {
                                $scope.contractFiles = res.data.map(function (item) {
                                    return {
                                        id: item.id,
                                        fileId: item.fileId,
                                        name: item.name,
                                        filename: item.fileName,
                                        remark: item.remark,
                                        filePath: item.filePath,
                                        thumbnailPath: that.getThumbnail(item.filePath),
                                        contentType: item.contentType
                                    };
                                });
                                for (var i = 0, len = res.data.length; i < len; i++) {
                                    $scope.pictureModel.picture.push({
                                        name: res.data[i].fileName,
                                        picUrl: that.getThumbnail(res.data[i].filePath),
                                        picUrlID: {
                                            id: res.data[i].fileId,
                                            path: that.getThumbnail(res.data[i].filePath),
                                            type: res.data[i].contentType
                                        }
                                    });
                                }
                                $scope.pictureModel = pictureService.updateModel($scope.pictureModel, res.data);
                            }
                        }
                    );
                },
                // 保存项目信息
                saveProjectInfo: function (submit) {
                    if (!$scope.projectInfo.name) {
                        $scope.projectBasic.projectName.$setDirty();
                    }
                    if (!$scope.projectInfo.code) {
                        $scope.projectBasic.projectCode.$setDirty();
                    }
                    if (!$scope.projectInfo.profile) {
                        $scope.projectBasic.projectProfile.$setDirty();
                    }
                    if (!$scope.projectInfo.value) {
                        $scope.projectBasic.projectValue.$setDirty();
                    }
                    if (!$scope.projectInfo.risk) {
                        $scope.projectBasic.projectRisk.$setDirty();
                    }
                    if ($scope.projectStatus == 4) {
                        if (!$scope.projectInfo.summary) {
                            $scope.projectBasic.projectSummary.$setDirty();
                        }
                    }
                    if (!$scope.projectInfo.orgId) {
                        scrollToErrorView($(".tab-content"));
                        $scope.orgNameError = true;
                        return;
                    }
                    if (!$scope.projectBasic.$valid) {
                        scrollToErrorView($(".tab-content"));
                        return;
                    }
                    var params = this.projectInfo;
                    var companyList = params.companys.map(function (item) {
                        return item.type;
                    });
                    if (unique(companyList).length < 2) {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: '至少选择两个干系企业且各个企业角色不相同',
                            type: 'errer',
                            manualClose: true
                        });
                        return;
                    }
                    if (!params.files.length) {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: '请上传项目文件',
                            type: 'errer',
                            manualClose: true
                        });
                        return;
                    }
                    if (typeof params.bizTypeCode === 'string') {
                        params.bizTypeCode = params.bizTypeCode === 'trade' ? 2 : 1;
                    }
                    var config;
                    if ($scope.projectStatus != 4) {
                        if (!$scope.projectId) {
                            config = {
                                urlParams: params,
                                seatParams: { issubmit: submit },
                                isNew: true
                            };
                        } else {
                            config = {
                                urlParams: params,
                                seatParams: {
                                    projectId: $scope.projectId,
                                    issubmit: submit
                                },
                                isNew: false
                            };
                        }
                        if (submit == 'true') {
                            $(document).promptBox({
                                title: '提示',
                                type: 'success',
                                content: {
                                    tip: '确定项目内容无误并提交审核？'
                                },
                                operation: [
                                    {
                                        type: 'submit',
                                        description: Lang.getValByKey('common', 'common_pagination_confirm'),
                                        application: 'confirm',
                                        operationEvent: function () {
                                            projectDetailService.sendProjectInfo(config, function (res) {
                                                if (res.errorCode === 0) {
                                                    $(document).promptBox('closePrompt');
                                                    $(document).promptBox({
                                                        isDelay: true,
                                                        contentDelay: res.msg,
                                                        type: 'success'
                                                    });
                                                    setTimeout(function () {
                                                        $scope.goBack();
                                                    }, 1500);
                                                } else {
                                                    $(document).promptBox({
                                                        isDelay: true,
                                                        contentDelay: res.msg,
                                                        type: 'errer',
                                                        manualClose: true
                                                    });
                                                }
                                            });
                                            $scope.$apply();
                                        }
                                    }
                                ]
                            });
                        } else {
                            projectDetailService.sendProjectInfo(config, function (res) {
                                if (res.errorCode === 0) {
                                    $(document).promptBox({
                                        isDelay: true,
                                        contentDelay: res.msg,
                                        type: 'success'
                                    });
                                    setTimeout(function () {
                                        $scope.goBack();
                                    }, 1500);
                                } else {
                                    $(document).promptBox({
                                        isDelay: true,
                                        contentDelay: res.msg,
                                        type: 'errer',
                                        manualClose: true
                                    });
                                }
                            });
                        }
                    } else {
                        if (!$scope.projectId) {
                            return;
                        }
                        if (!$scope.contractFiles.length) {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: '请上传合同文件',
                                type: 'errer',
                                manualClose: true
                            });
                            $scope.tab.toggle(2);
                        } else {
                            $(document).promptBox({
                                title: '提示',
                                type: 'success',
                                content: {
                                    tip: '确定结束此项目吗？'
                                },
                                operation: [
                                    {
                                        type: 'submit',
                                        description: Lang.getValByKey('common', 'common_pagination_confirm'),
                                        application: 'confirm',
                                        operationEvent: function () {
                                            // 合同文件 type = 3
                                            $scope.contractFiles.forEach(function (item) {
                                                item.type = 3;
                                            });
                                            var files = [];
                                            var fileNum = sessionStorage.getItem('projectFileNum');
                                            if ($scope.projectInfo.files.length > fileNum) {
                                                files = $scope.projectInfo.files.splice(fileNum);
                                            }
                                            // 项目文件 type = 1
                                            files.forEach(function (item) {
                                                item.type = 1;
                                            });
                                            config = {
                                                seatParams: { projectId: $scope.projectId },
                                                urlParams: {
                                                    summary: $scope.projectInfo.summary,
                                                    files: files.concat($scope.contractFiles)
                                                }
                                            };
                                            projectDetailService.sendsProjectSummary(config, function (res) {
                                                if (res.errorCode === 0) {
                                                    $(document).promptBox({
                                                        isDelay: true,
                                                        contentDelay: res.msg,
                                                        type: 'success'
                                                    });
                                                    setTimeout(function () {
                                                        $scope.goBack();
                                                    }, 1500);
                                                } else {
                                                    $(document).promptBox({
                                                        isDelay: true,
                                                        contentDelay: res.msg,
                                                        type: 'errer',
                                                        manualClose: true
                                                    });
                                                }
                                            });
                                            $scope.$apply();
                                        }
                                    }
                                ]
                            });
                        }
                    }
                },
                // 显示初审报告
                showFirstReport: function () {
                    // if ($scope.projectAction == 1) return;
                    this.isFirstCheck = true;
                    $scope.tab.toggle(0);
                },
                // 隐藏初审报告
                hideFirstReport: function () {
                    this.isFirstCheck = false;
                    $scope.tab.toggle(1);
                },
                // 提交初审意见
                postFirstApproval: function () {
                    if (!$scope.firstResultContent) {
                        $scope.firstCheckError = true;
                        return;
                    }
                    $(document).promptBox({
                        title: '提示',
                        type: 'success',
                        content: {
                            tip: '确认提交终审?'
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_pagination_confirm'),
                                application: 'confirm',
                                operationEvent: function () {
                                    var config = {
                                        seatParams: { projectId: $scope.projectId },
                                        urlParams: {
                                            firstAuditMsg: $scope.firstResultContent
                                        }
                                    };
                                    projectDetailService.postFirstApproval(config, function (res) {
                                        if (res.errorCode === 0) {
                                            $scope.hideFirstReport();
                                            $(document).promptBox('closePrompt');
                                            $(document).promptBox({
                                                isDelay: true,
                                                contentDelay: res.msg,
                                                type: 'success'
                                            });
                                            $scope.goBack();
                                            $scope.$apply();
                                        } else {
                                            $(document).promptBox({
                                                isDelay: true,
                                                contentDelay: res.msg,
                                                type: 'errer',
                                                manualClose: true
                                            });
                                        }
                                    });
                                }
                            }
                        ]
                    });
                },
                // 跳转
                jumpTo: function () {
                    if (!$scope.projectId) {
                        return;
                    }
                    sessionStorage.setItem('identityName', arguments[1]);
                    sessionStorage.setItem('isPass', +arguments[3]);
                    if ($scope.projectAction == 1 && (arguments[2] || arguments[4]) || $scope.projectAction == 2 && this.identity != 0) {
                        sessionStorage.setItem(
                            'detailPath',
                            location.hash
                                .split('&')
                                .slice(0, 2)
                                .join('&')
                        );
                        top.location.href = 'http://' + location.host + arguments[0] + '?id=' + $scope.projectId;
                    }
                },
                // 查看供应商详情
                goSeeSupplier: function (id) {
                    sessionStorage.setItem(
                        'detailPath',
                        location.hash
                            .split('&')
                            .slice(0, 2)
                            .join('&')
                    );
                    top.location.href = 'http://' + location.host + '#/supplier?module=trade&id=' + id;
                }
            };

            $scope = Object.assign($scope, $scopeExtend);

            if ($scope.legacyBusinessType) {
                $scope.projectInfo.bizTypeCode = $scope.legacyBusinessType;
                $scope.bizTypeName = $scope.legacyBusinessType === 'logistics' ? '物流' : '贸易';
            } else {
                $scope.getBusinessType();
            }

            $scope.getLanguage();
            $scope.getProjectInfo();
            $scope.getApprovalStatus();
            $scope.getFileList(3);
            $scope.tab = $('#m-tab').tab({ callback: clearData });

            function clearData() {
                // if ($scope.addProjectFile != 3) return;
                if ($scope.projectStatus && $scope.addProjectFile == 3) {
                    $scope.addProjectFile = 0;
                    $scope.singlecontractFile = {
                        fileId: '',
                        filePath: '',
                        thumbnailPath: '',
                        name: '',
                        remark: ''
                    };
                    $scope.$apply();
                }
            }
            function changeFileType(file, type) {
                var fCode, fileType;
                if (file[type]) {
                    var index = Number(file[type].lastIndexOf('.') + 1);
                    fCode = file[type].substr(index).toUpperCase();
                }
                if (fCode === 'DOC' || fCode == 'DOCX' || fCode === 'DOT' || fCode === 'DOTX') {
                    fileType = 'application/msword';
                }
                if (fCode === 'XLS' || fCode === 'XLT' || fCode === 'XLSX' || fCode === 'XLTX') {
                    fileType = 'application/vnd.ms-excel';
                }
                if (fCode === 'JPG' || fCode === 'JPEG' || fCode === 'PNG' || fCode === 'BMP' || fCode === 'TIFF') {
                    fileType = 'image';
                }
                if (fCode === 'PDF') {
                    fileType = 'pdf';
                }
                return fileType;
            }

            if ($scope.projectStatus < 4) {
                $scope.tab.disable(2);
            }

            if (!$scope.isFirstCheck && window.parseUrl.getParams().tab) {
                $scope.tab.toggle(window.parseUrl.getParams().tab);
            }

            if ($scope.projectStatus == 1 && !$scope.projectInfo.isReject) {
                $scope.tab.exdisable(0);
            }

            $scope.goBack = function () {
                var backPath = sessionStorage.getItem('managePath');
                top.location.href = 'http://' + location.host + backPath;
            };
        }
    ]);
});


// Object.assign polyfill
if (typeof Object.assign !== 'function') {
    Object.assign = function (target, varArgs) {
        'use strict';
        if (target == null) {
            // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

// 数组去重
function unique(arr) {
    var ret = [];
    var hash = {};
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var key = typeof item + item;
        if (hash[key] !== 1) {
            ret.push(item);
            hash[key] = 1;
        }
    }
    return ret;
}

// Array.includes polyfill
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (len === 0) {
                return false;
            }
            var n = fromIndex | 0;
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                if (o[k] === searchElement) {
                    return true;
                }
                k++;
            }
            return false;
        }
    });
}
