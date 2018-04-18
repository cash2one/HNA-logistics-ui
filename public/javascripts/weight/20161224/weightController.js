easySpa.require([
    'widget/slimscroll',
    'public/common/tableController.js',
    'widget/select',
    'widget/prompt'
], function() {
    app.controller('weightCtrl', ['$scope', 'weightService', 'weightView', 'tableService', function($scope, weightService, weightView, tableService) {
        var wordLimit = 140;
        var sectionLimit = 100;
        var unitEle;
        $scope.wordCount = wordLimit;
        $scope.weightSectionList = [
            {
                startPoint: "0",
                endPoint: ""
            }
        ];
        $scope.deleteSection = function() {
            $scope.weightSectionList.splice($scope.weightSectionList.length - 1, 1);
            setTimeout(function() {
                if ($(".error").length == 0) {
                    $("#weight-msg").addClass("ng-hide");
                    $("#weight-msg").html("");
                }
            }, 10);
        }
        $scope.initSelectList = function() {
            $scope.unit="kg";
            // $scope.unitList = weightService.getWeightUnitList();
            // unitEle = selectFactory({
            //     data: $scope.unitList,
            //     id: "unit",
            //     showTextField: "code",
            //     attrTextModel: function(name, data) {
            //         $scope.unit = name;
            //         $scope.$apply();
            //     }
            // });
        }
        function getWeightSectionIndex(currentEle) {
            var pointList = $(".point");
            for(var index = 0; index < pointList.length; index++) {
                if(pointList[index] == currentEle[0]) {
                    return index;
                }
            }
        }
        function getPreWeight(currentIndex, currentVal) {
            var weightSectionList = [];
            for(var index = 0; index < $scope.weightSectionList.length; index++) {
                weightSectionList.push($scope.weightSectionList[index].startPoint);
                weightSectionList.push($scope.weightSectionList[index].endPoint);
            }
            for(var index = currentIndex - 1; index >= 0; index--) {
                if(weightSectionList[index] + "" && $.trim(weightSectionList[index])) {
                    return parseFloat(weightSectionList[index]);
                }
            }
            return Number.NEGATIVE_INFINITY;
        }
        function getNextWeight(currentIndex, currentVal) {
            var weightSectionList = [];
            for(var index = 0; index < $scope.weightSectionList.length; index++) {
                weightSectionList.push($scope.weightSectionList[index].startPoint);
                weightSectionList.push($scope.weightSectionList[index].endPoint);
            }
            for(var index = currentIndex + 1; index < weightSectionList.length; index++) {
                if(weightSectionList[index] + "" && $.trim(weightSectionList[index])) {
                    return parseFloat(weightSectionList[index]);
                }
            }
            return Number.POSITIVE_INFINITY;
        }
        $scope.verifyMark = function() {
            $scope.wordCount = wordLimit - $("#mark").val().length;
            if($scope.wordCount < 0) {
                $scope.wordCount = 0;
                $scope.mark = $scope.mark.substring(0, wordLimit);
            }
        }
        $scope.limit3Data = function(ev, index) {
            if(!$.trim($(ev.target).val())) {
                return;
            }
            var currentVal = $(ev.target).val();
            var datas = currentVal.split(".");
            if(datas.length > 1) {
                if(datas[1].length > 3 && $scope.weightSectionList[index]) {
                    //$(ev.target).val();
                    if($(ev.target).hasClass("start-point")) {
                        $scope.weightSectionList[index].startPoint = currentVal.substring(0, currentVal.length - 1);
                    } else {
                        $scope.weightSectionList[index].endPoint = currentVal.substring(0, currentVal.length - 1);
                    }
                }
            }
        }
        $scope.isExistedCode = function() {
            if($scope.oldWeightCode == $scope.weightCode) {
                return;
            }
            if($scope.weightFrom.weightCode.$error.defined) {
                return;
            }
            var result = weightService.isExistedCode({code: $scope.weightCode});
            if(result && result.data) {//显示错误信息
                $scope.weightFrom.weightCode.errorTips = Lang.getValByKey("weight", "weight_input_weight_code_repeat");
                $("#code-msg").removeClass("ng-hide");
            } else {
                $scope.weightFrom.weightCode.errorTips = "";
                $("#code-msg").addClass("ng-hide");
            }
        }
        $scope.verifyWeightFormat = function(ev) {
            var currentVal = parseFloat($(ev.target).val());
            if(!/^([1-9]\d{0,15}|0)(\.\d{1,4})?$/.test($(ev.target).val())) {
                $("#weight-msg").html(Lang.getValByKey("weight", "weight_input_weight_limit"));
                $("#weight-msg").removeClass("ng-hide");
                $(ev.target).addClass('error');
            } else {
                $(ev.target).removeClass('error');
                if($(".error").length == 0) {
                    $("#weight-msg").addClass("ng-hide");
                    $("#weight-msg").html("");
                }
            }
            var currentIndex = getWeightSectionIndex($(ev.target));
            var prevWeight = getPreWeight(currentIndex, currentVal);
            var nextWeight = getNextWeight(currentIndex, currentVal);
            if(currentIndex % 2 == 0) {//重量起点
                if(currentVal < prevWeight || currentVal >= nextWeight) {
                    $scope.weightSectionList[parseInt(currentIndex / 2)].startPoint = "";
                    $("#weight-msg").html(Lang.getValByKey("weight", "weight_input_weight_nouse"));
                    $("#weight-msg").removeClass("ng-hide");
                    $(ev.target).addClass('error');
                }
            } else {//重量终点
                if(currentVal <= prevWeight || currentVal > nextWeight) {
                    $scope.weightSectionList[parseInt(currentIndex / 2)].endPoint = "";
                    $("#weight-msg").html(Lang.getValByKey("weight", "weight_input_weight_nouse"));
                    $("#weight-msg").removeClass("ng-hide");
                    $(ev.target).addClass('error');
                }
            }
        }
        $scope.addSection = function() {
            if($scope.weightSectionList.length == sectionLimit) {
                return;
            }
            var isCanAdd = true;
            for(var index = 0; index < $scope.weightSectionList.length; index++) {
                if($.trim($scope.weightSectionList[index].startPoint) == "") {
                    $scope.weightFrom["startPoint" + index].$setDirty();
                    isCanAdd = false;
                }
                if($.trim($scope.weightSectionList[index].endPoint) == "") {
                    $scope.weightFrom["endPoint" + index].$setDirty();
                    isCanAdd = false;
                }
            }
            if(!isCanAdd) {
                return;
            }
            var errorEle = $("#weight-msg");
            if(!$(errorEle).hasClass("ng-hide")) {
                return;
            }
            $scope.weightSectionList.push({
                startPoint: $scope.weightSectionList[$scope.weightSectionList.length - 1].endPoint,
                endPoint: ""
            });
        }
        $scope.add = function() {
            $scope.wordCount = wordLimit;
            $scope.weightName = "";
            $scope.weightCode = "";
            $scope.oldWeightCode = "";
            $scope.mark = "";
            $scope.unit = "kg";
            $scope.weightSectionList = [
                {
                    startPoint: "0",
                    endPoint: ""
                }
            ];
            $scope.promptTitle = Lang.getValByKey("weight", "weight_create_title");
            $scope.isCreateNewWeight = true;
            $scope.nestWeightFrom = true;
            $("#nest-weightFrom").css("display", "table");
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        }
        $scope.edit = function(value) {
            $scope.weightSectionList = [];
            var weightSectionList = value.weightSectionList;
            $("#nest-weightFrom").css("display", "table");
            $scope.isCreateNewWeight = false;
            $scope.promptTitle = Lang.getValByKey("weight", "weight_detail_title");
            $scope.nestWeightFrom = true;
            $scope.weightName = value.name;
            $scope.weightCode = value.code;
            $scope.unit = value.unit;
            $scope.oldWeightCode = value.code;
            $scope.mark = $.trim(value.remark);
            $("#mark").val(value.remark);
            $scope.id = value.id;
            $scope.wordCount = wordLimit - $scope.mark.length;
            for(var index = 0; index < weightSectionList.length; index++) {
                $scope.weightSectionList.push({
                    startPoint: weightSectionList[index].startPoint,
                    endPoint: weightSectionList[index].endPoint,
                    refId: weightSectionList[index].refId
                });
            }
            $(".input-text").removeClass("ng-dirty");
            $(".errors").addClass("ng-hide");
            $('button[name="prompt-save"]').addClass('save').removeClass('edit');
        }
        /** 条件搜索 **/
        $scope.searchWeight = function() {
            $scope.tableModel.restData.pageIndex = 1;
            loadWeightData();
        }
        $scope.delete = function() {
            if($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0) {
                var param = [];
                var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                if(!oldData.length) {
                    accountView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("weight", "weight_prompt_delay_tip"),type: 'errer',manualClose:true});
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
                        tip: Lang.getValByKey("weight", 'weight_prompt_delete_tip')
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_page_delete'),
                            application : 'delete',
                            operationEvent: function() {
                                submitDeleteWeight(param);
                            }
                        }
                    ]
                });
            }else{
                $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("weight", 'weight_prompt_delay_tip'), type: 'errer', manualClose:true});
            };
        }
        $scope.getUnitCodeByName = function(name) {
            var data = $scope.unitList.data;
            for(var index = 0; index < data.length; index++) {
                if(name == data[index].name) {
                    return data[index].code;
                }
            }
            return "";
        }
        /** 关闭弹框 */
        $scope.closePrompt = function() {
            $scope.nestWeightFrom = false;
        };
        $scope.savePrompt = function() {
            if(!$scope.weightName){
                $scope.weightFrom.weightName.$setDirty();
            };
            if(!$scope.weightCode) {
                $scope.weightFrom.weightCode.$setDirty();
            };
            // if(!$scope.unit) {
            //     $scope.weightFrom.unit.$setDirty();
            // }
            for(var index = 0; index < $scope.weightSectionList.length; index++) {
                if(!$scope.weightSectionList[index].startPoint) {
                    $scope.weightFrom["startPoint" + index].$setDirty();
                }
                if(!$scope.weightSectionList[index].endPoint) {
                    $scope.weightFrom["endPoint" + index].$setDirty();
                }
            }
            if(!$scope.weightFrom.$valid) {
                scrollToErrorView($(".switch-list"));
                return;
            };
            var errorEles = $(".errors");
            for(var index = 0; index < errorEles.length; index++) {
                if(!$(errorEles[index]).hasClass("ng-hide")) {
                    return;
                }
            }
            //$scope.unit = $scope.getUnitCodeByName($scope.unit);
            if($scope.isCreateNewWeight) {
                weightService.addWeight({
                    "name": $scope.weightName,
                    "code": $scope.weightCode,
                    "weightSectionList": $scope.weightSectionList,
                    "remark": $scope.mark,
                    "unit": $scope.unit
                }, function (data) {
                    if (data.errorCode != 0) {
                        $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'success',
                            time: 3000
                        });
                        //更新table表数据
                        loadWeightData();
                    }
                });
            } else {
                for(var index = 0; index < $scope.weightSectionList.length; index++) {
                    delete $scope.weightSectionList[index]["$$hashKey"];
                }
                weightService.updateWeight({
                    "id": $scope.id,
                    "name": $scope.weightName,
                    "code": $scope.weightCode,
                    "weightSectionList": $scope.weightSectionList,
                    "remark": $scope.mark,
                    "unit": $scope.unit,
                }, function (data) {
                    if (data.errorCode != 0) {
                        $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                    } else {
                        $scope.closePrompt();
                        $(document).promptBox({
                            isDelay: true,
                            contentDelay: data.msg,
                            type: 'success',
                            time: 3000
                        });
                        //更新table表数据
                        loadWeightData();
                    }
                });
            }
        }
        function submitDeleteWeight(param) {
            weightService.deleteWeightList(param, function(data) {
                if(data.errorCode === 0) {
                    $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'success', time:3000});
                    $(document).promptBox('closePrompt');
                    //更新table表数据
                    loadWeightData();
                } else{
                    $(document).promptBox('closePrompt');
                    $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                }
            });
        }
        function setScroll() {
            $(".table-container tbody").slimScroll({
                height: $('.content-main').height() - 250
            });
        }
        function loadWeightData() {
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
                    Lang.getValByKey("weight", "weight_id"),
                    Lang.getValByKey("weight", "weight_name"),
                    Lang.getValByKey("weight", "weight_code"),
                    Lang.getValByKey("weight", "weight_detail"),
                    Lang.getValByKey("weight", "weight_creator"),
                    Lang.getValByKey("weight", "weight_date"),
                    Lang.getValByKey("weight", "weight_mark")
                ],
                tableHeaderSize: [
                    '6%',
                    '15%',
                    '10%',
                    '10%',
                    '12%',
                    '13%',
                    '15%',
                    '15%'
                ],
                tableBody: [],
                restURL: "logistics.getWeightList",
                restData: {
                    language: "zh-CN",
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    asc: false,
                    unfilled: true,
                    sort: "createTime"
                },
                selectNumber: 0,
                selectFlag: false
            };
            loadWeightData();
        }
        $scope.$watch('tableModel.tableBody',function(newValue,oldValue, scope) {//字段转换
            for(var index = 0; index < newValue.length; index++) {
                var sectionList = newValue[index].weightSectionList;
                var section = "";
                for(jndex = 0; jndex < sectionList.length; jndex++) {
                    if(jndex != sectionList.length - 1) {
                        section += sectionList[jndex].startPoint + "-" + sectionList[jndex].endPoint + ",";
                    } else {
                        section += sectionList[jndex].startPoint + "-" + sectionList[jndex].endPoint;
                    }
                }
                newValue[index].weightSectionArray = section;
            }
        });
        initTable();
    }]);
});