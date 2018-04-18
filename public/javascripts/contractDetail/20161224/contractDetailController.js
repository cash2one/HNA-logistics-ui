easySpa.use([
    'widget/select',
    'widget/prompt',
    'widget/richText'
], function() {
    app.controller('contractDetailCtrl', ['$scope', 'contractDetailService', 'contractDetailView', function($scope, contractDetailService, contractDetailView) {


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

            $scope.userId = cookie.get("userId");

            $scope.id = $scope.id || easySpa.queryUrlValByKey("id"); //新增或者修改来

            $scope.tempId = easySpa.queryUrlValByKey("tempId");//有可能来自于模板，id和tempId 只能有一个存在

            if(!$scope.id){
                $scope.id = 0; //用id判断新增或者是修改
            }

            if($scope.id !=0){ //来自合同的修改
                $scope.isEdit = false;
                $scope.editContractTitle = false;

                $(".w-e-text").attr("contenteditable","false");
                //根据Id获取获取合同详情
                contractDetailService.getContractById($scope.id,function (returnData) {
                    if(returnData.errorCode == 0){


                        var data = returnData.data;
                        $scope.contractorTitle = data.title;
                        $scope.templateName = data.templateName;
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
                        $scope.partBPhone=data.secondContractorDto.contact;
                        $scope.partBBankAccount=data.secondContractorDto.bankAccount;
                        $scope.partBBankName=data.secondContractorDto.bankName;


                        $scope.isSelfTemplate = $scope.userId == data.createUserId;

                        $scope.contractStatus = data.status;//1 草稿态 2 已生成

                        $scope.editContractTitle = false; //不可编辑模版名称

                        $scope.fileUrl = data.fileUrl;
                    }

                })
            }else{
                $scope.isEdit = true;
                $scope.editContractTitle = true;
                $scope.isSelfTemplate =true; // 是否自己创建的合同

                $scope.contractStatus = 1;//1 草稿态 2 已生成

                if($scope.tempId){ //来自于模板，仅仅做为填充
                    contractDetailService.getContractTemplateById($scope.tempId,function (returnData) {

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
                            $scope.partBPhone=data.secondContractorDto.contact;
                            $scope.partBBankAccount=data.secondContractorDto.bankAccount;
                            $scope.partBBankName=data.secondContractorDto.bankName;
                        }
                    })
                }
            }

        }


        $.extend($scope, {
            initSelect: function() {
                contractDetailView.initStateSelect($scope); //初始化状态下拉列表
            },
            bindEvent: function() {
                contractDetailView.bindEvent($scope);
            }
        });

        $scope.downLoadContract = function () {
            $("a")[0];
        }

        init();//初始化数据
        $scope.initSelect(); //初始化搜索框
        $scope.bindEvent(); //初始化事件绑定

        $scope.cancelDraftContract = function () {
            init();
        }

    }]);

});