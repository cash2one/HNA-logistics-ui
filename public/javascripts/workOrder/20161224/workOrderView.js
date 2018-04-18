app.factory('workOrderView', ["tableService", "workOrderService", function(tableService, workOrderService) {
    var userNameElm;
    var staffSelectEle;
    var getData = function(q, currentPage){
        var params = {
            urlParams:{
                q: q || "",
                pageIndex: currentPage || 1,
                pageSize:10
            }
        };
        var data = workOrderService.getStaffList(params);
        angular.forEach(data.data, function(value, key){
          value.fullName += '('+ value.code +')';
        });
        return data;
    };
    var workOrderView = {
        setScroll: function() {
            $(".table-container tbody").slimScroll({
                height: $('.content-main').height() - 300
            });
        },
        initStateSelect: function($scope) {
            selectFactory({
                data: {data: [{
                    "id": "0",
                    "name": Lang.getValByKey("workOrder", "workOrder_created_state")
                }, {
                    "id": "1",
                    "name": Lang.getValByKey("workOrder", "workOrder_dealing_state")
                },{
                    "id": "2",
                    "name": Lang.getValByKey("workOrder", "workOrder_dealed_state")
                }, {
                    "id": "3",
                    "name": Lang.getValByKey("workOrder", "workOrder_closed_state")
                }]},
                id: "state",
                defaultText: Lang.getValByKey("common", "common_all_tips"),
                attrTextModel: function(name, data, currentData) {
                    if(!name) {
                        $scope.stateId = -1;
                    } else {
                        $scope.state = name;
                        $scope.stateId = currentData.id;
                    }
                    $scope.$apply();
                }
            });
            function getUserList(data, currentPage) {
                if(!currentPage) {
                    currentPage = 1;
                }
                var params = {
                    'urlParams': {
                        'q': data || '',
                        "pageIndex": currentPage,
                        "pageSize": 10
                    }
                };

                return workOrderService.getCustomerFullNameList(params);
            }
            var data = workOrderService.getCustomerList();
            userNameElm = selectFactory({
                data: data,
                id: "user-name",
                showTextField: "fullName",
                isSearch: true,
                isSaveInputVal:true,
                closeLocalSearch: true,
                defaultText:Lang.getValByKey("common", "common_select_tips"),
                pagination: true,
                searchPlaceHoder: Lang.getValByKey("common", 'common_select_search_client_name_tips'),
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    var userList = getUserList(data, currentPage);
                    userNameElm.setData(userList);
                },
                attrTextModel: function(name, data, currentItem) {
                    if(!name ) {
                        $scope.usernameId = '';
                        $scope.username = '';

                    } else {
                        $scope.usernameId = currentItem.id;
                        $scope.username = name;

                    }
                    $scope.$apply();
                }
            });
        },
        initStaffSelect: function ($scope) {
            if(staffSelectEle){ return; }
            staffSelectEle = selectFactory({
                data: [],
                id: "creator",
                isSearch: true,
                showTextField: "fullName",
                defaultText: Lang.getValByKey("common", 'common_select_tips'),
                searchPlaceHoder:'请输入姓名或工号',
                maxHeight: 160,
                isNotUseFilter:true,
                closeLocalSearch: true,
                isSaveInputVal:true,
                defaultCount:10,
                pagination:true,
                onSearchValueChange: function (attachEvent, data) {
                    var dataList = getData(data);
                    attachEvent.setData(dataList);
                },
                attrTextModel: function (name, data) {
                    if (name) {
                        var typeName = data.data.find(function (item) {
                            return item.fullName == name
                        });
                        $scope.creator = typeName.id;
                        $scope.creatorName = typeName.fullName;
                    }else{
                        $scope.creator = "";
                        $scope.creatorName = "";
                    }
                    $scope.$apply();
                }
            });
            staffSelectEle.open();
        },
        initTable: function($scope) {
            var self = this;
            $scope.beginTime = getBeforeDate(6)+' 00:00:00';
            $scope.finishTime = new Date().format("yyyy-MM-dd 23:59:59");
            $scope.tableModel = {
                tableHeader: [
                    Lang.getValByKey("common", "common_thead_number"),
                    Lang.getValByKey("workOrder", "workOrder_code"),
                    Lang.getValByKey("workOrder", "workOrder_level"),
                    Lang.getValByKey("workOrder", "workOrder_problem_type"),
                    Lang.getValByKey("workOrder", "workOrder_title"),
                    Lang.getValByKey("workOrder", "workOrder_customer"),
                    Lang.getValByKey("workOrder", "workOrder_creator"),
                    Lang.getValByKey("workOrder", "workOrder_current_dealer"),
                    Lang.getValByKey("workOrder", "workOrder_update_time"),
                    Lang.getValByKey("workOrder", "workOrder_last_deal_time"),
                    Lang.getValByKey("workOrder", "workOrder_state")
                ],
                tableHeaderSize: [
                    '5%',
                    '8%',
                    '7%',
                    '7%',
                    '11%',
                    '9%',
                    '9%',
                    '9%',
                    '12%',
                    '12%',
                    '6%'
                ],
                tableBody: [],
                restURL: "logistics.getWorkOrderList",
                restData: {
                    sortName: "createTime",
                    beginTime: getBeforeDate(6)+' 00:00:00',
                    endTime: new Date().format("yyyy-MM-dd 23:59:59"),
                    blockOrder: false,
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    isAsc: false,
                    unfilled: true
                },
                selectNumber: 0,
                selectFlag: false
            };
            $scope.$watch('tableModel.tableBody',function(newValue,oldValue, scope) {//字段转换
                for(var index = 0; index < newValue.length; index++) {
                   newValue[index].creatorName = newValue[index].creatorFullName + "(" + newValue[index].creatorUserName + ")";
                }
                self.unlockBtn();
            });
            $scope.loadData();
        },
        initCalander: function() {
            Calander.init({
                ele: ["#begin-time", "#finish-time"]
            });
        },
        lockBtn: function() {
            $("#delete").attr("disabled", "true");
            $("#delete").addClass("disabled");
        },
        unlockBtn: function() {
            $("#delete").removeAttr("disabled");
            $("#delete").removeClass("disabled");
        },
        check: function() {
            var isLimit = false;
            var checkBoxEles = $(".checkbox");
            for(var index = 0; index < checkBoxEles.length; index++) {
                if(checkBoxEles[index].checked) {
                    var status = $(checkBoxEles[index]).attr("data-status");
                    if(status != Lang.getValByKey("workOrder", "workOrder_closed_state")) {
                        isLimit = true;
                        this.lockBtn();
                        break;
                    }
                }
            }
            if(!isLimit) {
                this.unlockBtn();
            }
        },
        bindEvent: function($scope) {
            var self = this;
            $scope.showCustomerList = function() {
                if(userNameElm){ return; }
                var data = workOrderService.getCustomerList();
                userNameElm.setData(data);
            };
            $scope.resetCreator = function() {
                self.initStaffSelect($scope);
            };
            $scope.clearDate = function() {
                $scope.workId = undefined;
                $scope.creator = undefined;
                $scope.creatorName = undefined;
                $scope.username = undefined;
                $scope.title = undefined;
                $scope.state = Lang.getValByKey("workOrder", "workOrder_created_state");
                $scope.stateId = "0";
                $scope.usernameId = undefined;
                $scope.username = undefined;
                $scope.beginTime = getBeforeDate(6)+' 00:00:00';
                $scope.finishTime = new Date().format("yyyy-MM-dd 23:59:59");
                $('#state').val($scope.state);
                $scope.search();
            };
            $scope.search = function() {
                $scope.tableModel.restData.beginTime = $scope.beginTime;
                $scope.tableModel.restData.endTime = $scope.finishTime;
                $scope.tableModel.restData.workOrderCode = $scope.workId;
                $scope.tableModel.restData.title = $scope.title;
                $scope.tableModel.restData.creator = $scope.creator;
                $scope.tableModel.restData.customerUserId = $scope.usernameId;
                $scope.tableModel.restData.customerName = $scope.username;
                $scope.tableModel.restData.status = $scope.stateId;
                $scope.tableModel.restData.blockOrder = $scope.blockOrder;
                $scope.loadData();
            };
            $scope.createWorkId = function() {
                window.location.href = "#/workOrderDetail";
            };
            $scope.isBlockOrder = function() {
                $scope.blockOrder = !$scope.blockOrder;
            };
            $scope.delete = function() {
                if($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0){
                    var param = [];
                    var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                    if(!oldData.length) {
                        accountView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("workOrder", "workOrder_prompt_delay_tip"),type: 'errer',manualClose:true});
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
                            tip: Lang.getValByKey("workOrder", 'workOrder_prompt_delete_tip')
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey("common", 'common_page_delete'),
                                application : 'delete',
                                operationEvent: function() {
                                    workOrderService.deleteWorkOrder(param, function(data) {
                                        if(data.errorCode === 0) {
                                            $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'success', time:3000});
                                            $(document).promptBox('closePrompt');
                                            //更新table表数据
                                            $scope.loadData();
                                        } else {
                                            $(document).promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                                        }
                                    });
                                }
                            }
                        ]
                    });
                }else{
                    $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("workOrder", 'workOrder_prompt_delay_tip'), type: 'errer', manualClose:true});
                };
            };
            var time = setInterval(function() {
                if($(".tbody").length > 0) {
                    clearInterval(time);
                    time = null;
                    $(".tbody").delegate(".checkbox", "change", function() {
                        self.check();
                    });
                    $("#select-all").on("change", function() {
                        self.check();
                    });
                }
            }, 100);
        }
    };
    return workOrderView;
}]);
