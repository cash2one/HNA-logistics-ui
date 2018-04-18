easySpa.use([
    'widget/slimscroll',
    'widget/prompt',
    "widget/select",
    'widget/calander',
    'public/common/tableController.js'
]);
app.controller('historyRateCtrl', ['$scope', 'historyRateService', 'historyRateView', 'tableService', function($scope, historyRateService, historyRateView, tableService) {
    $scope.goBack = function() {
        window.location.href = "#/rate";
    }
    $scope.sourceCurrency = easySpa.queryUrlValByKey("sourceCurrency");
    $scope.destCurrency = easySpa.queryUrlValByKey("destCurrency");
    $scope.sourceName = easySpa.queryUrlValByKey("sourceName");
    $scope.destName = easySpa.queryUrlValByKey("destName");
    $scope.title = $scope.sourceName + "-" + $scope.destName;
    $scope.clearSearchCondition = function() {
        $("#begin-time").val("");
        $("#finish-time").val("");
        delete $scope.tableModel.restData.beginTime;
        delete $scope.tableModel.restData.endTime;
        loadRateData();
    }
    $scope.endTime = "2100-01-01 00:00:00";
    $scope.add = function() {
        $scope.isEdit = false
        $scope.promptTitle = Lang.getValByKey("historyRate", "history_rate_create_title");
        $scope.nestRateFrom = true;
        $scope.isCreateNewRate = true;
        $scope.rateCurrent = $scope.sourceCurrency;
        $scope.exchange = $scope.destCurrency;
        $scope.rateVal = "";
        $scope.id = "";
        $("#nest-rateFrom").css("display", "table");
        $(".errors").addClass("ng-hide");
        $scope.startTime = new Date().format("yyyy-MM-dd hh:mm:ss");//默认显示客户端时间，是否为服务器端暂定
        $(".input-text").removeClass("ng-dirty");
    }
    $scope.editRate = function(value) {
        $scope.isEdit = true;
        $("#nest-rateFrom").css("display", "table");
        $scope.isCreateNewRate = false;
        $scope.promptTitle = Lang.getValByKey("historyRate", "history_rate_update_title");
        $scope.nestRateFrom = true;
        $scope.rateCurrent = value.sourceCurrency;
        $scope.exchange = value.destCurrency;
        $scope.srouceName = value.sourceName;
        $scope.destName = value.destName;
        $scope.rateVal = value.rate;
        $scope.startTime = value.beginTime;
        $scope.endTime = value.endTime;
        $scope.id = value.id;
        $(".input-text").removeClass("ng-dirty");
        $(".errors").addClass("ng-hide");
        $('button[name="prompt-save"]').addClass('save').removeClass('edit');

    }
    $scope.search = function() {
        $scope.tableModel.restData.beginTime = $("#begin-time").val();
        $scope.tableModel.restData.endTime = $("#finish-time").val();
        loadRateData();
    }
    /** 批量删除已选汇率 **/
    $scope.delete = function() {
        if($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0){
            var param = [];
            var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
            if(!oldData.length) {
                accountView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("historyRate", "history_rate_prompt_delay_tip"),type: 'errer',manualClose:true});
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
                    tip: Lang.getValByKey("historyRate", 'history_rate_prompt_delete_tip')
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
            $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("historyRate", 'history_rate_prompt_delay_tip'), type: 'errer', manualClose:true});
        };
    }
    $scope.closePrompt = function() {
        $scope.nestRateFrom = false;
    };
    function submitDeleteRate(param) {
        historyRateService.deleteRateList(param, function(data) {
            if(data.errorCode === 0) {
                $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'success', time:3000});
                $(document).promptBox('closePrompt');
                //更新table表数据
                loadRateData();
            } else{
                $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
            }
        });
    }
    $scope.savePrompt = function(confirm) {
        if(!confirm) {
            confrim = false;
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
        var errorEles = $(".errors");
        for(var index = 0; index < errorEles.length; index++) {
            if(!$(errorEles[index]).hasClass("ng-hide")) {
                return;
            }
        }
        if($scope.isCreateNewRate) {
            historyRateService.createNewRate({
                "sourceCurrency": $scope.rateCurrent,
                "destCurrency": $scope.exchange,
                "sourceName": $scope.sourceName,
                "destName": $scope.destName,
                "rate": $scope.rateVal,
                "beginTime": $scope.startTime,
                "endTime": $scope.endTime,
                "confirm": confirm
            }, function (data) {
                if (data.errorCode != 0 && data.errorCode != 202051 && data.errorCode != 202052) {//服务器异常
                    $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                } else if (data.errorCode == 202051 || data.errorCode == 202052) {
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
                        contentDelay: Lang.getValByKey("historyRate", "rate_create_rate_tips"),
                        type: 'success',
                        time: 3000
                    });
                    //更新table表数据
                    loadRateData();
                }
            });
        } else {
            historyRateService.updateRate({
                "sourceCurrency": $scope.rateCurrent,
                "destCurrency": $scope.exchange,
                "sourceName": $scope.sourceName,
                "destName": $scope.destName,
                "rate": $scope.rateVal,
                "beginTime": $scope.startTime,
                "endTime": $scope.endTime,
                "id": $scope.id,
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
                        contentDelay: Lang.getValByKey("historyRate", "history_rate_update_rate_tips"),
                        type: 'success',
                        time: 3000
                    });
                    //更新table表数据
                    loadRateData();
                }
            });
        }
    }
    $scope.limit4Data = function() {
        var datas = $scope.rateVal.split(".");
        if(datas.length > 1) {
            if(datas[1].length > 4) {
                $scope.rateVal = $scope.rateVal.substring(0, $scope.rateVal.length - 1);
            }
        }
    }
    $scope.verifyRateFormat = function() {
        if(!/^([1-9]\d{0,15}|0)(\.\d{1,4})?$/.test($scope.rateVal)) {
            $scope.rateFrom.rateVal.$setDirty();
            $scope.rateFrom.rateVal.errorTips = Lang.getValByKey("historyRate", "rate_input_rate_val_limit");
            $("#rate-val-msg").removeClass("ng-hide");
        } else {
            $("#rate-val-msg").addClass("ng-hide");
            $scope.rateFrom.rateVal.errorTips = "";
        }
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
                Lang.getValByKey("historyRate", "rate_history_id"),
                Lang.getValByKey("historyRate", "rate_history_rate"),
                Lang.getValByKey("historyRate", "rate_history_begin_time"),
                Lang.getValByKey("historyRate", "rate_history_finish_time")
            ],
            tableHeaderSize: [
                '23.75%',
                '23.75%',
                '23.75%',
                '23.75%'
            ],
            tableBody: [],
            restURL: "logistics.getRateList",
            restData: {
                sourceCurrency: $scope.sourceCurrency,
                destCurrency: $scope.destCurrency,
                pageIndex: 1,
                pageSize: 10,
                isAsc: false,
                unfilled: true,
                sortName: "beginTime"
            },
            selectNumber: 0,
            selectFlag: false
        };
        loadRateData();
    }
    historyRateView.initCalander($scope);
    initTable();
}]);
