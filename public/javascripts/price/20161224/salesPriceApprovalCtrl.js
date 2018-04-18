var addSalesPriceUrl = '#/priceDetail?module=salesPriceApproval&q=price';
var controller = {
    $scope: null,
    service: null,
    tableService: null,
    initViewButton: function ($scope) {
        // 配置显示个性化视图的个性化对象
        $.extend(true, $scope.viewButton, {
            isAdd: false,
            isDelete: false,
            isCopy: false,
            isSubmitVerify: false,
            isVerifyOk: false,
            isNoPassDraft: false,
            isShowVerifyList: false,
            isShowStatusTableCell: false,
            isBelongToProduct: true,
            isBelongToService: false,
            isShowPriceType: true,
            isShowStatusTableCell: true,
            isShowStartState: true,
            isTabList: true,
            isShowOperAreaLine: false,
            isShowCheckBox: false,
            isShowOperAreaLine: false,
            isShowWeightAndArea: true,
        });
    },
    loadSalePriceData: function () {
        $scope = this.$scope;
        var self = this;
        // $scope.tableModel.restData.async = true;
        $scope.pricePlanQ = $scope.pricePlan;
        $scope.belongServiceQ = $scope.belongServiceId;
        $scope.startAddressQ = $scope.startAddress;
        $scope.belongProductQ = $scope.belongProduct;
        var params = {
            urlParams: $scope.tableModel.restData,
        };
        $scope.tableModel.restData.status = $scope.useStateId;
        self.tableService.getTable($scope.tableModel.restURL, params, function (data) {
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
    initPage: function () {
        var self = this;
        $scope = this.$scope;
        $scope.isShowPriceLevelList = false;
        $scope.useStateId = 2;
        function PostDataToServer(postMethod, isconfirmed) {
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
                if (isconfirmed) {
                    param.seatParams = {
                        confirmed: 'isconfirmed=true',
                    };
                } else {
                    param.seatParams = {
                        confirmed: 'isconfirmed=false',
                    };
                }
                postMethod(param, function (data) {
                    if (data.errorCode === 0) {
                        $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'success', time: 3000 });
                        $(document).promptBox('closePrompt');
                        // 更新table表数据
                        self.loadSalePriceData();
                    } else {
                        if (data.errorCode == 207001) {
                            // 需要确认提交
                            $(document).promptBox({
                                title: Lang.getValByKey('common', 'common_prompt_title'),
                                type: 'success',
                                content: {
                                    tip: data.msg,
                                },
                                operation: [
                                    {
                                        type: 'submit',
                                        description: Lang.getValByKey('common', 'common_pagination_confirm'),
                                        application: 'confirm',
                                        operationEvent: function () {
                                            $(document).promptBox('closePrompt');
                                            PostDataToServer(postMethod, true);
                                        },
                                    },
                                ],
                            });
                        } else {
                            $(document).promptBox({ isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true });
                        }
                    }
                });
            } else {
                $(document).promptBox({ isDelay: true, contentDelay: Lang.getValByKey('price', 'price_prompt_delay_tip'), type: 'errer', manualClose: true });
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
                Lang.getValByKey('price', 'price_start_time'),
                Lang.getValByKey('price', 'price_end_time'),
                // Lang.getValByKey("price", "price_validate_time"),
                Lang.getValByKey('price', 'price_status'),
            ],
            tableHeaderSize: [
                '4%',
                '10%',
                '5%',
                '13%',
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
                orderby: 'submittime'
            },
            selectNumber: 0,
            selectFlag: false,
        };
        this.loadSalePriceData();
        $scope.resetData = function () {
            $scope.costTypeStartCode = '';
            $scope.pricePlan = '';
            $scope.useStateId = '';
            $scope.useState = '';
            $scope.verifyState = '';
            $scope.verifyStateId = '';
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
            $scope.priceType = '';
            $scope.priceTypeId = '';
            $scope.q = '';
            for (var index = 0; index < $scope.priceLevelList.length; index++) {
                $scope[$scope.priceLevelList[index]] = false;
            }
            $scope.isShowPriceLevelList = false;
            $scope.isResetSearchCls = false;
            var type = $scope.getTabType();
            if (type == 1) {
                $scope.useStateId = 2;
            } else if (type == 2) {
                $scope.useStateId = 3;
                $scope.useState = Lang.getValByKey('price', 'price_verify_ok');
            }
            $scope.search();
        };
        $scope.search = function () {
            var grades = '';
            for (var index = 0; index < $scope.priceLevelList.length; index++) {
                if ($scope[$scope.priceLevelList[index]]) {
                    grades += index + 1 + ',';
                }
            }
            if (grades && grades.lastIndexOf(',') == grades.length - 1) {
                grades = grades.substring(0, grades.length - 1);
            }
            $scope.tableModel.restData.feeTypeCode = $scope.costTypeStartCode;
            $scope.tableModel.restData.grades = grades;
            $scope.tableModel.restData.status = $scope.useStateId;
            $scope.tableModel.restData.gradeType = $scope.priceTypeId;
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
            self.loadSalePriceData();
        };
        $scope.switchTab = function (ev, type) {
            var currentEle = $(ev.target);
            if (currentEle.hasClass('tab-active')) {
                return;
            }
            $('.tab-active').removeClass('tab-active');
            currentEle.addClass('tab-active');
            if (type == 1) {
                // 待审核
                $scope.viewButton.isShowUseState = false;
                $scope.viewButton.isShowStartUse = false;
                $scope.viewButton.isShowStopUse = false;
                $scope.viewButton.isVerifyOk = false;
                $scope.viewButton.isNoPassDraft = false;
                $scope.viewButton.isShowStatusTableCell = true;
                $('.select-container').css('display', 'none');
                $scope.resetData();
                $scope.useStateId = 2;
                $scope.tableModel.restData.asc = true;
                $scope.tableModel.tableHeaderSize = [
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
                ];
                self.loadSalePriceData();
            } else if (type == 2) {
                // 审核通过
                $scope.viewButton.isShowUseState = true;
                $scope.viewButton.isShowStartUse = false;
                $scope.viewButton.isShowStopUse = false;
                $scope.viewButton.isVerifyOk = false;
                $scope.viewButton.isNoPassDraft = false;
                $scope.viewButton.isShowStatusTableCell = false;
                $('.select-container').css('display', 'none');
                $scope.resetData();
                $scope.useStateId = 3;
                $scope.useState = Lang.getValByKey('price', 'price_verify_ok');
                $scope.tableModel.restData.asc = false;
                $scope.tableModel.tableHeaderSize = [
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
                ];
                self.loadSalePriceData();
            }
        };
        $scope.verifyOk = function () {
            $scope.showConfirmWindow(function () {
                PostDataToServer(self.service.verifySalePrice);
            }, Lang.getValByKey('price', 'price_confirm_verify_ok_tips'));
        };
        $scope.nopassDraft = function () {
            $scope.showConfirmWindow(function () {
                PostDataToServer(self.service.salePriceNoPass);
            }, Lang.getValByKey('price', 'price_confirm_nppass_tips'));
        };
        $scope.startUse = function () {
            $scope.showConfirmWindow(function () {
                PostDataToServer(self.service.salePriceStartUse);
            }, Lang.getValByKey('price', 'price_confirm_start_use_tips'));
        };
        $scope.stopUse = function () {
            $scope.showConfirmWindow(function () {
                PostDataToServer(self.service.salePriceStopUse);
            }, Lang.getValByKey('price', 'price_confirm_stop_use_tips'));
        };
        $scope.editCurrentPrice = function (uid) {
            var type = $scope.getTabType();
            location.href = addSalesPriceUrl + '&uid=' + uid + '&type=' + type;
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
