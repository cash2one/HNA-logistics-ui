easySpa.require([
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/prompt',
    'widget/select',
    'widget/calander',
    'public/lib/pinyin.js',
    'public/lib/pinyin-util.js'
],function(){
    app.controller('rateCtrl', ['$scope', 'rateService', 'rateView', 'tableService', function($scope, rateService, rateView, tableService) {
        var bar = $('#nest-rateFrom .label-text');
        var currentEle = null,
            exchangeEle = null,
            searchCurrentEle = null,
            searchExchangeEle = null,
            defaultTime = "2100-01-01 00:00:00";
        $scope.currentList = null;
        $scope.exchangeList = null;
        $scope.searchCurrencyList = null;
        $scope.searchExchangeList = null;
        $scope.endTime = defaultTime;
        $scope.serverTime = rateService.getServerTime().data;
        $("#begin-time").val($scope.serverTime);
        $("#finish-time").val($scope.serverTime);
        if(!$scope.serverTime) {
            $scope.serverTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        }
        $scope.add = function() {
            $scope.serverTime = rateService.getServerTime().data;
            $scope.isEdit = false;
            $scope.promptTitle = Lang.getValByKey("rate", "rate_create_title");
            $scope.isCreateNewRate = true;
            $scope.nestRateFrom = true;
            $scope.rateCurrent = "";
            $scope.exchange = "";
            $scope.rateVal = "";
            $scope.id = "";
            $("#nest-rateFrom").css("display", "table");
            $scope.startTime = $scope.serverTime//默认显示客户端时间，是否为服务器端暂定
            $scope.endTime = defaultTime;
            standardEndTime = "";
            standardStartTime = "";
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        }
        function setSearchParams() {
            $scope.tableModel.restData.sourceCurrency = "";
            $scope.tableModel.restData.destCurrency = "";
            if($scope.searchCurrentRate) {
                $scope.tableModel.restData.sourceCurrency = getCodeByName($scope.searchCurrentRate, $scope.searchCurrencyList);
            }
            if($scope.searchExchangeRate) {
                $scope.tableModel.restData.destCurrency = getCodeByName($scope.searchExchangeRate, $scope.searchExchangeList);
            }
            $scope.tableModel.restData.beginTime = $("#begin-time").val();
            $scope.tableModel.restData.endTime = $("#finish-time").val();
        }
        function clearSearchParams() {
            $scope.tableModel.restData.sourceCurrency = "";
            $scope.tableModel.restData.destCurrency = "";
            $scope.tableModel.restData.beginTime = "";
            $scope.tableModel.restData.endTime = "";
        }
        $scope.clearDate = function() {
            $scope.serverTime = rateService.getServerTime().data;
            $("#begin-time").val($scope.serverTime);
            $("#finish-time").val($scope.serverTime);
            if(!$scope.searchCurrentRate && !$scope.searchExchangeRate) {
                clearSearchParams();
                $scope.tableModel.restURL = "logistics.getLatestRate";
            } else {
                setSearchParams();
                $scope.tableModel.restURL = "logistics.getRateList";
            }
            loadRateData();
        }
        $scope.search = function() {
            $scope.tableModel.restData.pageIndex = 1;
            if(!$scope.searchCurrentRate && !$scope.searchExchangeRate && !$("#begin-time").val() && !$("#finish-time").val()) {
                clearSearchParams();
            } else {
                setSearchParams();
            }
            $scope.tableModel.restURL = "logistics.getRateList";
            loadRateData();
        }
        $scope.verifySame = function(currentId) {
            if($scope.rateCurrent == $scope.exchange) {
                if(currentId == "rate-current") {
                    $scope.rateCurrent = "";
                } else {
                    $scope.exchange = "";
                }
            }

        }
        /** 关闭国家弹框 */
        $scope.closePrompt = function() {
            $scope.nestRateFrom = false;
        };
        function rebuildCurrencyData(currencyList) {
            // var data = currencyList.data;
            // for(var index = 0; index < data.length; index++) {
            //     data[index].name = data[index].name + " (" + data[index].code + ")";
            // }
            return currencyList;
        }
        $scope.initSelectList = function() {
            /*初始化搜索本位币下拉框start*/
            $scope.searchCurrencyList = rebuildCurrencyData(rateService.getCurrencyList());
            searchCurrentEle = selectFactory({
                data: $scope.searchCurrencyList,
                isSearch: true,
                searchPlaceHoder: "货币名称或三字码",
                id: "search-currency",
                pagination: true,
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.searchCurrencyList = $scope.getCurrencyData(data,currentPage);
                    attachEvent.setData($scope.searchCurrencyList);
                },
                attrTextModel: function(name, data) {
                    $scope.searchRateCurrentCode = getCodeByName(name, data);
                    $scope.searchCurrentRate = name;
                    $scope.$apply();
                }
            });
            /*初始化搜索本位币下拉框end*/

            /*初始化搜索交换货币下拉框start*/
            $scope.searchExchangeList = rebuildCurrencyData(rateService.getCurrencyList());
            searchExchangeEle = selectFactory({
                data: $scope.searchExchangeList,
                isSearch: true,
                searchPlaceHoder: "货币名称或三字码",
                id: "search-exchange",
                pagination: true,
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.searchExchangeList = $scope.getCurrencyData(data,currentPage);
                    attachEvent.setData($scope.searchExchangeList);
                },
                attrTextModel: function(name, data) {
                    $scope.searchRateExchangeCode = getCodeByName(name, data);
                    $scope.searchExchangeRate = name;
                    $scope.$apply();
                }
            });
            /*初始化搜索交换货币下拉框end*/

            /*初始化弹出框本位币下拉搜索start*/
            $scope.currentList = rebuildCurrencyData(rateService.getCurrencyList());
            currentEle = selectFactory({
                data: $scope.currentList,
                isSearch: true,
                searchPlaceHoder: Lang.getValByKey("rate", "rate_current_or_code"),
                id: "rate-current",
                pagination: true,
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.currentList = $scope.getCurrencyData(data,currentPage);
                    attachEvent.setData($scope.currentList);
                },
                onBeforeShow: function(attachEle) {
                    if($scope.isEdit) {
                        attachEle.hide();
                    } else {
                        attachEle.display();
                    }
                },
                attrTextModel: function(name, data) {
                    $scope.rateCurrentCode = getCodeByName(name, data);
                    $scope.rateCurrent = name;
                    if($scope.exchange == $scope.rateCurrent) {
                        $("#rate-current").val("");
                        $scope.rateCurrent = "";
                    }
                    $scope.$apply();
                }
            });
            /*初始化弹出框本位币下拉搜索end*/

            /*初始化弹出框兑换货币下拉搜索start*/
            $scope.exchangeList = rebuildCurrencyData(rateService.getCurrencyList());
            exchangeEle = selectFactory({
                data: $scope.exchangeList,
                id: "exchange-text",
                isSearch: true,
                searchPlaceHoder: Lang.getValByKey("rate", "rate_current_or_code"),
                pagination: true,
                onSearchValueChange:function(attachEvent, data,currentPage) {
                    $scope.exchangeList = $scope.getCurrencyData(data,currentPage);
                    attachEvent.setData($scope.exchangeList);
                },
                onBeforeShow: function(attachEle) {
                    if($scope.isEdit) {
                        attachEle.hide();
                    } else {
                        attachEle.display();
                    }
                },
                attrTextModel: function(name, data) {
                    $scope.exchangeCode = getCodeByName(name, data);
                    $scope.exchange = name;
                    if($scope.exchange == $scope.rateCurrent) {
                        $("#exchange-text").val("");
                        $scope.exchange = "";
                    }
                    $scope.$apply();
                }
            });
            /*初始化弹出框兑换货币下拉搜索end*/
        };
        $scope.getCurrencyData = function(q,currentPage){
            if (!currentPage) {
                currentPage = 1;
            }
            q = q ? q : '';
            var config = {
                'urlParams': {
                    q: q,
                    pageIndex: currentPage,
                    pageSize: 10,
                    includeAllAudit: true
                },
                isAsync: true
            };
            var data = rebuildCurrencyData(rateService.getCurrencyList(config));
            angular.forEach(data.data, function(value, key){
                value.name += '('+ value.code +')';
            });
            return data;
        };

        function getCodeByName(name, data) {
            if(!data) {
                data = rebuildCurrencyData(rateService.getCurrencyList());
            }
            if(!name) {
                return;
            }
            data = data.data;
            for(var index = 0; index < data.length; index++) {
                if(data[index].name.indexOf("(") == -1) {
                    continue;
                }
                var currencyName = data[index].name.split("(")[0];
                var currencyCode = data[index].name.split("(")[1].substring(0, data[index].name.split("(")[1].length - 1);
                if($.trim(currencyName) == $.trim(name) || $.trim(data[index].name) == $.trim(name) || $.trim(currencyCode.toLowerCase()) == $.trim(name.toLowerCase())) {
                    return data[index].code;
                }
            }
            return "无匹配结果";
        }
        $scope.limit3Data = function() {
            if(!$scope.rateVal) {
                return;
            }
            var datas = $scope.rateVal.split(".");
            if(datas.length > 1) {
                if(datas[1].length > 3) {
                    $scope.rateVal = $scope.rateVal.substring(0, $scope.rateVal.length - 1);
                }
            }
        }
        $scope.verifyRateFormat = function() {
            if(!$scope.rateVal) {
                $("#rate-val-msg").addClass("ng-hide");
                $scope.rateFrom.rateVal.errorTips = "";
                return;
            }
            if(!/^([1-9]\d{0,15}|0)(\.\d{1,4})?$/.test($scope.rateVal)) {
                $scope.rateFrom.rateVal.$setDirty();
                $scope.rateFrom.rateVal.errorTips = Lang.getValByKey("rate", "rate_input_rate_val_limit");
                $("#rate-val-msg").removeClass("ng-hide");
                angular.element($(".verify-rate-format").addClass("ng-invalid"));
            } else {
                $("#rate-val-msg").addClass("ng-hide");
                $scope.rateFrom.rateVal.errorTips = "";
                angular.element($(".verify-rate-format").removeClass("ng-invalid"));
            }
        }
        /** 批量删除已选汇率 **/
        $scope.delete = function() {
            if($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0){
                var param = [];
                var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                if(!oldData.length) {
                    accountView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("rate", "rate_prompt_delay_tip"),type: 'errer',manualClose:true});
                    return false;
                }
                //组织数据
                angular.forEach(oldData, function(val) {
                    param.push(val.id);
                });
                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'warning',
                    content: {
                        tip: Lang.getValByKey("rate", 'rate_prompt_delete_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application : 'delete',
                            operationEvent: function() {
                                submitDeleteRate(param);
                            }
                        }
                    ]
                });
            }else{
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("rate", 'rate_prompt_delay_tip'), type: 'errer', manualClose:true});
            };
        }
        /** 编辑汇率 **/
        $scope.editRate = function(value) {
            $scope.isEdit = true;
            $("#nest-rateFrom").css("display", "table");
            $scope.isCreateNewRate = false;
            $scope.promptTitle = Lang.getValByKey("rate", "rate_detail_title");
            $scope.nestRateFrom = true;
            $scope.rateCurrent = value.sourceName;
            $scope.exchange = value.destName;
            $scope.sourceCode = value.sourceCurrency;
            $scope.destCode = value.destCurrency;
            $scope.rateVal = value.rate;
            standardStartTime = $scope.startTime = value.beginTime;
            standardEndTime = $scope.endTime = value.endTime;
            $scope.id = value.id;
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        }
        $scope.savePrompt = function(confirm) {
            if(!confirm) {
                confrim = false;
            }
            if($scope.currentList && !getCodeByName($.trim($("#rate-current").val()), $scope.currentList) || getCodeByName($.trim($("#rate-current").val()), $scope.currentList) == "无匹配结果")  {
                currentEle.showError();
            }
            if($scope.exchangeList && !getCodeByName($.trim($("#exchange-text").val()), $scope.exchangeList) || getCodeByName($.trim($("#exchange-text").val()), $scope.exchangeList) == "无匹配结果")  {
                exchangeEle.showError();
            }
            if(!$scope.rateCurrent){
                $scope.rateFrom.rateCurrent.$setDirty();
            };
            if(!$scope.exchange) {
                $scope.rateFrom.exchange.$setDirty();
            };
            if(!$scope.rateVal){
                $scope.rateFrom.rateVal.$setDirty();
            };
            if(!$scope.rateFrom.$valid){
                return;
            };

            var noResult = $("#nest-rateFrom .no-result");
            for(var index = 0; index < noResult.length; index++) {
                var ulEle = $(noResult[index]).closest('ul');
                ulEle.css("visibility", "visible");
            }
            if(noResult.length > 0) {
                return;
            }
            var errorEles = $(".errors");
            for(var index = 0; index < errorEles.length; index++) {
                if(!$(errorEles[index]).hasClass("ng-hide")) {
                    return;
                }
            }
            if($scope.isCreateNewRate) {//新增汇率
                rateService.createNewRate({
                    "sourceCurrency": getCodeByName($scope.rateCurrent, $scope.currentList),
                    "destCurrency": getCodeByName($scope.exchange, $scope.exchangeList),
                    "sourceName": $scope.rateCurrent,
                    "destName": $scope.exchange,
                    "rate": $scope.rateVal,
                    "beginTime": $scope.startTime,
                    "endTime": $scope.endTime,
                    "confirm": confirm
                }, function(data) {
                    if (data.errorCode != 0 && data.errorCode != 202051) {//服务器异常
                        $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                    } else if(data.errorCode == 202051) {
                        $(document).promptBox({
                            title: Lang.getValByKey("common", 'common_prompt_title'),
                            type: 'warning',
                            content: {
                                tip: data.msg
                            },
                            operation: [
                                {
                                    type: 'submit',
                                    description: Lang.getValByKey("common", 'common_pagination_confirm'),
                                    application : 'confirm',
                                    operationEvent: function() {
                                        $(document).promptBox('closePrompt');
                                        $scope.savePrompt(true);
                                    }
                                }
                            ]
                        });
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,//Lang.getValByKey("rate", "rate_create_rate_tips"),
                            type: 'success',
                            time: 3000
                        });
                        //更新table表数据
                        loadRateData();
                    }
                });
            } else {//编辑汇率(暂无)
                rateService.updateRate({
                    "sourceCurrency": $scope.sourceCode,
                    "destCurrency": $scope.destCode,
                    "sourceName": $scope.rateCurrent,
                    "destName": $scope.exchange,
                    "rate": $scope.rateVal,
                    "beginTime": $scope.startTime,
                    "endTime": $scope.endTime,
                    "id": $scope.id,
                    "confirm": confirm
                }, function(data) {
                    if (data.errorCode != 0 && data.errorCode != 202055) {//服务器异常
                        $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                    } else if(data.errorCode == 202055) {
                        $(document).promptBox({
                            title: Lang.getValByKey("common", 'common_prompt_title'),
                            type: 'warning',
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
                                        $scope.savePrompt(true);
                                    }
                                }
                            ]
                        });
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,//Lang.getValByKey("rate", "rate_update_rate_tips"),
                            type: 'success',
                            time: 3000
                        });
                        //更新table表数据
                        loadRateData();
                    }
                });
            }
        }
        function submitDeleteRate(param) {
            rateService.deleteRateList(param, function(data) {
                if(data.errorCode === 0) {
                    $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'success', time:3000});
                    $(document).promptBox('closePrompt');
                    //更新table表数据
                    loadRateData();
                } else {
                    $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                }
            });
        }
        function setScroll() {
            $(".table-container tbody").slimScroll({
                height: $('.content-main').height() - 250
            });
        }
        function loadRateData() {
            var params = {
                'urlParams': $scope.tableModel.restData
            };
            tableService.getTable($scope.tableModel.restURL, params, function(data) {
                $scope.q = $scope.tableModel.restData.q;
                if(data.errorCode === 0) {
                    $scope.tableModel = tableService.table($scope.tableModel, params, data);
                    setTimeout(function() {
                        setScroll();
                        $(window).on("resize", setScroll);
                        $scope.$apply();
                        $(".table-box").focus();
                    }, 100);
                }
            });
        }
        function initTable() {
            $scope.tableModel = {
                tableHeader: [
                    Lang.getValByKey("rate", "rate_id"),
                    Lang.getValByKey("rate", "rate_currency"),
                    Lang.getValByKey("rate", "rate_current_rate"),
                    Lang.getValByKey("rate", "rate_start_time"),
                    Lang.getValByKey("rate", "rate_end_time")
                ],
                tableHeaderSize: [
                    '5%',
                    '25.6%',
                    '22.4%',
                    '21%',
                    '21%'
                ],
                tableBody: [],
                restURL: "logistics.getLatestRate",
                restData: {
                    language: "zh-CN",
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    isAsc: true,
                    unfilled: true
                },
                selectNumber: 0,
                selectFlag: false
            };
            loadRateData();
        }
        rateView.initCalander($scope);
        initTable();
    }]);
});
