easySpa.require([
    'public/javascripts/price/20161224/priceRoute.js',
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/prompt',
    'widget/select',
    'widget/searchBox',
    'widget/calander'
], function () {
    app.controller('priceCtrl', [
        '$scope',
        'priceService',
        'service',
        'priceView',
        'tableService',
        function ($scope, priceService, service, priceView, tableService) {
            $scope.viewButton = {
                // 配置显示个性化视图的通用对象
                copyPrompt: false, // 是否显示复制弹出框
                isTabList: true, // 是否显示tab-list
                isVerifyOk: false, // 是否显示审核通过按钮
                isNoPassDraft: false, // 是否显示打回草稿按钮
                isAdd: true, // 是否显示添加按钮
                isDelete: true, // 是否显示delete按钮
                isCopy: true, // 是否显示复制按钮
                isSubmitVerify: true, // 是否显示提交审核按钮
                isShowVerifyList: true, // 是否显示搜索条件中的审核下拉列表
                isShowUseState: false, // 是否显示启用停用下拉列表
                isShowStartUse: false, // 是否显示启用按钮
                isShowStopUse: false, // 是否显示停用按钮
                isShowStatusTableCell: true, // 是否在table中显示状态一列
                isBelongToProduct: false, // 是否显示所属产品搜索框
                isBelongToService: true, // 是否显示所属服务
                isShowPriceType: false, // 是否显示价格类型
                isShowStartState: Lang.getValByKey('price', 'price_status'), // 是否在表格中显示启用停用状态
                isShowCheckBox: true, // 是否展示表格中的批量操作功能
                isShowOperAreaLine: true, // 是否展示操作区域分割线
                isShowWeightAndArea: false // 是否显示分区重量段
            };
            $scope.priceLevelList = [
                'level1',
                'level2',
                'level3',
                'level4',
                'level5'
            ];
            $scope.setScroll = function () {
                $('.table-container tbody').slimScroll({
                    height: $('.content-main').height() - 250
                });
            };
            $scope.closePrompt = function () {
                $scope.nestCostPriceFrom = false;
            };
            $scope.getTabType = function () {
                var type = -1;
                var tabActiveEle = $('.tab-active');
                if ($('.tab-list').css('display') != 'none' && tabActiveEle.length > 0) {
                    type = tabActiveEle.attr('data-type');
                }
                return type;
            };
            $scope.showCheckStream = function (uid, name) {
                var from = easySpa.queryUrlValByKey('module');
                var type = $scope.getTabType();
                self.location.href = '#/checkStream?uid=' + uid + '&from=' + from + '&name=' + name + '&type=' + type;
            };
            $scope.showConfirmWindow = function (callback, description) {
                if ($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {
                    if (!description) {
                        description = Lang.getValByKey('common', 'common_pagination_confirm');
                    }
                    $(document).promptBox({
                        title: Lang.getValByKey('common', 'common_prompt_title'),
                        type: 'success',
                        content: {
                            tip: description
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey('common', 'common_pagination_confirm'),
                                application: 'confirm',
                                operationEvent: function () {
                                    $(document).promptBox('closePrompt');
                                    callback();
                                }
                            }
                        ]
                    });
                } else {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: Lang.getValByKey('price', 'price_prompt_delay_tip'),
                        type: 'errer',
                        manualClose: true
                    });
                }
            };

            /* 初始化通用业务 start*/
            function initPublic() {
                var costEle = null;
                var startTime = '';
                var endTime = '';
                var defaultTime = '2100-01-01 00:00:00';
                var classPool = [
                    'start-time-canlander',
                    'end-time-canlander'
                ];
                var inputPool = [
                    '#start-time',
                    '#end-time'
                ];
                $scope.verifyState = Lang.getValByKey('price', 'price_draft');
                $scope.verifyStateId = 1;

                /**
                     * 获取结算方式
                     * @param config
                     * @param callback
                     * @returns {*}
                     */
                var getAccountData = function (q, callback) {
                    q = q ? q : '';
                    var config = {
                        urlParams: {
                            q: q,
                            pageIndex: 1,
                            pageSize: 100,
                            async: true
                        }
                    };
                    priceService.getAccount(config, callback);
                };
                var getCostData = function (q, callback) {
                    q = q ? q : '';
                    var config = {
                        urlParams: {
                            q: '',
                            pageIndex: 1,
                            pageSize: 10,
                            type: $scope.iInputCostTypeValue,
                            sort: 'code',
                            async: true
                        }
                    };
                    priceService.getCost(config, callback);
                };
                var getServicesData = function (q, currentPage, callback) {
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
                            // async: true, // 加上这个就不能翻页了
                        },
                        seatParams: {
                            serviceTypeId: -1
                        }
                    };
                    priceService.getServices(config, callback);
                };
                var getCurrentInputEle = function () {
                    for (var index = 0; index < classPool.length; index++) {
                        if ($('.ui-datepicker').hasClass(classPool[index])) {
                            return $(inputPool[index]);
                        }
                    }
                    return null;
                };
                var clearOtherClass = function (currentClass) {
                    for (var index = 0; index < classPool.length; index++) {
                        if (currentClass != classPool[index]) {
                            $('.ui-datepicker').removeClass(classPool[index]);
                        }
                    }
                };
                var showPriceLevelList = function () {
                    $scope.isShowPriceLevelList = true;
                    $scope.$apply();
                };
                var hidePriceLevelList = function () {
                    for (var index = 0; index < $scope.priceLevelList.length; index++) {
                        $scope[$scope.priceLevelList[index]] = false;
                    }
                    $scope.isShowPriceLevelList = false;
                    $scope.$apply();
                };
                selectFactory({
                    data: {
                        data: [
                            {
                                name: Lang.getValByKey('price', 'price_draft'),
                                id: 1
                            },
                            {
                                name: Lang.getValByKey('price', 'price_wait_verify'),
                                id: 2
                            },
                            {
                                name: Lang.getValByKey('price', 'price_verify_ok'),
                                id: 3
                            },
                            {
                                name: Lang.getValByKey('price', 'price_start_used'),
                                id: 4
                            },
                            {
                                name: Lang.getValByKey('price', 'price_stop_used'),
                                id: 5
                            }
                        ]
                    },
                    id: 'verify-state',
                    defaultText: '全部',
                    attrTextModel: function (name, data, currentData) {
                        if (name) {
                            $scope.verifyStateId = currentData.id;
                        } else {
                            $scope.verifyStateId = '';
                        }
                        $scope.verifyState = name;
                        $scope.$apply();
                    }
                });
                selectFactory({
                    data: {
                        data: [
                            {
                                name: '等级价',
                                id: 1
                            },
                            {
                                name: '协议价',
                                id: 2
                            }
                        ]
                    },
                    defaultText: '全部',
                    id: 'price-type',
                    attrTextModel: function (name, data, currentData) {
                        if (name) {
                            $scope.priceTypeId = currentData.id;
                        } else {
                            $scope.priceTypeId = '';
                        }
                        $scope.priceType = name;
                        $scope.$apply();
                        if ($scope.priceTypeId == 1) {
                            // 如果是等级价则显示等级复选框
                            showPriceLevelList();
                        } else {
                            hidePriceLevelList();
                        }
                    }
                });
                selectFactory({
                    data: {
                        data: [
                            {
                                name: '全部',
                                id: -2
                            },
                            {
                                name: '已审核',
                                id: 3
                            },
                            {
                                name: '已启用',
                                id: 4
                            },
                            {
                                name: '已停用',
                                id: 5
                            }
                        ]
                    },
                    id: 'use-state',
                    defaultText: '',
                    attrTextModel: function (name, data, currentData) {
                        if (name) {
                            $scope.useStateId = currentData.id;
                        } else {
                            $scope.useStateId = -2;
                        }
                        $scope.useState = name;
                        $scope.$apply();
                    }
                });
                getAccountData('', function (result) {
                    result.data.forEach(function (item) {
                        item.name = item.name + '(' + item.code + ')';
                    });
                    selectFactory({
                        isSearch: true,
                        pagination: true,
                        searchPlaceHoder: '请输入名称或编码',
                        data: result,
                        id: 'account-type',
                        attrTextModel: function (name, data, currentData) {
                            $scope.accountType = name;
                            if (typeof currentData.id !== 'undefined') {
                                $scope.accountTypeId = currentData.id;
                            } else {
                                $scope.accountTypeId = '';
                            }
                            $scope.$apply();
                        },
                        onSearchValueChange: function (attachEvent, data, currentPage) {
                            getAccountData('', function (result) {
                                result.data.forEach(function (item) {
                                    item.name = item.name + '(' + item.code + ')';
                                });
                                attachEvent.setData(result);
                            });
                            $scope.$apply();
                        }
                    });
                });
                priceService.getCostType(function (result) {
                    selectFactory({
                        data: result,
                        id: 'cost-type-start',
                        attrTextField: {
                            'ng-value': 'id'
                        },
                        attrTextId: function (id) {
                            $scope.iInputCostTypeValue = id;
                        },
                        attrTextModel: function (name, data, currentData) {
                            $scope.costTypeStartCode = '';
                            $scope.costTypeEndId = '';
                            if (!name) {
                                costEle.clearData();
                                return;
                            }
                            $scope.costTypeStartCode = currentData.code;
                            getCostData(name, function (costData) {
                                if (costData.data && costData.data.length == 0) {
                                    costEle.setData([]);
                                } else {
                                    costEle.setData(costData);
                                }
                                $scope.costTypeStart = name;
                                $scope.$apply();
                            });
                        }
                    });
                });
                costEle = selectFactory({
                    data: [],
                    id: 'cost-type-end',
                    isSearch: true,
                    isUsePinyin: true,
                    attrTextModel: function (name, data, currentData) {
                        if (name) {
                            $scope.costTypeEndId = currentData.id;
                        } else {
                            $scope.costTypeEndId = '';
                        }
                        $scope.costTypeEnd = name;
                        $scope.$apply();
                    }
                });
                priceService.getGoods(function (result) {
                    selectFactory({
                        data: result,
                        id: 'goods-type',
                        defaultText: '全部',
                        attrTextModel: function (name, data, currentData) {
                            if (name) {
                                $scope.goodsTypeId = currentData.code;
                            } else {
                                $scope.goodsTypeId = '';
                            }
                            $scope.goodsType = name;
                            $scope.$apply();
                        }
                    });
                });
                priceService.getCurrencyList({ q: '', pageSize: 10, pageIndex: 1 }, function (result) {
                    result.data.forEach(function (item) {
                        item.name = item.name + '(' + item.code + ')';
                    });
                    selectFactory({
                        data: result,
                        id: 'valuation-currency',
                        isSearch: true,
                        pagination: true,
                        defaultText: '全部',
                        searchPlaceHoder: Lang.getValByKey('price', 'price_search_valuation_currency'),
                        attrTextModel: function (name, data, currentData) {
                            if (name) {
                                $scope.valuationCurrencyId = currentData.code;
                            } else {
                                $scope.valuationCurrencyId = '';
                            }
                            $scope.valuationCurrency = name;
                            $scope.$apply();
                        },
                        onSearchValueChange: function (attachEvent, data, currentPage) {
                            priceService.getCurrencyList({ q: data, pageSize: 10, pageIndex: currentPage ? currentPage : 1 }, function (res) {
                                res.data.forEach(function (item) {
                                    item.name = item.name + '(' + item.code + ')';
                                });
                                attachEvent.setData(res);
                            });
                            $scope.$apply();
                        }
                    });
                });

                /**
             * 获取服务下拉框
             */
                getServicesData('', 1, function (servicesData) {
                    angular.forEach(servicesData.data, function (value) {
                        value.name += '(' + value.code + ')';
                    });
                    selectFactory({
                        data: servicesData,
                        id: 'belong-service',
                        isSearch: true,
                        closeLocalSearch: true,
                        pagination: true,
                        searchPlaceHoder: Lang.getValByKey('common', 'common_select_search_tips'),
                        onSearchValueChange: function (attachEvent, data, currentPage) {
                            getServicesData(data, currentPage, function (sd) {
                                console.log(currentPage);
                                angular.forEach(sd.data, function (value) {
                                    value.name += '(' + value.code + ')';
                                });
                                attachEvent.setData(sd);
                            });
                        },
                        attrTextModel: function (name, data, currentData) {
                            if (name) {
                                $scope.belongServiceId = currentData.uid;
                            } else {
                                $scope.belongServiceId = '';
                            }
                            $scope.belongService = name;
                            $scope.$apply();
                        }
                    });
                });
                $('#start-time').datetimepicker({
                    timeFormat: 'HH:mm:ss',
                    dateFormat: 'yy-mm-dd',
                    showSecond: true,
                    changeYear: true,
                    changeMonth: true,
                    beforeShow: function () {
                        startTime = $('#start-time').val();
                        $('#start-time').datetimepicker('setDate', startTime);
                        if ($('#end-time').val()) {
                            $('#start-time').datetimepicker('option', 'maxDate', $('#end-time').val());
                            $('#start-time').val(startTime);
                        }
                        $('.ui-datepicker').css('visibility', 'visible');
                        $('.ui-datepicker').addClass('canlander2');
                        clearOtherClass('start-time-canlander');
                        $('.ui-datepicker').addClass('start-time-canlander');
                    },
                    onChangeMonthYear: function () {
                        startTime = $('#start-time').val();
                    },
                    onSelect: function (date) {
                        var startTimeData = new Date(date).getTime();
                        var endTimeData = new Date($('#end-time').val()).getTime();
                        if (endTimeData < startTimeData) {
                            $('#start-time').val(new Date(endTimeData).format('yyyy-MM-dd hh:mm:ss'));
                            $('#start-time').datetimepicker('refresh');
                            startTime = $('#start-time').val();
                        } else {
                            startTime = date;
                        }
                    },
                    onClose: function () {
                        if (!$.trim($('#start-time').val())) {
                            $('#start-time').val('');
                            return;
                        }
                        $('#start-time').datetimepicker('setDate', startTime);
                        if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
                            $('#start-time').datetimepicker('setDate', endTime);
                            $('#start-time').val(endTime);
                        } else {
                            $('#start-time').datetimepicker('setDate', startTime);
                            $('#start-time').val(startTime);
                        }
                    }
                });
                $('#end-time').datetimepicker({
                    timeFormat: 'HH:mm:ss',
                    dateFormat: 'yy-mm-dd',
                    showSecond: true,
                    changeYear: true,
                    changeMonth: true,
                    maxDate: defaultTime,
                    beforeShow: function () {
                        endTime = $('#end-time').val();
                        $('#end-time').datetimepicker('option', 'defaultDate', endTime);
                        $('#end-time').datetimepicker('setDate', endTime);
                        if ($('#start-time').val()) {
                            $('#end-time').datetimepicker('option', 'minDate', $('#start-time').val());
                        }
                        $('.ui-datepicker').css('visibility', 'visible');
                        $('.ui-datepicker').addClass('canlander2');
                        clearOtherClass('end-time-canlander');
                        $('.ui-datepicker').addClass('end-time-canlander');
                    },
                    onChangeMonthYear: function () {
                        endTime = $('#end-time').val();
                    },
                    onSelect: function (date) {
                        var startTimeData = new Date($('#start-time').val()).getTime();
                        var endTimeData = new Date(date).getTime();
                        if (endTimeData < startTimeData) {
                            $('#end-time').val(new Date(startTimeData).format('yyyy-MM-dd hh:mm:ss'));
                            $('#end-time').datetimepicker('refresh');
                            endTime = $('#end-time').val();
                        } else {
                            endTime = date;
                        }
                    },
                    onClose: function () {
                        if (!$.trim($('#end-time').val())) {
                            $('#end-time').val('');
                            return;
                        }
                        if (new Date(endTime).getTime() < new Date($('#start-time').val()).getTime()) {
                            $('#end-time').datetimepicker('setDate', $('#start-time').val());
                            $('#end-time').val($('#start-time').val());
                        } else {
                            $('#end-time').datetimepicker('setDate', endTime);
                            $('#end-time').val(endTime);
                        }
                    }
                });
            }
            function initTabAcitve() {
                var type = easySpa.queryUrlValByKey('type');
                if (!type) {
                    return;
                }
                if (type == '1') {
                    $scope.switchTab(
                        {
                            target: $('.tab-list a')[0]
                        },
                        1
                    );
                } else if (type == '2') {
                    $scope.switchTab(
                        {
                            target: $('.tab-list a')[1]
                        },
                        2
                    );
                }
            }

            /**
         * 获取产品下拉列表
         */
            function rechangeProductData(data){
                data.forEach(function(value){
                    value.name += '('+ value.code +')';
                });
                return data
            }
            $scope.getProduct = function () {
                $scope.contentList = priceService.getProductAllData({'urlParams': {'isHot': true}});
                $scope.navItem = priceService.getProductNavItem();
                var productBox = new SearchBox.init({
                    inputId:"belong-product",
                    searchData:[],
                    defaultText: '请选择',
                    tip:'请输入名称或编码',
                    navItem: $scope.navItem.data,
                    tabIndex:'热门',
                    contentList: rechangeProductData($scope.contentList.data),
                    toggleTab: function(currentPage,index){
                        this.tabIndex = index;
                        var config = {
                            'urlParams': {
                                'isHot':false,
                                'pageIndex': currentPage || 1,
                                'pageSize': 10,
                                'capital': index
                            }
                        };
                        if(index == "热门"){
                            config.urlParams.isHot = true;
                            config.urlParams.capital = '';
                        }
                        if(index == "其他"){
                            config.urlParams.isHot = false;
                            config.urlParams.capital = '_';
                        }
                        var result = priceService.getProductAllData(config);
                        return {data:rechangeProductData(result.data),pagination:result.pagination}
                    },
                    onSearchValueChange:function(data,currentPage) {
                        var config = {
                            'urlParams': {
                                'q':data,
                                'isHot':false,
                                'pageIndex': currentPage || 1,
                                'pageSize': 10,
                                'capital': ''
                            }
                        };
                        var result = priceService.getProductAllData(config);
                        return {data:rechangeProductData(result.data),pagination:result.pagination};
                    },
                    attrTextModel: function (name, data) {
                        $scope.belongProductUid = data.uid || '';
                        $scope.belongProduct =  name || '';
                        $scope.$apply();
                    }
                });
            };
            $scope.getProduct();

            /* 初始化通用业务 end*/
            initPublic(); // 初始化通用业务
            controller.init($scope, service, tableService); // 初始化个性业务
            initTabAcitve();
            priceView.bindEvent();
        }
    ]);
});
