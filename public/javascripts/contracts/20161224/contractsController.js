easySpa.require([
    'widget/slimscroll',
    'widget/select',
    'widget/prompt',
    'widget/slides',
    'public/common/tableController.js',
    'public/common/calander.js',
    'public/common/pictureController.js'
],function(){
    app.controller('contractsCtrl', ['$scope', 'contractsService', 'contractsView','tableService','pictureService', function($scope, contractsService, contractsView,tableService,pictureService) {

        $.extend($scope, {
            initSelect: function() {
                contractsView.initStateSelect($scope); //初始化状态下拉列表
            },
            initCalander: function() {
                contractsView.initCalander();
            },
            setScroll: function() {
                contractsView.setScroll();
            },
            initTable: function() {
                contractsView.initTable($scope);
            },
            loadData: function() {
                var self = this;

                var params = {
                    'urlParams': $scope.tableModel.restData
                };
                tableService.getTable($scope.tableModel.restURL, params, function(data) {
                    if(data.errorCode === 0) {
                        angular.forEach(data.data,function (item) {
                            item.enableCheckbox = (item.createUserId.toString() === $scope.userId)
                        })
                        $scope.tableModel = tableService.table($scope.tableModel, params, data);
                        setTimeout(function() {
                            self.setScroll();
                            $(window).on("resize", self.setScroll);
                            $scope.$apply();
                            $(".table-box").focus();
                        }, 100);
                    }
                });
            },
            bindEvent: function() {
                contractsView.bindEvent($scope);
            }
        });

        $scope.$watch('tableModel.tableBody',function(newValue,oldValue, scope) {//字段转换
            for(var index = 0; index < newValue.length; index++) {
                newValue[index].thumbnailPath = getThumbnail(newValue[index].fileUrl) + '?filename='+newValue[index].fileName;
            }
        });

        function getThumbnail(image){
            if(image.indexOf('150x150') != -1) {
                var idx = image.lastIndexOf('.');
                var picName = image.substring(0, idx);
                var picType = image.substring(idx, image.length);
                var index = picName.lastIndexOf('_');
                var picUrl = image.substring(0, index);
                image = picUrl + picType;
            }
            return image
        };

        function initData() {
            $scope.userId = cookie.get("userId");
            $scope.serviceType = '全部';
            $scope.serviceTypeCode = undefined;
            $scope.contractStatus ='全部';
            $scope.contractStatusCode = 0;
            $scope.userId = cookie.get("userId");

            $scope.upLoadData ={};
        }

        $scope.download = function($event){
            console.log($event);
            console.log($event.target.getAttribute('data-href'));
            var loadhref = $event.target.getAttribute('data-href');
            window.location.href = loadhref;
        };

        initData();

        $scope.upLoadContracts = function () {
            $scope.upLoadData.name ='';
            $scope.showPrompt = true;
            //prompt里面的内容要重新赋值
            $scope.upLoadContractSerType = '';
            $scope.upLoadContractSerTypeCode='';
            $scope.upLoadContractTitle = '';
            $scope.UploadContacter.upLoadContractSerType.$setPristine();
            $scope.UploadContacter.upLoadContractTitle.$setPristine();
            $scope.UploadContacter.upLoadContractFiles.$setPristine();

        }
        $scope.closePrompt = function () {
            $scope.showPrompt = false;
        }
        function checkPrompt() {
            if(!$scope.upLoadContractSerType){
                $scope.UploadContacter.upLoadContractSerType.$setDirty();
            }
            if(!$scope.upLoadContractTitle){
                $scope.UploadContacter.upLoadContractTitle.$setDirty();
            }

            if(!$scope.upLoadData.name){
                $scope.UploadContacter.upLoadContractFiles.$setDirty();
                return false;
            }

            var errorEles = $(".errors");
            for(var index = 0; index < errorEles.length; index++) {
                if(!$(errorEles[index]).hasClass("ng-hide")) {
                    return false;
                }
            };

            return $scope.UploadContacter.$valid ? true:false;

        }

        $scope.savePrompt = function () {

            var canSave= checkPrompt();
            if(!canSave){
                return;
            }

            var param={
                serviceType:$scope.upLoadContractSerTypeCode,
                serviceTypeName:$scope.upLoadContractSerType,
                title:$scope.upLoadContractTitle,
                // fileUrl:$scope.upLoadData.path,
                // fileName:$scope.upLoadData.name,
                fileId:$scope.upLoadData.id,
                status:2 //默认自定义上传的文件状态为已生成
            }

            contractsService.uploadContract(param,function (returnData) {
                if(returnData.errorCode != 0){
                    $(document).promptBox({isDelay:true,contentDelay:returnData.msg,type: 'errer',manualClose:true});

                }else{
                    //关闭对话框
                    $scope.showPrompt = false;
                    $scope.loadData();
                    $(document).promptBox({isDelay:true,contentDelay:returnData.msg,type: 'success', time:3000})
                }

            })

        }

        $scope.pictureModel = {
            edit: true,    //是否编辑状态
            uploadShow: true,    //是否显示上传按钮图标
            picture: [],    //图片存放地址
            accept:'image/jpg,image/jpeg,image/png,image/bmp,image/tiff,application/pdf'
        };

        $scope.getFile = function (el) {
            var size = $scope[el.target.id].size;
            var result = pictureService.uploadFile($scope.pictureModel, $scope[el.target.id]);
            if (!result) {
                return false;
            }
            if (result.errorlocal) {
                $(document).promptBox({ isDelay: true, contentDelay: result.errorlocal, type: 'errer', manualClose: true });
            } else {
                result.then(function (res) {

                    // 保存上传文件所需要的参数
                    $scope.upLoadData = res.data.data;

                    if (res.data.errorCode === 0) {
                        $(document).promptBox({ isDelay: true, contentDelay: res.data.msg, type: 'success' });
                        //res.data.data为图片对应的 picUrlID
                        $scope.pictureModel = pictureService.updateModel($scope.pictureModel, res.data.data);
                        $scope.fileUrl = res.data.data.path;
                        $scope.$apply();

                    } else {
                        $(document).promptBox({ isDelay: true, contentDelay: res.data.msg, type: 'errer', manualClose: true });
                    }
                });
            }
        };

        $scope.getPictureUrl = function (value) {

            var typeImage;
            var typePdf;

            $scope.pictureModel.picture=[];
            if(value.fileType.indexOf('image') != -1){
                typeImage = true;
                typePdf = false;

            }else if(value.fileType.indexOf('application') != -1){
                typeImage = false;
                typePdf = true;

            }


            var param={
                picUrlID:{
                    id:value.fileId,
                    name:value.fileName,
                    path:value.fileUrl,
                    type:value.fileType
                },
                "picUrl": value.fileUrl,
                "name" : value.fileName,
                "typeImage":typeImage,
                "typePdf":typePdf,
                "suffix":value.fileType.split("/")[1]
            }

            $scope.pictureModel.picture.push(param);



            $('#slides').picturePreview({ pictureId: value.fileId },$scope.pictureModel.picture);
        }

        $scope.test= function (id) {
            top.location.href = 'http://' + location.host + '/#/contractDetail?id='+id;

        }

        $scope.initTable(); //初始化table组件
        $scope.initSelect(); //初始化搜索框
        $scope.initCalander();//初始化日历组件
        $scope.bindEvent(); //初始化事件绑定

    }]);
});
