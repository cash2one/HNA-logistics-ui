easySpa.use(['public/javascripts/fragment/costPrice/promptCtr.js']);
var addCostPriceUrl = '#/priceDetail?module=costPrice&q=price';
var controller = {
    $scope: null,
    service: null,
    tableService: null,
    initViewButton: function ($scope) {
        // 配置显示个性化视图的个性化对象
        $.extend(true, $scope.viewButton, {
            copyPrompt: true,
            isTabList: false,
            isShowWeightAndArea: true,
        });
    },
    loadCostPriceData: function () {
        var self = this;
        var $scope = this.$scope;
        $scope.pricePlanQ = $scope.pricePlan;
        $scope.belongServiceQ = $scope.belongServiceId;
        $scope.startAddressQ = $scope.startAddress;
        $scope.belongProductQ = $scope.belongProduct;
        $scope.tableModel.restData.status = $scope.verifyStateId;
        // $scope.tableModel.restData.async = true;
        var params = {
            urlParams: $scope.tableModel.restData,
        };
        this.tableService.getTable($scope.tableModel.restURL, params, function (data) {
            $scope.q = $scope.tableModel.restData.q;
            $scope.isShowIcon = true;
            if (data.errorCode === 0) {
                $scope.tableModel = self.tableService.table($scope.tableModel, params, data);
                setTimeout(function () {
                    $scope.setScroll();
                    $(window).on('resize', $scope.setScroll);
                    $scope.$apply();
                    $('.table-box').focus();
                }, 100);
            }
        });
    },
    initTable: function () {
        this.$scope.tableModel = {
            tableHeader: [
                Lang.getValByKey('price', 'price_id'),
                Lang.getValByKey('price', 'price_plan'),
                Lang.getValByKey('price', 'price_code'),
                Lang.getValByKey('price', 'price_belong_service'),
                // Lang.getValByKey("price", "price_cost_type"),
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
                '13%',
                '5%',
                '18%',
                '6%',
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
                pageIndex: 1,
                pageSize: 10,
                orderby: 'createtime'
            },
            selectNumber: 0,
            selectFlag: false,
        };
        this.loadCostPriceData();
    },
    registNgIfDomReadEvent: function () {
        // 保留方法
    },
    bindEvent: function () {
        var self = this;
        var $scope = this.$scope;
        $(window).resize(function () {
            // 保证在拉缩窗口的时候更新日历位置
            var currentInputEle = getCurrentInputEle();
            if (currentInputEle && currentInputEle.length > 0) {
                var calanderEle = $('.ui-datepicker');
                calanderEle.offset({
                    left: currentInputEle.offset().left,
                });
            }
        });
        function submitVerifyCostPrice(param) {
            self.service.submitVerifyCostPrice(param, function (data) {
                if (data.errorCode === 0) {
                    $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'success', time: 3000 });
                    $(document).promptBox('closePrompt');
                    // 更新table表数据
                    self.loadCostPriceData();
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                }
            });
        }
        function submitDeleteCostPrice(param) {
            self.service.deleteCostPrice(param, function (data) {
                if (data.errorCode === 0) {
                    $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'success', time: 3000 });
                    $(document).promptBox('closePrompt');
                    // 更新table表数据
                    self.loadCostPriceData();
                } else {
                    $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                }
            });
        }
        $scope.submitVerify = function () {
            var $scope = self.$scope;
            if ($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {
                var param = [];
                var oldData = self.tableService.getSelectTable($scope.tableModel.tableBody);
                if (!oldData.length) {
                    accountView.promptBox({
                        isDelay: true,
                        contentDelay: Lang.getValByKey('price', 'price_prompt_delay_tip'),
                        type: 'errer',
                        manualClose: true,
                    });
                    return false;
                }
                // 组织数据
                angular.forEach(oldData, function (val) {
                    param.push(val.uid);
                });
                $scope.showConfirmWindow(function () {
                    submitVerifyCostPrice(param);
                }, Lang.getValByKey('price', 'price_confirm_submit_price_method'));
            } else {
                $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey('price', 'price_prompt_delay_tip'), type: 'errer', manualClose: true });
            }
        };
        $scope['delete'] = function () {
            if ($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {
                var param = [];
                var oldData = self.tableService.getSelectTable($scope.tableModel.tableBody);
                if (!oldData.length) {
                    accountView.promptBox({ isDelay: true, contentDelay: Lang.getValByKey('price', 'price_prompt_delay_tip'), type: 'errer', manualClose: true });
                    return false;
                }
                // 组织数据
                angular.forEach(oldData, function (val) {
                    param.push(val.uid);
                });
                $(document).promptBox({
                    title: Lang.getValByKey('common', 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey('price', 'price_prompt_delete_tip'),
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                submitDeleteCostPrice(param);
                            },
                        },
                    ],
                });
            } else {
                $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey('price', 'price_prompt_delay_tip'), type: 'errer', manualClose: true });
            }
        };
        $scope.add = function () {
            location.href = addCostPriceUrl + '&action=new';
        };
        $scope.editCurrentPrice = function (uid) {
            location.href = addCostPriceUrl + '&uid=' + uid;
        };
        $scope.copy = function () {
            if ($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {
                var oldData = self.tableService.getSelectTable($scope.tableModel.tableBody);
                if (oldData.length > 1) {
                    $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey('price', 'price_prompt_limit_tip'), type: 'errer', manualClose: true });
                    return;
                }
                $scope.$broadcast('resetDataEvent', { service: self.service, uid: oldData[0].uid }); // 向子类发出重置数据事件
                $scope.promptTitle = Lang.getValByKey('price', 'price_copy_cost_price_title');
                $scope.nestCostPriceFrom = true;
                $('#nest-costPriceFrom').css('display', 'table');
                $('.input-text').removeClass('ng-dirty');
                $('.errors').addClass('ng-hide');
                $('button[name="prompt-save"]')
                    .addClass('save')
                    .removeClass('edit');
            } else {
                $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey('price', 'price_prompt_delay_tip'), type: 'errer', manualClose: true });
            }
        };
        $scope.search = function () {
            $scope.tableModel.restData.feeTypeCode = $scope.costTypeStartCode;
            $scope.tableModel.restData.biz = $scope.belongServiceId;
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
            self.loadCostPriceData();
        };
        $scope.resetData = function () {
            $scope.costTypeStartCode = '';
            $scope.pricePlan = '';
            $scope.verifyState = '草稿';
            $scope.verifyStateId = 1;
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
            $scope.belongService = '';
            $scope.belongServiceId = '';
            $scope.q = '';
            $scope.search();
        };
    },
    init: function ($scope, service, tableService) {
        this.initViewButton($scope);
        this.$scope = $scope;
        this.service = service;
        this.tableService = tableService;
        this.initTable();
        this.bindEvent();
        this.registNgIfDomReadEvent();
    },
};
