app.factory('contractTemplateDetailView', ["contractTemplateDetailService", function(contractTemplateDetailService) {
    var contractTemplateDetailView = {
        initStateSelect: function($scope) {

            var data = contractTemplateDetailService.getContractType();

            selectFactory({
                data:data,
                id: "serviceType",
                showTextField:"message",
                defaultText: null,
                attrTextModel: function (name, data, currentData) {
                    if (!name) {
                        $scope.serviceType = null;
                        $scope.serviceTypeCode = null;
                    } else {
                        $scope.serviceType = currentData.message;
                        $scope.serviceTypeCode = currentData.code;
                    }
                    $scope.$apply();
                }
            });
        },
        bindEvent: function($scope) {
            $scope.setCheckBox = function ($event) {
                var checkbox = $event.target;
                var checked = checkbox.checked;
                if (checked) {
                    $scope.generateContractImm = true;

                } else {
                    $scope.generateContractImm = false;
                }
            }

            $scope.goBack=function () {
                top.location.href = 'http://' + location.host + "#/contractTemplates";
                // window.location.href = "#/contractTemplates";
            }

            $scope.edit=function () {
                $scope.isEdit= !$scope.isEdit;
                $(".w-e-text").attr("contenteditable","true"); //富文本框
            }

            $scope.GenerateContract = function () { //别人生成的模板，不执行保存，直接生成模板
                top.location.href = 'http://' + location.host + "#/contractDetail?tempId="+$scope.id;
                // window.location.href = "#/contractDetail?tempId="+$scope.id;
            }

            $scope.checkTemplateNameUnique = function () {

                var param={
                    id:$scope.id,
                    name:$scope.templateName
                }
                contractTemplateDetailService.checkTemplateNameUnique(param,function (returnData) {
                    if(returnData.errorCode == 0){
                        $scope.showTemplateNameExist = returnData.data; //为true表示重复
                    }

                })

            }
            $scope.clearTemplateUniqueErr = function () {
                $scope.showTemplateNameExist = false;
            }

            $scope.saveContractTemplate =function () {

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

                    var errorEles = $(".errors");
                    for(var index = 0; index < errorEles.length; index++) {
                        if(!$(errorEles[index]).hasClass("ng-hide")) {
                            return false;
                        }
                    };

                    return $scope.contractTemplate.$valid ? true:false;

                }

                function summitForm(inputdata, summitFunc) {

                    summitFunc(inputdata, function (data) {
                        if (data.errorCode != 0 ) {
                            $(document).promptBox({isDelay: true, contentDelay: data.msg, type: 'errer', manualClose: true});
                        } else{//成功

                            $scope.id = data.data //防止重复修改
                            $scope.isEdit= !$scope.isEdit;
                            $scope.editContractTitle =false; //保存后不能修改合同模板
                            $(".w-e-text").attr("contenteditable","false");

                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: data.msg,//Lang.getValByKey("rate", "rate_create_rate_tips"),
                                type: 'success',
                                time: 3000
                            });

                            //如果勾选了要跳转

                            if($scope.generateContractImm){
                                setTimeout(function () {
                                    // window.location.href = "#/contractDetail?tempId="+$scope.id;
                                    top.location.href = 'http://' + location.host + "#/contractDetail?tempId="+$scope.id;

                                },1000)
                            }
                        }
                    })
                }

                if(!checkSave()){
                    scrollToErrorView($(".main"));
                    return;
                }

                //
                //
                // if(!$scope.id){
                //     $scope.id = 0;
                // }

                var param={
                    serviceType:$scope.serviceTypeCode,
                    name:$scope.templateName,
                    title:$scope.contractorTitle,
                    content:$(".w-e-text") .html(),
                    firstContractorDto: {
                        name: $scope.partAName,
                        address: $scope.partAAddr,
                        contact:$scope.partAPhone,
                        bankAccount:$scope.partABankAccount,
                        bankName: $scope.partABankName
                    },
                    secondContractorDto: {
                        name: $scope.partBName,
                        address: $scope.partBAddr,
                        contact:$scope.partBPhone,
                        bankAccount:$scope.partBBankAccount,
                        bankName: $scope.partBBankName
                    },
                    id:$scope.id
                };

                if(param.content && param.content.indexOf("<style") != -1){
                    var startPos = param.content.indexOf("<style");
                    var endPos = param.content.indexOf("</style>");

                    var first = param.content.slice(0,startPos);
                    var second = param.content.slice(endPos+8);
                    param.content = first + second;

                }


                if($scope.id == 0){ //新增
                    summitForm(param,contractTemplateDetailService.saveContractTemplate)
                }else{
                    summitForm(param,contractTemplateDetailService.updateContractTemplate)
                }
            }

        }
    };
    return contractTemplateDetailView;
}]);