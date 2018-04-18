easySpa.require([
    'widget/select',
    'widget/prompt',
    'widget/richText'
], function() {
    app.controller('contractTemplateDetailCtrl', ['$scope', 'contractTemplateDetailService', 'contractTemplateDetailView', function($scope, contractTemplateDetailService, contractTemplateDetailView) {


        function init() {

            $scope.editContractTitle = false;
            $scope.contractorTitle = "";
            $scope.partAName='';
            $scope.partBName = '';
            $scope.partAAddr="";
            $scope.partBAddr="";
            $scope.partAPhone="";
            $scope.partBPhone="";
            $scope.partABankAccount="";
            $scope.partBBankAccount="";
            $scope.partABankName="";
            $scope.partBBankName="";
            $scope.templateName='';

            //用于判断
            $scope.userId = cookie.get("userId");//本用户
            $scope.isSelfTemplate=true;

            $scope.generateContractImm = true;//checkbox

            $scope.id = $scope.id || easySpa.queryUrlValByKey("id");
            if(!$scope.id){
                $scope.id = 0; //用id判断新增或者是修改
            }



            if($scope.id){

                $(".w-e-text").attr("contenteditable","false");
                //根据Id获取相应的模板值
                contractTemplateDetailService.getContractTemplateById($scope.id,function (returnData) {
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

                        $scope.isSelfTemplate = $scope.userId == data.createUserId;
                    }

                })
                $scope.isEdit = false;
                $scope.editContractTitle = false;
            }else{
                $scope.isSelfTemplate= true;
                $scope.isEdit = true;
                $scope.editContractTitle = true;
            }

        }

        $.extend($scope, {
            initSelect: function() {
                contractTemplateDetailView.initStateSelect($scope); //初始化状态下拉列表
            },
            bindEvent: function() {
                contractTemplateDetailView.bindEvent($scope);
            }
        });


        init();//初始化数据
        $scope.initSelect(); //初始化搜索框
        $scope.bindEvent(); //初始化事件绑定

        $scope.cancel = function () {
            init();
        }
    }]);

});