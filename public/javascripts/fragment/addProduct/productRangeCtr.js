easySpa.require([
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/prompt',
    'widget/parseUrl',
    'widget/select'
], function () {
    app.controller('productRangeCtr', [
        '$scope',
        'addProductService',
        'tableService',
        function ($scope, addProductService, tableService) {
            $scope.$on('productRangeEvent', function (event, data) {
                // 接受初始化
                $scope.productGroupFirstId = data.productGroupFirstId || '';    //获取产品组ID
                $scope.init();
                $scope.$apply();
            });
            $scope.init = function () {
                var backId = sessionStorage.getItem('backPricePath');
                $scope.parameter = window.parseUrl.getParams();
                $scope.id = $scope.id || $scope.parameter.id;
                $scope.uid = $scope.uid || $scope.parameter.uid;
                if (backId) {
                    $scope.canEditRange = false;
                } else {
                    if ($scope.isAudit) {
                        if ($scope.IsDraftStatus || $scope.isOffline) {
                            $scope.canEditRange = true;
                        }
                    } else {
                        if ($scope.IsDraftStatus) {
                            $scope.canEditRange = true;
                        }
                    }
                }

                getProductBaseInfo($scope.uid);
                // 初始化表格数据
                $scope.productTable = {
                    tableHeader: [
                        Lang.getValByKey('common', 'common_thead_number'),
                        '类型范围',
                        '编码',
                        '创建者',
                        '创建时间',
                        '分区详情',
                        Lang.getValByKey('common', 'common_page_remarks')
                    ],
                    tableBody: [],
                    restURL: 'logistics.getProductRegion',
                    restData: {
                        q: '',
                        pageIndex: 1,
                        pageSize: 10,
                        sort: 'code'
                    },
                    selectNumber: 0,
                    selectFlag: false
                };

                /**
             * 获取表格列表
             */
                $scope.getProductTable = function () {
                    var params = {
                        urlParams: $scope.productTable.restData,
                        seatParams: {
                            id: $scope.id
                        }
                    };

                    tableService.getTable($scope.productTable.restURL, params, function (data) {
                        if (data.errorCode === 0) {
                            data.pagination = {
                                currentPage: 1,
                                currentResult: 0,
                                pageSize: 10,
                                totalPage: 0,
                                totalResult: 0
                            };

                            $scope.productTable = tableService.table($scope.productTable, params, data);

                            var data = $scope.productTable && $scope.productTable.tableBody;
                            if (data.length >= 2) {
                                $scope.disabledAdd = true;
                            } else {
                                $scope.disabledAdd = false;
                            }

                            var height = $('.tab-content').height() - 120;
                            setTimeout(function () {
                                $('.table-container tbody').slimscroll({ height: height });
                                $(window).resize(function () {
                                    height = $('.tab-content').height() - 120;
                                    $('.table-container tbody').slimscroll({ height: height });
                                });
                            }, 10);
                        }
                    });
                };
                $scope.getProductTable();

                /**
             * 添加产品范围
             */
                $scope.add = function () {
                    $scope.eDisabled = false;
                    $scope.sDisabled = false;
                    $scope.showCode = false;
                    var data = $scope.productTable && $scope.productTable.tableBody;

                    if (data) {
                        for (var i = 0, l = data.length; i < l; i++) {
                            if (data[i].type == 's') {
                                $scope.sDisabled = true;
                            } else if (data[i].type == 'e') {
                                $scope.eDisabled = true;
                            }
                        }
                    }
                    if ($scope.sDisabled && $scope.eDisabled) {
                        $scope.rangeRadio = '';
                    } else if ($scope.sDisabled) {
                        // 起点范围已存在
                        $scope.rangeRadio = 'e';
                    } else {
                        // 结束范围已存在 或 起点终点都不存在
                        $scope.rangeRadio = 's';
                    }

                    // 清除angular表单脏值检测
                    $scope.regionForm.$setPristine();
                    $scope.regionForm.$setUntouched();
                    $scope.regionForm.$setUntouched();
                    $scope.isSaveNext = true;

                    $scope.proRegionID = 0;

                    $scope.code = '';
                    $scope.description = '';

                    $(document).promptBox({
                        title: '添加分区方案',
                        loadTitle: function () {
                            return '添加分区方案';
                        },
                        isMiddle: true,
                        isNest: true,
                        content: {
                            nest: $('#regionDetail')
                        },
                        loadData: function () {
                            $('#nest-regionDetail .other-btn button[name="prompt-operation"]')
                                .addClass('save')
                                .removeClass('edit');
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_page_save'),
                                operationEvent: function () {
                                    $scope.saveProductRegion();
                                    $(document).promptBox('closeFormPrompt');
                                    $scope.$apply();
                                }
                            }
                        ]
                    });
                };

                $scope.edit = function (value) {
                    // 非草稿状态不可进行编辑
                    // if ($scope.isOffline) {
                    // } else if (!$scope.editable) { return; }
                    // if (!$scope.isOffline || !$scope.editable) { return; }

                    if (!$scope.$parent.IsDraftStatus && !$scope.$parent.isOffline) {
                        return;
                    }

                    $scope.eDisabled = false;
                    $scope.sDisabled = false;
                    $scope.showCode = true;
                    var data = $scope.productTable && $scope.productTable.tableBody;

                    if (data.length >= 2) {
                        $scope.sDisabled = true;
                        $scope.eDisabled = true;
                    }

                    // 清除angular表单脏值检测
                    $scope.regionForm.$setPristine();
                    $scope.regionForm.$setUntouched();
                    $scope.regionForm.$setUntouched();
                    $scope.isSaveNext = true;
                    $scope.rangeRadio = value.type;

                    $scope.code = value.code;
                    $scope.description = value.remark;
                    $scope.proRegionID = value.id;

                    $(document).promptBox({
                        title: '编辑分区方案',
                        loadTitle: function () {
                            return '编辑分区方案';
                        },
                        isMiddle: true,
                        isNest: true,
                        content: {
                            nest: $('#regionDetail')
                        },
                        loadData: function () {
                            $('#nest-regionDetail .other-btn button[name="prompt-operation"]')
                                .addClass('save')
                                .removeClass('edit');
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_page_save'),
                                operationEvent: function () {
                                    $scope.saveProductRegion();
                                    $scope.$apply();
                                    $(document).promptBox('closeFormPrompt');
                                }
                            }
                        ]
                    });
                };

                /**
             * 新增或编辑保存
             */
                $scope.saveProductRegion = function () {
                    if (!$scope.rangeRadio) {
                        return;
                    }
                    if ($scope.proRegionID && !$scope.code) {
                        $scope.regionForm.code.$setDirty();
                    }
                    if ($('#code-msg').hasClass('remote-invalid') || !$scope.regionForm.$valid) {
                        return;
                    }

                    //产品group-id  1：海运、6：空运、11：速递
                    var addressType = $scope.productGroupFirstId == 1 ? 1 : ($scope.productGroupFirstId == 6 ? 6 : 11);

                    var config = {
                        urlParams: {
                            type: $scope.rangeRadio,
                            productId: $scope.id,
                            code: $scope.code,
                            addressType: addressType,
                            remark: $.trim($scope.description)
                        },
                        seatParams: {}
                    };

                    var name = $scope.rangeRadio == 's' ? '起点范围' : '终点范围';

                    if ($scope.proRegionID) {
                        // 修改

                        config.seatParams.id = $scope.proRegionID;

                        addProductService.putProductRegion(config, function (data) {
                            if (data.errorCode === 0) {
                                $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });

                                if ($scope.isSaveNext) {
                                    // 跳转
                                    $scope.regionDetail(data.data, name);
                                } else {
                                    $scope.getProductTable();
                                }
                            } else {
                                $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                            }
                        });
                    } else {
                        // 新增
                        addProductService.saveProductRegion(config, function (data) {
                            if (data.errorCode === 0) {
                                $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });

                                if ($scope.isSaveNext) {
                                    // 跳转
                                    $scope.regionDetail(data.data, name);
                                } else {
                                    $scope.getProductTable();
                                }
                            } else {
                                $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                            }
                        });
                    }
                };

                /**
             * 查看详情
             * @param schemaUid
             * @param name
             */
                $scope.regionDetail = function (schemaUid, name) {
                    $scope.topParameter = window.parseUrl.getTopParams();
                    $scope.parameter.workId = $scope.topParameter.workId;
                    $scope.parameter.isJustShow = $scope.topParameter.isJustShow;
                    var status = '';
                    if ($scope.parameter.from == 'approval') {
                        // 审核
                        status = ($scope.status == 3 && $scope.canEditRange) ? 1 : $scope.status;
                    } else {
                        status = $scope.status;
                    }

                    if($scope.parameter.orderNo == 'undefined' || !$scope.parameter.orderNo){
                        $scope.parameter.orderNo = '';
                    }
                    window.location.href =
                        '#/regionDetail?schemaId=' + schemaUid +
                        '&name=' + name +
                        '&uid=' + $scope.uid +
                        '&id=' + $scope.id +
                        '&status=' + status +
                        '&q=addProduct&from=' + $scope.parameter.from +
                        '&type=' + $scope.parameter.type +
                        '&index=3' +
                        '&orderNo=' + ($scope.parameter.orderNo || '') +
                        '&workId=' + $scope.parameter.workId +
                        '&isJustShow=' + $scope.parameter.isJustShow +
                        '&productGroupId=' + $scope.productGroupFirstId +
                        '&origin=' + $scope.topParameter.origin;
                };

                /**
             * 删除产品范围
             * @returns {boolean}
             */
                $scope.del = function () {
                    var param = [];

                    var selData = tableService.getSelectTable($scope.productTable.tableBody);

                    if (!selData.length) {
                        $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey('common', 'common_code_noSelected'), type: 'errer', manualClose: true });
                        return false;
                    }

                    // 组织数据
                    angular.forEach(selData, function (val) {
                        param.push(val.id);
                    });

                    var config = {
                        urlParams: param
                    };

                    var opt = {
                        title: Lang.getValByKey('common', 'common_prompt_title'),
                        type: 'warning',
                        content: {
                            tip: '确定删除已选产品范围？'
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_page_delete'),
                                application: 'delete',
                                operationEvent: function () {
                                    addProductService.delProductRegion(config, function (data) {
                                        if (data.errorCode === 0) {
                                            $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'success' });
                                            $(document).promptBox('closePrompt');

                                            // 更新table表数据
                                            $scope.getProductTable();
                                            $scope.$apply();
                                        } else {
                                            $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                                        }
                                    });
                                }
                            }
                        ]
                    };
                    $(document).promptBox(opt);
                };

                $scope.checkCode = function () {
                    var config = {
                        urlParams: {
                            code: $scope.code,
                            id: $scope.proRegionID
                        }
                    };
                    if ($scope.code) {
                        addProductService.checkRegionCode(config, function (data) {
                            if (data.errorCode != 0) {
                                // 编码重复
                                $scope.regionForm.code.errorTips = data.msg;
                                $('#code-msg')
                                    .removeClass('ng-hide')
                                    .addClass('remote-invalid');
                            } else {
                                // 编码不重复
                                $('#code-msg')
                                    .addClass('ng-hide')
                                    .removeClass('remote-invalid');
                                $scope.regionForm.code.errorTips = '';
                            }
                        });
                    }
                };
            };

            function getProductBaseInfo(uid) {
                addProductService.getProductBaseInfo(uid, function (result) {
                    $scope.productGroupFirstId = result.data.productGroupRootId;
                    $scope.status = result.data.status;
                });
            }
        }
    ]);
});
