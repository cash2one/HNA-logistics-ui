easySpa.require([
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/prompt',
    'widget/select'
], function () {
    app.controller('pricePackageCtrl', [
        '$scope',
        'pricePackageService',
        'pricePackageView',
        'tableService',
        function ($scope, pricePackageService, pricePackageView, tableService) {
            var productList;
            var priceElmArray = [];
            $scope.deletePricePackage = function () {
                $scope.showPricePackage = false;
                var delTips = Lang.getValByKey('pricePackage', 'pricePackage_DelTips');
                tableService.delTableListByUid($scope.tableModel, delTips, pricePackageService.deletePricePackage, refreshTableData);
            };
            function setScroll() {
                $('.table-container tbody').slimScroll({
                    height: $('.content-main').height() - 250
                });
            }
            function refreshTableData() {
                var params = {
                    urlParams: $scope.tableModel.restData
                };
                tableService.getTable($scope.tableModel.restURL, params, function (data) {
                    $scope.q = $scope.tableModel.restData.q;
                    if (data.errorCode === 0) {
                        $scope.tableModel = tableService.table($scope.tableModel, params, data);
                        setTimeout(function () {
                            setScroll();
                            $(window).on('resize', setScroll);
                            $scope.$apply();
                            $('.table-box').focus();
                        }, 100);
                    }
                });
            }
            function initTable() {
                $scope.tableModel = {
                    tableHeader: [
                        Lang.getValByKey('common', 'common_thead_number'),
                        Lang.getValByKey('pricePackage', 'pricePackage_Name'),
                        Lang.getValByKey('pricePackage', 'pricePackage_Code'),
                        Lang.getValByKey('pricePackage', 'pricePackage_Creater'),
                        Lang.getValByKey('pricePackage', 'pricePackage_CreateTime'),
                        Lang.getValByKey('pricePackage', 'common_table_remark')
                    ],
                    tableBody: [],
                    tableHeaderSize: [
                        '5%',
                        '15%',
                        '10%',
                        '10%',
                        '15%',
                        '20%',
                        '20%'
                    ],
                    restURL: 'logistics.getPricePackage',
                    restData: {
                        q: '',
                        sortName: 'id',
                        isAsc: false,
                        pageIndex: 1,
                        pageSize: 10
                    },
                    selectNumber: 0,
                    selectFlag: false
                };
                refreshTableData();
            }
            function GetProductList() {
                var data = {
                    pageIndex: 1,
                    pageSize: 10,
                    status: 3,
                    includeAllAudit: true
                };
                productList = pricePackageService.getProductsList(data);
                rebuildName(productList);
            }
            function GetProductListBySearch(data, currentPage) {
                if (!currentPage) {
                    currentPage = 1;
                }
                var params = {
                    q: data || '',
                    pageIndex: currentPage,
                    pageSize: 10,
                    status: 3,
                    includeAllAudit: true
                };
                return pricePackageService.getProductsList(params);
            }
            $scope.reSetProductList = function (index) {
                // console.log(Select.sharePool);
                var id = 'productName-' + index;
                Select.sharePool[id].setData(productList);
            };
            function bindProductListToSelect() {
                var data = productList;
                priceElmArray = [];
                for (var index = 0; index < $scope.priceLevelList.length; index++) {
                    var priceElm = selectFactory({
                        data: [],
                        showTextField: 'gradeName',
                        id: 'productLevel-' + index,
                        isSaveInputVal: false,
                        isCreateNewSelect: true,
                        defaultText: Lang.getValByKey('common', 'common_select_tips'),
                        attrTextModel: function (name, data, currentData, currentEle) {
                            var index = currentEle.index;
                            if (!name) {
                                $scope.priceLevelList[index].productLevel = '';
                                $scope.priceLevelList[index].productLevelCode = '';

                            } else {
                                $scope.priceLevelList[index].productLevel = currentData.gradeName;
                                $scope.priceLevelList[index].productLevelCode = currentData.grade;
                                // $scope.pricePackageFrom["productLevel" + index].$setValidity();

                            }
                            $scope.$apply();
                        }
                    });
                    priceElm.index = index;
                    priceElmArray.push(priceElm); // 用于修改的时候填充价格等级
                    /* eslint no-multi-assign: 0 */
                    var aa = selectFactory({
                        data: data,
                        id: 'productName-' + index,
                        isSearch: true,
                        isSaveInputVal: true,
                        closeLocalSearch: true,
                        isCreateNewSelect: true,
                        defaultText: Lang.getValByKey('common', 'common_select_tips'),
                        pagination: true,
                        searchPlaceHoder: Lang.getValByKey('common', 'common_select_search_tips'),
                        onSearchValueChange: function (attachEvent, data, currentPage) {
                            var productList = GetProductListBySearch(data, currentPage);
                            rebuildName(productList);
                            attachEvent.setData(productList);
                        },
                        attrTextModel: function (name, data, currentData, currentEle) {
                            var index = currentEle.priceElm.index;

                            if (!name) {
                                currentEle.priceElm.setData({ data: [] });
                                $scope.priceLevelList[index].productLevel = '';
                                $scope.priceLevelList[index].productLevelCode = '';
                                $scope.priceLevelList[index].productName = '';
                                $scope.priceLevelList[index].productNameCode = '';
                                $scope.priceLevelList[index].productNameUid = '';
                            } else {
                                $scope.priceLevelList[index].productName = currentData.name;
                                $scope.priceLevelList[index].productNameCode = currentData.code;
                                $scope.priceLevelList[index].productNameUid = currentData.uid;
                                for (var checkIndex = 0; checkIndex < $scope.priceLevelList.length; checkIndex++) {
                                    if ($scope.priceLevelList[checkIndex].productName == name && checkIndex != index) {
                                        $('#productName-' + index).val('');
                                        $scope.priceLevelList[index].productName = '';
                                        $scope.priceLevelList[index].productNameCode = '';
                                        $scope.priceLevelList[index].productNameUid = '';
                                    }
                                }
                                // checkProductNameExist();
                                var priceLevel = pricePackageService.getPriceLevelByProductUid($scope.priceLevelList[index].productNameUid);
                                $scope.priceLevelList[index].productLevel = '';
                                currentEle.priceElm.setData(priceLevel);
                            }
                            $scope.$apply();
                        }
                    }).priceElm = priceElm;
                }
            }

            function bindProductListToSelectByIndex() {
                var data = productList;
                priceElmArray = [];
                // var index = $scope.priceLevelList.length == 0? 0:($scope.priceLevelList.length - 1);
                for (var index = $scope.priceLevelList.length - 1; index < $scope.priceLevelList.length; index++) {
                    var priceElm = selectFactory({
                        data: [],
                        showTextField: 'gradeName',
                        id: 'productLevel-' + index,
                        isSaveInputVal: false,
                        isCreateNewSelect: true,
                        defaultText: Lang.getValByKey('common', 'common_select_tips'),
                        attrTextModel: function (name, data, currentData, currentEle) {
                            var index = currentEle.index;
                            if (!name) {
                                $scope.priceLevelList[index].productLevel = '';
                                $scope.priceLevelList[index].productLevelCode = '';

                            } else {
                                $scope.priceLevelList[index].productLevel = currentData.gradeName;
                                $scope.priceLevelList[index].productLevelCode = currentData.grade;

                            }
                            $scope.$apply();
                        }
                    });
                    priceElm.index = index;
                    priceElmArray.push(priceElm); // 用于修改的时候填充价格等级

                    var aa = selectFactory({
                        data: data,
                        id: 'productName-' + index,
                        isSearch: true,
                        isSaveInputVal: true,
                        closeLocalSearch: true,
                        isCreateNewSelect: true,
                        defaultText: Lang.getValByKey('common', 'common_select_tips'),
                        pagination: true,
                        searchPlaceHoder: Lang.getValByKey('common', 'common_select_search_tips'),
                        onSearchValueChange: function (attachEvent, data, currentPage) {
                            var productList = GetProductListBySearch(data, currentPage);
                            rebuildName(productList);
                            attachEvent.setData(productList);
                        },
                        attrTextModel: function (name, data, currentData, currentEle) {
                            var index = currentEle.priceElm.index;
                            if (!name) {
                                currentEle.priceElm.setData({ data: [] });
                                $scope.priceLevelList[index].productLevel = '';
                                $scope.priceLevelList[index].productLevelCode = '';
                                $scope.priceLevelList[index].productName = '';
                                $scope.priceLevelList[index].productNameCode = '';
                                $scope.priceLevelList[index].productNameUid = '';
                            } else {
                                $scope.priceLevelList[index].productName = currentData.name;
                                $scope.priceLevelList[index].productNameCode = currentData.code;
                                $scope.priceLevelList[index].productNameUid = currentData.uid;
                                for (var checkIndex = 0; checkIndex < $scope.priceLevelList.length; checkIndex++) {
                                    if ($scope.priceLevelList[checkIndex].productName == name && checkIndex != index) {
                                        $('#productName-' + index).val('');
                                        $scope.priceLevelList[index].productName = '';
                                        $scope.priceLevelList[index].productNameCode = '';
                                        $scope.priceLevelList[index].productNameUid = '';
                                    }
                                }
                                // checkProductNameExist();
                                var priceLevel = pricePackageService.getPriceLevelByProductUid($scope.priceLevelList[index].productNameUid);
                                $scope.priceLevelList[index].productLevel = '';
                                currentEle.priceElm.setData(priceLevel);

                            }
                            $scope.$apply();
                        }
                    }).priceElm = priceElm;
                }
            }

            function InitPricePackageForm() {
                $scope.data = {
                    pricePackageName: '',
                    pricePackageCode: '',
                    description: ''
                };
                $scope.priceLevelList = [
                    {
                        productName: '',
                        productNameCode: '',
                        productLevel: '',
                        productLevelCode: ''
                    }
                ];
            }
            $scope.addPricePackage = function () {
                $scope.IsEdit = false;
                // 防止点击的时候原来的没有改
                $scope.value = {};
                $scope.pricePackageFrom.pricePackageCode.errorTips = '';
                $('#code-msg').addClass('ng-hide');

                $scope.showPricePackage = true;
                InitPricePackageForm();
                $scope.pricePackageFrom.$setPristine();
                setTimeout(function () {
                    bindProductListToSelect();
                    $scope.$apply();
                }, 200);
            };
            $scope.addPriceLevel = function () {
                if (!canAddPriceLevel()) {
                    return;
                }
                $scope.priceLevelList.push({
                    productName: '',
                    productNameCode: '',
                    productLevel: '',
                    productLevelCode: ''
                });
                // DOM可能还没有刷出来
                setTimeout(function () {
                    bindProductListToSelectByIndex();
                    $scope.$apply();
                }, 200);
            };
            $scope.closePrompt = function () {
                $scope.showPricePackage = false;
                Select.sharePool['productName-0'] = null;
                Select.sharePool['productLevel-0'] = null;
            };
            $scope.savePrompt = function () {
                if (!CheckBeforeSummit()) {
                    return;
                }
                var errorEles = $('.errors');
                for (var index = 0; index < errorEles.length; index++) {
                    if (!$(errorEles[index]).hasClass('ng-hide')) {
                        return;
                    }
                }
                if ($scope.IsEdit) {
                    var data = {
                        urlParams: {
                            name: $scope.data.pricePackageName,
                            code: $scope.data.pricePackageCode,
                            description: $scope.data.description,
                            comboQuotationDtoList: []
                        },
                        seatParams: {
                            uid: $scope.value.uid
                        }
                    };
                    for (var index = 0; index < $scope.priceLevelList.length; index++) {
                        var priceLevel = {
                            priceQuotationGradeName: $scope.priceLevelList[index].productLevel,
                            priceQuotationGrade: $scope.priceLevelList[index].productLevelCode,
                            productName: $scope.priceLevelList[index].productName.split('(')[0],
                            productUid: $scope.priceLevelList[index].productNameUid
                        };
                        data.urlParams.comboQuotationDtoList.push(priceLevel);
                    }
                    summitForm(data, pricePackageService.modifyPricePackage, refreshTableData);
                } else {
                    var data = {
                        name: $scope.data.pricePackageName,
                        code: $scope.data.pricePackageCode,
                        description: $scope.data.description,
                        comboQuotationDtoList: []
                    };
                    for (var index = 0; index < $scope.priceLevelList.length; index++) {
                        var priceLevel = {
                            priceQuotationGradeName: $scope.priceLevelList[index].productLevel,
                            priceQuotationGrade: $scope.priceLevelList[index].productLevelCode,
                            productName: $scope.priceLevelList[index].productName.split('(')[0],
                            productUid: $scope.priceLevelList[index].productNameUid
                        };
                        data.comboQuotationDtoList.push(priceLevel);
                    }
                    summitForm(data, pricePackageService.addPricePackage, refreshTableData);
                }
                // $scope.showPricePackage = false;
            };
            function summitForm(inputdata, summitFunc, refreshFunc) {
                summitFunc(inputdata, function (data) {
                    if (data.errorCode != 0) {
                        // 服务器异常
                        Select.sharePool['productName-0'] = null;
                        Select.sharePool['productLevel-0'] = null;
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
            function rebuildName(data) {
                var data = data.data;
                for (var index = 0; index < data.length; index++) {
                    data[index].name = data[index].name + '(' + data[index].code + ')';
                }
            }
            function canAddPriceLevel() {
                var isCanAdd = true;
                for (var index = 0; index < $scope.priceLevelList.length; index++) {
                    if ($.trim($scope.priceLevelList[index].productName) == '') {
                        // 每次dirty之前$pending下
                        $scope.pricePackageFrom['productName' + index].$pending = {};
                        $scope.pricePackageFrom['productName' + index].$setDirty();
                        isCanAdd = false;
                    }
                    if ($.trim($scope.priceLevelList[index].productLevel) == '') {
                        $scope.pricePackageFrom['productLevel' + index].$pending = {};
                        $scope.pricePackageFrom['productLevel' + index].$setDirty();
                        isCanAdd = false;
                    }
                }
                // var errorEle = $("#price-msg");
                // if(!$(errorEle).hasClass("ng-hide")) {
                //     isCanAdd = false;
                // }
                console.log(isCanAdd);
                return isCanAdd;
            }
            function CheckBeforeSummit() {
                if (!$scope.data.pricePackageName) {
                    $scope.pricePackageFrom.pricePackageName.$setDirty();
                }
                if (!$scope.data.pricePackageCode) {
                    $scope.pricePackageFrom.pricePackageCode.$setDirty();
                }
                var canAdd = canAddPriceLevel();
                return !!($scope.pricePackageFrom.$valid && canAdd);
            }
            $scope.deletePriceLevel = function () {
                $scope.priceLevelList.splice($scope.priceLevelList.length - 1, 1);
                setTimeout(function () {
                    if ($('.error').length == 0) {
                        $('#price-msg').addClass('ng-hide');
                        $('#price-msg').html('');
                    }
                }, 10);
            };

            /** 条件搜索 **/
            $scope.search = function () {
                $scope.tableModel.restData.pageIndex = 1;
                refreshTableData();
            };
            function reWritePricePackageForm(value) {
                console.log(value);
                // 用于显示
                $scope.data.pricePackageName = value.name;
                $scope.data.description = value.description;
                $scope.data.pricePackageCode = value.code;
                $scope.priceLevelList = {};
                var price = [];
                for (var index = 0; index < value.comboQuotationDtoList.length; index++) {
                    var data = {
                        productName: value.comboQuotationDtoList[index].productName + '(' + value.comboQuotationDtoList[index].productCode + ')',
                        productNameCode: value.comboQuotationDtoList[index].productCode,
                        productNameUid: value.comboQuotationDtoList[index].productUid,
                        productLevel: value.comboQuotationDtoList[index].priceQuotationGradeName,
                        productLevelCode: value.comboQuotationDtoList[index].priceQuotationGrade
                    };
                    price.push(data);
                }
                $scope.priceLevelList = price;
                // 保存下edit下的数据
                $scope.value = value;
            }
            $scope.editPricePackage = function (value) {
                reWritePricePackageForm(value);
                // 防止点击的时候原来的没有改
                $('#code-msg').addClass('ng-hide');
                // 用于做异步校验
                $scope.oldpricePackageCode = value.code;
                // DOM可能还没有刷出来
                setTimeout(function () {
                    bindProductListToSelect();
                    for (var index = 0; index < value.comboQuotationDtoList.length; index++) {
                        var level = pricePackageService.getPriceLevelByProductUid(value.comboQuotationDtoList[index].productUid);
                        priceElmArray[index].setData(level);
                        // 这里操作了DOM，scope检测会失效
                        priceElmArray[index].inputElement.val(value.comboQuotationDtoList[index].priceQuotationGradeName);
                    }
                    $scope.$apply();
                }, 200);
                $scope.showPricePackage = true;
                $scope.IsEdit = true;
            };
            $scope.isExistedCode = function () {
                if (!$scope.data.pricePackageCode) {
                    return; // 为空不校验
                }
                if ($scope.pricePackageFrom.pricePackageCode.$error.defined) {
                    return;
                }
                $scope.value.id = $scope.value.id ? $scope.value.id : '';
                var result = pricePackageService.isExistedCode({ id: $scope.value.id, code: $scope.data.pricePackageCode });
                if (result.errorCode != 0) {
                    // 显示错误信息
                    $scope.pricePackageFrom.pricePackageCode.errorTips = '编码已存在';
                    $('#code-msg').removeClass('ng-hide');
                } else {
                    $scope.pricePackageFrom.pricePackageCode.errorTips = '';
                    $('#code-msg').addClass('ng-hide');
                }
            };
            function init() {
                $scope.showPricePackage = false;
                $scope.IsEdit = false;
                initTable();
                // data 都是显示值
                InitPricePackageForm();
                GetProductList();
            }
            init();
        }
    ]);
});
