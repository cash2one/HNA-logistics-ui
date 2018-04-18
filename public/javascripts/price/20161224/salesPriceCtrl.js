easySpa.use(['public/javascripts/fragment/costPrice/promptCtr.js']);
var addSalesPriceUrl = '#/priceDetail?module=salesPrice&q=price';
var controller = {
    $scope: null,
    service: null,
    tableService: null,
    initViewButton: function ($scope) {
        // 配置显示个性化视图的个性化对象
        $.extend(true, $scope.viewButton, {
            // copyPrompt: false,
            isTabList: false,
            isCopy: true,
            copyPrompt: true,
            isBelongToProduct: true,
            isBelongToService: false,
            isShowPriceType: true,
            isShowWeightAndArea: true,
        });
    },
    loadSalePriceData: function () {
        $scope = this.$scope;
        var that = this;
        // $scope.tableModel.restData.async = true;
        $scope.pricePlanQ = $scope.pricePlan;
        $scope.belongServiceQ = $scope.belongServiceId;
        $scope.startAddressQ = $scope.startAddress;
        $scope.belongProductQ = $scope.belongProduct;
        $scope.tableModel.restData.status = $scope.verifyStateId;
        var params = {
            urlParams: $scope.tableModel.restData,
        };
        that.tableService.getTable($scope.tableModel.restURL, params, function (
            data
        ) {
            $scope.q = $scope.tableModel.restData.q;
            $scope.isShowIcon = true;
            if (data.errorCode === 0) {
                $scope.tableModel = that.tableService.table(
                    $scope.tableModel,
                    params,
                    data
                );
                setTimeout(function () {
                    $scope.setScroll();
                    $(window).on('resize', $scope.setScroll);
                    $scope.$apply();
                    $('.table-box').focus();
                }, 100);
            }
        });
    },
    initPage: function () {
        var that = this;
        var $scope = this.$scope;
        $scope.isShowPriceLevelList = false;
        function PostDataToServer(postMethod, isConfirmed) {
            function confirmPost(param) {
                postMethod(param, function (data) {
                    if (data.errorCode === 0) {
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'success',
                            time: 3000,
                        });
                        $(document).promptBox('closePrompt');
                        // 更新table表数据
                        that.loadSalePriceData();
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
            if (
                $scope.tableModel.selectNumber !== 0 &&
                $('.table-box tbody tr').length !== 0
            ) {
                var param = [];
                var oldData = that.tableService.getSelectTable(
                    $scope.tableModel.tableBody
                );
                if (!oldData.length) {
                    accountView.promptBox({
                        isDelay: true,
                        contentDelay: Lang.getValByKey(
                            'price',
                            'price_prompt_delay_tip'
                        ),
                        type: 'errer',
                        manualClose: true,
                    });
                    return false;
                }
                // 组织数据
                angular.forEach(oldData, function (val) {
                    param.push(val.uid);
                });
                if (isConfirmed) {
                    $(document).promptBox({
                        title: Lang.getValByKey(
                            'common',
                            'common_prompt_title'
                        ),
                        type: 'warning',
                        content: {
                            tip: Lang.getValByKey(
                                'price',
                                'price_prompt_delete_tip'
                            ),
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey(
                                    'common',
                                    'common_page_delete'
                                ),
                                application: 'delete',
                                operationEvent: function () {
                                    confirmPost(param);
                                },
                            },
                        ],
                    });
                } else {
                    confirmPost(param);
                }
            } else {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey(
                        'price',
                        'price_prompt_delay_tip'
                    ),
                    type: 'errer',
                    manualClose: true,
                });
            }
        }
        $scope.tableModel = {
            tableHeader: [
                Lang.getValByKey('price', 'price_id'),
                Lang.getValByKey('price', 'price_plan'),
                Lang.getValByKey('price', 'price_code'),
                Lang.getValByKey('price', 'price_belong_product'),
                // Lang.getValByKey("price", "price_cost_type"),
                Lang.getValByKey('price', 'price_type'),
                Lang.getValByKey('price', 'price_start_address'),
                // Lang.getValByKey("price", "price_area"),
                // Lang.getValByKey("price", "price_weight"),
                Lang.getValByKey('price', 'price_goods_type'),
                Lang.getValByKey('price', 'price_valuation_currency'),
                Lang.getValByKey('price', 'price_account_type'),
                // Lang.getValByKey("price", "price_validate_time"),
                Lang.getValByKey('price', 'price_start_time'),
                Lang.getValByKey('price', 'price_end_time'),
                Lang.getValByKey('price', 'price_state'),
            ],
            tableHeaderSize: [
                '5%',
                '10%',
                '5%',
                '12%',
                '6%',
                '9%',
                '6%',
                '6%',
                '6%',
                '12%',
                '12%',
                '6%'
            ],
            tableBody: [],
            restURL: 'logistics.getCostPriceList',
            restData: {
                type: 2,
                pageIndex: 1,
                pageSize: 10,
                orderby: 'createtime',
                isAsc: false,
            },
            selectNumber: 0,
            selectFlag: false,
        };
        this.loadSalePriceData();
        $scope.resetData = function () {
            $scope.costTypeStartCode = '';
            $scope.pricePlan = '';
            $scope.verifyStateId = 1;
            $scope.verifyState = '草稿';
            $scope.useStateId = '';
            $scope.useState = '';
            $scope.accountType = '';
            $scope.accountTypeId = '';
            $scope.costTypeStart = '';
            $scope.costTypeEnd = '';
            $scope.costTypeEndId = '';
            $scope.valuationCurrency = '';
            $scope.valuationCurrencyId = '';
            $scope.startAddress = '';
            $scope.goodsType = '';
            $scope.goodsTypeId = '';
            $('#start-time').val('');
            $('#end-time').val('');
            $scope.belongProduct = '';
            $scope.belongProductUid = '';
            $scope.belongProductValue = '';
            $scope.priceType = '';
            $scope.priceTypeId = '';
            $scope.q = '';
            for (var index = 0; index < $scope.priceLevelList.length; index++) {
                $scope[$scope.priceLevelList[index]] = false;
            }
            $scope.isShowPriceLevelList = false;
            $scope.isResetSearchCls = false;
            $scope.search();
        };
        $scope.search = function () {
            var grades = '';
            for (var index = 0; index < $scope.priceLevelList.length; index++) {
                if ($scope[$scope.priceLevelList[index]]) {
                    grades += index + 1 + ',';
                }
            }
            if (grades && grades.lastIndexOf(',') === grades.length - 1) {
                grades = grades.substring(0, grades.length - 1);
            }
            $scope.tableModel.restData.feeTypeCode = $scope.costTypeStartCode;
            $scope.tableModel.restData.gradeType = $scope.priceTypeId;
            $scope.tableModel.restData.grades = grades;
            $scope.tableModel.restData.biz = $scope.belongProductUid;
            $scope.tableModel.restData.q = $scope.pricePlan;
            $scope.tableModel.restData.pageIndex = 1;
            $scope.tableModel.restData.currencyId = $scope.valuationCurrencyId;
            $scope.tableModel.restData.feeTypeId = $scope.costTypeEndId;
            $scope.tableModel.restData.settleMentId = $scope.accountTypeId;
            $scope.tableModel.restData.starts = $scope.startAddress;
            $scope.tableModel.restData.cargoTypeCode = $scope.goodsTypeId;
            $scope.tableModel.restData.startEffectTime = $('#start-time').val();
            $scope.tableModel.restData.endEffectTime = $('#end-time').val();
            $scope.tableModel.restData.status = $scope.verifyStateId;
            that.loadSalePriceData();
        };
        $scope['delete'] = function () {
            PostDataToServer(that.service.deleteSalePrice, true);
        };
        $scope.submitVerify = function () {
            $scope.showConfirmWindow(function () {
                PostDataToServer(that.service.submitSalePrice);
            }, Lang.getValByKey('price', 'price_confirm_submit_price_method'));
        };
        $scope.add = function () {
            location.href = addSalesPriceUrl;
        };
        $scope.editCurrentPrice = function (uid) {
            location.href = addSalesPriceUrl + '&uid=' + uid;
        };
        $scope.copy = function () {
            if (
                $scope.tableModel.selectNumber !== 0 &&
                $('.table-box tbody tr').length !== 0
            ) {
                var oldData = that.tableService.getSelectTable(
                    $scope.tableModel.tableBody
                );
                if (oldData.length > 1) {
                    $(document).promptBox({
                        isDelay: true,
                        contentDelay: Lang.getValByKey(
                            'price',
                            'price_prompt_limit_tip'
                        ),
                        type: 'errer',
                        manualClose: true,
                    });
                    return;
                }
                $scope.$broadcast('resetDataEvent', {
                    service: that.service,
                    uid: oldData[0].uid,
                }); // 向子类发出重置数据事件
                $scope.promptTitle = Lang.getValByKey(
                    'price',
                    'price_copy_cost_price_title'
                );
                $scope.nestCostPriceFrom = true;
                $('#nest-costPriceFrom').css('display', 'table');
                $('.input-text').removeClass('ng-dirty');
                $('.errors').addClass('ng-hide');
                $('button[name="prompt-save"]')
                    .addClass('save')
                    .removeClass('edit');
            } else {
                $(document).promptBox({
                    isDelay: true,
                    contentDelay: Lang.getValByKey(
                        'price',
                        'price_prompt_delay_tip'
                    ),
                    type: 'errer',
                    manualClose: true,
                });
            }
        };
    },
    init: function ($scope, service, tableService) {
        this.initViewButton($scope);
        this.$scope = $scope;
        this.service = service;
        this.tableService = tableService;
        this.initPage();
    },
};
