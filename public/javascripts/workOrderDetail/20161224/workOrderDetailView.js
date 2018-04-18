app.factory('workOrderDetailView', [
    'pictureService',
    'workOrderDetailService',
    function (pictureService, workOrderDetailService) {
        var workOrderDetailView = {
            maxUpload: 9,
            goBack: function (isSave) {
                if (!easySpa.queryUrlValByKey('id') && !isSave) {
                    $(document).promptBox({
                        title: Lang.getValByKey('common', 'common_prompt_title'),
                        type: 'warning',
                        content: {
                            tip: Lang.getValByKey('common', 'common_back_confirm')
                        },
                        cancelDescription: Lang.getValByKey('common', 'common_back_no'),
                        operation: [
                            {
                                type: 'submit',
                                application: 'delete',
                                description: Lang.getValByKey('common', 'common_back_yes'),
                                operationEvent: function () {
                                    $(document).promptBox('closePrompt');
                                    if (easySpa.queryUrlValByKey('fromMenu')) {
                                        if(easySpa.queryUrlValByKey('customerType') == 'anony'){    //匿名用户留言返回
                                            top.location.href =
                                                'http://' +
                                                location.host +
                                                '/#/customerMessageDetail?id=' +
                                                easySpa.queryUrlValByKey('askboradid') +
                                                '&status=' +
                                                easySpa.queryUrlValByKey('status') +
                                                '&userName=' +
                                                easySpa.queryUrlValByKey('userName') +
                                                '&customerType=' +
                                                easySpa.queryUrlValByKey('customerType') +
                                                '&anonyTel=' +
                                                easySpa.queryUrlValByKey('anonyTel') +
                                                '&anonymity=' +
                                                easySpa.queryUrlValByKey('anonymity') +
                                                '&refCustomerCode=' +
                                                easySpa.queryUrlValByKey('refCustomerCode');
                                        }else if(easySpa.queryUrlValByKey('customerType') == 'login'){    //登录用户留言返回
                                            top.location.href =
                                                'http://' +
                                                location.host +
                                                '/#/customerMessageDetail?id=' +
                                                easySpa.queryUrlValByKey('askboradid') +
                                                '&status=' +
                                                easySpa.queryUrlValByKey('status') +
                                                '&userName=' +
                                                easySpa.queryUrlValByKey('userName') +
                                                '&customerType=' +
                                                easySpa.queryUrlValByKey('customerType') +
                                                '&refCustomerId=' +
                                                easySpa.queryUrlValByKey('refCustomerId') +
                                                '&refCustomerCode=' +
                                                easySpa.queryUrlValByKey('refCustomerCode');
                                        }
                                    }
                                    if (!easySpa.queryUrlValByKey('orderNo')) {
                                        location.href = '#/workOrder';
                                    } else {
                                        top.location.href = 'http://' + location.host + '/#/confirmOrder?orderNum=' + easySpa.queryUrlValByKey('orderNo');
                                    }
                                }
                            }
                        ]
                    });
                } else {
                    if (easySpa.queryUrlValByKey('fromMenu')) {
                        top.location.href =
                            'http://' +
                            location.host +
                            '/#/customerMessageDetail?id=' +
                            easySpa.queryUrlValByKey('askboradid') +
                            '&status=' +
                            easySpa.queryUrlValByKey('status') +
                            '&userName=' +
                            easySpa.queryUrlValByKey('userName') +
                            '&customerType=' +
                            easySpa.queryUrlValByKey('customerType') +
                            '&refCustomerId=' +
                            easySpa.queryUrlValByKey('refCustomerId') +
                            '&refCustomerCode=' +
                            easySpa.queryUrlValByKey('refCustomerCode');
                    }
                    if (!easySpa.queryUrlValByKey('orderNo')) {
                        location.href = '#/workOrder';
                    } else {
                        top.location.href = 'http://' + location.host + '/#/confirmOrder?orderNum=' + easySpa.queryUrlValByKey('orderNo');
                    }
                }
            },
            initWorkOrderTypeSelect: function ($scope, data) {
                var self = this;
                setTimeout(function () {
                    selectFactory({
                        data: data,
                        id: 'type',
                        showTextField: 'name',
                        attrTextField: {
                            'ng-value': 'code'
                        },
                        defaultText: Lang.getValByKey('common', 'common_select_tips'),
                        maxHeight: 160,
                        attrTextModel: function (name) {

                            $scope.workOrderDetailModel.typeName = name;
                            if (name) {
                                $scope.refAskBoardIdInvalidTip = '';
                                $scope.orderNoInvalidTip = '';
                                $scope.workOrderDetailModel.anonyTel = '';
                                $scope.workOrderDetailModel.anonymity = '';
                                $("#anonymity").removeAttr("disabled");
                                $("#anonyTel").removeAttr("disabled");
                                $('#type').removeClass('error').removeClass('ng-dirty');
                                $('#refAskBoardId').removeClass('error').removeClass('ng-dirty');
                                $('#orderNo').removeClass('error').removeClass('ng-dirty');
                                // $scope.checkWorkOrder();
                            }
                            $scope.$apply();
                        },
                        attrTextId: function (code) {
                            $scope.workOrderDetailModel.type = code;
                            $scope.workOrderDetailModel.orderNo = '';
                            $scope.workOrderDetailModel.refAskBoardId = '';
                            $scope.workOrderDetailModel.waybillNo = '';
                            // if (code === '0' || code === '1') {
                            //     $scope.workOrderDetailModel.orderNo = '';
                            // }
                            // if (code === '2') {
                            //     $scope.workOrderDetailModel.refAskBoardId = '';
                            // }
                            // if (code === '3') {
                            //     $scope.workOrderDetailModel.orderNo = '';
                            //     $scope.workOrderDetailModel.refAskBoardId = '';
                            // }
                            $scope.$apply();
                        }
                    });
                }, 1);
            },
            initStaffSelect: function ($scope) {
                var getData = function (q, currentPage) {
                    var params = {
                        urlParams: {
                            q: q || '',
                            pageIndex: currentPage || 1,
                            pageSize: 10
                        }
                    };
                    var data = workOrderDetailService.getStaffList(params);
                    angular.forEach(data.data, function (value, key) {
                        value.fullName += '(' + value.code + ')';
                    });
                    return data;
                };
                var staffSelectEle = selectFactory({
                    data: [],
                    id: 'transactor',
                    isSearch: true,
                    showTextField: 'fullName',
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    maxHeight: 160,
                    isNotUseFilter: true,
                    closeLocalSearch: true,
                    isSaveInputVal: true,
                    searchPlaceHoder: '请输入姓名或工号',
                    defaultCount: 10,
                    pagination: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        var resultList = getData(data, currentPage);
                        attachEvent.setData(resultList);
                        // attachEvent.setDefaultCount(resultList.length);
                    },
                    attrTextModel: function (name, data) {
                        if (name) {
                            var typeName = data.data.find(function (item) {
                                return item.fullName == name;
                            });
                            $scope.workOrderDetailModel.transactor = typeName.id;
                            $scope.workOrderDetailModel.transactorName = typeName.fullName;
                        } else {
                            $scope.workOrderDetailModel.transactor = '';
                            $scope.workOrderDetailModel.transactorName = '';
                        }
                        $scope.$apply();
                    }
                });
                // staffSelectEle.setData(getData());
                staffSelectEle.open();
            },
            setWorkOrderStatus: function ($scope, data) {
                $scope.workOrderDetailModel.workOrderStauts = data[0].action;
                $scope.workOrderDetailModel.workOrderStautsName = data[0].actionName;
                if ($scope.workOrderDetailModel.workOrderStauts % 5 == 0) {
                    $scope.workOrderDetailModel.action = '2';
                }
            },
            setWorkOrderDetail: function ($scope, data) {
                $scope.workOrderDetailModel = data.data;
                $scope.workOrderDetailModel.flowList = data.data.csrWorkOrderTransactionDtos;
                this.setWorkOrderStatus($scope, data.data.csrWorkOrderTransactionDtos);
            },
            uploadFile: function ($scope) {
                $scope.pictureModel = {
                    edit: true, // 是否编辑状态
                    uploadShow: true, // 是否显示上传按钮图标
                    picture: [], // 图片存放地址
                    accept: 'image/jpg,image/jpeg,image/png,image/bmp,image/tiff'
                };
                $scope.getFile = function (files) {
                    var length = files.length;
                    var picLength = $scope.pictureModel.picture.length;
                    if (length + picLength > pictureService.maxUpload) {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: Lang.getValByKey('workOrderDetail', 'supplier_prompt_tip_picture_one') + pictureService.maxUpload + Lang.getValByKey('workOrderDetail', 'supplier_prompt_tip_picture_two'),
                            type: 'errer',
                            manualClose: true
                        });
                        return false;
                    }
                    for (var i = 0; i < length; i++) {
                        var result = pictureService.uploadFile($scope.pictureModel, files[i]);

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
                            result.then(function (res) {
                                if (res.data.errorCode === 0) {
                                    // res.data.data为图片对应的 picUrlID
                                    $scope.validatePictureError = false;
                                    $scope.pictureModel = pictureService.updateModel($scope.pictureModel, res.data.data);

                                    $(document).promptBox({ isDelay: true, contentDelay: res.data.msg, type: 'success' });
                                } else {
                                    $(document).promptBox({
                                        isDelay: true,
                                        contentDelay: res.data.msg,
                                        type: 'errer',
                                        manualClose: true
                                    });
                                }
                            });
                        }
                    }
                };
            },
            collectData: function ($scope) {
                var attachList = $scope.pictureModel.picture.map(function (item) {
                    return item.picUrlID.id;
                });
                if($scope.blockOrder){
                    $scope.workOrderDetailModel.type = 4
                }
                return {
                    type: $scope.workOrderDetailModel.type, // 工单类型    0 售前 1 售后 2修改订单 3其他
                    refAskBoardId: $scope.workOrderDetailModel.leaveMsgId, // 留言板ID
                    waybillNo: $scope.workOrderDetailModel.waybillNo, // 运单号

                    anonymity: $scope.workOrderDetailModel.anonymity, // 匿名者名称
                    anonyTel: $scope.workOrderDetailModel.anonyTel, // 匿名者联系方式
                    title: $scope.workOrderDetailModel.title, // 标题
                    content: $scope.workOrderDetailModel.content, // 问题描述
                    attachFileIds: attachList, // 附件
                    priority: $scope.workOrderDetailModel.priority, // 优先级 0 一般 1 紧急 2 非常紧急
                    transactor: $scope.workOrderDetailModel.transactor, // 当前处理人

                    creator: 0, // 工单创建者ID
                    customerUserId: 0, // 子账号ID
                    fileGroupId: '', // 文件组ID
                    id: $scope.workOrderDetailModel.id,
                    status: $scope.workOrderDetailModel.status, // 0 已创建 1 处理中 2 已处理 3已关闭
                    workOrderCode: $scope.workOrderDetailModel.workOrderCode // 工单编号
                };
            },
            collectHandleData: function ($scope) {
                var attachList = $scope.pictureModel.picture.map(function (item) {
                    return item.picUrlID.id;
                });
                return {
                    action: $scope.workOrderDetailModel.action, // 动作 0：转交 1：提交建议 2：接受处理 3：完结 4：关闭 5：创建并转交
                    refWorkorderId: $scope.workOrderDetailModel.id,
                    sendTo: $scope.workOrderDetailModel.sendTo || $scope.workOrderDetailModel.transactor, // 下一个处理人
                    attachFileIds: attachList, // 保存时候使用
                    suggest: $scope.workOrderDetailModel.suggest
                };
            },
            unlockInput: function () {
                $('#anonymity').removeAttr('disabled');
                $('#anonyTel').removeAttr('disabled');
            },
            lockInput: function () {
                $('#anonymity').attr('disabled', 'true');
                $('#anonyTel').attr('disabled', 'true');
            }
        };
        return workOrderDetailView;
    }
]);
