easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/tab',
    'widget/parseUrl',
    'widget/select',
    'public/common/tableController.js',
    'public/common/pictureController.js',
    'public/common/areaController.js',
    'public/common/areaService.js',
    'public/javascripts/fragment/supplier/supplierCtrl.js',
    'public/javascripts/fragment/supplier/suppliersService.js',
    'public/javascripts/fragment/selectTypes/selectTypesCtrl.js',
    'public/javascripts/fragment/selectTypes/selectTypesService.js',
], function () {
    app.controller('servicesCtrl', [
        '$scope',
        'servicesService',
        'servicesView',
        'tableService',
        'areaService',
        'suppliersService',
        'pictureService',
        'selectTypesService',
        function ($scope, servicesService, servicesView, tableService, areaService, suppliersService, pictureService, selectTypesService) {
            $scope.tableModel = {
                tableHeader: [
                    Lang.getValByKey('common', 'common_thead_number'),
                    Lang.getValByKey('services', 'services_table_name'),
                    Lang.getValByKey('services', 'services_table_code'),
                    Lang.getValByKey('services', 'services_table_content'),
                    Lang.getValByKey('services', 'services_table_type'),
                    Lang.getValByKey('services', 'services_table_state'),
                ],
                tableBody: [],
                restURL: 'logistics.getServicesList',
                restData: {
                    q: '',
                    status: 1, // 审核状态，全部：0；草稿：1；待审核：2；已审核：3；
                    orderby: 'createtime',
                    pageIndex: 1,
                    pageSize: 10
                },
                selectNumber: 0,
                selectFlag: false,
            };

            var uParams = window.parseUrl.getParams();

            $scope.serviceTitle = Lang.getValByKey('services', 'services_title_add');
            $scope.serviceStateInfo = Lang.getValByKey('services', 'services_state_draft');
            $scope.states = {
                data: [
                    {
                        id: -1,
                        name: Lang.getValByKey('services', 'services_state_all'),
                    },
                    {
                        id: 1,
                        name: Lang.getValByKey('services', 'services_state_draft'),
                    },
                    {
                        id: 2,
                        name: Lang.getValByKey('services', 'services_state_unAudit'),
                    },
                    {
                        id: 3,
                        name: Lang.getValByKey('services', 'services_state_audit'),
                    },
                    {
                        id: 4,
                        name: Lang.getValByKey('services', 'services_status_online'),
                    },
                    {
                        id: 5,
                        name: Lang.getValByKey('services', 'services_status_offline'),
                    },
                ],
            };

            $scope.mainBlock = 'list'; // 首页list; 添加或服务详情页:detail; 供应商:suppler；流转过程:process；

            $scope.setGrey = false;
            $scope.showAuthor = false;
            /** 初始加载服务类型 */
            $scope.$on('$viewContentLoaded', function () {
                servicesService.getServicesTypes(function (response) {
                    if (response.errorCode === 0) {
                        $scope.types = response.data;
                        $scope.typeId = -1; // 默认加载全部分类。大类code
                        $scope.getTypeTable($scope.typeId);
                    }
                });
            });
            function setScrollDetail() {
                $('.white-background .table-container tbody').slimscroll({
                    height: $('.content-main').height() - 250,
                });
            }

            $(window).on('resize', setScrollDetail);

            /* 校验预估实效格式start*/
            $scope.checkEstimatedTime = function () {
                setTimeout(function () {
                    if ($('#estimatedTime').hasClass('ng-invalid')) {
                        $('#estimatedTime').addClass('check-error');
                        $scope.validateEstimatedTimeError = true;
                    } else {
                        $('#estimatedTime').removeClass('check-error');
                        $scope.validateEstimatedTimeError = false;
                    }
                    $scope.$apply();
                }, 200);
            };
            $scope.checkWeightLimitMin = function () {
                var weightLimitMin = $('#weightLimitMin').val();
                if (weightLimitMin.indexOf('.') > -1) {
                    weightLimitMin = weightLimitMin.substring(0, weightLimitMin.indexOf('.') + 4);
                    $scope.weightLimitMin = $.trim(weightLimitMin);
                }
                setTimeout(function () {
                    if ($('#weightLimitMin').hasClass('ng-invalid')) {
                        $('#weightLimitMin').addClass('check-error');
                        $scope.validateWeightError = true;
                        $('#validateWeightError').html('请输入数字和小数点，可精确到小数点后3位');
                    } else if ($scope.weightLimitMax && !$('#weightLimitMax').hasClass('ng-invalid') && parseFloat($scope.weightLimitMin) > parseFloat($scope.weightLimitMax)) {
                        $('#weightLimitMin').addClass('check-error');
                        $scope.validateWeightError = true;
                        $('#validateWeightError').html('下限必须小于等于上限值');
                    } else {
                        $('#weightLimitMin').removeClass('check-error');
                        $scope.validateWeightError = false;
                    }
                    $scope.$apply();
                }, 200);
            };
            $scope.checkWeightLimitMax = function () {
                var weightLimitMax = $('#weightLimitMax').val();
                if (weightLimitMax.indexOf('.') > -1) {
                    weightLimitMax = weightLimitMax.substring(0, weightLimitMax.indexOf('.') + 4);
                    $scope.weightLimitMax = $.trim(weightLimitMax);
                }
                setTimeout(function () {
                    if ($('#weightLimitMax').hasClass('ng-invalid')) {
                        $('#weightLimitMin').addClass('check-error');
                        $scope.validateWeightError = true;
                        $('#validateWeightError').html('请输入数字和小数点，可精确到小数点后3位');
                    } else if ($scope.weightLimitMin && !$('#weightLimitMin').hasClass('ng-invalid') && parseFloat($scope.weightLimitMin) > parseFloat($scope.weightLimitMax)) {
                        $('#weightLimitMin').addClass('check-error');
                        $scope.validateWeightError = true;
                        $('#validateWeightError').html('下限必须小于等于上限值');
                    } else {
                        $('#weightLimitMin').removeClass('check-error');
                        $scope.validateWeightError = false;
                    }
                    $scope.$apply();
                }, 200);
            };

            /* 校验预估实效格式end*/
            // 服务list列表信息
            $scope.getTypeTable = function (id, $event) {
                switch (id) {
                    case 'ST001':
                        $scope.currentTypeData = {
                            code: 'ST001',
                            name: '揽收',
                        };
                        break;
                    case 'ST002':
                        $scope.currentTypeData = {
                            code: 'ST002',
                            name: '仓储',
                        };
                        break;
                    case 'ST003':
                        $scope.currentTypeData = {
                            code: 'ST003',
                            name: '清关',
                        };
                        break;
                    case 'ST004':
                        $scope.currentTypeData = {
                            code: 'ST004',
                            name: '干线',
                        };
                        break;
                    case 'ST005':
                        $scope.currentTypeData = {
                            code: 'ST005',
                            name: '配送',
                        };
                        break;
                    case 'ST006':
                        $scope.currentTypeData = {
                            code: 'ST006',
                            name: '综合',
                        };
                        break;
                    default:
                        $scope.currentTypeData = {code: '', name: ''};
                }

                // 点击分类事件,清理搜索条件
                if ($event) {
                    $scope.seniorChecked = false;
                    $scope.showSenior = false;
                    $scope.tableModel.restData.status = 1;
                    $scope.tableModel.restData.pageIndex = 1;
                    $scope.q = '';
                    $scope.tableModel.restData.q = '';
                    $scope.serviceStateInfo = Lang.getValByKey('services', 'services_state_draft');
                }

                $scope.typeId = id;

                var params = {
                    seatParams: {serviceTypeId: $scope.typeId},
                    urlParams: $scope.tableModel.restData,
                };

                tableService.getTable($scope.tableModel.restURL, params, function (data) {
                    if (data.errorCode === 0) {
                        $scope.tableModel = tableService.table($scope.tableModel, params, data);

                        tableReData();

                        setScrollDetail();
                    }
                });
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
                    tableReData();
                },
                true
            );

            function tableReData() {
                $scope.disabled = false;
                angular.forEach($scope.tableModel.tableBody, function (value, key) {
                    if (value.areas && value.areas.length) {
                        $scope.tableModel.tableBody[key].serviceArea = '';
                        for (var i = 0, len = value.areas.length; i < len; i++) {
                            if ($scope.tableModel.tableBody[key].serviceArea) {
                                $scope.tableModel.tableBody[key].serviceArea += '，' + sliceLastNode(value.areas[i].name, '/');
                            } else {
                                $scope.tableModel.tableBody[key].serviceArea += sliceLastNode(value.areas[i].name, '/');
                            }
                        }
                    }
                    if (value.checkbox && value.status != 1) {
                        $scope.disabled = true;
                    }
                });
            }

            /**
             * 状态下拉列表
             */
            $scope.initStateSelectList = function () {
                var data = $scope.states;
                selectFactory({
                    data: data,
                    id: 'serviceState',
                    defaultText: '',
                    attrTextModel: function (name) {
                        var stateData;
                        if (!name) {
                            stateData = {};
                        } else {
                            stateData = getSigleDataByName(name, data);
                        }
                        $scope.serviceStateInfo = name;
                        $scope.serviceStateId = stateData.id;
                        $scope.tableModel.restData.pageIndex = 1;

                        $scope.tableModel.restData.status = $scope.serviceStateId;
                        $scope.getTypeTable($scope.typeId);
                        $scope.$apply();
                    },
                });
            };

            /** 检索服务 */
            $scope.retrievalList = function () {
                $scope.q = $scope.tableModel.restData.q;
                $scope.tableModel.restData.pageIndex = 1;
                $scope.getTypeTable($scope.typeId);
            };

            $scope.showFlowProcess = function (uid, name) {
                if (!uid) {
                    return;
                }

                $scope.mainBlock = 'process';
                $scope.processTitle = name;

                var config = {
                    seatParams: {
                        uid: uid,
                    },
                };
                servicesService.getServiceProcess(config, function (res) {
                    if (res.errorCode === 0) {
                        $scope.streamList = res.data;
                    }
                });
            };

            /** 添加服务 */
            $scope.addService = function () {
                $scope.serviceTitle = Lang.getValByKey('services', 'services_title_add');
                $scope.validateCodeError = false;
                $scope.mainBlock = 'detail';
                //$scope.infoTab.selected(0);
                $scope.infoTab.exdisable(0);
                //$scope.infoTab.disable(1);
                $scope.visible = false;
                $scope.isVisibleDraft = false; // 显示保存草稿
                $scope.isVisible = false; // 隐藏保存和取消按钮
                $scope.isVisibleEdit = false;
                // $scope.isShowByState = true;
                $scope.setGrey = true;

                $scope.showAuthor = false;

                $scope.nameInfo = '';
                $scope.codeInfo = '';
                $scope.serviceTypeName = $scope.currentTypeData.name;
                $scope.serviceTypeIds = [$scope.currentTypeData.code];
                $scope.subServiceTypeCode = '';
                $scope.subServiceTypeName = '';
                $scope.serviceContentInfo = '';
                $scope.supplierName = '';
                $scope.supplierCode = '';
                $scope.supplierId = '';
                $scope.descriptionInfo = '';
                $scope.estimatedTime = '';
                $scope.weightLimitMin = '';
                $scope.weightLimitMax = '';
                $scope.estimatedUnitValue = '';
                $scope.estimatedUnit = '';
                $scope.weightLimitUnitCode = 'kg';

                // 国家地区
                /** 国家地区id集 */
                $scope.choosedData = [];

                /** 国家地区名称显示 */
                $scope.regionZone = '';
                // 货物类型
                $scope.listGoodsTypeIds = [];
                $scope.goodsTypeIdsInfo = '';

                // 清除angular表单脏值检测
                $scope.serviceForm.$setPristine();
                $scope.serviceForm.$setUntouched();
                setTimeout(function () {
                    $('.from-box').scrollTop(0);
                }, 10);
            };

            $scope.goBack = function () {
                if (uParams.isfromprice) {
                    var priceData = JSON.parse(uParams.priceData);

                    window.location.href = '#/priceDetail?module=' + priceData.module +
                        '&q=' + priceData.q +
                        '&uid=' + priceData.uid +
                        '&type=' + priceData.type;
                    return;
                }

                if (!$scope.visible && $scope.mainBlock != 'process') {
                    $(document).promptBox({
                        title: Lang.getValByKey('common', 'common_prompt_title'),
                        type: 'warning',
                        content: {
                            tip: Lang.getValByKey('common', 'common_back_confirm'),
                        },
                        cancelDescription: Lang.getValByKey('common', 'common_back_no'),
                        operation: [
                            {
                                type: 'submit',
                                application: 'delete',
                                description: Lang.getValByKey('common', 'common_back_yes'),
                                operationEvent: function () {
                                    $scope.mainBlock = 'list';
                                    $scope.getTypeTable($scope.typeId);
                                    $scope.$apply();
                                    $(document).promptBox('closePrompt');
                                },
                            },
                        ],
                    });
                } else {
                    $scope.mainBlock = 'list';
                    $scope.getTypeTable($scope.typeId);
                }
            };

            /** 异步校验编码 */
            $scope.validateCode = function () {
                if (!$scope.codeInfo) {
                    return;
                }
                var id;
                if ($scope.isVisibleDraft == false) {
                    id = '';
                } else {
                    id = $scope.serviceId;
                }

                var config = {
                    urlParams: {
                        code: $scope.codeInfo,
                        uid: id,
                    },
                };
                servicesService.validateServiceCode(config, function (response) {
                    if (response.errorCode === 0) {
                        $scope.validateCodeError = false;
                    } else {
                        $scope.validateCodeError = true;
                    }
                });
            };
            $scope.removeValidateCode = function () {
                $scope.validateCodeError = false;
            };

            // 校验预估时效

            // 校验重量

            /** ================添加服务类型================= */

            $scope.selectServiceTypes = function () {

                var data, typesEle;

                /** 检索国家事件 */
                data = servicesService.getServicesTypeList();

                data && data.data.splice(0, 1);

                typesEle = selectFactory({
                    data: data,
                    id: 'serviceType',
                    isUsePinyin: true,
                    attrTextModel: function (name, res) {
                        var typesData;
                        if (!name) {
                            typesData = {};
                        } else {
                            typesData = getSigleDataByName(name, res);
                        }
                        if (typesData.code === 'ST004') {
                            $scope.subServiceTypeCode = 'MAINLINEAIR';
                            $scope.subServiceTypeName = '空运';
                        }
                        $scope.serviceTypeIds = [typesData.code];
                        $scope.serviceTypeName = typesData.name;

                        $scope.$apply();
                        clearNextAddress(typesEle);
                    },
                });
            };

            // 添加时效类型

            $scope.selectTimeTypes = function () {
                servicesService.getProductEstimated(null, function (result) {
                    $scope.estimatedList = result.data;
                    selectFactory({
                        data: result,
                        id: 'intenTimeType',
                        attrTextField: {
                            'ng-value': 'code',
                        },
                        attrTextId: function (code) {
                            $scope.estimatedUnit = code;
                            $scope.$apply();
                        },
                        attrTextModel: function (name) {
                            $scope.estimatedUnitValue = name;
                            $scope.$apply();
                        },
                    });
                });
            };

            /** ================添加货物类型============= */
            $scope.selectGoodTypes = function () {
                $(document).promptBox({
                    isHidden: true,
                    title: Lang.getValByKey('services', 'services_placeholder_goods_type'),
                    isNest: true,
                    loadData: function () {
                        loadGoodsData();
                    },
                    content: {
                        nest: $('#getUnGoodTypes'),
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_prompt_confirm'),
                            operationEvent: function () {
                                submitGoodsTypes();
                            },
                        },
                    ],
                });
            };

            $scope.selectTypesModel = {
                selectedGoods: [],
                listGoodsTypes: $scope.listGoodsTypes,
            };

            function loadGoodsData() {
                $scope.selectTypesModel.selectedGoods = [];
                servicesService.getGoodTypes(function (response) {
                    if (response.errorCode === 0) {
                        var sid = $scope.listGoodsTypeIds;

                        for (var i in response.data) {
                            response.data[i].id = response.data[i].code;
                            response.data[i].checked = false;
                            for (var j in sid) {
                                if (response.data[i].id == sid[j]) {
                                    response.data[i].checked = true;
                                }
                            }
                        }

                        var typeData = [];
                        for (var k in response.data) {
                            if (response.data[k].name) {
                                typeData.push(response.data[k]);
                            }
                        }
                        $scope.selectTypesModel.listGoodsTypes = typeData;
                        $scope.selectTypesModel = selectTypesService.init($scope.selectTypesModel);
                    }
                });
            }

            function submitGoodsTypes() {
                var types = $('#getUnGoodTypes input.active');
                var arr = [];
                var arrName = '';
                types.each(function (i) {
                    arr.push(types.eq(i).data('id'));
                    if (i == types.length - 1) {
                        arrName += types.eq(i).parent().data('name');
                    } else {
                        arrName += types.eq(i).parent().data('name') + '，';
                    }
                });

                $scope.goodsTypeIdsInfo = arrName;
                $scope.listGoodsTypeIds = arr;

                $(document).promptBox('closeFormPrompt');
                $scope.$apply();
            }

            /** ================添加货物类型 end============= */

            /** 检索供应商 */
            function clearNextAddress(currentEle) {
                var nextEle = currentEle.next;
                if (nextEle == null) {
                    return;
                }
                nextEle.clearData();
                nextEle.id = null;
                return clearNextAddress(nextEle);
            }

            function rebuildName(data) {
                if (!data) {
                    return;
                }
                for (var index = 0; index < data.length; index++) {
                    data[index].name = data[index].name + '(' + data[index].code + ')';
                }
            }

            $scope.getSupplierListData = function (q, currentPage) {
                if (!currentPage) {
                    currentPage = 1;
                }

                q = q ? q : '';
                var config = {
                    urlParams: {
                        q: q,
                        "pageIndex": currentPage,
                        "pageSize": 10
                    }
                };
                return servicesService.serviceGetSupplier(config);
            };
            $scope.getSupplierList = function () {
                $scope.supplierDatas = servicesService.serviceGetSupplier();

                rebuildName($scope.supplierDatas.data);

                var supplierEle = selectFactory({
                    data: $scope.supplierDatas,
                    id: 'supplier',
                    isSearch: true,
                    isUsePinyin: true,
                    searchPlaceHoder: "请输入名称或编码",
                    defaultText: Lang.getValByKey("common", "common_select_tips"),
                    closeLocalSearch: true,
                    pagination: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        var suppliers = $scope.getSupplierListData(data, currentPage);
                        rebuildName(suppliers.data);
                        attachEvent.setData(suppliers);
                    },
                    attrTextModel: function (name, data) {
                        var supplierData;
                        if (!name) {
                            supplierData = {};
                        } else {
                            supplierData = getSigleDataByName(name, data);
                        }

                        $scope.supplierId = supplierData.id;

                        if (!supplierData.name) {
                            $scope.supplierName = '';
                        } else {
                            $scope.supplierName = supplierData.name.split('，')[0];
                        }

                        $('#supplier').val($scope.supplierName);
                        $scope.$apply();
                        clearNextAddress(supplierEle);
                    },
                });

                supplierEle.setData($scope.supplierDatas);
                supplierEle.open();
                $('#supplier').val($scope.supplierName);
            };

            /** 查看服务详情 */
            $scope.editServiceDetail = function (id) {
                $scope.serviceTitle = Lang.getValByKey('services', 'services_title_detail');
                $scope.validateCodeError = false;
                $scope.mainBlock = 'detail';
                $scope.infoTab.selected(0);
                $scope.infoTab.enableAll();
                $scope.visible = true;
                $scope.isVisibleDraft = true;
                $scope.isVisible = false;

                $scope.showAuthor = true;

                $scope.serviceId = id;
                $scope.serviceSpanInfo(id);

                // 清除angular表单脏值检测
                $scope.serviceForm.$setPristine();
                $scope.serviceForm.$setUntouched();
                setTimeout(function () {
                    $('.from-box').scrollTop(0);
                }, 10);
            };
            $scope.serviceSpanInfo = function (id) {
                var config = {
                    seatParams: {uid: id},
                };
                servicesService.getServiceById(config, function (res) {
                    if (res.errorCode === 0) {
                        $scope.serviceData = res.data;

                        if ($scope.serviceData.status != 1) {
                            // 非草稿状态
                            $scope.setGrey = true;
                            // $scope.isShowByState = false;
                            $scope.isVisibleEdit = false; // 隐藏编辑按钮
                        } else {
                            // 草稿状态
                            $scope.setGrey = false; // 提交审核按钮不置灰
                            // $scope.isShowByState = true; // 显示提交审核按钮
                            $scope.isVisibleEdit = true; // 显示编辑按钮
                        }
                        $scope.serviceStateId = $scope.serviceData.status;
                        $scope.name = $scope.serviceData.name;
                        $scope.code = $scope.serviceData.code;
                        $scope.serviceTypeName = $scope.serviceData.serviceTypeName;
                        $scope.serviceTypeIds = $scope.serviceData.serviceTypeCodes;
                        $scope.subServiceTypeCode = $scope.serviceData.subServiceTypeCode;
                        switch ($scope.serviceData.subServiceTypeCode) {
                            case 'MAINLINESHIP':
                                $scope.subServiceTypeName = '海运';
                                break;
                            case 'MAINLINEAIR':
                                $scope.subServiceTypeName = '空运';
                                break;
                            case 'MAINLINEOTHER':
                                $scope.subServiceTypeName = '其他';
                                break;
                            default:
                                break;
                        }
                        $scope.id = $scope.serviceData.id;
                        $scope.lineName = $scope.serviceData.lineName ? $scope.serviceData.lineName + '(' + $scope.serviceData.lineCode + ')' : '';
                        $scope.lineId = $scope.serviceData.lineId;
                        $scope.className = $scope.serviceData.className;
                        $scope.classIds = $scope.serviceData.classId;
                        $scope.serviceContent = $.trim($scope.serviceData.serviceContent);
                        $scope.supplierName = $scope.serviceData.supplierName;
                        $scope.supplierId = $scope.serviceData.supplierId;
                        $scope.supplierCode = $scope.serviceData.supplierCode;
                        $scope.description = $.trim($scope.serviceData.description);
                        $scope.userName = $.trim($scope.serviceData.userName);
                        $scope.createTime = $.trim($scope.serviceData.createTime);
                        $scope.estimatedTime = $scope.serviceData.estimatedTime;
                        $scope.estimatedUnit = $scope.serviceData.estimatedUnit;
                        $scope.estimatedUnitValue = $scope.serviceData.estimatedUnitName;
                        $scope.weightLimitMin = $scope.serviceData.weightLimitMin;
                        $scope.weightLimitMax = $scope.serviceData.weightLimitMax;
                        $scope.weightLimitUnitCode = $scope.serviceData.weightLimitUnitCode;
                        $scope.getFlightsData($scope.lineId, false);
                        // 国家地区
                        /** 国家地区id集 */
                        $scope.choosedData = [];
                        var map = {};
                        angular.forEach($scope.serviceData.areas, function (value) {
                            map = {
                                figureCode: value.figureCode,
                                name: value.name.split('/')[value.name.split('/').length - 1],
                            };
                            $scope.choosedData.push(map);
                        });

                        /** 国家地区名称显示 */
                        var inputStr = '';
                        angular.forEach($scope.choosedData, function (value) {
                            inputStr += '，' + value.name.split('/')[value.name.split('/').length - 1];
                        });

                        inputStr ? inputStr = inputStr.slice(1) : '';
                        $scope.regionZone = inputStr;
                        // 货物类型
                        $scope.listGoodsTypeIds = $scope.serviceData.cargoTypes;
                        $scope.goodsTypeIdsInfo = $scope.serviceData.cargoTypeName;
                    }
                });
            };
            $scope.getWeightRule = function(id){
                var config = {
                    seatParams: {id: id},
                };
                servicesService.getServiceWeightRule(config,function(res){
                    if(res.errorCode === 0){
                        if(res.data){
                            $scope.isVolume = res.data.isVolume ? 'true' : 'false';
                            $scope.isremarkVolume = res.data.isVolume ? "是" : "否";
                            $scope.showVolumeDetail = res.data.isVolume ? true : false;
                            $scope.volumeFactor = res.data.volumeFactor;
                            $scope.weightValueTye = res.data.weightValueTye;
                            
                            if(res.data.weightValueTye === 'max'){
                                $scope.weightValueName = "实重和体积重取最大";
                            }else if(res.data.weightValueTye === 'min'){
                                $scope.weightValueName = "实重和体积重取最小";
                            }else {
                                $scope.weightValueName = "";
                            }
                        }else {
                            $scope.isVolume = false;
                            $scope.isremarkVolume = '否';
                            $scope.showVolumeDetail = false;
                            $scope.volumeFactor = '';
                            $scope.weightValueTye = '';
                            return;
                        }
                    }
                    
                });
            }
            /** 编辑服务详情 */
            $scope.editService = function () {
                // 清除angular表单脏值检测
                $scope.serviceForm.$setPristine();
                $scope.serviceForm.$setUntouched();

                $scope.setGrey = true;
                $scope.validateCodeError = false;
                $scope.visible = false;
                $scope.isVisible = true;
                $scope.isVisibleEdit = false;

                var config = {
                    seatParams: {uid: $scope.serviceId},
                };
                servicesService.getServiceById(config, function (res) {
                    if (res.errorCode === 0) {
                        $scope.serviceData = res.data;

                        $scope.nameInfo = $scope.serviceData.name;
                        $scope.codeInfo = $scope.serviceData.code;
                        $scope.serviceTypeName = $scope.serviceData.serviceTypeName;
                        $scope.serviceTypeIds = $scope.serviceData.serviceTypeCodes;
                        $scope.serviceContentInfo = $.trim($scope.serviceData.serviceContent);
                        $scope.supplierName = $scope.serviceData.supplierName + '(' + $scope.serviceData.supplierCode + ')';
                        $scope.supplierId = $scope.serviceData.supplierId;
                        $scope.supplierCode = $scope.serviceData.supplierCode;
                        $scope.descriptionInfo = $.trim($scope.serviceData.description);
                        $scope.getFlightsData($scope.lineId, true);
                        // 国家地区
                        /** 国家地区id集 */
                        $scope.choosedData = [];
                        var map = {};
                        angular.forEach($scope.serviceData.areas, function (value) {
                            map = {
                                figureCode: value.figureCode,
                                name: value.name.split('/')[value.name.split('/').length - 1],
                            };
                            $scope.choosedData.push(map);
                        });

                        /** 国家地区名称显示 */
                        var inputStr = '';
                        angular.forEach($scope.choosedData, function (value) {
                            inputStr += '，' + value.name.split('/')[value.name.split('/').length - 1];
                        });

                        inputStr ? inputStr = inputStr.slice(1) : '';
                        $scope.regionZone = inputStr;

                        // 货物类型
                        $scope.listGoodsTypeIds = $scope.serviceData.cargoTypes;
                        $scope.goodsTypeIdsInfo = $scope.serviceData.cargoTypeName;
                    }
                });
            };

            /** 服务内容去掉空格 */
            $scope.removeSpace = function () {
                if ($.trim($scope.serviceContentInfo).length) {
                    return true;
                } else {
                    $scope.serviceContentInfo = $.trim($scope.serviceContentInfo);
                }
            };
            $scope.SetIsConsiderVolume = function () {
                if ($scope.isVolume == 'false') {
                    $scope.isremarkVolume = "否";
                    $scope.showVolumeDetail = false;
                    $scope.volumeFactor = '';
                    $scope.weightValueTye = '';
                    
                } else {
                    $scope.isremarkVolume = "是";
                    $scope.showVolumeDetail = true;
                    $scope.volumeFactor = '';
                    $scope.weightValueTye = 'max';
                    $scope.weightValueName = '实重和体积重取最大';
                    
                    //     $scope.data.valueModeCode = 'max';
                    // if($scope.dataOld.valueModeCode){
                    //     $scope.data.valueMode = $scope.dataOld.valueMode;
                    //     $scope.data.valueModeCode = $scope.dataOld.valueModeCode;
                    // }else {
                    //     $scope.data.valueMode = '实重和体积重取最大';
                    //     $scope.data.valueModeCode = 'max';
                    // }
                    // $scope.data.volumeFactor = $scope.dataOld.volumeFactor;
                }
                $scope.ruleForm.$setPristine();
            };
            $scope.initSelect = function() {
                var data = servicesService.getWeightValueMode();
                var weightValueMode = selectFactory({
                    data: data,
                    id: 'type-select-input',
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    attrTextModel: function (name, data, currentItem) {
                        if (!name) {
                            $scope.weightValueTye = '';
                            $scope.weightValueName = '';
                        } else {
                            $scope.weightValueTye = currentItem.code; // 给后台
                            $scope.weightValueName = name;
                            $scope.ruleForm.valueMode.$setPristine();
                        }

                        $scope.$apply();
                    },
                });
            };
            /** 取消服务详情 */
            $scope.cancelService = function () {
                // 清除angular表单脏值检测
                $scope.serviceForm.$setPristine();
                $scope.serviceForm.$setUntouched();

                $scope.setGrey = false;
                $scope.visible = true;
                $scope.isVisible = false;
                $scope.isVisibleEdit = true;
                $scope.validateCodeError = false;

                $scope.serviceSpanInfo($scope.serviceId);
            };
            $scope.cancelWeight = function(){
                $scope.ruleForm.$setPristine();
                $scope.ruleForm.$setUntouched();
                $scope.setGrey = false;
                $scope.visible = true;
                $scope.isVisible = false;
                $scope.isVisibleEdit = true;
                $scope.validateCodeError = false;

                $scope.serviceSpanInfo($scope.serviceId);

                $scope.getWeightRule($scope.id);
            };
            $scope.submitWeight = function(){

                if ($scope.isVolume === 'true' && !$scope.ruleForm.$valid) {
                    if (!$scope.volumeFactor) {
                        $scope.ruleForm.volumeFactor.$setDirty();
                    }
                    if (!$scope.valueMode) {
                        $scope.ruleForm.valueMode.$setDirty();
                    }
                    return;
                }
                var isVolume,volumeFactor;
                if($scope.isVolume === 'true'){
                    isVolume = true;
                }else{
                    isVolume = false;
                }
                if($scope.volumeFactor){
                    volumeFactor = Number($scope.volumeFactor)
                }else{
                    volumeFactor = '';
                }
                var config = {
                    seatParams: {uid: $scope.serviceId},
                    urlParams: {
                        isVolume: isVolume,
                        volumeFactor: volumeFactor,
                        weightValueTye: $scope.weightValueTye
                    }
                };
                servicesService.serviceWeightRule(config,function(res){
                    if (res.errorCode != 0) {
                        // 服务器异常
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true });
                    } else {
                        $scope.isVisible = false;
                        $scope.isVisibleEdit = true;
                        $scope.visible = true;
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: res.msg,
                            type: 'success',
                            time: 3000
                        });
                    }
                });
            };
            /** ================= 国家地区弹框调用事件 =================*/
            /** 选择服务范围 */
            $scope.selectRegion = function () {
                $scope.initCtrl();

                $(document).promptBox({
                    title: Lang.getValByKey('services', 'services_prompt_title_area'),
                    isHidden: true,
                    boxWidth: true,
                    isNest: true,
                    loadData: function () {
                        $scope.loadRegionData();
                    },
                    content: {
                        nest: $('#serviceZone'),
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_prompt_confirm'),
                            operationEvent: function () {
                                $(document).promptBox('closeFormPrompt');

                                /** 国家地区名称显示 */
                                var inputStr = '';
                                angular.forEach($scope.areaModel.selectedData, function (value) {
                                    inputStr += '，' + value.name.split('/')[value.name.split('/').length - 1];
                                });

                                inputStr ? inputStr = inputStr.slice(1) : '';
                                $scope.regionZone = inputStr;

                                /** 国家地区id集 */
                                $scope.choosedData = [];
                                var map = {};
                                angular.forEach($scope.areaModel.selectedData, function (value) {
                                    map = {
                                        figureCode: value.interId,
                                        name: value.name.split('/')[value.name.split('/').length - 1],
                                    };
                                    $scope.choosedData.push(map);
                                });

                                $scope.$apply();
                            },
                        },
                    ],
                });
            };

            /** 初始化areaModel */
            var areaModel = {
                unSelectedData: [], // 待选区数据缓存
                selectedData: [], // 已选区数据缓存
                candidateFlag: false, // 待选区全选按钮勾选状态；true：勾选，false：未勾选。
                selectedFlag: false, // 已选区全选按钮勾选状态；true：勾选，false：未勾选。
            };

            /** loadData */
            $scope.loadRegionData = function () {
                areaModel.unSelectedData = servicesService.getCountry().data;
                areaModel.selectedData = $scope.choosedData;
                $scope.tab.selected(0);
                $scope.areaModel = areaService.initArea(areaModel);
            };

            /** ================= 国家地区弹框调用事件 end =================*/

            /** 新建保存服务 */
            $scope.saveDraftService = function () {
                if (!$scope.nameInfo) {
                    $scope.serviceForm.nameInfo.$setDirty();
                }
                if (!$scope.codeInfo) {
                    $scope.serviceForm.codeInfo.$setDirty();
                }
                if (!$scope.serviceTypeName) {
                    $scope.serviceForm.serviceTypeName.$setDirty();
                }
                if ($scope.serviceTypeIds.indexOf('ST004') !== -1 && !$scope.subServiceTypeName) {
                    $scope.serviceForm.subServiceTypeName.$setDirty();
                }
                if (!$scope.serviceContentInfo) {
                    $scope.serviceForm.serviceContentInfo.$setDirty();
                }
                if (!$scope.regionZone) {
                    // $scope.serviceForm.regionZone.$setDirty();
                }
                if (!$scope.estimatedTime && $scope.estimatedUnitValue) {
                    $scope.serviceForm.estimatedTime.$setDirty();
                }
                if ($scope.estimatedTime && !$scope.estimatedUnitValue) {
                    $scope.serviceForm.estimatedUnit.$setDirty();
                }
                if (!$scope.goodsTypeIdsInfo) {
                    $scope.serviceForm.goodsTypeIdsInfo.$setDirty();
                }
                if (!$scope.goodsTypeIdsInfo) {
                    $scope.serviceForm.goodsTypeIdsInfo.$setDirty();
                }
                if (!$scope.supplierName) {
                    $scope.serviceForm.supplierName.$setDirty();
                }
                // if (!$scope.serviceForm.$valid || $('.check-error').length || $('.ng-invalid').length) {
                //     scrollToErrorView($(".form-box"));
                //     return;
                // }
                if (!$scope.serviceForm.$valid) {
                    scrollToErrorView($(".form-box"));
                    return;
                }

                var config = {
                    urlParams: {
                        name: $scope.nameInfo,
                        code: $scope.codeInfo,
                        serviceTypeCodes: $scope.serviceTypeIds,
                        subServiceTypeCode: $scope.subServiceTypeCode,
                        serviceContent: $.trim($scope.serviceContentInfo),
                        areas: [],
                        cargoTypes: $scope.listGoodsTypeIds,
                        supplierId: $scope.supplierId,
                        estimatedTime: $scope.estimatedTime,
                        estimatedUnit: $scope.estimatedUnit,
                        weightLimitMin: $scope.weightLimitMin,
                        weightLimitMax: $scope.weightLimitMax,
                        weightLimitUnitCode: $scope.weightLimitUnitCode,
                        description: $.trim($scope.descriptionInfo),
                    },
                };

                var map = {};
                angular.forEach($scope.choosedData, function (value) {
                    map = {
                        figureCode: value.figureCode,
                        name: value.name,
                    };
                    config.urlParams.areas.push(map);
                });
                servicesService.addServices(config, function (res) {
                    if (res.errorCode === 0) {
                        $scope.infoTab.enableAll();

                        // $scope.isShowByState = true;
                        $scope.setGrey = false;
                        $scope.isVisibleDraft = true;
                        $scope.isVisible = false;
                        $scope.isVisibleEdit = true;
                        $scope.visible = true;
                        $scope.showAuthor = true;

                        $scope.id = res.id;
                        $scope.isVolume = false;
                        $scope.serviceId = res.data;
                        $scope.serviceSpanInfo(res.data);

                        // 清除angular表单脏值检测
                        $scope.serviceForm.$setPristine();
                        $scope.serviceForm.$setUntouched();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: res.msg,
                            type: 'success',
                        });
                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: res.msg,
                            type: 'errer',
                            manualClose: true,
                        });
                    }
                });
            };

            /** 修改保存服务 */
            $scope.submitService = function () {
                if (!$scope.nameInfo) {
                    $scope.serviceForm.nameInfo.$setDirty();
                }
                if (!$scope.codeInfo) {
                    $scope.serviceForm.codeInfo.$setDirty();
                }
                if (!$scope.serviceTypeName) {
                    $scope.serviceForm.serviceTypeName.$setDirty();
                }
                if ($scope.serviceTypeIds.indexOf('ST004') !== -1 && !$scope.subServiceTypeName) {
                    $scope.serviceForm.subServiceTypeName.$setDirty();
                }
                if (!$scope.estimatedTime && $scope.estimatedUnitValue) {
                    $scope.serviceForm.estimatedTime.$setDirty();
                }
                if ($scope.estimatedTime && !$scope.estimatedUnitValue) {
                    $scope.serviceForm.estimatedUnit.$setDirty();
                }
                if (!$scope.serviceContentInfo) {
                    $scope.serviceForm.serviceContentInfo.$setDirty();
                }
                if (!$scope.goodsTypeIdsInfo) {
                    $scope.serviceForm.goodsTypeIdsInfo.$setDirty();
                }
                if (!$scope.goodsTypeIdsInfo) {
                    $scope.serviceForm.goodsTypeIdsInfo.$setDirty();
                }
                if (!$scope.supplierName) {
                    $scope.serviceForm.supplierName.$setDirty();
                }
                // if (!$scope.serviceForm.$valid || $('.check-error').length || $('.ng-invalid').length) {
                //     scrollToErrorView($(".form-box"));
                //     return;
                // }
                if (!$scope.serviceForm.$valid) {
                    scrollToErrorView($(".form-box"));
                    return;
                }
                if ($scope.weightLimitMsg) {
                    $scope.serviceForm.weightLimitMin.$setDirty();
                    $scope.serviceForm.weightLimitMax.$setDirty();
                    return false;
                }
                var config = {
                    seatParams: {uid: $scope.serviceId},
                    urlParams: {
                        name: $scope.nameInfo,
                        code: $scope.codeInfo,
                        serviceTypeCodes: $scope.serviceTypeIds,
                        subServiceTypeCode: $scope.subServiceTypeCode,
                        serviceContent: $.trim($scope.serviceContentInfo),
                        areas: [],
                        cargoTypes: $scope.listGoodsTypeIds,
                        supplierId: $scope.supplierId,
                        estimatedTime: $scope.estimatedTime,
                        estimatedUnit: $scope.estimatedUnit,
                        weightLimitMin: $scope.weightLimitMin,
                        weightLimitMax: $scope.weightLimitMax,
                        weightLimitUnitCode: $scope.weightLimitUnitCode,
                        description: $.trim($scope.descriptionInfo),
                    },
                };

                var map = {};
                angular.forEach($scope.choosedData, function (value) {
                    map = {
                        figureCode: value.figureCode,
                        name: value.name,
                    };
                    config.urlParams.areas.push(map);
                });

                servicesService.editServices(config, function (res) {
                    if (res.errorCode === 0) {
                        $scope.setGrey = false;
                        $scope.isVisibleDraft = true;
                        $scope.isVisible = false;
                        $scope.isVisibleEdit = true;
                        $scope.visible = true;

                        $scope.serviceId = res.data;
                        $scope.serviceSpanInfo(res.data);

                        // 清除angular表单脏值检测
                        $scope.serviceForm.$setPristine();
                        $scope.serviceForm.$setUntouched();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: res.msg,
                            type: 'success',
                        });
                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: res.msg,
                            type: 'errer',
                            manualClose: true,
                        });
                    }
                });
            };

            /** 删除草稿服务 */
            $scope.deleteService = function () {
                if ($scope.tableModel.selectNumber) {
                    var selectArr = tableService.getSelectTable($scope.tableModel.tableBody);

                    $(document).promptBox({
                        title: Lang.getValByKey('common', 'common_prompt_title'),
                        type: 'warning',
                        content: {
                            tip: Lang.getValByKey('services', 'services_prompt_title_delete'),
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_page_delete'),
                                application: 'delete',
                                operationEvent: function () {
                                    $scope.submitDeleteService(selectArr);
                                },
                            },
                        ],
                    });
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: Lang.getValByKey('common', 'common_prompt_delay_tip'),
                        type: 'errer',
                        manualClose: true,
                    });
                }
            };
            $scope.submitDeleteService = function (selectArr) {
                var arr = [];
                var str = '';
                for (var i in selectArr) {
                    str += selectArr[i].status;
                    arr.push(selectArr[i].uid);
                }

                if (str.indexOf('1') == -1) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: Lang.getValByKey('services', 'services_prompt_title_delete_tips'),
                        type: 'errer',
                        manualClose: true,
                    });
                    $(document).promptBox('closePrompt');
                    return false;
                } else {
                    if (str.indexOf('2') != -1) {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: Lang.getValByKey('services', 'services_prompt_title_delete_tips'),
                            type: 'errer',
                            manualClose: true,
                        });
                        $(document).promptBox('closePrompt');
                        return false;
                    }
                    if (str.indexOf('3') != -1) {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: Lang.getValByKey('services', 'services_prompt_title_delete_tips'),
                            type: 'errer',
                            manualClose: true,
                        });
                        $(document).promptBox('closePrompt');
                        return false;
                    }
                    var config = {urlParams: arr};
                    servicesService.deleteServices(config, function (response) {
                        if (response.errorCode === 0) {
                            $(document).promptBox('closePrompt');
                            $scope.getTypeTable($scope.typeId);
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: response.msg,
                                type: 'success',
                            });
                        } else {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: response.msg,
                                type: 'errer',
                                manualClose: true,
                            });
                        }
                    });
                }

                $scope.$apply();
            };

            /** 批量审核服务 */
            $scope.auditService = function () {
                if ($scope.tableModel.selectNumber) {
                    var selectArr = tableService.getSelectTable($scope.tableModel.tableBody);

                    $(document).promptBox({
                        title: Lang.getValByKey('common', 'common_prompt_title'),
                        type: 'success',
                        content: {
                            tip: Lang.getValByKey('services', 'services_prompt_title_audit'),
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_pagination_confirm'),
                                operationEvent: function () {
                                    $scope.submitAuditService(selectArr);
                                },
                            },
                        ],
                    });
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: Lang.getValByKey('common', 'common_prompt_delay_tip'),
                        type: 'errer',
                        manualClose: true,
                    });
                }
            };
            $scope.submitAuditService = function (selectArr) {
                var arr = [];
                for (var i in selectArr) {
                    arr.push(selectArr[i].uid);
                }

                var config = {urlParams: arr};
                servicesService.toAuditServices(config, function (response) {
                    if (response.errorCode === 0) {
                        $(document).promptBox('closePrompt');
                        $scope.getTypeTable($scope.typeId);
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: response.msg,
                            type: 'success',
                        });
                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: response.msg,
                            type: 'errer',
                            manualClose: true,
                        });
                    }
                });
                $scope.$apply();
            };

            /** 单个审核服务 */
            $scope.auditSingleService = function () {
                $(document).promptBox({
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'success',
                    content: {
                        tip: Lang.getValByKey('services', 'services_prompt_title_audit_tips'),
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_pagination_confirm'),
                            operationEvent: function () {
                                var config = {
                                    urlParams: [$scope.serviceId],
                                };
                                servicesService.toAuditServices(config, function (response) {
                                    if (response.errorCode === 0) {
                                        $scope.mainBlock = 'list';
                                        $(document).promptBox('closePrompt');
                                        $scope.getTypeTable($scope.typeId);
                                        $scope.$apply();
                                        $(document).promptBox({
                                            isDelay: true,
                                            contentDelay: response.msg,
                                            type: 'success',
                                        });
                                    } else {
                                        $(document).promptBox({
                                            isDelay: true,
                                            contentDelay: response.msg,
                                            type: 'errer',
                                            manualClose: true,
                                        });
                                    }
                                });
                            },
                        },
                    ],
                });
            };

            /** 供应商详情 */
            $scope.supplierModel = {
                supplierData: [],
            };
            $scope.pictureModel = {
                edit: true, // 是否编辑状态
                uploadShow: false, // 是否显示上传按钮图标
                picture: [], // 图片存放地址
                accept: 'image/jpg,image/jpeg,image/png,image/bmp,image/tiff'
            };
            $scope.getSupplier = function (supplierId) {
                $scope.tabs.selected(0);
                $scope.mainBlock = 'suppler';
                var config = {
                    seatParams: {
                        sid: supplierId,
                        intertype: 'logistics',
                    },
                };
                servicesService.getSupplierById(config, function (res) {
                    if (res.errorCode === 0) {
                        $scope.supplierModel.supplierData = res.data;
                        // 组装类型
                        var str = '';
                        angular.forEach($scope.supplierModel.supplierData.serviceTypes, function (value, key) {
                            if (key == $scope.supplierModel.supplierData.serviceTypes.length - 1) {
                                str += value.supplierTypeName;
                            } else {
                                str += value.supplierTypeName + ',';
                            }
                        });
                        $scope.supplierModel.supplierData.serviceTypes = str;
                        // 组装评价等级
                        $('#stars').rating('update', parseInt($scope.supplierModel.supplierData.rank));
                        $('#stars').rating('refresh', {
                            min: 0,
                            max: 5,
                            step: 1,
                            size: 'xs',
                            animate: true,
                            displayOnly: true,
                            showClear: false,
                            showCaption: false,
                        });
                        // 组装营业执照
                        $scope.pictureModel.picture = pictureEdit($scope.supplierModel.supplierData.files);
                        $scope.pictureModel = pictureService.init($scope.pictureModel);

                        $scope.supplierModel = suppliersService.initSupplier($scope.supplierModel);
                    }
                });
            };

            /** 编辑素有营业执照id数组 */
            function pictureEdit(picture) {
                var length = picture ? picture.length : 0;
                var map = {};
                var ret = [];
                for (var i = 0; i < length; i++) {
                    map = {
                        picUrlID: picture[i],
                        delshow: false,
                    };
                    ret.push(map);
                }
                return ret;
            }

            /** 返回服务 */
            $scope.goSupplerBack = function () {
                $scope.mainBlock = 'detail';
            };

            /**
             * 阻止回车事件
             * @param $event
             */
            $scope.preventEvent = function ($event) {
                if ($event.keyCode == 13) {
                    $event.preventDefault();
                }
            };

            function sliceLastNode(str, separator) {
                if (!str || !separator) {
                    return '';
                }

                var index = str.lastIndexOf(separator);
                if (index != -1) {
                    str = str.slice(index + 1);
                }
                return str;
            }

            function getSigleDataByName(name, data) {
                var result = data.data;
                for (var index = 0; index < result.length; index++) {
                    if (result[index].name == name) {
                        return result[index];
                    }
                }
            }

            /* by jinxyang */

            // 查看详情方法
            $scope.regionDetail = function (schemaUid, name) {
                var url = '#/regionDetail?schemaId=' + schemaUid + '&name=' + name + '&q=services&uid=' + $scope.serviceId + '&status=' + $scope.serviceData.status;
                if (uParams.isfromprice) {    //从价格跳转过来的
                    url += '&isfromprice=1&priceData=' + uParams.priceData;
                }
                window.location.href = url;
            };

            // $scope.startDisabled = false; // 起点范围
            // $scope.endDisabled = false; // 终点范围

            $scope.infoTab = $('#info-tab').tab({
                callback: function (index) {
                    if ($scope.serviceData.status === 1) {
                        $scope.isVisibleEdit = true;
                        $scope.setGrey = false;
                        // $scope.setGrey = false;
                        // $scope.isVisibleEdit = true;
                        // $scope.isVisible = false;
                        $scope.validateCodeError = false;
                    }
                    if(index === 1) {
                        //获取计重规则信息
                        $scope.getWeightRule($scope.id);
                        $scope.initSelect();
                    }
                    if (index === 2) {
                        // 服务分区
                        $scope.getServiceRegion(); // 获取表格数据
                    }
                    $scope.visible = true;
                    $scope.isVisible = false;
                    $scope.serviceSpanInfo($scope.serviceId);
                    $scope.$apply();
                },
            });

            $scope.getServiceRegion = function () {
                // 初始化表格配置
                $scope.serviceRangeTable = {
                    tableHeader: [Lang.getValByKey('common', 'common_thead_number'), '类型范围', '编码', '创建者', '创建时间', '分区详情', Lang.getValByKey('common', 'common_page_remarks')],
                    tableBody: [],
                    restURL: 'logistics.getServiceRange',
                    restData: {
                        id: $scope.serviceData.id,
                    },
                    selectNumber: 0,
                    selectFlag: false,
                };

                var params = {
                    seatParams: $scope.serviceRangeTable.restData,
                };

                tableService.getTable($scope.serviceRangeTable.restURL, params, function (data) {
                    if (data.errorCode === 0) {
                        data.pagination = {
                            currentPage: 1,
                            currentResult: 0,
                            pageSize: 10,
                            totalPage: 0,
                            totalResult: 0,
                        };

                        $scope.serviceRangeTable = tableService.table($scope.serviceRangeTable, params, data);

                        // 检测起点终点是否存在
                        var tableBody = $scope.serviceRangeTable && $scope.serviceRangeTable.tableBody;

                        $scope.startDisabled = false;
                        $scope.endDisabled = false;
                        $scope.disabledAdd = false;

                        if (tableBody) {
                            for (var i = 0, l = tableBody.length; i < l; i++) {
                                if (tableBody[i].type === 's') {
                                    $scope.startDisabled = true;
                                } else if (tableBody[i].type === 'e') {
                                    $scope.endDisabled = true;
                                }
                            }

                            if ($scope.startDisabled && $scope.endDisabled) {
                                $scope.disabledAdd = true;
                            }
                        }

                        $scope.$apply();
                    }
                });
            };

            // 添加服务
            $scope.add = function () {
                $scope.showCode = false;

                if ($scope.startDisabled) {
                    $scope.rangeRadio = 'e';
                } else {
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
                        nest: $('#regionDetail'),
                    },
                    loadData: function () {
                        $('#nest-regionDetail .other-btn button[name="prompt-operation"]').addClass('save').removeClass('edit');
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_page_save'),
                            operationEvent: function () {
                                $scope.saveSeriviceRegion();
                                $(document).promptBox('closeFormPrompt');
                                $scope.$apply();
                            },
                        },
                    ],
                });
            };

            $scope.editable = true; // 草稿状态可编辑，其他状态不可编辑
            $scope.edit = function (value) {
                // 非草稿状态不可进行编辑
                if (!$scope.editable) {
                    return;
                }

                $scope.startDisabled = false; // 起点范围
                $scope.endDisabled = false; // 终点范围
                $scope.showCode = true;

                var data = $scope.serviceRangeTable && $scope.serviceRangeTable.tableBody;

                if (data.length >= 2) {
                    $scope.startDisabled = true;
                    $scope.endDisabled = true;
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
                        nest: $('#regionDetail'),
                    },
                    loadData: function () {
                        $('#nest-regionDetail .other-btn button[name="prompt-operation"]').addClass('save').removeClass('edit');
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_page_save'),
                            operationEvent: function () {
                                $scope.saveSeriviceRegion();
                                $(document).promptBox('closeFormPrompt');
                                $scope.$apply();
                            },
                        },
                    ],
                });
            };

            // 保存或修改
            $scope.saveSeriviceRegion = function () {
                if (!$scope.rangeRadio) {
                    return;
                }
                if ($scope.proRegionID && !$scope.code) {
                    $scope.regionForm.code.$setDirty();
                }
                if ($('#code-msg').hasClass('remote-invalid') || !$scope.regionForm.$valid) {
                    return;
                }

                var config = {
                    urlParams: {
                        serviceId: $scope.serviceData.id,
                        type: $scope.rangeRadio,
                        remark: $.trim($scope.description),
                    },
                    seatParams: {},
                };

                var name = $scope.rangeRadio === 's' ? '起点范围' : '终点范围';

                if ($scope.proRegionID) {
                    // 修改
                    config.seatParams.id = $scope.proRegionID;
                    servicesService.editServicesRegion(config, function (data) {
                        if (data.errorCode === 0) {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: data.msg,
                                type: 'success',
                            });

                            if ($scope.isSaveNext) {
                                $scope.regionDetail(data.data, name);
                            } else {
                                $scope.getServiceRegion();
                            }
                        } else {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: data.msg,
                                type: 'errer',
                                manualClose: true,
                            });
                        }
                    });
                } else {
                    // 添加
                    servicesService.saveServicesRegion(config, function (data) {
                        if (data.errorCode === 0) {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: data.msg,
                                type: 'success',
                            });

                            if ($scope.isSaveNext) {
                                $scope.regionDetail(data.data, name);
                            } else {
                                $scope.getServiceRegion();
                            }
                        } else {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: data.msg,
                                type: 'errer',
                                manualClose: true,
                            });
                        }
                    });
                }
            };

            // 删除服务
            $scope.del = function () {
                var param = [];

                var selData = tableService.getSelectTable($scope.serviceRangeTable.tableBody);

                if (!selData.length) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: Lang.getValByKey('common', 'common_code_noSelected'),
                        type: 'errer',
                        manualClose: true,
                    });
                    return false;
                }

                // 组织数据
                angular.forEach(selData, function (val) {
                    param.push(val.id);
                });

                var config = {
                    urlParams: param,
                    serviceId: $scope.serviceData.id,
                };

                var opt = {
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: '确定删除已选服务范围？',
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                servicesService.deleteServicesRegion(config, function (data) {
                                    if (data.errorCode === 0) {
                                        $(document).promptBox({
                                            isDelay: true,
                                            contentDelay: data.msg,
                                            type: 'success',
                                        });
                                        $(document).promptBox('closePrompt');

                                        $scope.getServiceRegion();
                                        $scope.serviceRangeTable.restData.id = $scope.serviceData.id;
                                        $scope.$apply();
                                    } else {
                                        $(document).promptBox({
                                            isDelay: true,
                                            contentDelay: data.msg,
                                            type: 'errer',
                                            manualClose: true,
                                        });
                                    }
                                });
                            },
                        },
                    ],
                };
                $(document).promptBox(opt);
            };

            // 初始化干线类型
            $scope.initLineType = function () {
                var data = {
                    data: [{id: 1, code: 'MAINLINESHIP', name: '海运'}, {id: 2, code: 'MAINLINEAIR', name: '空运'}, {
                        id: 3,
                        code: 'MAINLINEOTHER',
                        name: '其他'
                    }],
                };
                selectFactory({
                    data: data,
                    defaultText: '',
                    id: 'initLineType',
                    attrTextField: {
                        'ng-value': 'code',
                    },
                    attrTextId: function (code) {
                        $scope.subServiceTypeCode = code;
                        $scope.$apply();
                    },
                    attrTextModel: function (name) {
                        $scope.subServiceTypeName = name;
                        $scope.$apply();
                    },
                }).open();
            }

            // 初始化航线数据
            $scope.initLineIds = function () {
                selectFactory({
                    data: [],
                    id: 'lineId',
                    defaultText: '请选择',
                    showTextField: 'nameCode',
                    isSearch: true,
                    closeLocalSearch: true,
                    searchPlaceHoder: '请输入航线名称或编码',
                    pagination: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        servicesService.getLines({
                            subServiceTypeCode: $scope.subServiceTypeCode,
                            params: {q: data, pageIndex: currentPage || 1}
                        }, function (res) {
                            res.data.forEach(function (item) {
                                item.nameCode = item.name + '(' + item.code + ')';
                            });
                            attachEvent.setData(res);
                        });
                    },
                    attrTextField: {
                        'ng-value': 'id',
                    },
                    attrTextModel: function (nameCode) {
                        if (!nameCode) {
                            $scope.lineName = '';
                            $scope.$apply();
                            return;
                        }
                        $scope.lineName = nameCode;
                        $scope.$apply();
                    },
                    attrTextId: function (id) {
                        if (!id) {
                            $scope.flightTable.tableBody = [];
                            $scope.lineId = '0';
                            $scope.$apply();
                            return;
                        }
                        $scope.lineId = id;
                        $scope.getFlightsData(id, true);
                        $scope.$apply();
                    },
                }).open();
            }

            // 初始化航班表格数据
            $scope.flightTable = {
                tableHeader: [Lang.getValByKey('common', 'common_thead_number'), '航班号', '承运公司', '出发时间', '到达时间'],
                tableBody: [],
                // restURL: '',
                // restData: { lineId: $scope.lineId },
                selectNumber: 0,
                selectFlag: false,
            };

            // 根据航线id获取航班/港口
            $scope.getFlightsData = function (id, showChecked) {
                if (!id || id === 0) {
                    $scope.flightTable.tableBody = [];
                    return;
                }
                var params = {urlParams: {lineId: id, pageSize: 1000}};
                var url = $scope.subServiceTypeCode === 'MAINLINESHIP' ? 'logistics.getShipFlights' : 'logistics.getAirFlights'
                tableService.getTable(url, params, function (res) {
                    if (res.errorCode === 0) {
                        var resData = angular.copy(res);
                        var data = [];
                        if (!showChecked) {
                            if ($scope.serviceData.classId && $scope.serviceData.classId.length) {
                                for (var i = 0, iLen = $scope.serviceData.classId.length; i < iLen; i += 1) {
                                    for (var j = 0, jLen = resData.data.length; j < jLen; j += 1) {
                                        if ($scope.serviceData.classId[i] === resData.data[j].id) {
                                            data.push(resData.data[j]);
                                        }
                                    }
                                }
                            }
                            resData.data = data;
                        }
                        $scope.flightTable = tableService.table($scope.flightTable, params, resData);
                        if (showChecked) {
                            if ($scope.serviceData.classId && $scope.serviceData.classId.length) {
                                for (var i = 0, iLen = $scope.serviceData.classId.length; i < iLen; i += 1) {
                                    for (var j = 0, jLen = $scope.flightTable.tableBody.length; j < jLen; j += 1) {
                                        if ($scope.serviceData.classId[i] === $scope.flightTable.tableBody[j].id) {
                                            $scope.flightTable.tableBody[j].checkbox = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            };

            // 提交航线航班数据
            $scope.submitFlights = function () {
                var selectArr = tableService.getSelectTable($scope.flightTable.tableBody);
                if ($scope.lineName && !selectArr.length) {
                    $(document).promptBox({isDelay: true, contentDelay: '请至少选择一个航班！', type: 'errer', manualClose: true,});
                    return;
                }
                $scope.classIds = selectArr.map(function (item) {
                    return item.id
                });
                var config = {
                    seatParams: {
                        uid: $scope.serviceId
                    },
                    urlParams: {
                        lineId: $scope.lineId,
                        classIds: $scope.classIds
                    }
                };
                servicesService.submitFlights(config, function (res) {
                    if (res.errorCode === 0) {
                        $scope.setGrey = false;
                        $scope.isVisibleDraft = true;
                        $scope.isVisible = false;
                        $scope.isVisibleEdit = true;
                        $scope.visible = true;

                        $scope.serviceId = res.data;
                        $scope.serviceSpanInfo(res.data);
                        // 清除angular表单脏值检测
                        $scope.mainlineForm.$setPristine();
                        $scope.mainlineForm.$setUntouched();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: res.msg,
                            type: 'success',
                        });
                    } else {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: res.msg,
                            type: 'errer',
                            manualClose: true,
                        });
                    }
                });
            }

            if (uParams.uid) {
                $scope.serviceTitle = Lang.getValByKey('services', 'services_title_detail');
                $scope.validateCodeError = false;
                $scope.mainBlock = 'detail';
                $scope.infoTab.selected(0);
                $scope.infoTab.enableAll();
                $scope.visible = true;
                $scope.isVisibleDraft = true;
                $scope.isVisible = false;
                $scope.showAuthor = true;

                $scope.serviceId = uParams.uid;
                $scope.serviceSpanInfo(uParams.uid);

                // setTimeout(function () {
                //     if (uParams.backfrom) {    //从分区跳转过来的话需要定位到服务范围，否则不需要。
                //         $('.from-box').scrollTop(0);
                //         $scope.infoTab.toggle(2);
                //     }
                // }, 10);
                if (uParams.backfrom) {
                    $scope.backfromRegion = true;
                    $('.base-info-tab').removeClass('active');
                    $('.base-info-pane').removeClass('active');
                    $scope.getServiceRegion();
                    
                }else {
                    $scope.backfromRegion = false;
                }
            }
        }
    ]);
});
