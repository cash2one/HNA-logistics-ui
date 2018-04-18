app.factory('contractsView', ["tableService", "contractsService", function(tableService,contractsService) {
    var contractsView = {
        setScroll: function () {
            $(".table-container tbody").slimScroll({
                height: $('.content-main').height() - 380
            });
        },
        initStateSelect: function ($scope) {
            selectFactory({
                data: {data: [{
                    "code": "0",
                    "name": "全部"
                }, {
                    "code": "1",
                    "name": "草稿"
                },{
                    "code": "2",
                    "name": "已生成"
                }]},
                id: "contractStatus",
                defaultText: null,
                attrTextModel: function(name, data, currentData) {
                    if (!name) {
                        $scope.contractStatus = null;
                    } else {
                        $scope.contractStatus = currentData.name;
                        $scope.contractStatusCode = currentData.code;
                    }
                    $scope.$apply();
                }
            });

            var data = contractsService.getContractType();

            data.data.splice(0, 0, {
                "code": 0,
                "message": "全部"
            });

            selectFactory({
                data: data,
                showTextField: "message",
                id: "serviceType",
                defaultText: null,
                attrTextModel: function (name, data, currentData) {

                    if (!name) {
                        $scope.serviceTypeCode = 0;
                        $scope.serviceType="全部"
                    } else {
                        $scope.serviceType = currentData.message;
                        $scope.serviceTypeCode = currentData.code;
                    }
                    $scope.$apply();
                }
            });

            selectFactory({
                data: {data: [{
                    "code": "1",
                    "message": "物流"
                },{
                    "code": "2",
                    "message": "贸易"
                }]},
                showTextField: "message",
                id: "upLoadContractSerType",
                defaultText: null,
                attrTextModel: function (name, data, currentData) {

                    if (!name) {
                        $scope.upLoadContractSerType = null;
                        $scope.upLoadContractSerTypeCode=""
                    } else {
                        $scope.upLoadContractSerType = currentData.message;
                        $scope.upLoadContractSerTypeCode = currentData.code;
                    }
                    $scope.$apply();
                }
            });
        },
        initCalander: function () {
            Calander.init({
                ele: ["#begin-time", "#finish-time"]
            });
        },
        initTable: function ($scope) {
            var self = this;
            $scope.tableModel = {
                tableHeader: [
                    Lang.getValByKey("common", "common_thead_number"),
                    "业务类型",
                    "模板名称",
                    "合同标题",
                    "创建人",
                    "创建时间",
                    "合同状态",
                    "操作"
                ],
                tableHeaderSize: [
                    '15%',
                    '10%',
                    '10%',
                    '10%',
                    '10%',
                    '20%',
                    '10%',
                    '10%'
                ],
                tableBody: [],
                restURL: "logistics.getContracsList",
                restData: {
                    sort: "createTime",
                    q: '',
                    pageIndex: 1,
                    pageSize: 10,
                    asc: false
                },
                selectNumber: 0,
                selectFlag: false
            };
            // $scope.$watch('tableModel.tableBody',function(newValue,oldValue, scope) {//字段转换
            //     for(var index = 0; index < newValue.length; index++) {
            //         newValue[index].creatorName = newValue[index].creatorFullName + "(" + newValue[index].creatorUserName + ")";
            //     }
            //     self.unlockBtn();
            // });
            $scope.loadData();
        },
        bindEvent: function ($scope) {
            $scope.clearData = function () {
                $scope.serviceType = "全部";
                $scope.serviceTypeCode = undefined;
                $scope.templateName = undefined;
                $scope.creater = undefined;
                $scope.templateTitle = undefined;
                $scope.contractStatusCode = 0;
                $scope.contractStatus = "全部"
                $("#begin-time").val("");
                $("#finish-time").val("");
                $scope.search();
            }
            $scope.search = function () {
                $scope.tableModel.restData.startTime = $("#begin-time").val();
                $scope.tableModel.restData.endTime = $("#finish-time").val();
                $scope.tableModel.restData.serviceType = $scope.serviceTypeCode;
                $scope.tableModel.restData.templateName = $scope.templateName;
                $scope.tableModel.restData.createUserName = $scope.creater;
                $scope.tableModel.restData.status = $scope.contractStatusCode;
                $scope.tableModel.restData.title = $scope.templateTitle;
                $scope.loadData();
            }
            $scope.createContract = function () {
                // window.location.href = "/#/contractDetail";
                top.location.href = 'http://' + location.host + '#/contractDetail';
            }
            $scope.deleteContract = function() {
                if($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0){
                    var param = [];
                    var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                    if(!oldData.length) {
                        accountView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
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
                            tip: "是否确认删除该合同？"
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey("common", 'common_page_delete'),
                                application : 'delete',
                                operationEvent: function() {
                                    contractsService.delContracts(param, function(data) {
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
                    $(document).promptBox({isDelay:true, contentDelay:Lang.getValByKey("common", 'common_code_noSelected'), type: 'errer', manualClose:true});
                };
            }



        }
    }


    return contractsView;
}]);