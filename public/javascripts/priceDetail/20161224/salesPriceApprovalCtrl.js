var controller = {
    $scope: null,
    service: null,
    initViewButton: function($scope) {//配置显示个性化视图的个性化对象
        $.extend(true, $scope.viewButton, {
            isShowCancelBtn:true,    //取消按钮
            isSalesPrice:true
        });
    },
    init: function($scope, service) {
        this.initViewButton($scope);
        this.$scope = $scope;
        this.service = service;

        this.scopeEvent();
    },
    scopeEvent: function(){
        var _this = this;
        var $scope = _this.$scope, service = _this.service;

        /**
         * 子Controller初始化
         */
        $scope.childInit = function(){
            if($scope.uid){
                $scope.getInfo();
            }

            if($scope.isOnline === false){
                $scope.isHidenEditBtn = false;    //隐藏编辑按钮
            }else{
                $scope.isHidenEditBtn = true;    //隐藏编辑按钮
            }

            //设置viewButton按钮状态
            if($scope.status == 2){    //未审核状态
                $scope.viewButton.audit = true;
            }else if($scope.status == 3){    //已审核状态
                $scope.viewButton.audit = false;    //隐藏打回草稿和审核通过按钮
                $scope.viewButton.enable = true;    //显示启用或停用按钮

                if($scope.isOnline == true){
                    $scope.enableName = Lang.getValByKey("priceDetail", "priceDetail_code_stop");
                    $scope.enableValue = false;
                }else{
                    $scope.enableName = Lang.getValByKey("priceDetail", "priceDetail_code_start");
                    $scope.enableValue = true;
                }
            }
        };
        $scope.childInit();

        /**
         * 提交审核意见
         */
        $scope.submitAudit = function(){
            $scope.auditSubmitStatus = true;
            if(!$scope.auditRemark){
                $scope.auditForm.auditRemark.$setDirty();
            }
            if(!$scope.auditForm.$valid){
                return;
            }
            var config = {
                'urlParams':{
                    'msg':$scope.auditRemark
                },
                'seatParams':{
                    'uid':$scope.uid
                }
            };
            if($scope.auditStatus == 1){    //打回草稿
                service.returnDraft(config, function(res){
                    if(res.errorCode === 0){
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});

                        setTimeout(function(){$scope.goBack()}, $scope.jumpTime);
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                    }
                });
            }else if($scope.auditStatus == 2){    //审核通过
                service.auditPassed(config, function(res){
                    if(res.errorCode === 0){
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});

                        setTimeout(function(){$scope.goBack()}, $scope.jumpTime);
                    }else{
                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                    }
                });
            }
        };

        /**
         * 启用或停用
         * @param flag
         */
        $scope.enabled = function(flag){
            if(flag == false){    //停用
                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'success',
                    content: {
                        tip: Lang.getValByKey("priceDetail", "priceDetail_code_stopConfirm")
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_pagination_confirm'),
                            operationEvent: function (){
                                $(document).promptBox('closePrompt');

                                var config = {
                                    'urlParams':[$scope.uid]
                                };
                                service.stopPrice(config, function(res){
                                    if(res.errorCode === 0){
                                        $scope.enableName = Lang.getValByKey("priceDetail", "priceDetail_code_start");
                                        $scope.enableValue = true;
                                        $scope.isOffline = true;
                                        $scope.isHidenEditBtn = false;    //停用后，显示编辑按钮
                                        $scope.$apply();
                                        location.reload();
                                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});
                                    }else{
                                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                                    }
                                });
                            }
                        }
                    ]
                });

            }else if(flag){    //启用
                $(document).promptBox({
                    title: Lang.getValByKey("common", 'common_prompt_title'),
                    type: 'success',
                    content: {
                        tip: Lang.getValByKey("priceDetail", "priceDetail_code_startConfirm")
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey("common", 'common_pagination_confirm'),
                            operationEvent: function (){
                                $(document).promptBox('closePrompt');

                                var config = {
                                    'urlParams':[$scope.uid],
                                    'seatParams': {'isconfirmed':false}
                                };
                                service.startPrice(config, function(res){
                                    if(res.errorCode == 0){
                                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});

                                        setTimeout(function(){$scope.goBack()}, $scope.jumpTime);
                                    }else if(res.errorCode == 207001){
                                        $(document).promptBox({
                                            title: Lang.getValByKey("common", 'common_prompt_title'),
                                            type: 'success',
                                            content: {
                                                tip: res.msg
                                            },
                                            operation: [
                                                {
                                                    type: 'submit',
                                                    description: Lang.getValByKey("common", 'common_pagination_confirm'),
                                                    operationEvent: function (){
                                                        $(document).promptBox('closePrompt');

                                                        var config = {
                                                            'urlParams':[$scope.uid],
                                                            'seatParams': {'isconfirmed':true}
                                                        };
                                                        service.startPrice(config, function(res){
                                                            if(res.errorCode === 0){
                                                                $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'success'});

                                                                setTimeout(function(){$scope.goBack()}, $scope.jumpTime);
                                                            }else{
                                                                $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        });
                                    }else{
                                        $(document).promptBox({isDelay:true, contentDelay:res.msg, type: 'errer', manualClose:true});
                                    }
                                });
                            }
                        }
                    ]
                });
            }
        };
    }
};