easySpa.require([
    'widget/tab',
    'widget/parseUrl',
    'widget/select',
    'widget/searchBox',
    'widget/prompt',
    'widget/htable',
    'widget/tootips',
    'public/common/tableController.js',
    'public/common/areaController.js',
    'public/common/areaService.js',
    'public/common/calander.js',
    'public/javascripts/priceDetail/20161224/priceDetailRoute.js'
], function () {
    app.controller('priceDetailCtrl', ['$scope', 'priceDetailService', 'service', 'areaService', 'tableService', 'priceDetailView', function ($scope, priceDetailService, service, areaService, tableService, priceDetailView) {
        $scope.viewButton = {
            // 配置显示个性化视图的通用对象
            submit: false, // 提交审核状态按钮
            audit: false, // 审核状态按钮
            enable: false, // 停用启用状态按钮
            isCopy: false, // 是否复制价格
            isShowCancelBtn: false, // 是否显示取消按钮
            isSalesPrice: false, // 是否是销售价格
            isSaveInfoPrompt: false // 保存价格基本信息是否需要提示框
        };
        $scope.htable = null; // 价格明细表格
        $scope.jumpTime = 1000; // 页面跳转前空闲时间设置。

        $scope.copyPriceDetailList = [];

        // 初始化时间控件
        priceDetailView.initCalander();

        // 价格类型
        $scope.priceTypeData = {
            data: [
                {
                    name: Lang.getValByKey('priceDetail', 'priceDetail_code_gradePrice'),
                    id: 1
                },
                {
                    name: Lang.getValByKey('priceDetail', 'priceDetail_code_agreementPrice'),
                    id: 2
                }
            ]
        };

        // 等级价类型
        $scope.priceLevelData = {
            data: [
                {
                    name: Lang.getValByKey('priceDetail', 'priceDetail_code_level1'),
                    id: '1'
                },
                {
                    name: Lang.getValByKey('priceDetail', 'priceDetail_code_level2'),
                    id: '2'
                },
                {
                    name: Lang.getValByKey('priceDetail', 'priceDetail_code_level3'),
                    id: '3'
                },
                {
                    name: Lang.getValByKey('priceDetail', 'priceDetail_code_level4'),
                    id: '4'
                },
                {
                    name: Lang.getValByKey('priceDetail', 'priceDetail_code_level5'),
                    id: '5'
                }
            ]
        };

        // 默认计价方式：单价
        $scope.defatutPriceMethod = {
            name: Lang.getValByKey('priceDetail', 'priceDetail_code_unitPrice'),
            code: 'PCT_PRICE'
        };

        // 计价方式特殊计价方式： 总价code
        $scope.sumPriceMethod = {
            code: 'PCT_SUM'
        };

        // 价格明细tab数据缓存
        $scope.priceDetail = {};

        $scope.priceDetailList = [];

        function rechangeProductData(data) {
            data.forEach(function (value) {
                value.name += '(' + value.code + ')';
            });
            return data
        }

        $scope.getProduct = function () {
            $scope.contentList = priceDetailService.getProductAllData({'urlParams': {'isHot': true}});
            $scope.navItem = priceDetailService.getProductNavItem();
            var productBoxEle = new SearchBox.init({
                inputId: "select-product",
                searchData: [],
                defaultText: '请选择',
                tip: '请输入名称或编码',
                navItem: $scope.navItem.data,
                tabIndex: '热门',
                contentList: rechangeProductData($scope.contentList.data),
                toggleTab: function (currentPage, index) {
                    this.tabIndex = index;
                    var config = {
                        'urlParams': {
                            'isHot': false,
                            'pageIndex': currentPage || 1,
                            'pageSize': 10,
                            'capital': index
                        }
                    };
                    if (index == "热门") {
                        config.urlParams.isHot = true;
                        config.urlParams.capital = '';
                    }
                    if (index == "其他") {
                        config.urlParams.isHot = false;
                        config.urlParams.capital = '_';
                    }
                    var result = priceDetailService.getProductAllData(config);
                    return {data: rechangeProductData(result.data), pagination: result.pagination}
                },
                onSearchValueChange: function (data, currentPage) {
                    var config = {
                        'urlParams': {
                            'q': data,
                            'isHot': false,
                            'pageIndex': currentPage || 1,
                            'pageSize': 10,
                            'capital': ''
                        }
                    };
                    var result = priceDetailService.getProductAllData(config);
                    return {data: rechangeProductData(result.data), pagination: result.pagination};
                },
                attrTextModel: function (name, data) {
                    if (name != $scope.iInputProduct) {
                        $scope.copyPriceDetailList = [];
                    }
                    $scope.iInputProductValue = data.uid || '';
                    $scope.iInputProduct = name || '';
                    $scope.$apply();
                }
            });
        };

        /**
         * 初始化模块
         */
        $scope.init = function () {
            $scope.tabBox = $('#m-tabs').tab({callback: tabBoxCallback});    // 执行callback函数

            $scope.parameter = window.parseUrl.getParams();

            $scope.module = $scope.parameter.module; // 加载模块

            $scope.currentServiceTypeIndex = 0;  // 销售价格-价格明细里面第一级tab(服务类型)的index
            $scope.currentDetailIndex = 0;  // 销售价格-价格明细二级tab的index

            if ($scope.parameter.uid) { // 详情界面
                $scope.uid = $scope.parameter.uid; // 价格id缓存
                $scope.isEdit = false;
            }
            else {    // 新建
                $scope.isEdit = true;
                $scope.uid = 0;
                $scope.tabBox.exdisable(0);    // 除过index==0的，禁止其他的tab

                // 新建时采购价初始化结算方式
                if ($scope.module == 'costPrice') {
                    priceDetailService.getAccountDetail({seatParams: {id: 1}}, function (res) {
                        if (res.errorCode === 0) {
                            $scope.iInputAccount = res.data.name + '(' + res.data.code + ')';
                            $scope.iInputAccountValue = 1;
                        }
                    });

                    // 初始化计价货币
                    priceDetailService.getCurrencyByCode({seatParams: {code: 'CNY'}}, function (res) {
                        if (res.errorCode === 0) {
                            $scope.iInputCurrency = res.data.name + '(CNY)';
                            $scope.iInputCurrencyValue = 'CNY';
                        }
                    });
                }
            }
            setTimeout(function () {
                try {
                    $scope.getProduct();
                    $scope.$apply();
                } catch (e) {
                }

            }, 10);
        };
        $scope.init();

        /** =======================================基本信息============================**/
        $scope.getInfo = function () {
            if ($scope.viewButton.isSalesPrice) {
                // 销售价
                priceDetailService.getSalesPriceInfo({seatParams: {uid: $scope.uid}}, function (res) {
                    if (res.errorCode === 0) {
                        $scope.setInfo(res.data);
                        if (res.data.isOnline === false) {
                            if ($scope.parameter.module == 'salesPrice') {
                                $scope.isOffline = false;
                            } else {
                                $scope.isOffline = true;
                            }
                        }
                    }
                });
            }
            else {
                priceDetailService.getCostPriceInfo({seatParams: {uid: $scope.uid}}, function (res) {
                    if (res.errorCode === 0) {
                        $scope.setInfo(res.data);
                        if (res.data.isOnline === false) {
                            if ($scope.parameter.module == 'costPrice') {
                                $scope.isOffline = false;
                            } else {
                                $scope.isOffline = true;
                            }
                        }
                    }
                });
            }
        };

        /**
         * 查看产品详情
         */
        $scope.jumpTo = function () {
            location.href = '#/product?module=new&id=' + $scope.productId + '&uid=' + $scope.productUid;
            sessionStorage.setItem('backPricePath', $scope.uid);
            var type = $scope.parameter.type || '';
            sessionStorage.setItem('backPriceType', type);
            sessionStorage.setItem('backPriceModule', $scope.parameter.module);
        };

        /**
         * 设置价格基本信息。
         * @param data    后台返回的res.data
         */
        $scope.setInfo = function (data) {
            $scope.baseInfo = data;
            // 缓存价格明细数据
            $scope.freightItems = []; // 价格明细List
            $scope.freightWeightSettings = []; // 计价方式List

            $scope.title = data.name;

            // 缓存Uid及code数据
            $scope.productId = data.productid;
            $scope.productUid = data.productUid;
            $scope.uid = data.uid;
            $scope.iCode = data.code;
            $scope.status = data.status;
            $scope.isOnline = data.isOnline;

            // 创建者和创建时间
            $scope.creatorUserName = data.creatorUserName;
            $scope.createTime = data.createTime;

            // 价格名称
            $scope.iPriceName = $scope.iInputPriceName = data.name;

            // 服务名称和值
            $scope.iServices = $scope.iInputServices = data.serviceName;
            $scope.iInputServicesValue = data.bizUid;

            // 产品类型
            $scope.iProduct = $scope.iInputProduct = data.productName;
            $scope.iInputProductValue = data.bizUid;

            // 价格类型
            var priceType = getSigleDataById(data.gradeType, $scope.priceTypeData);
            $scope.iPriceType = $scope.iInputPriceType = priceType.name;
            $scope.iInputPriceTypeValue = priceType.id;

            if (data.gradeType == 1) {
                // 等级价
                var level = getSigleDataById(data.grade, $scope.priceLevelData);
                $scope.iPriceLevel = $scope.iInputPriceLevel = level.name;
                $scope.iInputPriceLevelValue = level.id;
            } else if (data.gradeType == 2) {
                // 协议价
                $scope.iClient = $scope.iInputClient = data.customerName;
                $scope.iInputClientValue = data.customerId;
            }

            // 货物类型
            $scope.iGoodsType = $scope.iInputGoodsType = data.cargoTypeName;
            $scope.iInputGoodsTypeValue = data.cargoTypeCode;

            // 计价货币
            $scope.iCurrency = data.currencyName;
            $scope.iInputCurrency = data.currencyName + '(' + data.currencyCode + ')';
            $scope.iInputCurrencyValue = $scope.cacheCurrencyCode = data.currencyCode;

            // 起运地, 数据需要重组
            /** 国家地区名称显示 */
            var inputStr = '';
            angular.forEach(data.areas, function (value, key) {
                inputStr += '，' + value.name.split('/')[value.name.split('/').length - 1];
            });
            inputStr ? inputStr = inputStr.slice(1) : '';
            $scope.iDeparture = $scope.iInputDeparture = inputStr;
            $scope.areasData = data.areas;

            // 结算方式
            $scope.iAccount = data.settlementTypeName;
            $scope.iInputAccount = data.settlementTypeName ? data.settlementTypeName + '(' + data.settlementTypeCode + ')' : '';
            $scope.iInputAccountValue = data.settlementTypeId;
            // 生效时间
            $scope.iBeginTime = $scope.iInputBeginTime = data.startEffectTime;

            // 失效时间
            $scope.iEndTime = $scope.iInputEndTime = data.endEffectTime;

            // 重量段
            $scope.iWeight = $scope.iInputWeight = data.weightName;
            $scope.iInputWeightValue = $scope.cacheWeightUid = data.weightSchemaUid;

            // 分区
            $scope.iRegion = $scope.iInputRegion = data.regionName;
            $scope.iInputRegionValue = $scope.cacheRegionUid = data.regionSchemaUid;

            // 备注
            $scope.iRemark = $scope.iInputRemark = data.description;

            //如果是采购价，则将分区重量段缓存为请求的基本信息中的数据
            $scope.saveReturnCostRegionValue = data.regionSchemaUid;
            $scope.saveReturnCostWeightnValue = data.weightSchemaUid;

            if (data.costSets.length > 0) {
                $scope.priceDetailList = data.costSets || [];
            } else {
                $scope.serviceTypeList = data.saleSets || [];
                if ($scope.serviceTypeList.length > 0) {
                    $scope.priceDetailList = $scope.serviceTypeList[0].sets;
                } else {
                    $scope.priceDetailList = [];
                }
            }
            if ($scope.module != 'costPrice' && $scope.module != 'costPriceApproval') {
                if ($scope.serviceTypeList.length > 0) {
                    $scope.allPriceDetailList = [];
                    $.each($scope.serviceTypeList, function (index, val) {
                        $.each(val.sets, function (i, v) {
                            $scope.allPriceDetailList.push(v);
                        });
                    });
                }
            }

            // 设置销售价格数据缓存，并且循环加载getPriceTable函数。
            if ($scope.viewButton.isSalesPrice && (!$scope.viewButton.isCopy || !$scope.copyPriceDetailList.length || $scope.module == 'costPrice' || $scope.module == 'costPriceApproval')) {
                // 获取销售价格方案的所有价格明细。 采购价复制到销售价格时，是没有的。
                priceDetailService.getSalesDetailsByUid({seatParams: {uid: $scope.uid}}, function (res) {
                    $scope.allPrices = res.data || [];
                });

                // 二维数组，存放销售价格明细编辑实时数据。
                $scope.savePriceDetailCache = [];
                var arrm = [];
                $.extend(true, arrm, data.saleSets);
                for (var m = 0, ml = arrm.length; m < ml; m++) {
                    $scope.savePriceDetailCache.push([]);
                    for (var n = 0, nl = arrm[m].sets.length; n < nl; n++) {
                        for (var k = 0, kl = $scope.allPrices.length; k < kl; k++) {
                            if (arrm[m].sets[n].id == $scope.allPrices[k].id) {
                                $.extend(true, arrm[m].sets[n], $scope.allPrices[k]);
                                break;
                            }
                        }
                        if (!arrm[m].sets[n].freightItems) {
                            arrm[m].sets[n].freightItems = [];
                        }
                        if (!arrm[m].sets[n].freightWeightSettings) {
                            arrm[m].sets[n].freightWeightSettings = [];
                        }
                        $scope.savePriceDetailCache[m].push(arrm[m].sets[n]);
                    }
                }

                for (var m = 0, ml = $scope.savePriceDetailCache.length; m < ml; m++) {
                    for (var n = 0, nl = $scope.savePriceDetailCache[m].length; n < nl; n++) {
                        if ($scope.savePriceDetailCache[m][n].id) {
                            $scope.currentServiceTypeIndex = m;
                            $scope.currentDetailIndex = n;
                            $scope.getPriceTable(n, $scope.savePriceDetailCache[m][n].id);
                        }
                    }
                }
            }
        };

        /**
         * 编辑基本信息
         */
        $scope.editInfo = function () {
            // 清除angular表单脏值检测
            $scope.infoForm.$setPristine();
            $scope.infoForm.$setUntouched();

            $scope.viewButton.submitDisabled = true;
            $scope.viewButton.isSaveInfoPrompt = false;

            $scope.isEdit = true;
            $scope.tabBox.exdisable(0);
        };

        /**
         * 取消基本信息编辑
         */
        $scope.cancelInfo = function () {
            $scope.tabBox.enableAll();
            $scope.isEdit = false;
            $scope.viewButton.submitDisabled = false;
            $scope.getInfo();
        };

        /**
         * 取消价格明细编辑
         */
        $scope.cancelPrice = function () {
            $scope.isEditPrice = false;
            $scope.viewButton.submitDisabled = false;
            $scope.getInfo();

            // 销售价 价格明细中点击取消之后定位到初始页。
            if ($scope.viewButton.isSalesPrice) {
                $scope.currentServiceTypeIndex = 0;
                $scope.currentDetailIndex = 0;
                $scope.getPriceTable($scope.currentDetailIndex);
            } else {  // 采购价 价格明细中点击取消。
                $scope.copyPriceDetailList = [];
                var id = ($scope.priceDetailList && $scope.priceDetailList.length) ? $scope.priceDetailList[0].id : '';
                var isNotClearCost = id ? true : false;    // id存在时，不进行清空。
                $scope.getPriceTable(0, id, isNotClearCost);
            }
        };

        /**
         * 保存基本信息
         */
        $scope.saveInfo = function (isNext) {
            // 公共校验
            var arr = ['iInputPriceName', 'iInputGoodsType', 'iInputCurrency', 'iInputBeginTime', 'iInputEndTime', 'iInputWeight', 'iInputRegion'];
            for (var i = 0, l = arr.length; i < l; i++) {
                if (!$.trim($scope[arr[i]])) {
                    $scope.infoForm[arr[i]].$setDirty();
                }
            }

            // 新增或复制销售价
            if ($scope.viewButton.isSalesPrice) {
                $scope.type = 2; // 销售价：type=2, 成本价：type=1

                if (!$scope.iInputProduct) {
                    // 所属产品
                    $scope.infoForm.iInputProduct.$setDirty();
                }

                if (!$scope.iInputPriceType) {
                    $scope.infoForm.iInputPriceType.$setDirty();
                }

                if ($scope.iInputPriceTypeValue == 1 && !$scope.iInputPriceLevel) {
                    // 等级价
                    $scope.infoForm.iInputPriceLevel.$setDirty();
                } else if ($scope.iInputPriceTypeValue == 2 && !$scope.iInputClient) {
                    // 协议价
                    $scope.infoForm.iInputClient.$setDirty();
                }
            } else {
                // 成本价
                $scope.type = 1;
                if (!$scope.iInputServices) {
                    // 所属服务
                    $scope.infoForm.iInputServices.$setDirty();
                }
            }
            if (!$scope.infoForm.$valid) {
                scrollToErrorView($(".tab-content"));
                return;
            }

            if ($scope.viewButton.isSaveInfoPrompt) {
                $(document).promptBox({
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: '修改重量段或分区内容，价格值将会被清空，确定继续？'
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_pagination_confirm'),
                            operationEvent: function () {
                                $(document).promptBox('closePrompt');
                                $scope.saveInfoAction(isNext);
                                $scope.$apply();
                            }
                        }
                    ]
                });
            } else {
                $scope.saveInfoAction(isNext);
            }
        };
        $scope.saveInfoAction = function (isNext) {
            var config = {
                urlParams: {
                    feeTypeId: $scope.iInputCostValue, // 费用类型ID
                    name: $scope.iInputPriceName, // 价格名称
                    startEffectTime: $scope.iInputBeginTime, // 生效时间
                    endEffectTime: $scope.iInputEndTime, // 失效时间
                    regionSchemaUid: $scope.iInputRegionValue, // 分区UID
                    weightSchemaUid: $scope.iInputWeightValue, // 重量段UID
                    settlementTypeId: $scope.iInputAccountValue, // 结算方式ID
                    cargoTypeCode: $scope.iInputGoodsTypeValue, // 货物类型code
                    currencyCode: $scope.iInputCurrencyValue, // 计价货币
                    areas: $scope.areasData, // 起运地
                    description: $scope.iInputRemark // 备注
                }
            };

            if ($scope.viewButton.isSalesPrice) {
                // 销售价
                config.urlParams.type = 2;
                config.urlParams.bizUid = $scope.iInputProductValue; // 所属产品UID
                config.urlParams.gradeType = $scope.iInputPriceTypeValue; // 价格类型，1：等级价，2：协议价
                config.urlParams.grade = $scope.iInputPriceLevelValue; // 等级价等级类别
                config.urlParams.customerId = $scope.iInputClientValue; // 客户ID
            } else {
                // 成本价
                config.urlParams.type = 1;
                config.urlParams.bizUid = $scope.iInputServicesValue; // 所属服务UID
            }

            if ($scope.uid) {
                // 编辑
                config.seatParams = {
                    uid: $scope.uid
                };

                if ($scope.viewButton.isSalesPrice) {
                    // 销售价编辑
                    var saveSalesInfo = $scope.isOffline ? 'saveAuditSalesInfo' : 'saveSalesEditInfo';
                    priceDetailService[saveSalesInfo](config, function (res) {
                        if (res.errorCode === 0) {
                            $scope.saveInfoCallback(res.data, isNext);
                            if (!isNext) {
                                $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                            }
                        } else {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: res.msg,
                                type: 'errer',
                                manualClose: true
                            });
                        }
                    });
                } else {
                    // 成本价编辑
                    var saveCostInfo = $scope.isOffline ? 'saveAuditCostInfo' : 'saveCostEditInfo';
                    priceDetailService[saveCostInfo](config, function (res) {
                        if (res.errorCode === 0) {
                            $scope.saveInfoCallback(res.data, isNext);
                            if (!isNext) {
                                $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                            }
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
                if ($scope.viewButton.isSalesPrice) {
                    // 销售价新增
                    priceDetailService.saveSalesAddInfo(config, function (res) {
                        if (res.errorCode === 0) {
                            $scope.saveInfoCallback(res.data, isNext, true);
                        } else {
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: res.msg,
                                type: 'errer',
                                manualClose: true
                            });
                        }
                    });
                } else {
                    // 成本价新增
                    priceDetailService.saveCostAddInfo(config, function (res) {
                        if (res.errorCode === 0) {
                            $scope.saveInfoCallback(res.data, isNext, true);
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
        };
        $scope.saveInfoCallback = function (data, isNext, isCreat) {
            if ($scope.module == 'costPrice') {
                $scope.saveReturnCostRegionValue = data.regionSchemaUid;
                $scope.saveReturnCostWeightnValue = data.weightSchemaUid;
                $scope.saveReturnCostRegion = data.regionName;
                $scope.saveReturnCostWeightn = data.weightName;
            }

            $scope.isCreatPrice = isCreat;
            $scope.tabBox.enableAll();

            if (!$scope.viewButton.isCopy) {
                $scope.freightItems = [];
                $scope.freightWeightSettings = [];
            }
            $scope.iInputRegionValue = data.regionSchemaUid;
            $scope.iInputRegion = data.regionName;
            $scope.iInputWeightValue = data.weightSchemaUid;
            $scope.iInputWeight = data.weightName;

            $scope.uid = data.uid;
            $scope.iCode = data.code;
            $scope.isEdit = false; // 基本信息处于非编辑状态

            $scope.creatorUserName = data.creatorUserName;
            $scope.createTime = data.createTime;

            $scope.viewButton.submitDisabled = false;
            //保存基本信息，请求采购价分区重量段
            if (data.costSets.length > 0) {
                $scope.priceDetailList = data.costSets || [];
            } else {
                $scope.serviceTypeList = data.saleSets || [];
                $scope.priceDetailList = $scope.serviceTypeList[0].sets || [];
            }

            $scope.currentServiceTypeIndex = 0;
            $scope.currentDetailIndex = 0;
            $scope.priceDetail = $scope.priceDetailList[0] || {};

            $scope.iCostType = $scope.iInputCostType = $scope.iInputCostTypeValue = '';
            $scope.iCost = $scope.iInputCost = $scope.iInputCostValue = '';

            $scope.viewButton.isShowCancelBtn = true;
            $scope.getInfo();
            $scope.viewButton.isCopy = false; // 保存之后处于非复制状态

            if (isNext) {
                // 保存并下一步
                $scope.tabBox.selected(1); // 切换到价格明细
                $scope.isEditPrice = true; // 价格明细处于编辑状态

                $scope.priceDetail.id = $scope.priceDetailList[0] && $scope.priceDetailList[0].id;
                $scope.getPriceTable(0, $scope.priceDetail.id);

                // 清除angular表单脏值检测
                $scope.priceDetailForm.$setPristine();
                $scope.priceDetailForm.$setUntouched();
            }
        };

        /** =======================================基本信息 End============================**/

        /** =================================获取服务、重量段、分区详细信息 ================**/
        $scope.tableModel = {
            tableHeader: [
                Lang.getValByKey('common', 'common_thead_number'),
                Lang.getValByKey('common', 'common_thead_name'),
                Lang.getValByKey('common', 'common_code_code'),
                Lang.getValByKey('common', 'common_thead_type'),
                Lang.getValByKey('priceDetail', 'priceDetail_code_regionAndCountry'),
                Lang.getValByKey('common', 'common_page_remarks')
            ],
            tableBody: [],
            restURL: 'logistics.getRegionsByID',
            restData: {
                q: '',
                pageIndex: 1,
                pageSize: 10,
                schemaId: '',
                sort: 'createTime'
            },
            selectNumber: 0,
            selectFlag: false
        };

        $scope.detail = {}; // 数据均挂载到detail下面

        $scope.showDetails = function (type) {
            // 显示详情
            $scope.mainInfo = true;

            // 初始化数据
            $scope.detail.isServices = $scope.detail.isRegions = $scope.detail.isWeights = false;
            var config = {seatParams: {uid: 0}};

            if (type == 'services') {    //跳转到服务
                var priceData = {    //价格需要的参数
                    'module': $scope.parameter.module,
                    'q': $scope.parameter.q,
                    'uid': $scope.parameter.uid,
                    'type': $scope.parameter.type || ''
                };

                window.location.href = '#/services?priceData=' + JSON.stringify(priceData) + '&uid=' + $scope.iInputServicesValue + '&isfromprice=1';

            } else if (type == 'regions') {
                // 分区详情
                $scope.detail.isRegions = true;
                config.seatParams.uid = $scope.iInputRegionValue;
                $scope.detail.title = Lang.getValByKey('priceDetail', 'priceDetail_code_regionDetail');

                setTimeout(function () {
                    $scope.getRegionTable();
                    $scope.$apply();
                }, 10);
            } else if (type == 'weights') {
                // 重量段详情
                $scope.detail.isWeights = true;
                config.seatParams.uid = $scope.iInputWeightValue;
                $scope.detail.title = Lang.getValByKey('priceDetail', 'priceDetail_code_weightDetail');

                priceDetailService.getWeightDetail(config, function (res) {
                    var data = res.data;
                    $scope.detail.name = data.name;
                    $scope.detail.code = data.code;
                    $scope.detail.unit = data.unit;
                    $scope.detail.weightSectionList = data.weightSectionList;
                    $scope.detail.remark = data.remark;
                    $scope.detail.createTime = data.createTime;
                    $scope.detail.creator = data.creator;
                });
            }
        };

        /**
         * 获取分区详情表格
         */
        $scope.getRegionTable = function () {
            $scope.tableModel.restData.schemaId = $scope.iInputRegionValue;

            var config = {
                urlParams: $scope.tableModel.restData
            };

            tableService.getTable($scope.tableModel.restURL, config, function (data) {
                if (data.errorCode === 0) {
                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                    tableReData();
                    var height = priceDetailView.height('table');
                    setTimeout(function () {
                        priceDetailView.slimscroll('.table-container tbody', height);
                        $(window).resize(function () {
                            height = priceDetailView.height('table');
                            priceDetailView.slimscroll('.table-container tbody', height);
                        });
                    }, 10);
                }
            });
        };

        /**
         * 分区详情table表格搜索
         */
        $scope.searchRegionTable = function () {
            $scope.tableModel.restData.pageIndex = 1;
            $scope.q = $scope.tableModel.restData.q;
            $scope.getRegionTable();
        };

        $scope.$watch('tableModel',
            function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                tableReData();
            }, true
        );

        function tableReData() {
            angular.forEach($scope.tableModel.tableBody, function (value, key) {
                if (value.areas && value.areas.length) {
                    $scope.tableModel.tableBody[key].type = Lang.getValByKey('priceDetail', 'priceDetail_code_regionAndCountry');
                    $scope.tableModel.tableBody[key].typeValue = '';
                    for (var i = 0, len = value.areas.length; i < len; i++) {
                        if ($scope.tableModel.tableBody[key].typeValue) {
                            $scope.tableModel.tableBody[key].typeValue += '，' + sliceLastNode(value.areas[i].name);
                        } else {
                            $scope.tableModel.tableBody[key].typeValue += sliceLastNode(value.areas[i].name);
                        }
                    }
                } else if (value.postcodes && value.postcodes.length) {
                    $scope.tableModel.tableBody[key].type = Lang.getValByKey('priceDetail', 'priceDetail_code_postCode');
                    $scope.tableModel.tableBody[key].typeValue = '';
                    for (var i = 0, len = value.postcodes.length; i < len; i++) {
                        if ($scope.tableModel.tableBody[key].typeValue) {
                            $scope.tableModel.tableBody[key].typeValue += '，' + value.postcodes[i].startPostcode + '-' + value.postcodes[i].endPostcode;
                        } else {
                            $scope.tableModel.tableBody[key].typeValue += value.postcodes[i].startPostcode + '-' + value.postcodes[i].endPostcode;
                        }
                    }
                }
            });
        }

        /**
         * 返回
         */
        $scope.goBackToInfo = function () {
            $scope.mainInfo = false;
        };

        /** =================================获取服务、重量段、分区详细信息End ================**/

        /**
         * 价格明细表头获取分区地址或邮编详情
         * @param data
         * @returns {string}
         */
        $scope.getRegionDetail = function (data) {
            var html = '';
            var retData = priceDetailService.getRegionDetail(data.id).data;

            if (!retData) {
                return html;
            }

            if (retData.areas && retData.areas.length) {
                for (var i = 0, len = retData.areas.length; i < len; i++) {
                    if (html) {
                        html += '，' + sliceLastNode(retData.areas[i].name);
                    } else {
                        html += sliceLastNode(retData.areas[i].name);
                    }
                }
            } else if (retData.postcodes && retData.postcodes.length) {
                var countryName = '';
                for (var i = 0, len = retData.postcodes.length; i < len; i++) {
                    countryName = countryName ? countryName : retData.postcodes[i].countryName;
                    if (html) {
                        html += '，' + retData.postcodes[i].startPostcode + '-' + retData.postcodes[i].endPostcode;
                    } else {
                        html += retData.postcodes[i].startPostcode + '-' + retData.postcodes[i].endPostcode;
                    }
                }
                html = countryName + '（' + html + '）';
            }

            return html;
        };

        /** =======================================价格明细============================**/
        /**
         * 对比列数据和单元格数据计价方式是否一致
         */
        $scope.compare = function () {
            var rDom = $('#w-lock-table .table-content tbody tr');

            $('#w-lock-table .table-left tbody tr').each(function (index) {
                var lData = $(this)
                    .find('.u-price-edit')
                    .data();
                rDom
                    .eq(index)
                    .find('.u-edit-input')
                    .each(function () {
                        var cData = $(this).data();
                        if (lData.calcType != cData.calcType) {
                            $(this)
                                .parent()
                                .addClass('u-edit-warn');
                        } else {
                            $(this)
                                .parent()
                                .removeClass('u-edit-warn');
                        }
                    });
            });
        };

        /**
         * 获取价格明细单个tab数据信息。
         * @param id
         */
        $scope.getOnePriceDetails = function (id) {
            var config = {
                seatParams: {
                    uid: $scope.uid,
                    id: id
                }
            };
            var result = '';
            if ($scope.viewButton.isSalesPrice) {
                // 销售价
                priceDetailService.getOneSalesPriceDetail(config, function (res) {
                    if (res.errorCode == 0) {
                        result = res.data;
                    }
                });
            } else {
                priceDetailService.getOneCostPriceDetail(config, function (res) {
                    if (res.errorCode == 0) {
                        result = res.data;
                    }
                });
            }

            if (result) {
                $scope.iInputCostTypeValue = result.feeTypeIdx;
                $scope.iInputCostType = $scope.iCostType = result.feeTypeIdxName;

                $scope.iInputCostValue = result.feeTypeId;
                $scope.iInputCost = $scope.iCost = result.feeTypeName;
                //不是采购价的时候，才去请求自己的分区重量段，否则用基本信息里面返回的数据
                if ($scope.module != 'costPrice' && $scope.module != 'costPriceApproval') {
                    $scope.iDetailWeightValue = result.weightSchemaUid;
                    $scope.iDetailWeight = (result.weightSchemaUid + '') != '-1' ? result.weightName : '任意重量段';
                    $scope.iDetailRegionValue = result.regionSchemaUid;
                    $scope.iDetailRegion = (result.regionSchemaUid + '') != '-1' ? result.regionName : '任意分区';
                } else {
                    $scope.iDetailWeightValue = $scope.saveReturnCostWeightnValue;
                    $scope.iDetailRegionValue = $scope.saveReturnCostRegionValue;
                }
                $scope.freightItems = result.freightItems;
                $scope.freightRegionSettings = result.freightRegionSettings;
                $scope.freightWeightSettings = result.freightWeightSettings;

                $scope.priceDetail.id = result.id;
                $scope.priceDetail.quotationId = result.quotationId;
                $scope.priceDetail.serviceUid = result.serviceUid;
                $scope.priceDetail.supplierId = result.supplierId;

            }
            return result;
        };
        $scope.changeServiceType = function ($index) {
            if ($scope.currentServiceTypeIndex === $index) {
                return false;
            }
            $scope.currentServiceTypeIndex = $index;
            $scope.currentDetailIndex = 0;
            $scope.priceDetailList = $scope.serviceTypeList[$index].sets || [];
            $scope.priceDetail = $scope.priceDetailList[0];
            $scope.iDetailRegionValue = $scope.priceDetail.regionSchemaUid;
            $scope.iDetailWeightValue = $scope.priceDetail.weightSchemaUid;
            $scope.getPriceTable(0, $scope.priceDetail.id);
        };
        /**
         * 调用价格明细列表
         * @param id   供应商或者服务ID
         */
        $scope.getPriceTable = function ($index, id, isNotClearCost) {
            // 设置价格明细中当前活动页
            $scope.currentDetailIndex = $index;
            $scope.freightItems = [];
            $scope.freightWeightSettings = [];

            if ($scope.priceDetailList.length > 0) {
                $scope.priceDetail = $scope.priceDetailList[$index] || {};
            }

            // 当价格是销售价。
            if ($scope.viewButton.isSalesPrice && $scope.savePriceDetailCache) {
                var tmpArr = $scope.savePriceDetailCache[$scope.currentServiceTypeIndex][$scope.currentDetailIndex];
                $scope.priceDetail = {};
                $scope.priceDetail.id = tmpArr.id;
                $scope.priceDetail.quotationId = tmpArr.quotationId;
                $scope.priceDetail.serviceUid = tmpArr.serviceUid;
                $scope.priceDetail.supplierId = tmpArr.supplierId;

                // 费用类型。
                $scope.iInputCostTypeValue = tmpArr.feeTypeIdx || '';
                $scope.iCostType = $scope.iInputCostType = tmpArr.feeTypeIdxName;

                // 具体费用类型。
                $scope.iInputCostValue = tmpArr.feeTypeId;
                $scope.iCost = $scope.iInputCost = tmpArr.feeTypeName;

                // 分区
                $scope.iDetailRegion = tmpArr.regionName;
                $scope.iDetailRegionValue = tmpArr.regionSchemaUid;

                // 重量段
                $scope.iDetailWeight = tmpArr.weightName;
                $scope.iDetailWeightValue = tmpArr.weightSchemaUid;

                // 重置分区、重量段、费用类型 数据
                if (!$scope.iDetailRegionValue || !$scope.iDetailWeightValue) {
                    //从采购价获取到的分区和重量段
                    var regionAndWightFromCost = getRegionByService($scope.uid, $scope.priceDetail.serviceUid) || {};
                }
                if (!$scope.iDetailRegionValue) {
                    if (regionAndWightFromCost && regionAndWightFromCost.regionUid) {
                        $scope.iDetailRegionValue = regionAndWightFromCost.regionUid;
                        $scope.iDetailRegion = regionAndWightFromCost.regionName;
                    } else {
                        $scope.iDetailRegion = $scope.iInputRegion;
                        $scope.iDetailRegionValue = $scope.iInputRegionValue;
                    }
                    tmpArr.regionName = $scope.iDetailRegion;
                    tmpArr.regionSchemaUid = $scope.iDetailRegionValue;
                }
                if (!$scope.iDetailWeightValue) {
                    if (regionAndWightFromCost && regionAndWightFromCost.weightUid) {
                        $scope.iDetailWeightValue = regionAndWightFromCost.weightUid;
                        $scope.iDetailWeight = regionAndWightFromCost.weightName;
                    } else {
                        $scope.iDetailWeight = $scope.iInputWeight;
                        $scope.iDetailWeightValue = $scope.iInputWeightValue;
                    }
                    tmpArr.weightName = $scope.iDetailWeight;
                    tmpArr.weightSchemaUid = $scope.iDetailWeightValue;
                }

                if (!$scope.iInputCostTypeValue && regionAndWightFromCost && regionAndWightFromCost.feeTypeIdx) {
                    tmpArr.feeTypeIdx = $scope.iInputCostTypeValue = regionAndWightFromCost.feeTypeIdx || '';
                    tmpArr.feeTypeIdxName = $scope.iCostType = $scope.iInputCostType = regionAndWightFromCost.feeTypeIdxName;
                }
                if (!$scope.iInputCostValue && regionAndWightFromCost && regionAndWightFromCost.feeTypeId) {
                    tmpArr.feeTypeId = $scope.iInputCostValue = regionAndWightFromCost.feeTypeId;
                    tmpArr.feeTypeName = $scope.iCost = $scope.iInputCost = regionAndWightFromCost.feeTypeName;
                }

                if(!$scope.isEditPrice && !tmpArr.id){
                    tmpArr.feeTypeIdx = $scope.iInputCostTypeValue = '';
                    tmpArr.feeTypeIdxName = $scope.iCostType = $scope.iInputCostType = '';

                    tmpArr.feeTypeId = $scope.iInputCostValue = '';
                    tmpArr.feeTypeName = $scope.iCost = $scope.iInputCost = '';
                }

                $.extend(true, $scope.freightWeightSettings, tmpArr.freightWeightSettings);
                $.extend(true, $scope.freightItems, tmpArr.freightItems);
            }
            else {
                if (!id) {    // id不存在时，
                    $scope.priceDetail.id = $scope.priceDetailList[$index].id;
                    $scope.priceDetail.quotationId = $scope.priceDetailList[$index].quotationId;
                    $scope.priceDetail.serviceUid = $scope.priceDetailList[$index].serviceUid;
                    $scope.priceDetail.supplierId = $scope.priceDetailList[$index].supplierId;

                    // 清除费用类型
                    if (!isNotClearCost) {
                        $scope.iCostType = $scope.iInputCostType = $scope.iInputCostTypeValue = '';
                        $scope.iCost = $scope.iInputCost = $scope.iInputCostValue = '';
                    }

                    if ($scope.viewButton.isSalesPrice) {
                        //从采购价获取到的分区和重量段
                        var regionAndWightFromCost = getRegionByService($scope.uid, $scope.priceDetail.serviceUid) || {};

                        if (regionAndWightFromCost && regionAndWightFromCost.regionUid) {
                            $scope.iDetailRegionValue = regionAndWightFromCost.regionUid;
                            $scope.iDetailRegion = regionAndWightFromCost.regionName;
                        } else {
                            $scope.iDetailRegion = $scope.iInputRegion;
                            $scope.iDetailRegionValue = $scope.iInputRegionValue;
                        }
                        if (regionAndWightFromCost && regionAndWightFromCost.weightUid) {
                            $scope.iDetailWeightValue = regionAndWightFromCost.weightUid;
                            $scope.iDetailWeight = regionAndWightFromCost.weightName;
                        } else {
                            $scope.iDetailWeight = $scope.iInputWeight;
                            $scope.iDetailWeightValue = $scope.iInputWeightValue;
                        }
                        if (regionAndWightFromCost && regionAndWightFromCost.feeTypeId) {
                            $scope.iInputCostTypeValue = regionAndWightFromCost.feeTypeIdx || '';
                            $scope.iCostType = $scope.iInputCostType = regionAndWightFromCost.feeTypeIdxName;
                            $scope.iInputCostValue = regionAndWightFromCost.feeTypeId;
                            $scope.iCost = $scope.iInputCost = regionAndWightFromCost.feeTypeName;
                        }
                    } else {
                        $scope.iDetailRegionValue = $scope.saveReturnCostRegionValue;
                        $scope.iDetailWeightValue = $scope.saveReturnCostWeightnValue;
                        $scope.iDetailRegion = $scope.saveReturnCostRegion;
                        $scope.iDetailWeight = $scope.saveReturnCostWeightn;
                    }

                    if ($scope.copyPriceDetailList[$scope.currentServiceTypeIndex]) {
                        if ($scope.baseInfo.saleSets && $scope.baseInfo.saleSets.length) {
                            var current = $scope.copyPriceDetailList[$scope.currentServiceTypeIndex][$scope.currentDetailIndex];
                        } else {
                            var current = $scope.copyPriceDetailList[$index];
                        }

                        angular.forEach(current.freightItems, function (value, key) {
                            $scope.freightItems[key] = {};
                            $scope.freightItems[key].baseUnitCode = value.baseUnitCode;
                            $scope.freightItems[key].baseUnitName = value.baseUnitName;
                            $scope.freightItems[key].baseValue = value.baseValue;
                            $scope.freightItems[key].calcName = value.calcName;
                            $scope.freightItems[key].calcType = value.calcType;
                            $scope.freightItems[key].id = value.id;
                            $scope.freightItems[key].idx = value.idx;
                            $scope.freightItems[key].ordinal = value.ordinal;
                            $scope.freightItems[key].price = value.price;
                            $scope.freightItems[key].quotationId = value.quotationId;
                            $scope.freightItems[key].quotationSetId = value.quotationSetId;
                            $scope.freightItems[key].toRegionUid = value.toRegionUid;
                        });
                        $scope.iCostType = $scope.iInputCostType = current.feeTypeIdxName || '';
                        $scope.iInputCostTypeValue = current.feeTypeIdx || '';

                        $scope.iCost = $scope.iInputCost = current.feeTypeName || '';
                        $scope.iInputCostValue = current.feeTypeId || '';

                        $scope.iDetailWeight = current.weightName || regionAndWightFromCost.weightName || $scope.iInputWeight;
                        $scope.iDetailWeightValue = current.weightSchemaUid || regionAndWightFromCost.weightUid || $scope.iInputWeightValue;

                        $scope.iDetailRegion = current.regionName || regionAndWightFromCost.regionName || $scope.iInputRegion;
                        $scope.iDetailRegionValue = current.regionSchemaUid || regionAndWightFromCost.regionUid || $scope.iInputRegionValue;

                        angular.forEach(current.freightWeightSettings, function (value, key) {
                            var map = {
                                baseUnitCode: value.baseUnitCode,
                                baseUnitName: value.baseUnitName,
                                baseValue: value.baseValue,
                                calcName: value.calcName,
                                calcType: value.calcType,
                                id: value.id,
                                ordinal: value.ordinal,
                                quotationId: value.quotationId,
                                quotationSetId: value.quotationSetId
                            };
                            $scope.freightWeightSettings.push(map);
                        });
                    }
                } else {    // id存在时，加载对应id的价格明细
                    var result = $scope.getOnePriceDetails(id);
                    $scope.iDetailWeightValue = result.weightSchemaUid;
                    $scope.iDetailRegionValue = result.regionSchemaUid;
                }
            }

            var weightSchemaUid = $scope.iDetailWeightValue ? $scope.iDetailWeightValue : '-1';
            var regionSchemaUid = $scope.iDetailRegionValue ? $scope.iDetailRegionValue : '-1';
            var config = {
                seatParams: {
                    regionSchemaUid: regionSchemaUid,
                    weightSchemaUid: weightSchemaUid
                }
            };

            var weightRegionData = priceDetailService.getWeightAndRegion(config).data;
            if (!weightRegionData) {
                return;
            }
            var weightInfo = weightRegionData.weights,
                weightList = [];
            if (weightInfo) {
                weightList = weightInfo && weightInfo.weightSectionList
            } else {
                weightList = [{"id": "", "refId": "", "startPoint": "0", "endPoint": "任意"}];
            }

            var regionInfo = weightRegionData.regions,
                regionList = [];
            if (regionInfo) {
                regionList = regionInfo && regionInfo.regionlist;
            } else {
                regionList = [{"id": "", "name": "任意", "code": ""}];
            }
            // 组织表格左侧数据
            var leftData = [[Lang.getValByKey('common', 'common_thead_number'), Lang.getValByKey('priceDetail', 'priceDetail_page_priceMethod'), Lang.getValByKey('priceDetail', 'priceDetail_code_weightOrRegion')]];
            for (var i = 0, wl = weightList.length; i < wl; i++) {
                var arr = [i + 1, Lang.getValByKey('priceDetail', 'priceDetail_code_editPrice'), weightList[i].startPoint + '-' + weightList[i].endPoint];
                leftData.push(arr);
            }

            // 组织表格右侧数据
            var rightData = [];
            for (var i = 0; i <= wl; i++) {
                var arr = [];
                for (var j = 0, rl = regionList.length; j < rl; j++) {
                    if (i == 0) {
                        // 表头分区
                        arr.push(regionList[j].name);
                    } else {
                        // 内容
                        arr.push('');
                    }
                }
                rightData.push(arr);
            }
            $scope.htable = $('#w-lock-table').htable({left: leftData, right: rightData}, {});

            $('#w-lock-table .table-top th').tootips({mouseoverfn: $scope.getRegionDetail});

            // 重量段单位
            $('#w-lock-table').find('.i-unit').html('(' + weightRegionData.weightUnit + ')');
            if (regionList) {   // table-top绑定分区data
                $('#w-lock-table').find('.table-top').find('th').each(function (index) {
                    $(this).data(regionList[index]);
                });
            }

            $('#w-lock-table').find('.u-price-edit').each(function (index) {
                if (!$scope.freightWeightSettings[index]) {
                    var map = {
                        baseUnitCode: 'kg',
                        baseUnitName: Lang.getValByKey('priceDetail', 'priceDetail_code_unitKg'),
                        baseValue: 1,
                        calcName: $scope.defatutPriceMethod.name,
                        calcType: $scope.defatutPriceMethod.code
                    };
                    $scope.freightWeightSettings[index] = map;

                    if ($scope.viewButton.isSalesPrice && $scope.savePriceDetailCache) {
                        var tmpArr = $scope.savePriceDetailCache[$scope.currentServiceTypeIndex][$scope.currentDetailIndex];
                        tmpArr.freightWeightSettings = tmpArr.freightWeightSettings ? tmpArr.freightWeightSettings : [];
                        tmpArr.freightWeightSettings[index] = map;
                    }
                }
                $(this).data($scope.freightWeightSettings[index]);
                $(this).text($scope.freightWeightSettings[index].calcName);

                var attrHtml = '<ul class="tootips-list">';
                attrHtml += '<li><span>' + Lang.getValByKey('priceDetail', 'priceDetail_page_priceMethod') + '：</span>' + $scope.freightWeightSettings[index].calcName + '</li>';
                if ($scope.freightWeightSettings[index].calcType != $scope.sumPriceMethod.code) {
                    // 总价
                    attrHtml += '<li><span>' + Lang.getValByKey('priceDetail', 'priceDetail_page_priceUnit') + '：</span>' + $scope.freightWeightSettings[index].baseValue + $scope.freightWeightSettings[index].baseUnitName + '</li>';
                }
                attrHtml += '</ul>';
                $(this).attr('data-tootips', attrHtml);
            });

            var thLength = $('#w-lock-table .table-top thead').find('th').length; // 单元格的列数
            var trIndex = 0; // 循环tr的行数

            $('#w-lock-table').find('.u-edit-input').each(function (index) {
                var map = {
                    baseUnitCode: 'kg', // 价格单位code
                    baseUnitName: Lang.getValByKey('priceDetail', 'priceDetail_code_unitKg'), // 价格名称name
                    baseValue: 1, // 价格单位基准
                    calcName: $scope.defatutPriceMethod.name, // 计价方式name
                    calcType: $scope.defatutPriceMethod.code, // 计价方式type
                    price: '' // 价格值
                };

                var divisor = index + 1 - thLength * trIndex;
                if ((index + 1) % thLength == 0) {
                    ++trIndex;
                }
                if ($scope.freightItems[index] && $scope.freightItems[index].idx && divisor == $scope.freightItems[index].idx) {

                } else if ($scope.freightItems[index] && $scope.freightItems[index].idx != divisor) {
                    map.idx = divisor;
                    $scope.freightItems.splice(index, 0, map);
                } else if (!$scope.freightItems[index]) {
                    map.idx = divisor;
                    $scope.freightItems.splice(index, 0, map);
                }

                if (!$scope.freightItems[index]) {
                    $scope.freightItems[index] = map;
                }

                $scope.freightItems[index].price = $scope.freightItems[index].price == -1 ? '' : $scope.freightItems[index].price;
                $(this).data($scope.freightItems[index]);
                $(this).val($scope.freightItems[index].price);

                var attrHtml = '<ul class="tootips-list">';
                attrHtml += '<li><span>' + Lang.getValByKey('priceDetail', 'priceDetail_page_priceMethod') + '：</span>' + $scope.freightItems[index].calcName + '</li>';
                attrHtml += '<li><span>' + Lang.getValByKey('priceDetail', 'priceDetail_page_priceValue') + '：</span>' + $scope.freightItems[index].price + '</li>';
                if ($scope.freightItems[index].calcType != $scope.sumPriceMethod.code) {
                    // 总价
                    attrHtml += '<li><span>' + Lang.getValByKey('priceDetail', 'priceDetail_page_priceUnit') + '：</span>' + $scope.freightItems[index].baseValue + $scope.freightItems[index].baseUnitName + '</li>';
                }
                attrHtml += '</ul>';
                $(this).attr('data-tootips', attrHtml);
            });

            // 价格为销售价时，缓存数据。
            if ($scope.viewButton.isSalesPrice && $scope.savePriceDetailCache) {
                $scope.savePriceDetailCache[$scope.currentServiceTypeIndex][$scope.currentDetailIndex].freightItems = [];
                $.extend(true, $scope.savePriceDetailCache[$scope.currentServiceTypeIndex][$scope.currentDetailIndex].freightItems, $scope.freightItems);
            }

            $scope.compare();

            if ($scope.isEditPrice) {
                // 价格明细编辑状态
                $scope.htable.editCell(showEditCell, $scope.changeSavePriceDetailCacheVal);
                $scope.htable.editRow(showEidtRow);
            } else {
                $('[data-tootips]').tootips();
            }
        };

        /**
         * 价格明细-编辑
         */
        $scope.editPrice = function () {
            $scope.isEditPrice = true; // 编辑状态位设置
            $scope.viewButton.submitDisabled = true;

            $scope.htable.editCell(showEditCell, $scope.changeSavePriceDetailCacheVal); // 单元格编辑启用
            $scope.htable.editRow(showEidtRow);
        };

        /**
         * 保存单价单元格内容
         */
        $scope.setCellData = function () {
            // 计价方式
            var priceMethodModel = $scope.priceMethodModel,
                priceMethodValue = $scope.priceMethodValue;

            // 价格值
            var priceValue = $scope.priceValue;

            // 价格单位
            var priceBaseUnit = $scope.priceBaseUnit,
                priceUnit = $scope.priceUnit,
                priceUnitValue = $scope.priceUnitValue;

            if (!priceMethodModel) {
                $scope.priceForm.priceMethodModel.$setDirty();
            }
            if (!priceValue) {
                $scope.priceForm.priceValue.$setDirty();
            }
            if (!$scope.ePriceTotal) {
                // 非总价
                if (!priceBaseUnit) {
                    $scope.priceForm.priceBaseUnit.$setDirty();
                }
                if (!priceUnit) {
                    $scope.priceForm.priceUnit.$setDirty();
                }
            }
            if (!$scope.priceForm.$valid) {
                return;
            }

            // 行index
            var aDom = $('#w-lock-table').find('.u-edit-box.active');
            var index = aDom
                .parent('td')
                .parent('tr')
                .index();
            // 行左侧数据
            var lData = $('#w-lock-table .table-left tbody tr')
                .eq(index)
                .find('.u-price-edit')
                .data();
            // 和左侧calcType 不一致时添加样式
            if (lData.calcType == priceMethodValue) {
                aDom.removeClass('u-edit-warn');
            } else {
                aDom.addClass('u-edit-warn');
            }

            aDom.removeClass('u-edit-error');

            var data = {
                calcName: priceMethodModel,
                calcType: priceMethodValue,
                price: priceValue,
                baseValue: priceBaseUnit,
                baseUnitName: priceUnit,
                baseUnitCode: priceUnitValue
            };
            $scope.htable.setCellData(data, $scope.changeSavePriceDetailCacheVal);

            $(document).promptBox('closeFormPrompt');
        };

        /**
         * 保存重量段整行内容
         */
        $scope.setRowData = function () {
            // 计价方式
            var priceMethodModel = $scope.priceMethodModel,
                priceMethodValue = $scope.priceMethodValue;

            // 价格单位
            var priceBaseUnit = $scope.priceBaseUnit,
                priceUnit = $scope.priceUnit,
                priceUnitValue = $scope.priceUnitValue;

            if (!priceMethodModel) {
                $scope.priceForm.priceMethodModel.$setDirty();
            }
            if (!$scope.ePriceTotal) {
                // 非总价
                if (!priceBaseUnit) {
                    $scope.priceForm.priceBaseUnit.$setDirty();
                }
                if (!priceUnit) {
                    $scope.priceForm.priceUnit.$setDirty();
                }
            }
            if (!$scope.priceForm.$valid) {
                return;
            }

            // 行index
            var aDom = $('#w-lock-table').find('.u-price-edit.active');
            var index = aDom.parent('td').parent('tr').index();
            // 行右侧数据处理
            $('#w-lock-table .table-content tbody tr').eq(index).find('.u-edit-warn').each(function () {
                $(this).removeClass('u-edit-warn');
            });

            var data = {
                calcName: priceMethodModel,
                calcType: priceMethodValue,
                baseValue: priceBaseUnit,
                baseUnitName: priceUnit,
                baseUnitCode: priceUnitValue
            };
            $scope.htable.setRowData(data, $scope.changeSavePriceDetailCacheVal);

            $(document).promptBox('closeFormPrompt');
        };

        function showEditCell(data) {
            // 清除angular表单脏值检测
            $scope.priceForm.$setPristine();
            $scope.priceForm.$setUntouched();
            // 重置viewModule的值。否则下面的传值不生效
            $scope.weightName = '';
            $scope.regionName = '';
            $scope.priceMethodModel = '';
            $scope.priceMethodValue = '';
            $scope.priceValue = '';
            $scope.priceBaseUnit = '';
            $scope.priceUnit = '';
            $scope.priceUnitValue = '';
            $scope.ePriceValue = true;
            $scope.$apply();

            // 初始化弹出层数据
            $scope.weightName = data.latitude;
            $scope.regionName = data.longitude;
            $scope.priceMethodModel = data.calcName;
            $scope.priceMethodValue = data.calcType;
            $scope.priceValue = data.price == -1 ? '' : data.price;
            $scope.priceBaseUnit = data.baseValue;
            $scope.priceUnit = data.baseUnitName;
            $scope.priceUnitValue = data.baseUnitCode;

            if ($scope.priceMethodValue == $scope.sumPriceMethod.code) {
                // 总价
                $scope.ePriceTotal = true;
            } else {
                $scope.ePriceTotal = false;
            }
            $scope.$apply();

            $(document).promptBox({
                title: Lang.getValByKey('priceDetail', 'priceDetail_code_editPrice'),
                isMiddle: true,
                isNest: true,
                content: {
                    nest: $('#cellEdit')
                },
                loadData: function () {
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey('common', 'common_page_save'),
                        operationEvent: function () {
                            if ($scope.ePriceValue) {
                                $scope.setCellData();
                            } else {
                                $scope.setRowData();
                            }
                            $scope.$apply();
                        }
                    }
                ]
            });
        }

        function showEidtRow(data) {
            // 清除angular表单脏值检测
            $scope.priceForm.$setPristine();
            $scope.priceForm.$setUntouched();
            // 重置viewModule的值。否则下面的传值不生效
            $scope.weightName = '';
            $scope.regionName = '';
            $scope.priceMethodModel = '';
            $scope.priceMethodValue = '';
            $scope.priceBaseUnit = '';
            $scope.priceUnit = '';
            $scope.priceUnitValue = '';
            $scope.ePriceValue = false;
            $scope.$apply();

            // 初始化弹出层数据
            $scope.weightName = data.latitude;
            $scope.regionName = data.longitude;
            $scope.priceMethodModel = data.calcName;
            $scope.priceMethodValue = data.calcType;
            $scope.priceBaseUnit = data.baseValue;
            $scope.priceUnit = data.baseUnitName;
            $scope.priceUnitValue = data.baseUnitCode;

            if ($scope.priceMethodValue == $scope.sumPriceMethod.code) {
                // 总价
                $scope.ePriceTotal = true;
            } else {
                $scope.ePriceTotal = false;
            }
            $scope.$apply();

            $(document).promptBox({
                title: Lang.getValByKey('priceDetail', 'priceDetail_code_editPrice'),
                isMiddle: true,
                isNest: true,
                content: {
                    nest: $('#cellEdit')
                },
                loadData: function () {
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey('common', 'common_page_save'),
                        operationEvent: function () {
                            if ($scope.ePriceValue) {
                                $scope.setCellData();
                            } else {
                                $scope.setRowData();
                            }
                            $scope.$apply();
                        }
                    }
                ]
            });
        }


        $scope.changeSavePriceDetailCacheVal = function (type, data, index) {
            if ($scope.savePriceDetailCache && $scope.savePriceDetailCache[$scope.currentServiceTypeIndex]) {
                var tmpArr = $scope.savePriceDetailCache[$scope.currentServiceTypeIndex][$scope.currentDetailIndex];

                if (type == 'cell') {    // 价格明细
                    var map = {
                        baseUnitCode: 'kg', // 价格单位code
                        baseUnitName: Lang.getValByKey('priceDetail', 'priceDetail_code_unitKg'), // 价格名称name
                        baseValue: 1, // 价格单位基准
                        calcName: $scope.defatutPriceMethod.name, // 计价方式name
                        calcType: $scope.defatutPriceMethod.code, // 计价方式type
                        price: '' // 价格值
                    };
                    if(tmpArr.freightItems[index]){
                        tmpArr.freightItems[index] = $.extend(true, {}, map,tmpArr.freightItems[index], data);
                    }else{
                        tmpArr.freightItems[index] = $.extend(true, {}, data);
                    }
                } else if (type == 'row') {    // 计价方式
                    tmpArr.freightWeightSettings[index] = $.extend(true, {}, data);
                }
            }
        };

        //复制价格明细
        $scope.copyPriceDetail = function () {
            //全选，反选
            $scope.checkedArr = [];
            $scope.checkedOrCancelAll = function ($event) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                if (action === 'add') {
                    $scope.checkedArr = [];
                    $.each($scope.allPriceDetailList, function (index, val) {
                        if (val.serviceUid != $scope.priceDetail.serviceUid) {
                            $scope.checkedArr.push(val.serviceUid);
                        }
                    });
                } else {
                    $scope.checkedArr = [];
                }
            };
            $scope.isCheckedAll = function () {
                if ($scope.allPriceDetailList.length === 1) {
                    return false;
                }
                return ($scope.allPriceDetailList.length - 1) === $scope.checkedArr.length;
            };
            $scope.checkedOne = function ($event, serviceUid) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');

                if (action === 'add' && $scope.checkedArr.indexOf(serviceUid) == -1) {
                    $scope.checkedArr.push(serviceUid);
                }
                if (action === 'remove' && $scope.checkedArr.indexOf(serviceUid) != -1) {
                    var idx = $scope.checkedArr.indexOf(serviceUid);
                    $scope.checkedArr.splice(idx, 1);
                }
            };
            $scope.isCheckedOne = function (serviceUid) {
                if ($.inArray(serviceUid, $scope.checkedArr) > -1) {
                    return true;
                } else {
                    return false;
                }
            }

            $(document).promptBox({
                title: Lang.getValByKey('priceDetail', 'priceDetail_copy_to'),
                isMiddle: true,
                isNest: true,
                content: {
                    nest: $('#copyDetail')
                },
                loadData: function () {
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey('common', 'common_page_save'),
                        operationEvent: function () {
                            var config = {
                                urlParams: {
                                    fromUid: $scope.priceDetail.serviceUid,
                                    toUids: $scope.checkedArr
                                },
                                seatParams: {
                                    uid: $scope.uid
                                }
                            };
                            priceDetailService.copyPriceDetail(config, function (res) {
                                $(document).promptBox('closeFormPrompt');
                                if (res.errorCode === 0) {
                                    //复制成功，重新请求价格信息
                                    $scope.getInfo();
                                    $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
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
        };
        /**
         * 保存价格明细
         */
        $scope.savePrice = function () {
            if ($scope.viewButton.isSalesPrice && $scope.savePriceDetailCache) {    // 销售价
                if ($('#w-lock-table .u-edit-error').length) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: Lang.getValByKey('priceDetail', 'priceDetail_page_priceValueError'),
                        type: 'errer',
                        manualClose: true
                    });
                    return;
                }
                // 组织数据并进行数据校验
                var arr = [], flag = true;
                for (var m = 0, ml = $scope.savePriceDetailCache.length; m < ml; m++) {
                    for (var n = 0, nl = $scope.savePriceDetailCache[m].length; n < nl; n++) {
                        if (!$scope.savePriceDetailCache[m][n].feeTypeIdx || !$scope.savePriceDetailCache[m][n].feeTypeId) {
                            flag = false;
                        } else {
                            if ($scope.savePriceDetailCache[m][n].freightItems.length) {
                                arr.push($scope.savePriceDetailCache[m][n]);

                                // Price为空时，传-1
                                for (var k = 0, kl = $scope.savePriceDetailCache[m][n].freightItems.length; k < kl; k++) {
                                    if ($scope.savePriceDetailCache[m][n].freightItems[k].price === '') {
                                        $scope.savePriceDetailCache[m][n].freightItems[k].price = -1;
                                    }
                                }
                            }
                        }
                    }
                }

                if (!flag) {
                    $(document).promptBox({isDelay: true, contentDelay: '必填项不能为空！', type: 'errer', manualClose: true});
                    return;
                }

                var config = {
                    urlParams: arr,
                    seatParams: {
                        uid: $scope.uid
                    }
                };

                var saveAllSales = $scope.isOffline ? 'saveAllAuditSalesPrice' : 'saveAllSalesPrice';
                // 调用接口
                priceDetailService[saveAllSales](config, function (res) {
                    if (res.errorCode == 0) {
                        $scope.viewButton.submitDisabled = false; // 可进行提交审核
                        $scope.isEditPrice = false;
                        $scope.htable.cancelEditCell();

                        $scope.getInfo();

                        $scope.currentServiceTypeIndex = 0;
                        $scope.currentDetailIndex = 0;

                        $scope.getPriceTable($scope.currentDetailIndex);

                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
                    } else {
                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'errer', manualClose: true});
                    }
                });
            } else {    // 成本价
                // 费用类型校验
                if (!$scope.iInputCostType) {
                    $scope.priceDetailForm.iInputCostType.$setDirty();
                }
                if (!$scope.iInputCost) {
                    $scope.priceDetailForm.iInputCost.$setDirty();
                }
                if (!$scope.priceDetailForm.$valid) {
                    return;
                }

                if ($('#w-lock-table .u-edit-error').length) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: Lang.getValByKey('priceDetail', 'priceDetail_page_priceValueError'),
                        type: 'errer',
                        manualClose: true
                    });
                    return;
                }

                // 组织数据
                var leftTrList = $('#w-lock-table .table-left tbody').children('tr'),
                    rightTrList = $('#w-lock-table .table-content tbody').children('tr');

                var rowLength = leftTrList.length || rightTrList.length,
                    colLength = rightTrList.children('td').length;

                var priceMethod = [],
                    priceDetail = [];

                var map = {};
                for (var i = 0; i < rowLength; i++) {
                    // 组织计价方式数据
                    var mData = leftTrList
                        .find('a.u-price-edit')
                        .eq(i)
                        .data();
                    map = {
                        calcType: mData.calcType || -1,
                        baseValue: mData.baseValue || 1,
                        baseUnitCode: mData.baseUnitCode || ''
                    };
                    priceMethod.push(map);

                    // 组织右侧价格明细
                    rightTrList
                        .eq(i)
                        .children('td')
                        .each(function () {
                            var pData = $(this)
                                .find('.u-edit-input')
                                .data();
                            pData.price = pData.price === '' ? -1 : pData.price;
                            map = {
                                calcType: pData.calcType || -1,
                                price: pData.price,
                                baseValue: pData.baseValue || 1,
                                baseUnitCode: pData.baseUnitCode || ''
                            };
                            priceDetail.push(map);
                        });
                }
                var config = {
                    urlParams: {
                        freightItems: priceDetail,
                        freightWeightSettings: priceMethod,
                        weightSchemaUid: $scope.iDetailWeightValue,
                        regionSchemaUid: $scope.iDetailRegionValue,
                        feeTypeId: $scope.iInputCostValue,
                        supplierId: $scope.priceDetail.supplierId,
                        serviceUid: $scope.priceDetail.serviceUid,
                        id: $scope.priceDetail.id,
                        quotationId: $scope.priceDetail.quotationId
                    },
                    seatParams: {
                        uid: $scope.uid
                    }
                };

                var saveCost = $scope.isOffline ? 'saveAuditCostPrice' : 'saveCostPrice';
                priceDetailService[saveCost](config, function (res) {
                    if (res.errorCode === 0) {
                        $scope.viewButton.submitDisabled = false; // 可进行提交审核

                        $scope.priceDetail.id = res.data.id;

                        $scope.isEditPrice = false;

                        $scope.htable.cancelEditCell();

                        // 重新请求价格明细
                        $scope.getPriceTable($scope.currentDetailIndex, $scope.priceDetail.id);

                        $scope.priceDetailList[$scope.currentDetailIndex].id = $scope.priceDetail.id;

                        $(document).promptBox({isDelay: true, contentDelay: res.msg, type: 'success'});
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
        };

        /** =======================================调用价格明细列表 End============================**/

        function tabBoxCallback(index) {
            if (index == 0) {
                // 基本信息
                $scope.getInfo($scope.uid);
                $scope.cancelPrice();    // 在价格明细处于编辑状态时，切换到基本信息里面。
                $scope.$apply();
            } else if (index == 1) {
                $scope.currentServiceTypeIndex = 0;
                // 价格明细
                if ($scope.isEditPrice) {
                    // 清除angular表单脏值检测
                    $scope.priceDetailForm.$setPristine();
                    $scope.priceDetailForm.$setUntouched();
                }
                if ($scope.module != 'costPrice' && $scope.module != 'costPriceApproval') {
                    if ($scope.serviceTypeList.length > 0) {
                        $scope.allPriceDetailList = [];
                        $scope.isCreatPrice = true;
                        //判断是否为“新增价格明细”(若saleSets中sets下所有的set.id都为null，说明为新增)
                        $.each($scope.serviceTypeList, function (index, val) {
                            $.each(val.sets, function (i, v) {
                                $scope.allPriceDetailList.push(v);
                                if (v.id != null) {
                                    $scope.isCreatPrice = false;
                                    return;
                                }
                            });
                        });
                    }
                }

                if ($scope.priceDetailList && $scope.priceDetailList.length > 0) {
                    $scope.priceDetail.id = $scope.priceDetailList[0] && $scope.priceDetailList[0].id;
                }
                $scope.getPriceTable(0, $scope.priceDetail.id);
                $scope.$apply();
            }
        }

        $scope.goBack = function () {
            var q = $scope.parameter.q;
            var module = $scope.parameter.module;
            var type = $scope.parameter.type || '';
            var action = $scope.parameter.action;

            var url = '#/' + q + '?module=' + module;
            type ? url += '&type=' + type : '';
            // if (($scope.isEdit || $scope.isEditPrice) && !action) {
            if ($scope.isEdit || $scope.isEditPrice) {
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
                                window.location.href = url;
                            }
                        }
                    ]
                });
            } else {
                window.location.href = url;
            }
        };

        /** =======================================调用后台接口列表============================**/
        var servicesEle, costTypeEle, costEle, goodsEle, currencyEle, accountEle, weightEle, regionEle, priceTypeEle, priceLevelEle, clientEle;

        /**
         * 获取服务下拉框
         */
        $scope.getServicesData = function (q, currentPage) {
            if (!currentPage) {
                currentPage = 1;
            }
            q = q ? q : '';
            var config = {
                urlParams: {
                    q: q,
                    pageIndex: currentPage,
                    pageSize: 10,
                    status: 3,
                    includeAllAudit: true
                },
                seatParams: {
                    serviceTypeId: -1
                }
            };
            var data = priceDetailService.getServices(config);
            angular.forEach(data.data, function (value, key) {
                value.name += '(' + value.code + ')';
            });
            return data;
        };
        $scope.getServices = function () {
            $scope.servicesData = $scope.getServicesData();
            servicesEle = selectFactory({
                data: $scope.servicesData,
                isSearch: true,
                isUsePinyin: true,
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                id: 'select-service',
                searchPlaceHoder: Lang.getValByKey('common', 'common_select_search_tips'),
                showTextField: 'name',
                attrTextField: {
                    'ng-value': 'uid'
                },
                closeLocalSearch: true,
                pagination: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.servicesData = $scope.getServicesData(data, currentPage);
                    servicesEle.setData($scope.servicesData);
                },
                attrTextId: function (uid) {
                    // 从销售价复制到采购价：修改服务，清空复制价格。否则不清空
                    if ($scope.module == 'salesPrice' && uid != $scope.iInputServicesValue) {
                        $scope.copyPriceDetailList = [];
                    }
                    $scope.iInputServicesValue = uid;
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.iInputServices = name;
                    $scope.$apply();
                }
            });
            servicesEle.open();
            $('#select-service').val($scope.iInputServices);
        };

        /**
         * 获取费用类型下拉框
         */
        $scope.getCostType = function () {
            if (costTypeEle) {
                return;
            }

            $scope.costTypeData = priceDetailService.getCostType();

            costTypeEle = selectFactory({
                data: $scope.costTypeData,
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                id: 'select-cost-type',
                showTextField: 'name',
                attrTextModel: function (name, data, item) {
                    $scope.iInputCostType = name;

                    if (!item.id) {
                        $scope.iInputCost = $scope.iInputCostValue = '';
                        $scope.iInputCostTypeValue = '';
                        costEle && costEle.clearData();
                    } else {
                        $scope.iInputCostTypeValue = item.id;
                    }

                    // 销售价缓存数据
                    if ($scope.viewButton.isSalesPrice && $scope.savePriceDetailCache) {
                        var tmpArr = $scope.savePriceDetailCache[$scope.currentServiceTypeIndex][$scope.currentDetailIndex];

                        tmpArr.feeTypeIdxName = name || '';
                        tmpArr.feeTypeIdx = item.id || '';
                    }
                    $scope.$apply();
                }
            });
            costTypeEle.open();
            $('#select-cost-type').val($scope.iInputCostType);
        };
        $scope.getCostData = function (q, currentPage) {
            var config = {
                urlParams: {
                    q: q ? q : '',
                    pageIndex: currentPage ? currentPage : 1,
                    pageSize: 10,
                    type: $scope.iInputCostTypeValue,
                    sort: 'code'
                }
            };
            var data = priceDetailService.getCost(config);
            angular.forEach(data.data, function (value, key) {
                value.name += '(' + value.code + ')';
            });
            return data;
        };
        $scope.getCost = function () {
            if (!$scope.iInputCostTypeValue || costEle) {
                return;
            }

            costEle = selectFactory({
                data: [],
                isSearch: true,
                isUsePinyin: true,
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                id: 'select-cost',
                showTextField: 'name',
                pagination: true,
                isSaveInputVal: true,
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    if (!$scope.iInputCostType) {
                        return;
                    }
                    $scope.costData = $scope.getCostData(data, currentPage);
                    attachEvent.setData($scope.costData);
                },
                attrTextModel: function (name, data, item) {
                    $scope.iInputCost = name;
                    $scope.iInputCostValue = item.id || '';

                    // 销售价缓存数据
                    if ($scope.viewButton.isSalesPrice && $scope.savePriceDetailCache) {
                        var tmpArr = $scope.savePriceDetailCache[$scope.currentServiceTypeIndex][$scope.currentDetailIndex];
                        tmpArr.feeTypeName = name || '';
                        tmpArr.feeTypeId = item.id || '';
                    }
                    $scope.$apply();
                }
            });
            costEle.open();
        };

        /**
         * 获取货物类型下拉框
         */
        $scope.getGoods = function () {
            if (goodsEle) {
                return;
            }

            $scope.goodsData = priceDetailService.getGoods();

            goodsEle = selectFactory({
                data: $scope.goodsData,
                isUsePinyin: true,
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                id: 'select-goods',
                showTextField: 'name',
                attrTextField: {
                    'ng-value': 'code'
                },
                attrTextId: function (code) {
                    $scope.iInputGoodsTypeValue = code;
                },
                attrTextModel: function (name) {
                    $scope.iInputGoodsType = name;
                    $scope.$apply();
                }
            });
            goodsEle.setData($scope.goodsData);
            goodsEle.open();
            $('#select-goods').val($scope.iInputGoodsType);
        };

        /**
         * 获取计价货币下拉框
         */
        $scope.getCurrency = function () {
            if (currencyEle) {
                return;
            }
            currencyEle = selectFactory({
                data: [],
                isSearch: true,
                closeLocalSearch: true,
                pagination: true,
                isSaveInputVal: true,
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                id: 'select-currency',
                showTextField: 'name',
                attrTextField: {
                    'ng-value': 'code'
                },
                searchPlaceHoder: Lang.getValByKey('priceDetail', 'priceDetail_page_currencyPlacer'),
                attrTextId: function (code) {
                    $scope.iInputCurrencyValue = code;
                },
                attrTextModel: function (name) {
                    $scope.iInputCurrency = name;
                    $scope.$apply();
                },
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.currencyData = priceDetailService.getCurrency({
                        urlParams: {
                            q: data,
                            pageSize: 10,
                            pageIndex: currentPage ? currentPage : 1
                        }
                    });
                    angular.forEach($scope.currencyData.data, function (value, key) {
                        value.name += '(' + value.code + ')';
                    });
                    attachEvent.setData($scope.currencyData);
                }
            });
            currencyEle.open();
        };

        /**
         * 获取结算方式下拉框
         */
        $scope.getAccountData = function (q, currentPage) {
            if (!currentPage) {
                currentPage = 1;
            }
            q = q ? q : '';
            var config = {
                urlParams: {
                    q: q,
                    pageIndex: currentPage,
                    pageSize: 10
                }
            };
            return priceDetailService.getAccount(config);
        };
        $scope.getAccount = function () {
            accountEle = selectFactory({
                data: [],
                isSearch: true,
                isUsePinyin: true,
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                id: 'select-account',
                showTextField: 'name',
                closeLocalSearch: true,
                isSaveInputVal: true,
                pagination: true,
                searchPlaceHoder: Lang.getValByKey('common', 'common_select_search_tips'),
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.accountData = $scope.getAccountData(data, currentPage);
                    angular.forEach($scope.accountData.data, function (value, key) {
                        value.name += '(' + value.code + ')';
                    });
                    attachEvent.setData($scope.accountData);
                },
                attrTextField: {
                    'ng-value': 'id'
                },
                attrTextId: function (id) {
                    $scope.iInputAccountValue = id;
                },
                attrTextModel: function (name) {
                    $scope.iInputAccount = name;
                    $scope.$apply();
                }
            });
            // accountEle.setData($scope.accountData);
            accountEle.open();
            // $('#select-account').val($scope.iInputAccount);
        };

        /**
         * 获取重量段下拉框
         */
        $scope.getWeightData = function (q, currentPage) {
            if (!currentPage) {
                currentPage = 1;
            }
            q = q ? q : '';
            var config = {
                urlParams: {
                    q: q,
                    pageIndex: currentPage,
                    pageSize: 10,
                    sort: 'code',
                    asc: true
                }
            };
            var data = priceDetailService.getWeight(config);
            angular.forEach(data.data, function (value, key) {
                value.name += '(' + value.code + ')';
            });
            return data;
        };
        $scope.getWeight = function (type) {
            var id = '';
            if (type == 'info') {
                id = 'select-weight-info';
            } else {
                id = 'select-weight-detail';
            }
            $scope.weightData = $scope.getWeightData();

            weightEle = selectFactory({
                data: $scope.weightData,
                isSearch: true,
                isUsePinyin: true,
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                id: id,
                pagination: true,
                searchPlaceHoder: Lang.getValByKey('common', 'common_select_search_tips'),
                showTextField: 'name',
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.weightData = $scope.getWeightData(data, currentPage);
                    attachEvent.setData($scope.weightData);
                },
                attrTextModel: function (name, data, item) {
                    if (type == 'info') {
                        // 基本信息中的重量段
                        $scope.iInputWeight = name;
                        $scope.iInputWeightValue = item.uid || '';

                        // 销售价复制到销售价或者修改销售价时，不清空内容。
                        if ($scope.module != 'salesPrice' || ($scope.urlData && $scope.urlData.priceType != 2)) {
                            // 当修改时或者复制时基本信息里面修改了重量段后，点击保存并下一步时需要弹出提示框, 并且清空复制的值
                            if (($scope.uid || $scope.viewButton.isCopy) && $scope.iInputWeightValue != $scope.cacheWeightUid) {
                                $scope.viewButton.isSaveInfoPrompt = true;
                                $scope.copyPriceDetailList = [];
                            }
                        }
                    } else {
                        $scope.iDetailWeightValue = item.uid ? item.uid : '-1';

                        // 销售价缓存数据
                        if ($scope.viewButton.isSalesPrice && $scope.savePriceDetailCache) {
                            var tmpArr = $scope.savePriceDetailCache[$scope.currentServiceTypeIndex][$scope.currentDetailIndex];
                            tmpArr.weightName = name || '';
                            tmpArr.weightSchemaUid = $scope.iDetailWeightValue;
                            tmpArr.freightItems = null;
                            tmpArr.freightWeightSettings = null;
                        }

                        if ($scope.iDetailWeightValue == '-1') {
                            $scope.iDetailWeight = '任意重量段';
                        } else {
                            $scope.iDetailWeight = name;
                        }
                        $scope.getPriceTable($scope.currentDetailIndex, '', true);
                    }
                    $scope.$apply();
                }
            });
            weightEle.setData($scope.weightData);
            weightEle.open();
            if (type == 'info') {
                $('#select-weight-info').val($scope.iInputWeight);
            } else {
                $('#select-weight-detail').val($scope.iDetailWeight);
            }
        };
        //根据服务查询一个参考的采购价分区
        function getRegionByService(quotationUid, serviceUid) {
            var config = {
                seatParams: {
                    quotationUid: quotationUid,
                    serviceUid: serviceUid
                }
            };
            var result = priceDetailService.getRegionByService(config);
            return result.data;
        }

        /**
         * 获取分区下拉框
         */
        $scope.getRegionData = function (q, currentPage) {
            if (!currentPage) {
                currentPage = 1;
            }
            q = q ? q : '';
            var config = {
                urlParams: {
                    q: q,
                    type: 1,
                    pageIndex: currentPage,
                    pageSize: 10,
                    sort: 'code',
                    asc: true
                }
            };
            var data = priceDetailService.getRegion(config);
            angular.forEach(data.data, function (value, key) {
                value.name += '(' + value.code + ')';
            });
            return data;
        };
        $scope.getRegion = function (type) {
            var id = '';
            if (type == 'info') {
                id = 'select-region-info';
            } else {
                id = 'select-region-detail';
            }
            $scope.regionData = $scope.getRegionData();

            regionEle = selectFactory({
                data: $scope.regionData,
                isSearch: true,
                isUsePinyin: true,
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                id: id,
                showTextField: 'name',
                pagination: true,
                searchPlaceHoder: Lang.getValByKey('common', 'common_select_search_tips'),
                closeLocalSearch: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.regionData = $scope.getRegionData(data, currentPage);
                    attachEvent.setData($scope.regionData);
                },
                attrTextModel: function (name, data, item) {
                    if (type == 'info') {
                        // 基本信息中的分区
                        $scope.iInputRegion = name || '';
                        $scope.iInputRegionValue = item.uid || '';

                        // 销售价复制到销售价或者修改销售价时，不清空内容。
                        if ($scope.module != 'salesPrice' || ($scope.urlData && $scope.urlData.priceType != 2)) {
                            // 当修改时或者复制时基本信息里面修改了分区方案后，点击保存并下一步时需要弹出提示框, 并且清空复制的值
                            if (($scope.uid || $scope.viewButton.isCopy) && item.uid != $scope.cacheRegionUid) {
                                $scope.viewButton.isSaveInfoPrompt = true;
                                $scope.copyPriceDetailList = [];
                            }
                        }
                    } else {
                        $scope.iDetailRegionValue = item.uid ? item.uid : '-1';
                        // 销售价缓存数据
                        if ($scope.viewButton.isSalesPrice && $scope.savePriceDetailCache) {
                            var tmpArr = $scope.savePriceDetailCache[$scope.currentServiceTypeIndex][$scope.currentDetailIndex];
                            tmpArr.regionName = name || '';
                            tmpArr.regionSchemaUid = $scope.iDetailRegionValue;
                            tmpArr.freightItems = null;    // 重置值
                            tmpArr.freightWeightSettings = null;
                        }
                        if ($scope.iDetailRegionValue == '-1') {
                            $scope.iDetailRegion = '任意分区';
                        } else {
                            $scope.iDetailRegion = name;
                        }

                        $scope.getPriceTable($scope.currentDetailIndex, '', true);
                    }
                    $scope.$apply();
                }
            });
            regionEle.setData($scope.regionData);
            regionEle.open();
            if (type == 'info') {
                $('#select-region-info').val($scope.iInputRegion);
            } else {
                $('#select-region-detail').val($scope.iDetailRegion);
            }
        };

        /**
         * 价格类型
         */
        $scope.getPriceType = function () {
            if (priceTypeEle) {
                return;
            }

            priceTypeEle = selectFactory({
                data: $scope.priceTypeData,
                id: 'select-price-type',
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                showTextField: 'name',
                attrTextField: {
                    'ng-value': 'id'
                },
                attrTextId: function (id) {
                    $scope.iInputPriceTypeValue = id;
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    if ($scope.iInputPriceType != name) {
                        Select.sharePool['select-price-level'] = '';
                        Select.sharePool['select-client'] = '';

                        if ($scope.iInputPriceTypeValue == 1) {
                            // 等级价
                            $scope.iInputPriceLevel = $scope.iInputPriceLevelValue = '';
                        } else if ($scope.iInputPriceTypeValue == 2) {
                            // 协议价
                            $scope.iInputClient = $scope.iInputClientValue = '';
                        }
                    }

                    $scope.iInputPriceType = name;
                    $scope.$apply();
                }
            });
            priceTypeEle.setData($scope.priceTypeData);
            priceTypeEle.open();
            $('#select-price-type').val($scope.iInputPriceType);
        };

        /**
         * 等级价类别
         */
        $scope.getPriceLevel = function () {
            selectFactory({
                data: $scope.priceLevelData,
                id: 'select-price-level',
                showTextField: 'name',
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                attrTextField: {
                    'ng-value': 'id'
                },
                attrTextId: function (id) {
                    $scope.iInputPriceLevelValue = id;
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.iInputPriceLevel = name;
                    $scope.$apply();
                }
            });
        };

        /**
         * 客户下拉框
         */
        $scope.getClientData = function (q, currentPage) {
            q = q ? q : '';
            var config = {
                urlParams: {
                    q: q,
                    userType: 1,
                    pageIndex: currentPage ? currentPage : 1,
                    pageSize: 10,
                    sortName: 'evaluateLeval',
                    isAsc: false
                }
            };
            return priceDetailService.getClient(config);
        };
        $scope.getClient = function () {
            // $scope.clientData = $scope.getClientData();
            clientEle = selectFactory({
                data: [],
                isSearch: true,
                isUsePinyin: true,
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                id: 'select-client',
                showTextField: 'nameCode',
                closeLocalSearch: true,
                pagination: true,
                searchPlaceHoder: '请输入账户名或编码',
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    $scope.clientData = $scope.getClientData(data, currentPage);
                    $scope.clientData.data.forEach(function (item) {
                        item.nameCode = item.userName + '(' + item.code + ')';
                    });
                    attachEvent.setData($scope.clientData);
                },
                attrTextField: {
                    'ng-value': 'id'
                },
                attrTextId: function (id) {
                    $scope.iInputClientValue = id;
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.iInputClient = name;
                    $scope.$apply();
                }
            });
            // clientEle.setData($scope.clientData);
            clientEle.open();
            $('#select-client').val($scope.iInputClient);
        };

        // 其他公共下拉框
        var priceMethodEle, priceUnitEle;

        /**
         * 计价方式下拉框
         */
        $scope.showPriceMethod = function () {
            if (priceMethodEle) {
                return;
            }
            $scope.priceMethod = priceDetailService.getCalcTypeList();

            priceMethodEle = selectFactory({
                data: $scope.priceMethod,
                isUsePinyin: true,
                id: 'select-price-method',
                showTextField: 'name',
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                attrTextField: {
                    'ng-value': 'code'
                },
                attrTextId: function (code) {
                    $scope.priceMethodValue = code;
                    if (code == $scope.sumPriceMethod.code) {
                        // 总价
                        $scope.ePriceTotal = true;
                        Select.sharePool['select-price-unit'] = '';
                    } else {
                        $scope.ePriceTotal = false;
                    }
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.priceMethodModel = name;
                    $scope.$apply();
                }
            });
            priceMethodEle.setData($scope.priceMethod);
            priceMethodEle.open();
            $('#select-price-method').val($scope.priceMethodModel);
        };

        /**
         * 价格单位下拉框
         */
        $scope.showPriceUnit = function () {
            if (!$scope.priceUnitData) {
                $scope.priceUnitData = priceDetailService.getPriceUnit();
            }

            priceUnitEle = selectFactory({
                data: $scope.priceUnitData,
                id: 'select-price-unit',
                showTextField: 'name',
                direction: 'up',
                defaultText: Lang.getValByKey('common', 'common_select_tips'),
                attrTextField: {
                    'ng-value': 'code'
                },
                attrTextId: function (code) {
                    $scope.priceUnitValue = code;
                    $scope.$apply();
                },
                attrTextModel: function (name) {
                    $scope.priceUnit = name;
                    $scope.$apply();
                }
            });
            priceUnitEle.setData($scope.priceUnitData);
            priceUnitEle.open();
            $('#select-price-unit').val($scope.priceUnit);
        };

        /**
         * 起运地选择
         */
        var areaModel = {
            unSelectedData: [],
            selectedData: [],
            candidateFlag: false,
            selectedFlag: false
        };
        $scope.loadRegionData = function () {
            areaModel.unSelectedData = priceDetailService.getCountry().data;
            areaModel.selectedData = $scope.areasData;
            $scope.tab.selected(0);
            $scope.areaModel = areaService.initArea(areaModel);
        };
        $scope.selectRegion = function () {
            $scope.initCtrl();

            $(document).promptBox({
                title: Lang.getValByKey('priceDetail', 'priceDetail_code_addDeparture'),
                isHidden: true,
                boxWidth: true,
                isNest: true,
                loadData: function () {
                    $scope.loadRegionData();
                },
                content: {
                    nest: $('#serviceZone')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey('common', 'common_prompt_confirm'),
                        operationEvent: function () {
                            $(document).promptBox('closeFormPrompt');

                            /** 国家地区名称显示 */
                            var inputStr = '';
                            angular.forEach($scope.areaModel.selectedData, function (value, key) {
                                inputStr += '，' + value.name.split('/')[value.name.split('/').length - 1];
                            });

                            inputStr ? inputStr = inputStr.slice(1) : '';
                            $scope.iDeparture = $scope.iInputDeparture = inputStr;

                            /** 国家地区id集 */
                            $scope.areasData = [];
                            var map = {};
                            angular.forEach($scope.areaModel.selectedData, function (value, key) {
                                map = {
                                    figureCode: value.interId,
                                    name: value.name.split('/')[value.name.split('/').length - 1]
                                };
                                $scope.areasData.push(map);
                            });

                            $scope.$apply();
                        }
                    }
                ]
            });
        };

        /** =======================================调用后台接口列表 End============================**/

        controller.init($scope, service);

        /**
         * 获取已选单个数据信息
         * @param id
         * @param data
         * @returns {*}
         */
        function getSigleDataById(id, data) {
            var data = data.data;
            for (var index = 0, length = data.length; index < length; index++) {
                if (data[index].id == id) {
                    return data[index];
                }
            }
        }

        function sliceLastNode(str) {
            var index = str.lastIndexOf('/');
            if (index != -1) {
                str = str.slice(index + 1);
            }
            return str;
        }
    }]);
});