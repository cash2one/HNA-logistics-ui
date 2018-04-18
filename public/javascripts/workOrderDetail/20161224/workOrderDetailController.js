easySpa.require([
    'widget/select',
    'widget/prompt',
    'public/common/pictureController.js',
    'widget/slides'
], function(){
    app.controller('workOrderDetailCtrl', [
        '$scope',
        'workOrderDetailService',
        'workOrderDetailView',
        '$route',
        function ($scope, workOrderDetailService, workOrderDetailView, $route) {
            var showMsg = function (msg, type) {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: msg,
                    type: type,
                    time: 3000,
                    manualClose: type === 'errer'
                });
            };
            $.extend($scope, {
                workOrderDetailModel: {},
                blockOrder: false,
                workOrderPriority: {
                    2: Lang.getValByKey('workOrderDetail', 'workOrderDetail_label_veryUrgent'),
                    1: Lang.getValByKey('workOrderDetail', 'workOrderDetail_label_urgent'),
                    0: Lang.getValByKey('workOrderDetail', 'workOrderDetail_label_normal')
                },
                flowMenu: {
                    0: Lang.getValByKey('workOrderDetail', 'workOrderDetail_flow_0'),
                    1: Lang.getValByKey('workOrderDetail', 'workOrderDetail_flow_1'),
                    2: Lang.getValByKey('workOrderDetail', 'workOrderDetail_flow_2'),
                    3: Lang.getValByKey('workOrderDetail', 'workOrderDetail_flow_3'),
                    4: Lang.getValByKey('workOrderDetail', 'workOrderDetail_flow_4'),
                    5: Lang.getValByKey('workOrderDetail', 'workOrderDetail_flow_5')
                },
                contentRemainWords: 1000,
                suggestRemainWords: 140,
                goBack: function (isSave) {
                    workOrderDetailView.goBack(isSave);
                },

                /* initWorkOrderTypeSelect: function () {
                 workOrderDetailService.getWorkOrderTypeList('', function (res) {
                 console.log(res);
                 selectFactory({
                 data: res,
                 id: 'type',
                 // isUsePinyin: true,
                 // isSaveInputVal: true,
                 showTextField: 'name',
                 attrTextField: {
                 'ng-value': 'code'
                 },
                 defaultText: Lang.getValByKey('common', 'common_select_tips'),
                 maxHeight: 160,
                 attrTextModel: function (name) {
                 if (name) {
                 var typeName = res.data.find(function (item) {
                 return item.name === name;
                 });
                 $scope.workOrderDetailModel.type = typeName.code;
                 $scope.workOrderDetailModel.typeName = typeName.name;
                 // self.clearNameAndTel($scope);
                 // $scope.workOrderDetailModel.orderNo = "";
                 // $scope.workOrderDetailModel.refAskBoardId = "";
                 }
                 // $scope.refAskBoardIdInvalidTip = "";
                 // $scope.orderNoInvalidTip = "";
                 // $scope.workOrderDetailModel.anonyTel = "";
                 // $scope.workOrderDetailModel.anonymity = "";
                 $scope.checkWorkOrder();
                 $scope.$apply();
                 },
                 attrTextId: function (code) {
                 if (code === 0 || code === 1) {
                 $scope.workOrderDetailModel.orderNo = '';
                 }
                 if (code === 2) {
                 $scope.workOrderDetailModel.refAskBoardId = '';
                 }
                 if (code === 3) {
                 $scope.workOrderDetailModel.orderNo = '';
                 $scope.workOrderDetailModel.refAskBoardId = '';
                 }
                 $scope.$apply();
                 console.log(code, $scope.workOrderDetailModel.orderNo, $scope.workOrderDetailModel.refAskBoardId);
                 }
                 });
                 });
                 }, */
                // 初始化工单类型select选框
                initWorkOrderTypeSelect: function () {
                    var params = {};
                    var callback = function (res) {
                        if (res.errorCode === 0) {
                            workOrderDetailView.initWorkOrderTypeSelect($scope, res);
                        } else {
                            showMsg(res.msg, 'errer');
                        }
                    };
                    workOrderDetailService.getWorkOrderTypeList(params, callback);
                },
                // 异步效验单号是否存在
                checkWorkOrder: function () {


                    if ($route.current.params.refCustomerCode) {
                        $scope.workOrderDetailModel.refAskBoardId = $route.current.params.refCustomerCode;
                    }
                    if ($route.current.params.waybillNo) {
                        $scope.workOrderDetailModel.waybillNo = $route.current.params.waybillNo;
                    }
                    if (!$scope.workOrderDetailModel.type || !($scope.workOrderDetailModel.refAskBoardId || $scope.workOrderDetailModel.waybillNo)) {
                        return;
                    }
                    var param = {};
                    var callback = null;
                    if ($scope.workOrderDetailModel.refAskBoardId) {
                        param = {
                            seatParams: {
                                code: $scope.workOrderDetailModel.refAskBoardId
                            }
                        };
                        callback = function (res) {
                            if (res.errorCode === 0) {
                                $scope.workOrderDetailModel.anonymity = res.data.customerFullName || res.data.anonymity;
                                $scope.workOrderDetailModel.anonyTel = res.data.customerTelNo || res.data.anonyTel;
                                $scope.workOrderDetailModel.leaveMsgId = res.data.id;


                                $("#anonymity").attr("disabled","disabled");
                                $("#anonyTel").attr("disabled","disabled");

                                setTimeout(function () {
                                    $("#anonymity").attr("disabled","disabled");
                                    $("#anonyTel").attr("disabled","disabled");

                                },500)

                                $('#refAskBoardId').removeClass('error');
                                $scope.refAskBoardIdInvalidTip = '';
                                $scope.orderNoInvalidTip = '';
                                // workOrderDetailView.unlockInput();
                            } else {
                                // workOrderDetailView.lockInput();
                                $scope.workOrderDetailModel.anonymity = '';
                                $scope.workOrderDetailModel.anonyTel = '';
                                $scope.refAskBoardIdInvalidTip = res.msg;
                                $scope.orderNoInvalidTip = '';
                                $('#refAskBoardId').addClass('error');
                            }
                        };
                        workOrderDetailService.checkWorkOrder(param, callback);
                    } else {

                        param = {
                            seatParams: {
                                waybillNo: $scope.workOrderDetailModel.waybillNo
                            }
                        };
                        callback = function (res) {
                            if (res.errorCode === 0) {
                                $scope.workOrderDetailModel.anonymity = res.data.cusFullName;
                                $scope.workOrderDetailModel.anonyTel = res.data.mobilePhone;
                                $("#anonymity").attr("disabled","disabled");
                                $("#anonyTel").attr("disabled","disabled");

                                setTimeout(function () {
                                    $("#anonymity").attr("disabled","disabled");
                                    $("#anonyTel").attr("disabled","disabled");

                                },500)

                                $('#orderNo').removeClass('error');
                                $scope.refAskBoardIdInvalidTip = '';
                                $scope.orderNoInvalidTip = '';
                            } else {
                                $scope.workOrderDetailModel.anonymity = '';
                                $scope.workOrderDetailModel.anonyTel = '';
                                $scope.refAskBoardIdInvalidTip = '';
                                $scope.orderNoInvalidTip = res.msg;
                                $('#orderNo').addClass('error');
                            }
                        };
                        workOrderDetailService.checkorderNo(param, callback);
                    }
                },
                // 获取员工列表
                initStaffSelect: function () {
                    workOrderDetailView.initStaffSelect($scope);
                },
                // 获取工单详情
                getInfoByWorkOrderId: function () {
                    var params = {
                        seatParams: {
                            id: easySpa.queryUrlValByKey('id')
                        }
                    };
                    var callback = function (res) {
                        if (res.errorCode === 0) {
                            workOrderDetailView.setWorkOrderDetail($scope, res);
                        } else {
                            showMsg(res.msg, 'errer');
                        }
                    };
                    workOrderDetailService.getWorkOrderDetailById(params, callback);
                },
                // 图片上传
                uploadFile: function () {
                    workOrderDetailView.uploadFile($scope);
                },
                checkWorkOrderInfo: function (isNotShowMsg) {
                    var flag = false;
                    if (!$scope.createWorkOrderSubmit) {
                        return false;
                    }
                    var checkList = [
                        {
                            id: 'type',
                            modelName: 'typeName'
                        },
                        {
                            id: 'title',
                            modelName: 'title'
                        },
                        {
                            id: 'content',
                            modelName: 'content'
                        },
                        {
                            id: 'transactor',
                            modelName: 'transactor'
                        }
                    ];
                    for (var s = 0, len = checkList.length; s < len; s++) {
                        if (!$scope.workOrderDetailModel[checkList[s].modelName]) {
                            $('#' + checkList[s].id).addClass('error');
                            flag = true;
                        } else {
                            $('#' + checkList[s].id).removeClass('error');
                        }
                    }
                    var nameAndTel = [
                        {
                            id: 'anonymity',
                            modelName: 'anonymity',
                            reg: /^([\w\u4E00-\u9FA5_\-]+)+$/,
                            key: 'anonymityErrorTips',
                            tip: Lang.getValByKey('common', 'common_code_tipsOne')
                        },
                        {
                            id: 'anonyTel',
                            reg: /^([\d_\-\+]+)+$/,
                            modelName: 'anonyTel',
                            key: 'anonyTelErrorTips',
                            tip: Lang.getValByKey('common', 'common_code_tipsThree')
                        }
                    ];
                    for (var t = 0, len2 = nameAndTel.length; t < len2; t++) {
                        if ($scope.workOrderDetailModel[nameAndTel[t].modelName] && !nameAndTel[t].reg.test($scope.workOrderDetailModel[nameAndTel[t].modelName])) {
                            $('#' + nameAndTel[t].id)
                                .addClass('error')
                                .removeClass('notError');
                            $scope[nameAndTel[t].key] = nameAndTel[t].tip;
                            flag = true;
                        } else {
                            $scope[nameAndTel[t].key] = null;
                            $('#' + nameAndTel[t].id)
                                .removeClass('error')
                                .addClass('notError');
                        }
                    }
                    if ($scope.workOrderDetailModel.type == 1 || $scope.workOrderDetailModel.type == 0) {
                        if (!$scope.workOrderDetailModel.refAskBoardId || $scope.refAskBoardIdInvalidTip) {
                            $('#refAskBoardId').addClass('error');
                            flag = true;
                        } else {
                            $('#refAskBoardId').removeClass('error');
                        }
                    } else if ($scope.workOrderDetailModel.type == 2) {
                        if (!$scope.workOrderDetailModel.waybillNo || $scope.orderNoInvalidTip) {
                            $('#orderNo').addClass('error');
                            flag = true;
                        } else {
                            $('#orderNo').removeClass('error');
                        }
                    }
                    if ($scope.workOrderDetailModel.priority == undefined && !isNotShowMsg) {
                        $scope.priorityError = true;
                        // showMsg(Lang.getValByKey("workOrderDetail","workOrderDetail_toast_infoType_null"),'errer');
                        flag = true;
                    }
                    return flag;
                },
                // 创建工单
                createWorkOrder: function () {
                    var flag = false;
                    $scope.createWorkOrderSubmit = true;
                    flag = this.checkWorkOrderInfo();
                    if (flag) {
                        scrollToErrorView($(".wod-main"));
                        return;
                    }
                    var self = this;
                    var params = {
                        urlParams: workOrderDetailView.collectData($scope)
                    };
                    var callback = function (res) {
                        if (res.errorCode === 0) {
                            showMsg(res.msg || Lang.getValByKey('workOrderDetail', 'workOrderDetail_msg_createOk'), 'success');
                            setTimeout(function () {
                                self.goBack(true);
                            }, 3000);
                        } else {
                            showMsg(res.msg, 'errer');
                        }
                    };
                    workOrderDetailService.createWorkOrder(params, callback);
                },
                closeOrDispatch: function () {
                    if ($scope.workOrderDetailModel.action === 3) {
                        // $scope.workOrderDetailModel.transactor = $scope.workOrderDetailModel.creator;
                        $scope.workOrderDetailModel.sendTo = $scope.workOrderDetailModel.creator;
                        $scope.workOrderDetailModel.transactorName = $scope.workOrderDetailModel.creatorFullName;
                    } else if ($scope.workOrderDetailModel.action === 0) {
                        $scope.workOrderDetailModel.transactor = '';
                        $scope.workOrderDetailModel.transactorName = '';
                    }
                },
                changeBlockOrder: function () {
                    $scope.blockOrder = !$scope.blockOrder
                },
                checkHandleInfo: function (isNotShowMsg) {
                    var flag = false;
                    if (!$scope.handleWorkOrderSubmit) {
                        return false;
                    }
                    var action = $scope.workOrderDetailModel.action;
                    var checkList = [
                        {
                            id: 'infoType',
                            modelName: 'action'
                        },
                        {
                            id: 'content',
                            modelName: 'suggest'
                        }
                    ];
                    for (var s = 0, len = checkList.length; s < len; s++) {
                        if ($scope.workOrderDetailModel[checkList[s].modelName] == undefined) {
                            $('#' + checkList[s].id).addClass('error');
                            flag = true;
                        } else {
                            $('#' + checkList[s].id).removeClass('error');
                        }
                    }
                    if ($scope.workOrderDetailModel.action == undefined && !isNotShowMsg) {
                        $scope.actionError = true;
                        flag = true;
                    }
                    if ($scope.workOrderDetailModel.action != 4 && $scope.workOrderDetailModel.action != 3 && !$scope.workOrderDetailModel.transactorName) {
                        $('#transactor').addClass('error');
                        flag = true;
                    }
                    return flag;
                },
                // 处理工单流程
                handleWorkOrder: function () {
                    var flag = false;
                    // return
                    if ($scope.workOrderDetailModel.action != 2) {
                        $scope.handleWorkOrderSubmit = true;
                        flag = this.checkHandleInfo();
                    }
                    if (flag) {
                        return;
                    }
                    var self = this;
                    var data = workOrderDetailView.collectHandleData($scope);
                    // return;
                    var param = {
                        urlParams: data
                    };
                    var callback = function (res) {
                        if (res.errorCode == '0') {
                            showMsg(res.msg || Lang.getValByKey('workOrderDetail', 'workOrderDetail_msg_HandleOk'), 'success');
                            if (data.action == 2) {
                                self.init(true);
                            } else {
                                self.goBack();
                            }
                        } else {
                            showMsg(res.msg, 'errer');
                        }
                    };
                    workOrderDetailService.handleWorkOrder(param, callback);
                },
                jumpTo: function (type) {
                    var url = '';

                    var menuA = '';
                    var customerType = $scope.workOrderDetailModel.customerUserId < 1 ? 'anony' : 'login';

                    switch (type) {
                        case 1:
                            url =
                                '#/customerMessageDetail?id=' +
                                $scope.workOrderDetailModel.refAskBoardId +
                                '&status=true' +
                                '&userName=' +
                                $scope.workOrderDetailModel.customerUserFullName +
                                '&workOrderId=' +
                                $scope.workOrderDetailModel.id +
                                '&fromMenu=workOrderDetail' +
                                '&refCustomerId=' +
                                $scope.workOrderDetailModel.customerUserId +
                                '&customerType=' +
                                customerType +
                                '&anonymity=' +
                                $scope.workOrderDetailModel.anonymity +
                                '&anonyTel=' +
                                $scope.workOrderDetailModel.anonyTel +
                                '&refCustomerCode=' +
                                $scope.workOrderDetailModel.refCustomerCode +
                                '&isJustShow=' +
                                true;
                            break;
                        case 2:
                            url = '#/confirmOrder?orderNum=' + $scope.workOrderDetailModel.orderNo + '&id=' + $scope.workOrderDetailModel.id + '&isJustShow=' + true;
                            break;
                        default:
                            break;
                    }
                    top.location.href = 'http://' + location.host + url;
                },
                init: function (flag) {
                    var self = this;

                    if (!flag) {
                        $scope.initWorkOrderTypeSelect();
                        workOrderDetailService.getWorkOrderTypeList({}, function (res) {
                            if (res.errorCode == '0') {
                                if (easySpa.queryUrlValByKey('fromMenu')) {
                                    $scope.workOrderDetailModel.typeName = res.data[0].name;
                                    $scope.workOrderDetailModel.type = res.data[0].code;
                                    $scope.checkWorkOrder();
                                }
                                if (easySpa.queryUrlValByKey('waybillNo')) {
                                    $scope.workOrderDetailModel.typeName = res.data[2].name;
                                    $scope.workOrderDetailModel.type = res.data[2].code;
                                    $scope.checkWorkOrder();
                                }
                            } else {
                                showMsg(res.msg, 'errer');
                            }
                        });
                        $scope.uploadFile();
                        reSetMenuCssStatus('#/workOrder');
                    }
                    if (easySpa.queryUrlValByKey('id')) {
                        $scope.getInfoByWorkOrderId();
                    }
                    $scope.$watchGroup(
                        [
                            'workOrderDetailModel.title',
                            'workOrderDetailModel.anonymity',
                            'workOrderDetailModel.anonyTel',
                            'workOrderDetailModel.content',
                            'workOrderDetailModel.transactor',
                            'workOrderDetailModel.type',
                            'workOrderDetailModel.priority'
                        ],
                        function () {
                            self.checkWorkOrderInfo(true);
                        }
                    );

                    $scope.$watchGroup(['workOrderDetailModel.action', 'workOrderDetailModel.suggest', 'workOrderDetailModel.transactorName'], function () {
                        self.checkHandleInfo(true);
                    });

                    $('.error').removeClass('error');
                },
                resetRemainWords: function (total, type) {
                    if (type == 1) {
                        $scope.contentRemainWords = total - $scope.workOrderDetailModel.content.length;
                    } else {
                        $scope.suggestRemainWords = total - $scope.workOrderDetailModel.suggest.length;
                    }
                }
            });

            $scope.init();
        }
    ]);
});