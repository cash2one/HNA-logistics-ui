easySpa.require([
    'widget/prompt',
    'widget/select',
    'widget/calander'
], function () {
    app.controller('logisticsCtrl', ['$scope', 'logisticsService', 'logisticsView', function ($scope, logisticsService, logisticsView) {
        $scope.showMsg = function (msg, type) {
            $(document).promptBox({
                isDelay: true,
                contentDelay: msg,
                type: type,
                time: 3000,
                manualClose: type === 'errer'
            });
        };

        //$scope 属性值存放在data中。
        $scope.data = {
            'orderNumType': '1'
        };

        //获取信息列表
        var setOrderNumType = function () {
            orderNumTypeEle = selectFactory({
                data: [],
                id: "typeList",
                isSaveInputVal: false,
                maxHeight: 160,
                isCreateNewSelect: true,
                showTextField: "operTypeName",
                "direction": "up",
                attrTextField: {
                    "ng-value": "operType"
                },
                attrTextId: function (code, data) {
                    $scope.logisticsModel.typeCode = code;
                },
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                attrTextModel: function (name, data) {
                    $scope.logisticsModel.tplCode = "";
                    $scope.logisticsModel.tplName = "";
                    $scope.logisticsModel.params = null;
                    var tempData = data.data.find(function (item) {
                        return item.operTypeName == name;
                    });
                    $scope.logisticsModel.typeName = name;
                    if (tempData) {
                        var tplList = tempData.codeDtoList;
                        tplList && tplList.map(function (item) {
                            if (item.messageTemplate.indexOf("(") == -1 && item.code) {
                                item.messageTemplate += "(" + (item.code || '') + ")";
                            }
                        });
                        $scope.setTpl({
                            data: tplList
                        });
                    } else {
                        $scope.setTpl({
                            data: []
                        });
                    }
                    $scope.formCheck();
                    $scope.$apply();
                }
            });
            var params = {};
            var callback = function (res) {
                if (res.errorCode == 0) {
                    res.data.map(function (item) {
                        item.operTypeName = item.operTypeName + "(" + item.operType + ")";
                    });
                    orderNumTypeEle.setData(res);
                } else {
                    $scope.showMsg(res.msg, "errer");
                }
            };
            logisticsService.getType(params, callback);
        };

        var clearNext = function (currentEle) {
            var nextEle = currentEle.next;
            if (nextEle == null) {
                return;
            }
            nextEle.clearData();
            nextEle.id = null;
            return clearNext(nextEle);
        };

        $scope.setTpl = function (data) {
            tplEle = selectFactory({
                data: [],
                id: "orderStatus",
                isSaveInputVal: false,
                maxHeight: 160,
                isCreateNewSelect: false,
                attrTextField: {
                    "ng-value": "code"
                },
                "direction": "down",
                showTextField: "messageTemplate",
                attrTextId: function (code, data) {
                    $scope.logisticsModel.tplCode = code;
                },
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                attrTextModel: function (name, data) {
                    var tempData = data.data.find(function (item) {
                        return item.messageTemplate == name;
                    });

                    $scope.logisticsModel.tplName = name;
                    $scope.logisticsModel.params = tempData.params;
                    $scope.logisticsModel.params = $scope.logisticsModel.params.map(function (item) {
                        item = "";
                    });
                    $scope.formCheck();
                    clearNext(tplEle);
                    $scope.$apply();
                }
            });
            tplEle.setData(data);
            if (orderNumTypeEle) {
                orderNumTypeEle.next = tplEle;
            }
        };

        $scope.formCheck = function () {
            if (!$scope.formSubmit) {
                return;
            }
            var flag = false;
            if (!$.trim($("#content").val())) {
                $("#content").addClass("error");
                flag = true;
            } else {
                $("#content").removeClass("error");
            }
            var formEle = [{
                modelName: "updateTime",
                id: "updateTime"
            }, {
                modelName: "tplName",
                id: "orderStatus"
            }];
            for (var s = 0, len = formEle.length; s < len; s++) {
                if ($scope.logisticsModel[formEle[s].modelName] == "" || $scope.logisticsModel[formEle[s].modelName] == undefined) {
                    $("#" + formEle[s].id).addClass("error");
                    flag = true;
                } else {
                    $("#" + formEle[s].id).removeClass("error");
                }
            }
            if ($scope.logisticsModel.params) {
                var placeList = [{
                    id: "placeA",
                    verificationId: "placeAInvalidTip",
                    reg: /^([\w\u4E00-\u9FA5_\-]+)+$/,
                    errorTips: Lang.getValByKey("logistics", "logistics_input_validation")
                }, {
                    id: "placeB",
                    verificationId: "placeBInvalidTip",
                    reg: /^([\w\u4E00-\u9FA5_\-]+)+$/,
                    errorTips: Lang.getValByKey("logistics", "logistics_input_validation")
                }];
                for (var s = 0, len = $scope.logisticsModel.params.length; s < len; s++) {
                    if (!$scope.logisticsModel.params[s]) {
                        $("#" + placeList[s].id).addClass("error");
                        $scope[placeList[s].verificationId] = null;
                        flag = true;
                    } else if (!(placeList[s].reg.test($scope.logisticsModel.params[s]))) {
                        $("#" + placeList[s].id).addClass("error");
                        $scope[placeList[s].verificationId] = placeList[s].errorTips;
                        flag = true;
                    } else {
                        $("#" + placeList[s].id).removeClass("error");
                        $scope[placeList[s].verificationId] = null;
                    }
                }
            }
            return flag;
        };

        $scope.delInvalid = function (e) {
            var event = e || window.event;
            logisticsView.delInvalid($scope, event);
        };

        $scope.reShowTextarea = function () {
            logisticsView.reShowTextarea($scope);
        };

        $scope.isValid = function (e) {
            var event = e || window.event;
            logisticsView.isValid($scope, event);
            $scope.formCheck();
        };

        //更新订单信息
        $scope.update = function () {
            var self = this;
            $scope.formSubmit = true;
            var flag = false;
            flag = $scope.formCheck();
            if (flag) {
                scrollToErrorView($(".logistic"));
                return;
            }
            var contentList = logisticsView.getOrderNumList();
            var config = {
                urlParams: {
                    "type": Number($scope.data.orderNumType),
                    "code": $scope.logisticsModel.tplCode,                //模板code
                    "contentList": contentList,                             //订单编号列表
                    "messageTime": $scope.logisticsModel.updateTime,   //事件时间
                    "params": $scope.logisticsModel.params              //A、B地
                }
            };

            logisticsService.addLogisticsInfo(config, function (res) {
                if (res.errorCode == 0) {
                    $scope.showMsg(res.msg, "success");
                    $scope.init(true, Number($scope.data.orderNumType));
                    $scope.invalidList = res.data || [];
                } else {
                    $scope.showMsg(res.msg, "errer");
                    $scope.invalidList = res.data || [];
                    // logisticsView.switchLabel($scope);
                }
            });
        };

        $scope.init = function (flag, type) {
            $scope.textValue = $("#content").val();
            var self = this;
            $(".error").removeClass("error");
            logisticsForm.reset();
            if ($scope.logisticsForm && $scope.logisticsForm.content) {
                $scope.logisticsForm.content.$setPristine();
            }
            $scope.formSubmit = false;

            $scope.logisticsModel = {
                updateTime: "",//new Date().format("yyyy-MM-dd hh:mm:ss")
            };
            setOrderNumType();
            if (flag) {
                $("#content").val($scope.textValue.trim());
            }

            //$scope 属性值存放在data中。
            $scope.data.orderNumType = type ? type : 1;

            $scope.showTextarea = true;
            $scope.invalidList = [];
            $scope.$watchGroup(['logisticsModel.tplName',
                'logisticsModel.updateTime',
                'logisticsModel.params'
            ], function () {
                self.formCheck();
            })
            if ($('#updateTime')) {
                $('#updateTime').datetimepicker("destroy");
            }

            logisticsView.initCalander();

        };
        $scope.init()
    }]);
});
