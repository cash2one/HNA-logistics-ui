easySpa.require([
    'public/javascripts/product/20161224/productRoute.js',
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/prompt',
    'widget/select',
    'widget/starRating'
], function () {
    app.controller('productServeCtr', [
        '$scope',
        'addProductService',
        'tableService',
        function ($scope, addProductService, tableService) {
            $scope.$on('productServeEvent', function () {
                // 接受初始化
                $scope.isEdit = false;
                $scope.init();
                $scope.$apply();
            });

            var serviceElm = {};
            var propertyElm = {};
            var serviceTypeElm = {};
            var services = {};

            var propertySelectWithOutMain = {};
            var propertySelectAll = {};

            /* 已配置服务列表---begin */
            /* function setScroll() {
                $('.customer-table tbody').slimScroll({
                    height: $('.content-main').height() - 330
                });
            }*/

            function refreshTableData() {
                var params = {
                    urlParams: $scope.tableModel.restData
                };
                tableService.getTable($scope.tableModel.restURL, params, function (res) {
                    if (res.errorCode === 0) {
                        res.pagination = {
                            pageSize: 10,
                            totalPage: 1,
                            totalResult: res.data.length,
                            currentResult: 0,
                            currentPage: 1
                        };
                        $scope.tableModel = tableService.table($scope.tableModel, params, res);
                        setTimeout(function () {
                            // setScroll();
                            // $(window).on('resize', setScroll);
                            $('.table-box').focus();
                            $scope.$apply();
                        }, 100);
                    }
                });
            }

            function initTable() {
                $scope.tableModel = {
                    tableHeader: [
                        Lang.getValByKey('addProduct', 'product_service_point'),
                        Lang.getValByKey('addProduct', 'product_service_attr'),
                        Lang.getValByKey('addProduct', 'product_service_type'),
                        Lang.getValByKey('common', 'common_table_remark')
                    ],
                    tableBody: [],
                    tableHeaderSize: [
                        '25%',
                        '25%',
                        '25%',
                        '25%'
                    ],
                    restURL: 'logistics.getProduct',
                    restData: {
                        q: '',
                        isAsc: false,
                        pageIndex: 1,
                        pageSize: 10,
                        id: $scope.$parent.id
                    },
                    selectNumber: 0,
                    selectFlag: false
                };
                refreshTableData();
            }

            /* 已配置服务列表---end */

            function rebuildName(data) {
                if (!data) {
                    return;
                }
                for (var index = 0; index < data.length; index++) {
                    data[index].name = data[index].name + '(' + data[index].code + ')';
                }
            }

            // 根据服务类型获取服务列表
            $scope.SetServiceByServiceType = function () {
                serviceElm = selectFactory({
                    data: [],
                    id: 'serviceName',
                    showTextField: 'name',
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    isSearch: true,
                    closeLocalSearch: true,
                    isSaveInputVal: true,
                    searchPlaceHoder: '请输入名称或编码',
                    pagination: true,
                    onSearchValueChange: function (attachEvent, data, currentPage) {
                        if (!$scope.data.serviceTypeCode) {
                            return;
                        }
                        var params = {
                            urlParams: {
                                status: 3,
                                includeAllAudit: true,
                                q: data || '',
                                pageIndex: currentPage || 1,
                                pageSize: 10
                            },
                            seatParams: {
                                serviceTypeCode: $scope.data.serviceTypeCode
                            }
                        };
                        var servicesData = addProductService.getServicebyServiceType(params);
                        rebuildName(servicesData.data);
                        attachEvent.setData(servicesData);
                    },
                    attrTextModel: function (name, data, currentItem) {
                        $scope.serviceRelInfo.orderQuantity = '';
                        $('#orderQuantity').val('');
                        $scope.showServiceExist = false;
                        if (!name) {
                            $scope.serviceRelInfo.serviceName = '';
                            $scope.serviceRelInfo.serviceUid = '';
                        } else {
                            // 校验是否已选择
                            var selectServiceUids = $scope.data.productServiceRelInfos.length ? $scope.data.productServiceRelInfos.map(function (item) {
                                return item.serviceUid;
                            }) : [];

                            if (selectServiceUids.indexOf(currentItem.uid) === -1) {
                                $scope.serviceRelInfo.serviceName = name.split('(')[0];
                                $scope.serviceRelInfo.serviceUid = currentItem.uid; // 这个和服务是一一对应的
                                $scope.serviceRelInfo.regionsStart = [];
                                $scope.serviceRelInfo.regionsEnd = [];
                                $scope.serviceRelInfo.cargos = [];
                                $scope.serviceRelInfo.weightLimitMin = currentItem.weightLimitMin;
                                $scope.serviceRelInfo.weightLimitMax = currentItem.weightLimitMax;
                                $scope.weightLimitMin = currentItem.weightLimitMin;
                                $scope.weightLimitMax = currentItem.weightLimitMax;
                                $('#modifyPrompt .border-red').removeClass('border-red');
                                if(currentItem.weightLimitMin || currentItem.weightLimitMin == 0){
                                    $("#weightLimitBegin, #weightLimitEnd").attr('min',currentItem.weightLimitMin);
                                }else{
                                    $("#weightLimitBegin, #weightLimitEnd").removeAttr('min');
                                }

                                if(currentItem.weightLimitMax || currentItem.weightLimitMax == 0){
                                    $("#weightLimitBegin, #weightLimitEnd").attr('max',currentItem.weightLimitMax);
                                }else{
                                    $("#weightLimitBegin, #weightLimitEnd").removeAttr('max');
                                }
                                getProductServiceRegions(currentItem.uid);
                                getProductServiceCargos(currentItem.uid);
                            } else {
                                // $scope.serviceRelInfo.serviceName = '';
                                // $scope.serviceRelInfo.serviceUid = '';
                                $scope.showServiceExist = true;
                            }
                        }
                        $scope.$apply();
                    }
                }).open();
            };

            // 初始化服务类型
            $scope.InitServiceTypeSelect = function() {
                var typeData = addProductService.getAvailableTypes({ seatParams: { productId: $scope.$parent.id } });
                typeData.data.splice(0, 1);
                serviceTypeElm = selectFactory({
                    data: { data: [] },
                    id: 'service-type',
                    height: 140,
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    attrTextModel: function (name, data, currentItem) {
                        $scope.showServiceExist = false;
                        if (!name) {
                            $scope.data.serviceTypeName = '';
                            $scope.data.serviceTypeCode = '';
                        } else {
                            $scope.data.serviceTypeName = name;
                            $scope.data.serviceTypeCode = currentItem.code;
                        }
                        $scope.$apply();
                    }
                });
                serviceTypeElm.setData(typeData);
                serviceTypeElm.open();
            }

            function refreshPropertySelect() {
                addProductService.IsMainServiceExist($scope.id, function (result) {
                    if (result.errorCode === 0) {
                        if (result.data) {
                            propertyElm.setData(propertySelectWithOutMain);
                        } else {
                            propertyElm.setData(propertySelectAll);
                        }
                    } else {
                        propertyElm.setData(propertySelectWithOutMain);
                    }
                });

                // if($scope.productInfo.isMainExist ) { //主服务只允许添加一次，校验其他产品是否存在
                //
                //     propertyElm.setData(propertySelectWithOutMain);
                // } else {
                //     propertyElm.setData(propertySelectAll);
                // }
            }

            // 初始化服务属性
            function InitPropertySelect() {
                propertyElm = selectFactory({
                    data: [],
                    id: 'proprety',
                    isCreateNewSelect: true,
                    defaultText: Lang.getValByKey('common', 'common_select_tips'),
                    attrTextModel: function (name, data, currentItem) {
                        if (!name) {
                            $scope.data.servicePropertyName = '';
                            $scope.data.serviceProperty = '';
                        } else {
                            $scope.data.servicePropertyName = name;
                            $scope.data.serviceProperty = currentItem.code;

                            $scope.IsMainExist = currentItem.code == 'MAIN';
                        }

                        $scope.$apply();
                    }
                });
            }

            // 添加/修改服务配置
            $scope.newService = true;
            $scope.addServiceConfig = function (index, obj) {
                if (!obj) {
                    InitData();
                    var servicesList = $scope.tableModel.tableBody;
                    $scope.ordinal = $scope.tableModel.pagination.totalResult + 1;
                    $scope.data.ordinal = servicesList.length ? servicesList[servicesList.length - 1].ordinal + 1 : 1;
                } else {
                    $scope.ordinal = index + 1;
                    $scope.newService = false;
                    getProductServiceInfo(obj.serviceProperty, obj.ordinal, index);
                }
                if (!$scope.canEditService && !$scope.$parent.isNew) {
                    initStar('#starsPrice', $scope.data.priceWeighting, true);
                    initStar('#starsTime', $scope.data.agingWeighting, true);
                }
                if ($scope.canEditService || $scope.$parent.isNew) {
                    initStar('#starsPrice', $scope.data.priceWeighting, false);
                    initStar('#starsTime', $scope.data.agingWeighting, false);
                }
                refreshPropertySelect();
                $scope.showPrompt = true;
                $('#showPrompt').css('display', 'table');
                $scope.serviceForm.$setPristine();
            };

            // 获取服务详情
            function getProductServiceInfo(type, ordinal, index) {
                addProductService.getProductService({ seatParams: { uid: $scope.$parent.uid, type: type, ordinal: ordinal }, urlParams: { hasDisabled: true } }, function (res) {
                    if (res.errorCode === 0) {
                        $scope.data = angular.copy(res.data);
                    }
                });
            }

            /* 删除服务---begin */
            function submitDeleteService(params) {
                addProductService.delProductService({ urlParams: params }, function (data) {
                    if (data.errorCode === 0) {
                        $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'success', time: 3000 });
                        $(document).promptBox('closePrompt');
                        // 更新table表数据
                        refreshTableData();
                    } else {
                        $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                    }
                });
            }
            $scope.deleteServiceConfig = function () {
                if ($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {
                    var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                    if (!oldData.length) {
                        accountView.promptBox({ isDelay: true, contentDelay: '请先选择服务', type: 'errer', manualClose: true });
                        return false;
                    }
                    // 组织数据
                    var params = {
                        productUid: $scope.$parent.uid,
                        serviceProperties: oldData.map(function (item) {
                            return {
                                ordinal: item.ordinal,
                                serviceProperty: item.serviceProperty
                            };
                        })
                    };
                    $(document).promptBox({
                        title: Lang.getValByKey('common', 'common_prompt_title'),
                        type: 'warning',
                        content: {
                            tip: '确定删除已选服务？'
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_page_delete'),
                                application: 'delete',
                                operationEvent: function () {
                                    submitDeleteService(params);
                                }
                            }
                        ]
                    });
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: '请先选择服务', type: 'errer', manualClose: true });
                }
            };

            /* 删除服务---end */

            $scope.closePrompt = function () {
                $scope.showPrompt = false;
            };

            /* 保存服务配置---begin */
            function summitForm(inputdata, summitFunc, refreshFunc) {
                summitFunc(inputdata, function (data) {
                    if (data.errorCode != 0) {
                        // 服务器异常
                        $scope.showPricePackage = true;
                        $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg, // Lang.getValByKey("rate", "rate_create_rate_tips"),
                            type: 'success',
                            time: 3000
                        });
                        // 更新table表数据
                        refreshFunc();
                    }
                });
            }
            $scope.savePrompt = function () {
                if ($scope.data.servicePropertyName == '') {
                    $scope.serviceForm.servicePropertyName.$setDirty();
                }
                if ($scope.data.serviceTypeName == '') {
                    $scope.serviceForm.serviceTypeName.$setDirty();
                }

                if($scope.data.servicePropertyName == '' || $scope.data.serviceTypeName == ''){
                    return;
                }

                if (!$scope.data.productServiceRelInfos.length) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: '请至少选择一个服务',
                        type: 'errer',
                        manualClose: true
                    });
                    $scope.modifyPrompt = true;
                    $('#modifyPrompt').css('display', 'table');
                    return;
                }
                var data = null;
                if (!$scope.data.id) {
                    summitForm($scope.data, addProductService.addProductService, refreshTableData);
                } else {
                    data = {
                        urlParams: $scope.data,
                        seatParams: {
                            id: $scope.data.id
                        }
                    };
                    summitForm(data, addProductService.modifyProductService, refreshTableData);
                }
            };

            /* 保存服务配置---end */

            // 初始化服务数据
            function InitData() {
                $scope.data = {
                    agingWeighting: 1,
                    description: '',
                    id: '',
                    isEnable: true,
                    ordinal: 0,
                    priceWeighting: 1,
                    productId: $scope.$parent.id,
                    productName: '',
                    productServiceRelInfos: [],
                    productUid: $scope.$parent.uid,
                    serviceProperty: '',
                    servicePropertyName: '',
                    serviceTypeCode: '',
                    serviceTypeName: ''
                };
                $scope.serviceRelInfo = {
                    customerLevel: '',
                    customerLevelName: '',
                    customerLevelExt: '',
                    customerLevelExtName: '',
                    declaredValueMax: '',
                    declaredValueMin: '',
                    orderQuantity: '',
                    orderQuantityUnit: '%',
                    regionsStart: [],
                    regionsEnd: [],
                    cargos: [],
                    serviceContent: '',
                    serviceName: '',
                    serviceUid: '',
                    weightLimitMax: '',
                    weightLimitMin: ''
                };
                $scope.showPrompt = false;
                $scope.modifyPrompt = false;
                $scope.IsMainExist = false; // 本产品是否有主服务

                // $scope.showServiceTypeExist = false;
                $scope.showServiceExist = false;
            }

            // 星级评价
            function initStar(id, level, disabled) {
                $(id).rating('update', level);
                $(id).rating('refresh', {
                    min: 0,
                    max: 5,
                    step: 1,
                    size: 'xs',
                    animate: true,
                    displayOnly: disabled,
                    showClear: false,
                    showCaption: false
                });
            }

            // 显示服务详细信息配置
            $scope.showModifyPrompt = function (index) {
                $scope.editIndex = index;
                if ($scope.data.servicePropertyName == '') {
                    $scope.serviceForm.servicePropertyName.$setDirty();
                }
                if ($scope.data.serviceTypeName == '') {
                    $scope.serviceForm.serviceTypeName.$setDirty();
                }

                if($scope.data.servicePropertyName == '' || $scope.data.serviceTypeName == ''){
                    return;
                }
                $('#modifyPrompt .border-red').removeClass('border-red');
                $('#weight-msg').html('');

                $scope.serviceRelInfo.orderQuantity = '';
                $('#orderQuantity').val('');

                if (typeof index === 'number') {

                    if($scope.data.productServiceRelInfos[index].serviceWeightLimitMin || $scope.data.productServiceRelInfos[index].serviceWeightLimitMin == 0){
                        $("#weightLimitBegin, #weightLimitEnd").attr('min',$scope.data.productServiceRelInfos[index].serviceWeightLimitMin);
                    }else{
                        $("#weightLimitBegin, #weightLimitEnd").removeAttr('min');
                    }
                    if($scope.data.productServiceRelInfos[index].serviceWeightLimitMax || $scope.data.productServiceRelInfos[index].serviceWeightLimitMin == 0){
                        $("#weightLimitBegin, #weightLimitEnd").attr('max',$scope.data.productServiceRelInfos[index].serviceWeightLimitMax);
                    }else{
                        $("#weightLimitBegin, #weightLimitEnd").removeAttr('max');
                    }

                    $scope.serviceRelInfo = angular.copy($scope.data.productServiceRelInfos[index]);
                    $scope.showServicesRegions = $scope.serviceRelInfo.regionsStart ? $scope.serviceRelInfo.regionsStart.length : $scope.serviceRelInfo.regionsEnd ? $scope.serviceRelInfo.regionsEnd.length : '';
                    var startStr = $scope.serviceRelInfo.regionsStart ? $scope.serviceRelInfo.regionsStart
                        .map(function (item) {
                            return item.name.substr(0, item.name.indexOf('('));
                        })
                        .join(',') : '';
                    var endStr = $scope.serviceRelInfo.regionsEnd ? $scope.serviceRelInfo.regionsEnd
                        .map(function (item) {
                            return item.name.substr(0, item.name.indexOf('('));
                        })
                        .join(',') : '';
                    $scope.selectedRegionsStr = endStr ? startStr + ',' + endStr : startStr;
                    $scope.selectedCargosStr = $scope.serviceRelInfo.cargos
                        ? $scope.serviceRelInfo.cargos
                            .map(function (item) {
                                return item.cargoTypeName;
                            })
                            .join(',')
                        : '';
                    $scope.isEdit = !$scope.isEdit;
                    $scope.serviceRelInfo.orderQuantity = $scope.data.productServiceRelInfos[index].orderQuantity;
                    if($scope.serviceRelInfo.orderQuantity){
                        $('#orderQuantity').val($scope.data.productServiceRelInfos[index].orderQuantity + $scope.data.productServiceRelInfos[index].orderQuantityUnit);
                    }
                }
                $scope.modifyPrompt = true;
                $('#modifyPrompt').css('display', 'table');
            };

            // 服务范围/航班列表
            function getProductServiceRegions(uid) {
                addProductService.getProductServiceRegions({ seatParams: { uid: uid } }, function (res) {
                    if (res.errorCode === 0) {
                        var resData = angular.copy(res.data);
                        $scope.showServicesRegions = resData.starts.length || resData.ends.length;
                        if(!$scope.serviceRelInfo.regionsStart){
                            $scope.serviceRelInfo.regionsStart = [];
                        }
                        if(!$scope.serviceRelInfo.regionsEnd){
                            $scope.serviceRelInfo.regionsEnd = [];
                        }
                        if (!$scope.serviceRelInfo.regionsStart.length) {
                            resData.starts.forEach(function (item) {
                                item.checked = true;
                            });
                        } else {
                            for (var i = 0, iLen = $scope.serviceRelInfo.regionsStart.length; i < iLen; i += 1) {
                                for (var j = 0, jLen = resData.starts.length; j < jLen; j += 1) {
                                    if ($scope.serviceRelInfo.regionsStart[i].id === resData.starts[j].id) {
                                        resData.starts[j].checked = true;
                                    }
                                }
                            }
                        }
                        if (!$scope.serviceRelInfo.regionsEnd.length) {
                            resData.ends.forEach(function (item) {
                                item.checked = true;
                            });
                        } else {
                            for (var m = 0, mLen = $scope.serviceRelInfo.regionsEnd.length; m < mLen; m += 1) {
                                for (var n = 0, nLen = resData.ends.length; n < nLen; n += 1) {
                                    if ($scope.serviceRelInfo.regionsEnd[m].id === resData.ends[n].id) {
                                        resData.ends[n].checked = true;
                                    }
                                }
                            }
                        }
                        $scope.regionsSelected = angular.copy(resData.starts);
                        $scope.regionsSelectedEnd = angular.copy(resData.ends);
                        $scope.serviceRelInfo.regionsStart = $scope.regionsSelected.filter(function (item) {
                            return item.checked;
                        });
                        $scope.serviceRelInfo.regionsEnd = $scope.regionsSelectedEnd.filter(function (item) {
                            return item.checked;
                        });
                        var startStr = $scope.serviceRelInfo.regionsStart ? $scope.serviceRelInfo.regionsStart
                            .map(function (item) {
                                return item.name.substr(0, item.name.indexOf('('));
                            })
                            .join(',') : '';
                        var endStr = $scope.serviceRelInfo.regionsEnd ? $scope.serviceRelInfo.regionsEnd
                            .map(function (item) {
                                return item.name.substr(0, item.name.indexOf('('));
                            })
                            .join(',') : '';
                        $scope.selectedRegionsStr = endStr ? startStr + ',' + endStr : startStr;
                    }
                });
            }
            // 切换起/终点范围
            $scope.tabActive = 1;
            $scope.toggleData = function (type) {
                $scope.tabActive = type;
            };
            // 获取服务所含货物类型
            function getProductServiceCargos(uid) {
                addProductService.getProductServiceCargos({ seatParams: { uid: uid } }, function (res) {
                    if (res.errorCode === 0) {
                        var resData = angular.copy(res.data);
                        if (!$scope.serviceRelInfo.cargos.length) {
                            resData.forEach(function (item) {
                                item.checked = true;
                            });
                        } else {
                            for (var i = 0, iLen = $scope.serviceRelInfo.cargos.length; i < iLen; i += 1) {
                                for (var j = 0, jLen = resData.length; j < jLen; j += 1) {
                                    if ($scope.serviceRelInfo.cargos[i].cargoTypeCode === resData[j].cargoTypeCode) {
                                        resData[j].checked = true;
                                    }
                                }
                            }
                        }
                        $scope.cargosSelected = resData;
                        $scope.serviceRelInfo.cargos = $scope.cargosSelected.filter(function (item) {
                            return item.checked;
                        });
                        $scope.selectedCargosStr = $scope.serviceRelInfo.cargos
                            .map(function (item) {
                                return item.cargoTypeName;
                            })
                            .join(',');
                    }
                });
            }
            // 选择货物类型
            $scope.showCargos = function () {
                if (!$scope.serviceRelInfo.serviceName || $scope.showServiceExist) {
                    $scope.serviceItemForm.serviceName.$setDirty();
                    return;
                }
                // $scope.serviceRelInfo.cargos = [];
                var optCargo = {
                    title: '货物类型',
                    isHidden: true,
                    isNest: true,
                    loadData: function () {
                        getProductServiceCargos($scope.serviceRelInfo.serviceUid);
                    },
                    content: {
                        nest: $('#cargos')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: '确定',
                            operationEvent: function () {
                                var serviceRelInfoCache = $scope.serviceRelInfo.cargos;
                                $scope.serviceRelInfo.cargos = $scope.cargosSelected.filter(function (item) {
                                    return item.checked;
                                });
                                if (!$scope.serviceRelInfo.cargos.length) {
                                    $(document).promptBox({
                                        isDelay: true,
                                        contentDelay: '请至少选择一项',
                                        type: 'errer',
                                        manualClose: true
                                    });
                                    $scope.serviceRelInfo.cargos = serviceRelInfoCache;
                                    return;
                                }
                                $scope.selectedCargosStr = $scope.serviceRelInfo.cargos
                                    .map(function (item) {
                                        return item.cargoTypeName;
                                    })
                                    .join(',');
                                $scope.serviceRelInfo.cargos.forEach(function (item) {
                                    if (item.hasOwnProperty('checked')) {
                                        delete item.checked;
                                    }
                                });
                                $(document).promptBox('closeSlideBox');
                                $scope.$apply();
                            }
                        }
                    ]
                };
                $(document).promptBox(optCargo);
            };
            // 选择服务范围
            $scope.showRegions = function () {
                if (!$scope.serviceRelInfo.serviceName || $scope.showServiceExist) {
                    $scope.serviceItemForm.serviceName.$setDirty();
                    return;
                }
                $scope.tabActive = 1;
                // $scope.serviceRelInfo.regionsStart = [];
                // $scope.serviceRelInfo.regionsEnd = [];
                var optRegion = {
                    title: '服务范围',
                    isHidden: true,
                    isNest: true,
                    loadData: function () {
                        getProductServiceRegions($scope.serviceRelInfo.serviceUid);
                    },
                    content: {
                        nest: $('#regions')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: '确定',
                            operationEvent: function () {
                                $scope.serviceRelInfo.regionsStart = $scope.regionsSelected.filter(function (item) {
                                    return item.checked;
                                });
                                $scope.serviceRelInfo.regionsEnd = $scope.regionsSelectedEnd.filter(function (item) {
                                    return item.checked;
                                });
                                if (!$scope.serviceRelInfo.regionsStart.length && !$scope.serviceRelInfo.regionsEnd.length) {
                                    $(document).promptBox({
                                        isDelay: true,
                                        contentDelay: '请至少选择一项',
                                        type: 'errer',
                                        manualClose: true
                                    });
                                    return;
                                }
                                var startStr = $scope.serviceRelInfo.regionsStart
                                    .map(function (item) {
                                        return item.name.substr(0, item.name.indexOf('('));
                                    })
                                    .join(',');
                                var endStr = $scope.serviceRelInfo.regionsEnd
                                    .map(function (item) {
                                        return item.name.substr(0, item.name.indexOf('('));
                                    })
                                    .join(',');
                                $scope.selectedRegionsStr = endStr ? startStr + ',' + endStr : startStr;
                                $(document).promptBox('closeSlideBox');
                                $scope.$apply();
                            }
                        }
                    ]
                };
                $(document).promptBox(optRegion);
            };

            $scope.arrToString = function (arr, property) {
                var str = arr
                    .map(function (item) {
                        return item[property].indexOf('(') !== -1 ? item[property].substr(0, item[property].indexOf('(')) : item[property];
                    })
                    .join(',');
                str = str.length > 30 ? str.substr(0, 29) + '...' : str;
                return str;
            };

            $scope.minMax = function (min, max, unit) {
                var str = '';
                if (min && max) {
                    str = min + '~' + max + unit;
                }
                if (min && !max) {
                    str = '大于' + min + unit;
                }
                if (!min && max) {
                    str = '小于' + max + unit;
                }
                if (!min && !max) {
                    str = '/';
                }
                return str;
            };

            /* 服务范围/航班列表---begin */

            // 初始化客户等级
            $scope.initCustomerLevel = function () {
                selectFactory({
                    data: {
                        data: [
                            { name: '一级', code: 1 },
                            { name: '二级', code: 2 },
                            { name: '三级', code: 3 },
                            { name: '四级', code: 4 },
                            { name: '五级', code: 5 }
                        ]
                    },
                    id: 'customerLevel',
                    attrTextModel: function (name, data, currentItem) {
                        // if (!name) {
                        //     return;
                        // }
                        $scope.serviceRelInfo.customerLevelName = currentItem.name;
                        $scope.serviceRelInfo.customerLevel = currentItem.code;
                        $scope.serviceRelInfo.customerLevelExtName = '';
                        $scope.serviceRelInfo.customerLevelExt = '';
                        $scope.$apply();
                    }
                }).open();
            };

            // 初始化客户等级范围
            $scope.initCustomerLevelRange = function () {
                var data = [
                    { name: '及以上', code: 'above' },
                    { name: '及以下', code: 'below' }
                ];
                var customerLevelSel = selectFactory({
                    data: {},
                    id: 'customerLevelRange',
                    attrTextModel: function (name, data, currentItem) {
                        if (!name) {
                            return;
                        }
                        $scope.serviceRelInfo.customerLevelExtName = currentItem.name;
                        $scope.serviceRelInfo.customerLevelExt = currentItem.code;
                        $scope.$apply();
                    }
                });
                customerLevelSel.setData({ data: data });
                customerLevelSel.open();
            };

            // 获取货币单位
            function getCurrencyUnit(productId) {
                var params = { seatParams: { productId: productId } };
                addProductService.getCurrencyUnit(params, function (res) {
                    if (res.errorCode === 0) {
                        $scope.currencyName = res.data && res.data.currencyCode ? res.data.currencyCode : 'CNY';
                    }
                });
            }

            // 初始化单量
            $scope.initOrderQuantity = function () {
                var data = [
                    { name: '10%', code: '10' },
                    { name: '20%', code: '20' },
                    { name: '30%', code: '30' },
                    { name: '40%', code: '40' },
                    { name: '50%', code: '50' },
                    { name: '60%', code: '60' },
                    { name: '70%', code: '70' },
                    { name: '80%', code: '80' },
                    { name: '90%', code: '90' },
                    { name: '100%', code: '100' }
                ];
                var orderQuantitySel = selectFactory({
                    data: {},
                    id: 'orderQuantity',
                    height: 120,
                    direction: 'up',
                    attrTextModel: function (name, data, currentItem) {
                        if (!name) {
                            return;
                        }
                        $scope.serviceRelInfo.orderQuantity = currentItem.code;
                        $scope.$apply();
                    }
                });
                orderQuantitySel.setData({ data: data });
                orderQuantitySel.open();
            };

            $scope.closeModifyPrompt = function () {
                $scope.showServiceExist = false;
                $scope.serviceRelInfo = {
                    customerLevel: '',
                    customerLevelName: '',
                    customerLevelExt: '',
                    customerLevelExtName: '',
                    declaredValueMax: '',
                    declaredValueMin: '',
                    orderQuantity: '',
                    orderQuantityUnit: '%',
                    regions: [],
                    cargos: [],
                    serviceContent: '',
                    serviceName: '',
                    serviceUid: '',
                    weightLimitMax: '',
                    weightLimitMin: ''
                };
                $scope.selectedRegionsStr = '';
                $scope.selectedCargosStr = '';
                //清除angular表单脏值检测
                $scope.serviceItemForm.serviceName.$setPristine();
                $scope.serviceItemForm.serviceName.$setUntouched();
                $scope.modifyPrompt = false;
                $scope.isEdit = false;
                $('#modifyPrompt').hide();
            };
            $scope.saveModifyPrompt = function () {
                if (!$scope.serviceRelInfo.serviceName) {
                    $scope.serviceItemForm.serviceName.$setDirty();
                    return;
                }
                if ($scope.showServiceExist) {
                    return;
                }
                if(!$scope.serviceItemForm.$valid){
                    return;
                }

                if(($scope.serviceRelInfo.weightLimitMin != 0 && !$scope.serviceRelInfo.weightLimitMin) && $scope.serviceRelInfo.weightLimitMax){
                    $('#weightLimitBegin').addClass('border-red');
                }else if($scope.serviceRelInfo.weightLimitMin && ($scope.serviceRelInfo.weightLimitMax != 0 && !$scope.serviceRelInfo.weightLimitMax)){
                    $('#weightLimitEnd').addClass('border-red');
                }else if(
                    ($scope.serviceRelInfo.weightLimitMin != 0 && !$scope.serviceRelInfo.weightLimitMin)
                    &&
                    ($scope.serviceRelInfo.weightLimitMax != 0 && !$scope.serviceRelInfo.weightLimitMax)
                ){
                    $('#weightLimitBegin, #weightLimitEnd').removeClass('border-red');
                    $('#weight-msg').html('');
                }

                if($('#modifyPrompt').find('.border-red').length){

                    var min = $('#weightLimitBegin').attr('min'),
                        max = $('#weightLimitBegin').attr('max');

                    if(min && max){
                        var html = '数值不在有效范围内(' + min + '-' + max + ')';

                        $('#weight-msg').html(html);
                    }
                    return;
                }
                if($scope.serviceRelInfo.weightLimitMin > $scope.serviceRelInfo.weightLimitMax){
                    $('#weight-msg').html('下限值必须小于上限值');
                    return;
                }

                if (!$scope.serviceRelInfo.weightLimitMin  && !$scope.serviceRelInfo.weightLimitMax) {
                    $scope.serviceRelInfo.weightLimitMin = $scope.serviceRelInfo.serviceWeightLimitMin;
                    $scope.serviceRelInfo.weightLimitMax = $scope.serviceRelInfo.serviceWeightLimitMax;
                }

                var infoCopy = angular.copy($scope.data.productServiceRelInfos);
                var ids = infoCopy.map(function (item) {
                    return item.serviceUid;
                });
                // var index = ids.indexOf($scope.serviceRelInfo.serviceUid);
                var index = $scope.editIndex;
                if($scope.isEdit){
                    $scope.data.productServiceRelInfos.splice(index, 1, $scope.serviceRelInfo);
                }else {
                    $scope.data.productServiceRelInfos.push($scope.serviceRelInfo);
                }
                $scope.closeModifyPrompt();
            };
            $scope.delOneServiceRelInfo = function (index, item) {
                /* if (item.id && $scope.data.productServiceRelInfos.length <= 1) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: '请至少保留一个服务',
                        type: 'errer',
                        manualClose: true
                    });
                    return;
                } */
                $(document).promptBox({
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: '确定删除已选服务？'
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                $scope.data.productServiceRelInfos.splice(index, 1);
                                $(document).promptBox({ isDelay: true, contentDelay: '删除成功', type: 'success', time: 3000 });
                                $(document).promptBox('closePrompt');
                                /* var ids = [];
                                if (!item.id) {
                                } else {
                                    ids.push(item.id);
                                    addProductService.delProductServiceItem({ urlParams: ids }, function (res) {
                                        if (res.errorCode === 0) {
                                            $(document).promptBox({ isDelay: true, contentDelay: '删除成功', type: 'success', time: 3000 });
                                            $(document).promptBox('closePrompt');
                                            $scope.data.productServiceRelInfos.splice(index, 1);
                                        } else {
                                            $(document).promptBox({ isDelay: true, contentDelay: '删除成功', type: 'errer', manualClose: true });
                                        }
                                    });
                                } */
                                $scope.$apply();
                            }
                        }
                    ]
                });
            };

            $scope.init = function () {
                getCurrencyUnit($scope.$parent.id);
                InitData();
                initTable();
                InitPropertySelect();

                var backId = sessionStorage.getItem('backPricePath');
                if (backId) {
                    $scope.canEditService = false;
                } else {
                    if ($scope.isAudit) {
                        if ($scope.IsDraftStatus || $scope.isOffline) {
                            $scope.canEditService = true;
                        }
                    } else {
                        if ($scope.IsDraftStatus) {
                            $scope.canEditService = true;
                        }
                    }
                }

                propertySelectAll = addProductService.getProductPropertyType();
                propertySelectWithOutMain = $.extend(true, propertySelectWithOutMain, propertySelectAll); // 深度拷贝
                propertySelectWithOutMain.data.splice(0, 1);
            };

            $scope.checkWeightLimit = function(value, id){
                var reg = /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,3}$/;
                if(!reg.test(value)){ $('#weight-msg').html(''); return; }

                var min = $('#'+id).attr('min'),
                    max = $('#'+id).attr('max');

                if(value < min || value > max){
                    $('#'+id).addClass('border-red');
                }else{
                    $('#'+id).removeClass('border-red');
                }
            }
        }
    ]);
});
