var addCostPriceUrl = "#/priceDetail?module=costPriceApproval&q=price";
var controller = {
    $scope: null,
    service: null,
    tableService: null,
    initViewButton: function($scope) {//配置显示个性化视图的个性化对象
        $.extend(true, $scope.viewButton, {
            isAdd: false,
            isDelete: false,
            isCopy: false,
            isSubmitVerify: false,
            isVerifyOk: false,
            isNoPassDraft: false,
            isShowVerifyList: false,
            isShowStatusTableCell: true,
            isShowStartState: true,
            isTabList: true,
            isShowCheckBox: false,
            isShowOperAreaLine: false,
            isShowWeightAndArea: true
        });
    },
    loadCostPriceApprovalData: function() {
        var self = this;
        var $scope = this.$scope;
        $scope.pricePlanQ = $scope.pricePlan;
        $scope.belongServiceQ = $scope.belongServiceId;
        $scope.startAddressQ = $scope.startAddress;
        $scope.belongProductQ = $scope.belongProduct;
        //$scope.tableModel.restData.async = true;
        $scope.tableModel.restData.status = $scope.useStateId;
        var params = {
            'urlParams': $scope.tableModel.restData
        };
        this.tableService.getTable($scope.tableModel.restURL, params, function(data) {
            $scope.q = $scope.tableModel.restData.q;
            $scope.isShowIcon = true;
            if(data.errorCode === 0) {
                $scope.tableModel = self.tableService.table($scope.tableModel, params, data);
                setTimeout(function() {
                    $scope.setScroll();
                    $(window).on("resize", $scope.setScroll);
                    $scope.$apply();
                    $(".table-box").focus();
                }, 100);
            }
        });
    },
    initPage: function() {
        var self = this;
        $scope = this.$scope;
        $scope.useStateId = 2;
        $scope.tableModel = {
            tableHeader: [
                Lang.getValByKey("price", "price_id"),
                Lang.getValByKey("price", "price_plan"),
                Lang.getValByKey("price", "price_code"),
                Lang.getValByKey("price", "price_belong_service"),
                //Lang.getValByKey("price", "price_cost_type"),
                Lang.getValByKey("price", "price_start_address"),
                // Lang.getValByKey("price", "price_area"),
                // Lang.getValByKey("price", "price_weight"),
                Lang.getValByKey("price", "price_goods_type"),
                Lang.getValByKey("price", "price_valuation_currency"),
                Lang.getValByKey("price", "price_account_type"),
                // Lang.getValByKey("price", "price_validate_time"),
                Lang.getValByKey("price", "price_start_time"),
                Lang.getValByKey("price", "price_end_time"),
                Lang.getValByKey("price", "price_status")
            ],
            tableHeaderSize: [
                '5%',
                '13%',
                '6%',
                '14%',
                '8%',
                '6%',
                '7%',
                '6%',
                '12%',
                '12%',
                '6%'
            ],
            tableBody: [],
            restURL: "logistics.getCostPriceList",
            restData: {
                q: '',
                pageIndex: 1,
                pageSize: 10,
                unfilled: true,
                orderby:'submittime',
                asc:true
            },
            selectNumber: 0,
            selectFlag: false
        };
        this.loadCostPriceApprovalData();
        $scope.search = function() {
            $scope.tableModel.restData.feeTypeCode = $scope.costTypeStartCode;
            $scope.tableModel.restData.status = $scope.useStateId;
            $scope.tableModel.restData.biz = $scope.belongServiceId;
            $scope.tableModel.restData.q = $scope.pricePlan;
            $scope.tableModel.restData.pageIndex = 1;
            $scope.tableModel.restData.currencyId = $scope.valuationCurrencyId;
            $scope.tableModel.restData.feeTypeId = $scope.costTypeEndId;
            $scope.tableModel.restData.settleMentId = $scope.accountTypeId;
            $scope.tableModel.restData.starts = $scope.startAddress;
            $scope.tableModel.restData.cargoTypeCode = $scope.goodsTypeId;
            $scope.tableModel.restData.startEffectTime = $("#start-time").val();
            $scope.tableModel.restData.endEffectTime = $("#end-time").val();
            self.loadCostPriceApprovalData();
        }
        $scope.resetData = function() {
            $scope.costTypeStartCode = "";
            $scope.pricePlan = "";
            $scope.useStateId = "";
            $scope.useState = "";
            $scope.verifyStateId = "";
            $scope.verifyState = "";
            $scope.accountType = "";
            $scope.accountTypeId = "";
            $scope.costTypeStart = "";
            $scope.costTypeEnd = "";
            $scope.costTypeEndId = "";
            $scope.valuationCurrency = "";
            $scope.valuationCurrencyId = "";
            $scope.startAddress = "";
            $scope.goodsType = "";
            $scope.goodsTypeId = "";
            $("#start-time").val("");
            $("#end-time").val("");
            $scope.belongService = "";
            $scope.belongServiceId = "";
            $scope.q = "";
            var type = $scope.getTabType();
            if(type == 1) {
                $scope.useStateId = 2;
            } else if(type == 2) {
                $scope.useStateId = 3;
                $scope.useState = Lang.getValByKey("price", "price_verify_ok");
            }
            $scope.search();
        }
        $scope.switchTab = function(ev, type) {
            var currentEle = $(ev.target);
            if(currentEle.hasClass("tab-active")) {
                return;
            }
            $(".tab-active").removeClass("tab-active");
            currentEle.addClass("tab-active");
            if(type == 1) {//待审核
               $scope.viewButton.isShowUseState = false;
               $scope.viewButton.isShowStartUse = false
               $scope.viewButton.isShowStopUse = false
               $scope.viewButton.isVerifyOk = false;
               $scope.viewButton.isNoPassDraft = false;
               $scope.viewButton.isShowStatusTableCell = true;
               $(".select-container").css("display", "none");
               $scope.resetData();
               $scope.useStateId = 2;
                $scope.tableModel.restData.asc = true;
               $scope.tableModel.tableHeaderSize = [
                   '5%',
                   '13%',
                   '6%',
                   '14%',
                   '8%',
                   '6%',
                   '7%',
                   '6%',
                   '12%',
                   '12%',
                   '6%'
               ];
               $scope.tableModel.restData.orderby = 'submittime';
               self.loadCostPriceApprovalData();
            } else if(type == 2) {//审核通过
               $scope.viewButton.isShowUseState = true;
               $scope.viewButton.isShowStartUse = false;
               $scope.viewButton.isShowStopUse = false;
               $scope.viewButton.isVerifyOk = false;
               $scope.viewButton.isNoPassDraft = false;
               $scope.viewButton.isShowStatusTableCell = false;
               $(".select-container").css("display", "none");
               $scope.resetData();
               $scope.useStateId = 3;
               $scope.useState = Lang.getValByKey("price", "price_verify_ok");
               $scope.tableModel.restData.asc = false;
               $scope.tableModel.tableHeaderSize = [
                   '5%',
                   '13%',
                   '6%',
                   '14%',
                   '8%',
                   '6%',
                   '7%',
                   '6%',
                   '12%',
                   '12%',
                   '6%'
               ];
               $scope.tableModel.restData.orderby = 'submittime';
               self.loadCostPriceApprovalData();
            }
        }
        function PostDataToServer(postMethod, isconfirmed) {
            if($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0){
                var param = [];
                var oldData = self.tableService.getSelectTable($scope.tableModel.tableBody);
                if(!oldData.length) {
                    accountView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("price", "price_prompt_delay_tip"),type: 'errer',manualClose:true});
                    return false;
                }
                //组织数据
                angular.forEach(oldData, function(val) {
                    param.push(val.uid);
                });
                if(isconfirmed) {
                    param.seatParams = {
                        confirmed: "isconfirmed=true"
                    };
                } else {
                    param.seatParams = {
                        confirmed: "isconfirmed=false"
                    };
                }
                postMethod(param, function(data) {
                    if(data.errorCode === 0) {
                        $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'success', time:3000});
                        $(document).promptBox('closePrompt');
                        //更新table表数据
                        self.loadCostPriceApprovalData();
                    } else {
                        if(data.errorCode == 207001) {//需要确认提交
                            $(document).promptBox({
                                title: Lang.getValByKey("common", 'common_prompt_title'),
                                type: 'success',
                                content: {
                                    tip: data.msg
                                },
                                operation: [
                                    {
                                        type: 'submit',
                                        description: Lang.getValByKey("common", 'common_pagination_confirm'),
                                        application: 'confirm',
                                        operationEvent: function () {
                                            $(document).promptBox('closePrompt');
                                            PostDataToServer(postMethod, true);
                                        }
                                    }
                                ]
                            });
                        } else {
                            $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                        }
                    }
                });
            }else{
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("price", 'price_prompt_delay_tip'), type: 'errer', manualClose:true});
            };
        }
        $scope.verifyOk = function() {
            $scope.showConfirmWindow(function() {
                PostDataToServer(self.service.verifyPass);
            }, Lang.getValByKey("price", "price_confirm_verify_ok_tips"));
        }
        $scope.nopassDraft = function() {
            $scope.showConfirmWindow(function() {
                PostDataToServer(self.service.nopassDraft);
            }, Lang.getValByKey("price", "price_confirm_nppass_tips"));
        }
        $scope.startUse = function() {
            $scope.showConfirmWindow(function() {
                PostDataToServer(self.service.startUse);
            }, Lang.getValByKey("price", "price_confirm_start_use_tips"));
        }
        $scope.stopUse = function() {
            $scope.showConfirmWindow(function() {
                PostDataToServer(self.service.stopUse);
            }, Lang.getValByKey("price", "price_confirm_stop_use_tips"));
        }
        $scope.editCurrentPrice = function(uid) {
            var type = $scope.getTabType();
            location.href = addCostPriceUrl + "&uid=" + uid + "&type=" + type;
        }
    },
    init: function($scope, service, tableService) {
        this.initViewButton($scope);
        this.$scope = $scope;
        this.tableService = tableService;
        this.service = service;
        this.initPage();
    }
}