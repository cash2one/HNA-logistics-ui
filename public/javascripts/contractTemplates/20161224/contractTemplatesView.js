app.factory('contractTemplatesView', ["tableService", "contractTemplatesService", function(tableService,contractTemplatesService) {
    var contractTemplatesView = {
        setScroll: function () {
            $(".table-container tbody").slimScroll({
                height: $('.content-main').height() - 330
            });
        },
        initStateSelect: function ($scope) {

            var data = contractTemplatesService.getContractType();
            data.data.splice(0, 0, {
                "code": null,
                "message": "全部"
            });

            selectFactory({
                data: data,
                id: "serviceType",
                showTextField: "message",
                defaultText: null,
                attrTextModel: function (name, data, currentData) {
                    if (!name) {
                        $scope.serviceTypeCode = null;
                    } else {
                        $scope.serviceType = currentData.message;
                        $scope.serviceTypeCode = currentData.code;
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
                    "创建人",
                    "创建时间",
                ],
                tableHeaderSize: [
                    '15%',
                    '20%',
                    '20%',
                    '20%',
                    '20%'
                ],
                tableBody: [],
                restURL: "logistics.getContractTemplate",
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
            $scope.loadData();
        },
        bindEvent: function ($scope) {
            $scope.clearData = function () {
                $scope.serviceType = "全部";
                $scope.serviceTypeCode = undefined;
                $scope.templateName = undefined;
                $scope.creater = undefined;
                $("#begin-time").val("");
                $("#finish-time").val("");
                $scope.search();
            }
            $scope.search = function () {
                $scope.tableModel.restData.startTime = $("#begin-time").val();
                $scope.tableModel.restData.endTime = $("#finish-time").val();
                $scope.tableModel.restData.serviceType = $scope.serviceTypeCode;
                $scope.tableModel.restData.name = $scope.templateName;
                $scope.tableModel.restData.createUserName = $scope.creater;

                $scope.loadData();
            }
            $scope.createContractTemplate = function () {
                // window.location.href = "#/contractTemplateDetail";
                top.location.href = 'http://' + location.host + "#/contractTemplateDetail";
            }
            $scope.deleteContractTemplate = function() {
                if($scope.tableModel.selectNumber != 0 && $('.table-box tbody tr').length != 0){
                    var param = [];
                    var oldData = tableService.getSelectTable($scope.tableModel.tableBody);
                    if(!oldData.length) {
                        $(document).promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
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
                            tip: "是否确认删除该合同模板？"
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey("common", 'common_page_delete'),
                                application : 'delete',
                                operationEvent: function() {
                                    contractTemplatesService.delContractTemplate(param, function(data) {
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
    return contractTemplatesView;
}]);