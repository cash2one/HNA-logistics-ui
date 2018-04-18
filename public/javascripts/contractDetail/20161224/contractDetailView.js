app.factory('contractDetailView', ["contractDetailService",function(contractDetailService) {
    var contractDetailView = {

        initStateSelect: function ($scope) {
            

            function getContractTemplateList(data, currentPage) {
                if(!currentPage) {
                    currentPage = 1;
                }
                var params = {
                    'name': data || '',
                    "pageIndex": currentPage,
                    "pageSize": 10,
                    serviceType:$scope.serviceTypeCode
                };

                var data = contractDetailService.getContractTemplateByType(params);
                return data;
            }


            var templateNameElm =selectFactory({
                data: [],
                id: "templateName",
                isSearch: true,
                closeLocalSearch:true,
                defaultText:Lang.getValByKey("common", "common_select_tips"),
                isSaveInputVal:true,
                pagination: true,
                onSearchValueChange: function (attachEvent, data, currentPage) {
                    var ContractTemplateList = getContractTemplateList(data, currentPage);
                    templateNameElm.setData(ContractTemplateList);
                },
                attrTextModel: function (name, data, currentData) {

                    if (!name) {
                        $scope.contractTemplateId =null;

                    } else {
                        $scope.contractTemplateId = currentData.id; //获取模板的Id
                        //根据模板Id获取详细信息
                        contractDetailService.getContractTemplateById($scope.contractTemplateId,function (returnData) {

                            if(returnData.errorCode == 0){
                                var data = returnData.data;
                                $scope.contractorTitle = data.title;
                                $scope.templateName = data.name;
                                $scope.serviceTypeCode = data.serviceType;
                                $scope.serviceType = data.serviceTypeName;
                                $(".w-e-text").html(data.content);

                                $scope.partAName=data.firstContractorDto.name;
                                $scope.partAAddr=data.firstContractorDto.address;
                                $scope.partAPhone=data.firstContractorDto.contact;
                                $scope.partABankAccount=data.firstContractorDto.bankAccount;
                                $scope.partABankName=data.firstContractorDto.bankName;

                                $scope.partBName =data.secondContractorDto.name;
                                $scope.partBAddr=data.secondContractorDto.address;
                                $scope.partBPhone=data.secondContractorDto.contact;;
                                $scope.partBBankAccount=data.secondContractorDto.bankAccount;
                                $scope.partBBankName=data.secondContractorDto.bankName;

                            }

                        })
                    }
                    $scope.$apply();
                }
            });


            var data = contractDetailService.getContractType();

            selectFactory({
                data: data,
                id: "serviceType",
                showTextField: "message",
                defaultText: null,
                attrTextModel: function (name, data, currentData) {
                    if (!name) {
                        $scope.serviceTypeCode = null;
                    } else {
                        //更改的时候如果和之前选的不一致要清空数据
                        if($scope.serviceType != currentData.message && $scope.editContractTitle){
                            templateNameElm.setData({})
                            $scope.templateName='';
                            $scope.contractTemplate.templateName.$setPristine();

                        }

                        $scope.serviceType = currentData.message;
                        $scope.serviceTypeCode = currentData.code;

                    }
                    $scope.$apply();
                }
            });

        },
        bindEvent: function($scope) {

            $scope.getContractTemplateList=function () {

                if($scope.serviceTypeCode){
                    var param={
                        serviceType:$scope.serviceTypeCode
                    }
                    contractDetailService.getContractTemplateByType(param,function (returnData) {
                        if(returnData.errorCode!=0){
                            Select.sharePool["templateName"].setData([])
                        }else{
                            Select.sharePool["templateName"].setData(returnData)
                        }
                    })
                }else{
                    Select.sharePool["templateName"].setData([])
                }
            }

            // $scope.goBack=function () {
            //     if($scope.tempId){
            //         window.location.href = "#/contractTemplateDetail?id="+$scope.tempId;
            //
            //     }else{
            //         window.location.href = "#/contracts";
            //     }
            //
            // }

            $scope.goBack=function () {

                if($scope.tempId){
                    top.location.href = 'http://' + location.host + "#/contractTemplateDetail?id="+$scope.tempId;

                }else{
                    top.location.href = 'http://' + location.host + "#/contracts"
                }

            }

            $scope.edit=function () {
                $scope.isEdit= !$scope.isEdit;
                $(".w-e-text").attr("contenteditable","true"); //富文本框
            }


            $scope.saveDraftContract = function () {
                $scope.saveStatue = 1 ;//0 初态 1 生成草稿 2 生成合同
                $scope.saveContract();
            }

            $scope.GenerateContract = function () {
                $scope.saveStatue = 2 ;//0 初态 1 生成草稿 2 生成合同
                $scope.saveContract();
            }


            //保存草稿
            $scope.saveContract =function () {

                function checkSave() {
                    if(!$scope.serviceType){
                        $scope.contractTemplate.serviceType.$setDirty();
                    }
                    if(!$scope.templateName){
                        $scope.contractTemplate.templateName.$setDirty();
                    }

                    if(!$scope.contractorTitle){
                        $scope.contractTemplate.contractorTitle.$setDirty();
                    }

                    if(!$scope.contractTemplate.$valid){
                        scrollToErrorView($(".contract-detail-main"));
                    }

                    var errorEles = $(".errors");
                    for(var index = 0; index < errorEles.length; index++) {
                        if(!$(errorEles[index]).hasClass("ng-hide")) {
                            return false;
                        }
                    };

                    return $scope.contractTemplate.$valid ? true:false;

                }

                function summitForm(inputdata, summitFunc) {

                    summitFunc(inputdata, function (resultData) {

                        if (resultData.errorCode != 0 ) {
                            if(resultData.errorCode == 403){
                                return; // 如果是403error，不要报错
                            }
                            $(document).promptBox({isDelay: true, contentDelay: resultData.msg, type: 'errer', manualClose: true});
                        } else{//成功
                            var data = resultData.data;
                            var msg = resultData.msg;


                            $scope.editContractTitle =false; //保存后不能修改合同模板
                            $scope.id = data.id //防止重复修改

                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: msg,//Lang.getValByKey("rate", "rate_create_rate_tips"),
                                type: 'success',
                                time: 3000
                            });


                            if($scope.saveStatue == 2){

                                $scope.contractStatus = 2;
                                //这里需要把url带回来

                                $scope.fileUrl = data.fileUrl; //直接保存后需要记录下fileUrl

                                // setTimeout(function () {
                                //     location.href = "#/contracts"; //如果是保存合同，直接跳回列表
                                // },1000)

                            }else{

                                $scope.contractStatus = 1;
                                $scope.isEdit= !$scope.isEdit;
                                $(".w-e-text").attr("contenteditable","false");
                            }

                        }
                    })
                }

                if(!checkSave()){
                    return;
                }


                var param={
                    serviceType:$scope.serviceTypeCode,
                    name:$scope.templateName,
                    title:$scope.contractorTitle,
                    content:$(".w-e-text") .html(),
                    firstContractorDto: {
                        name: $scope.partAName,
                        contact:$scope.partAPhone,
                        address: $scope.partAAddr,
                        bankAccount:$scope.partABankAccount,
                        bankName: $scope.partABankName,

                    },
                    secondContractorDto: {
                        name: $scope.partBName,
                        address: $scope.partBAddr,
                        contact:$scope.partBPhone,
                        bankAccount:$scope.partBBankAccount,
                        bankName: $scope.partBBankName
                    },
                    id:$scope.id,
                    status:$scope.saveStatue, // 状态 1 草稿 2 生成合同
                    templateName:$scope.templateName
                };

                if(param.content && param.content.indexOf("<style") != -1){
                    var startPos = param.content.indexOf("<style");
                    var endPos = param.content.indexOf("</style>");

                    var first = param.content.slice(0,startPos);
                    var second = param.content.slice(endPos+8);
                    param.content = first + second;

                }

                if($scope.id == 0){ //新增
                    summitForm(param,contractDetailService.saveContract)
                }else{
                    summitForm(param,contractDetailService.updateContract)
                }
            }

        }
    };

    return contractDetailView;
}]);